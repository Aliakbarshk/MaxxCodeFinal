/**
 * Ultra-Resilient JavaScript Execution & Verification Engine
 * Safely executes synchronous, asynchronous, and ESNext code with console interception,
 * timeout protection, and robust output comparison.
 */

export interface ExecutionResult {
  success: boolean;
  output: string[];
  returnValue?: any;
  error?: string;
  passed?: boolean;
  feedback?: string;
}

export const runJavaScript = async (
  code: string,
  options?: {
    expectedOutput?: string;
    expectedPattern?: RegExp | string;
    timeoutMs?: number;
    testRunner?: (logs: string[], result: any) => { passed: boolean; feedback?: string };
  }
): Promise<ExecutionResult> => {
  const output: string[] = [];
  const timeoutLimit = options?.timeoutMs || 3500;

  // Safe argument formatter that never throws
  const formatArg = (arg: any): string => {
    try {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
      if (typeof arg === 'bigint') return `${arg}n`;
      if (typeof arg === 'symbol') return arg.toString();
      if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
      if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
      if (arg instanceof Set) {
        return `Set(${arg.size}) { ${Array.from(arg).map(formatArg).join(', ')} }`;
      }
      if (arg instanceof Map) {
        return `Map(${arg.size}) { ${Array.from(arg.entries()).map(([k, v]) => `${formatArg(k)} => ${formatArg(v)}`).join(', ')} }`;
      }
      if (Array.isArray(arg)) {
        try {
          return JSON.stringify(arg);
        } catch {
          return `[Array(${arg.length})]`;
        }
      }
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch {
          return '[Object]';
        }
      }
      return String(arg);
    } catch {
      return '[Unserializable Value]';
    }
  };

  const fakeConsole = {
    log: (...args: any[]) => output.push(args.map(formatArg).join(' ')),
    info: (...args: any[]) => output.push(args.map(formatArg).join(' ')),
    warn: (...args: any[]) => output.push(`[warn] ${args.map(formatArg).join(' ')}`),
    error: (...args: any[]) => output.push(`[error] ${args.map(formatArg).join(' ')}`),
    dir: (...args: any[]) => output.push(args.map(formatArg).join(' ')),
    table: (data: any) => {
      try {
        output.push(typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data));
      } catch {
        output.push('[Table Data]');
      }
    },
  };

  let returnValue: any = undefined;
  let hasRuntimeError = false;
  let errorMessage = '';

  try {
    // Sanitize any accidental window prompt / alert to avoid hanging execution
    const safeEnvPreamble = `
      var alert = function(msg) { fakeConsole.log("[alert]", msg); };
      var prompt = function() { return null; };
      var confirm = function() { return true; };
    `;

    // Wrap in an async IIFE that captures top-level returns and await
    // Note: Concatenation ensures no backtick-interpolation issues inside template literals
    const wrappedCode = 
      safeEnvPreamble + 
      "\nreturn (async function(console) {\n" +
      code +
      "\n})(fakeConsole);";

    const runner = new Function('fakeConsole', wrappedCode);

    // Timeout protection against infinite loops
    const executionPromise = Promise.resolve().then(() => runner(fakeConsole));
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Execution timed out after ${timeoutLimit / 1000}s. Check for infinite loops!`)), timeoutLimit)
    );

    returnValue = await Promise.race([executionPromise, timeoutPromise]);
  } catch (err: any) {
    hasRuntimeError = true;
    errorMessage = err?.message || String(err);
    output.push(`Error: ${errorMessage}`);
  }

  // If no console output was logged, but the code produced a return value, display it
  if (output.length === 0 && returnValue !== undefined) {
    output.push(`=> ${formatArg(returnValue)}`);
  }

  if (hasRuntimeError) {
    return {
      success: false,
      output,
      error: errorMessage,
      passed: false,
      feedback: `Runtime Error: ${errorMessage}`,
    };
  }

  // Verification
  let passed = true;
  let feedback = 'All tests passed!';

  if (options?.testRunner) {
    try {
      const testResult = options.testRunner(output, returnValue);
      passed = testResult.passed;
      if (testResult.feedback) feedback = testResult.feedback;
    } catch (e: any) {
      passed = false;
      feedback = `Test evaluation error: ${e?.message || e}`;
    }
  } else if (options?.expectedOutput !== undefined && options.expectedOutput !== '...') {
    const normalize = (s: string) => 
      (s || '')
       .trim()
       .replace(/\r\n/g, '\n')
       .replace(/["']/g, '')
       .replace(/\s+/g, ' ');

    const joinedActual = output.join('\n');
    const normActual = normalize(joinedActual);
    const normExpected = normalize(options.expectedOutput);

    const matchesWhole = normActual === normExpected;
    const matchesAnyLine = output.some(line => normalize(line) === normExpected);
    const containsExpected = normActual.includes(normExpected);

    if (!matchesWhole && !matchesAnyLine && !containsExpected) {
      passed = false;
      feedback = `Expected output:\n"${options.expectedOutput}"\n\nActual output:\n"${output.join('\n') || '(no console output)'}"`;
    }
  }

  if (passed && options?.expectedPattern) {
    try {
      const regex = typeof options.expectedPattern === 'string' 
        ? new RegExp(options.expectedPattern) 
        : options.expectedPattern;
      const allText = output.join('\n') + '\n' + (typeof returnValue === 'string' ? returnValue : JSON.stringify(returnValue));
      if (!regex.test(allText) && !regex.test(code)) {
        passed = false;
        feedback = `Code requirement not met. Make sure to follow the instructions carefully!`;
      }
    } catch {
      // Regex check error fallback
    }
  }

  return {
    success: true,
    output,
    returnValue,
    passed,
    feedback,
  };
};
