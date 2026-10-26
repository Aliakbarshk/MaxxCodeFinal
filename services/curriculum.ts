import { Lesson, TestItem } from '../types';

export const LESSONS: Lesson[] = [
  // ==========================================
  // CHAPTER 0: JAVASCRIPT FOUNDATIONS
  // ==========================================
  {
    id: 'js_0_1',
    type: 'code',
    title: 'Hello JavaScript & The Console',
    description: 'Learn how JavaScript outputs data to the dev console using console.log()',
    language: 'javascript',
    order: 0,
    chapter: 'Chapter 0: Foundations & Types',
    content: {
      intro: 'In JavaScript, `console.log()` is the foundational tool used to display output, debug values, and print messages. Everything passed between parentheses will be rendered in the console.',
      intro_hi: 'जावास्क्रिप्ट में `console.log()` सबसे बुनियादी तरीका है जिससे हम कंसोल में आउटपुट दिखाते हैं और डिबग करते हैं।',
      intro_hinglish: 'JavaScript mein `console.log()` sabse basic tool hai jisse hum console mein output print karte hain aur values check karte hain.',
      summary: [
        '`console.log()` outputs data to the environment.',
        'Strings can be wrapped in single (\'), double ("), or backtick (`) quotes.',
        'Semicolons at the end of statements are standard practice in modern JS.'
      ],
      instructions: 'Use `console.log` to print the exact message: "Hello, JavaScript Master!"',
      instructions_hi: '`console.log` का उपयोग करके "Hello, JavaScript Master!" प्रिंट करें।',
      instructions_hinglish: '`console.log` use karke "Hello, JavaScript Master!" print karein.',
      initialCode: '// Write your first JavaScript statement below:\n',
      solutionCode: 'console.log("Hello, JavaScript Master!");',
      expectedOutput: 'Hello, JavaScript Master!',
      codeExplanation: '`console.log()` prints the string argument to the console. Quotes define a string primitive.'
    }
  },
  {
    id: 'js_0_2',
    type: 'code',
    title: 'Variables: let, const & Immutability',
    description: 'Master modern variable declaration with let and const',
    language: 'javascript',
    order: 1,
    chapter: 'Chapter 0: Foundations & Types',
    content: {
      intro: 'Modern JavaScript avoids `var`. We use `const` for values that should not be reassigned, and `let` for variables whose values will change over time. Reassigning a `const` throws a TypeError!',
      intro_hi: 'आधुनिक जावास्क्रिप्ट में हम `var` के स्थान पर `const` और `let` का उपयोग करते हैं। `const` की वैल्यू बदली नहीं जा सकती।',
      intro_hinglish: 'Modern JS mein hum `var` use nahi karte. Jo value fix rehti hai use `const` banate hain aur jo change hogi use `let`.',
      summary: [
        'Use `const` by default for predictable, bug-free code.',
        'Use `let` only when you explicitly intend to reassign a variable.',
        'Variables declared with `let` and `const` have block scope `{}`.'
      ],
      instructions: 'Declare a `const` named `appName` with value "MaXxCode", and a `let` named `level` set to 1. Then reassign `level = 2` and log both separated by a space: `console.log(appName, level)`.',
      instructions_hi: '`appName` नाम से एक `const` बनाएं जिसकी वैल्यू "MaXxCode" हो, और `level` नाम से `let` बनाकर 1 रखें। फिर `level = 2` करें और `console.log(appName, level)` करें।',
      instructions_hinglish: '`appName` const banayein value "MaXxCode" ke saath, aur `level` let banayein 1 ke saath. Fir level ko 2 reassign karke log karein.',
      initialCode: '// 1. Declare appName and level\n// 2. Reassign level to 2\n// 3. Log them\n',
      solutionCode: 'const appName = "MaXxCode";\nlet level = 1;\nlevel = 2;\nconsole.log(appName, level);',
      expectedOutput: 'MaXxCode 2',
      codeExplanation: '`const appName` holds an immutable reference. `let level` allows reassignment from 1 to 2.'
    }
  },
  {
    id: 'js_0_3',
    type: 'code',
    title: 'Template Literals & String Interpolation',
    description: 'Build dynamic strings elegantly using backticks and ${expression}',
    language: 'javascript',
    order: 2,
    chapter: 'Chapter 0: Foundations & Types',
    content: {
      intro: 'ES6 Template Literals use backticks (`` ` ``) instead of quotes. They let you interpolate variables directly using `${variable}` without messy `+` string concatenations, and support multi-line strings effortlessly.',
      intro_hi: 'टेम्पलेट लिटरल्स में बैकबिक्स (`` ` ``) और `${}` का उपयोग करके स्ट्रिंग्स के अंदर वेरिएबल्स को आसानी से जोड़ा जाता है।',
      intro_hinglish: 'Template literals mein backticks aur `${}` use karke bina `+` lagaye strings mein variables inject kar sakte hain.',
      summary: [
        'Enclosed by backtick characters (`` ` ``).',
        'Expressions inside `${}` are evaluated and coerced to string.',
        'Supports clean multi-line formatting without newline escapes.'
      ],
      instructions: 'Given `const user = "Alex"` and `const score = 100`, use a template literal to log: "Alex scored 100 points!"',
      instructions_hi: '`user` और `score` का उपयोग करके टेम्पलेट लिटरल से "Alex scored 100 points!" प्रिंट करें।',
      instructions_hinglish: 'Template literal use karke log karein: "Alex scored 100 points!"',
      initialCode: 'const user = "Alex";\nconst score = 100;\n// Use a template literal with console.log:\n',
      solutionCode: 'const user = "Alex";\nconst score = 100;\nconsole.log(`${user} scored ${score} points!`);',
      expectedOutput: 'Alex scored 100 points!',
      codeExplanation: '`${user}` and `${score}` are evaluated at runtime and interpolated into the string.'
    }
  },
  {
    id: 'js_0_test',
    type: 'test',
    title: 'Chapter 0 Mastery Test',
    description: 'Test your grasp on JS fundamentals, variables, and scoping',
    language: 'javascript',
    order: 3,
    chapter: 'Chapter 0: Foundations & Types',
    content: {
      passThreshold: 0.8,
      testItems: [
        {
          id: 'c0_q1',
          type: 'mcq',
          question: 'Which keyword should you prefer by default for variables that will not be reassigned?',
          options: ['var', 'let', 'const', 'static'],
          correctIndex: 2
        },
        {
          id: 'c0_q2',
          type: 'mcq',
          question: 'What is the type of `typeof null` in JavaScript due to a historic bug?',
          options: ['"null"', '"undefined"', '"object"', '"boolean"'],
          correctIndex: 2
        },
        {
          id: 'c0_q3',
          type: 'code',
          question: 'Log the type of the number 42 using `typeof`',
          initialCode: '// Log typeof 42\n',
          solutionCode: 'console.log(typeof 42);',
          expectedOutput: 'number'
        },
        {
          id: 'c0_q4',
          type: 'mcq',
          question: 'Which syntax correctly interpolates a variable inside template literals?',
          options: ['$(var)', '#{var}', '${var}', '{{var}}'],
          correctIndex: 2
        },
        {
          id: 'c0_q5',
          type: 'code',
          question: 'Create a const `pi = 3.14` and log it multiplied by 2 (`pi * 2`)',
          initialCode: '',
          solutionCode: 'const pi = 3.14;\nconsole.log(pi * 2);',
          expectedOutput: '6.28'
        }
      ]
    }
  },

  // ==========================================
  // CHAPTER 1: MODERN OPERATORS & CONTROL FLOW
  // ==========================================
  {
    id: 'js_1_1',
    type: 'code',
    title: 'Strict Equality (===) vs Loose (==)',
    description: 'Why strict equality is non-negotiable in production JavaScript',
    language: 'javascript',
    order: 4,
    chapter: 'Chapter 1: Modern Operators & Control Flow',
    content: {
      intro: 'The loose equality operator `==` performs implicit type coercion, causing famous quirks like `0 == ""` (true) or `null == undefined` (true). The strict equality operator `===` checks both value AND type without coercion.',
      intro_hi: '`==` अपने आप टाइप कन्वर्जन (type coercion) कर देता है जो बग्स पैदा करता है। हमेशा `===` (Strict Equality) का प्रयोग करें।',
      intro_hinglish: '`==` bina puche type convert kar deta hai, isliye production code mein hamesha `===` use karte hain jo type aur value dono check karta hai.',
      summary: [
        'Always use `===` and `!==` in modern JavaScript.',
        '`==` coerces types (e.g. `5 == "5"` is true, but `5 === "5"` is false).',
        '`===` prevents subtle bugs and improves JIT optimization.'
      ],
      instructions: 'Compare `5 === "5"` and `5 === 5`. Log both boolean results on separate lines using console.log.',
      instructions_hi: '`5 === "5"` और `5 === 5` को कम्पेयर करें और दोनों का रिज़ल्ट अलग-अलग लाइन में लॉग करें।',
      instructions_hinglish: '`5 === "5"` aur `5 === 5` ko compare karke dono results console.log karein.',
      initialCode: '// Log 5 === "5"\n// Log 5 === 5\n',
      solutionCode: 'console.log(5 === "5");\nconsole.log(5 === 5);',
      expectedOutput: 'false\ntrue',
      codeExplanation: '`5 === "5"` yields false because number !== string. `5 === 5` yields true.'
    }
  },
  {
    id: 'js_1_2',
    type: 'code',
    title: 'Nullish Coalescing (??) & Optional Chaining (?.)',
    description: 'Safely access nested properties and provide true null/undefined defaults',
    language: 'javascript',
    order: 5,
    chapter: 'Chapter 1: Modern Operators & Control Flow',
    content: {
      intro: 'The `||` operator treats `0`, `""`, and `false` as falsy, accidentally overwriting valid values! The Nullish Coalescing operator `??` ONLY falls back if the left side is `null` or `undefined`. Pair this with Optional Chaining `?.` to safely read deep object paths without crashing.',
      intro_hi: '`??` सिर्फ तभी डिफॉल्ट वैल्यू लेता है जब वैल्यू `null` या `undefined` हो (यह 0 या "" को नहीं बदलता)। `?.` सुरक्षित रूप से ऑब्जेक्ट प्रॉपर्टीज एक्सेस करता है।',
      intro_hinglish: '`||` 0 aur empty string ko bhi replace kar deta hai. `??` sirf `null` ya `undefined` pe fallback karta hai. `?.` se code crash hone se bach jata hai.',
      summary: [
        '`??` evaluates fallback only for `null` and `undefined`.',
        '`?.` stops evaluation if value before it is nullish, returning `undefined` instead of throwing.',
        'Essential for dealing with dynamic API responses.'
      ],
      instructions: 'Given `const user = { name: "Ria", settings: { count: 0 } };`:\n1. Use optional chaining to safely read `user.profile?.bio ?? "No Bio"` and log it.\n2. Log `user.settings.count ?? 10` to demonstrate that 0 is preserved.',
      instructions_hi: 'दिए गए ऑब्जेक्ट में `user.profile?.bio ?? "No Bio"` और `user.settings.count ?? 10` को लॉग करें।',
      instructions_hinglish: 'Optional chaining aur nullish coalescing use karke dono values log karein.',
      initialCode: 'const user = { name: "Ria", settings: { count: 0 } };\n// 1. Log bio fallback\n// 2. Log count fallback\n',
      solutionCode: 'const user = { name: "Ria", settings: { count: 0 } };\nconsole.log(user.profile?.bio ?? "No Bio");\nconsole.log(user.settings.count ?? 10);',
      expectedOutput: 'No Bio\n0',
      codeExplanation: '`user.profile?.bio` safely evaluates to `undefined`, triggering "No Bio". `user.settings.count` is 0 (not nullish), so 0 is kept.'
    }
  },
  {
    id: 'js_1_test',
    type: 'test',
    title: 'Chapter 1 Test: Operators & Flow',
    description: 'Verify your proficiency in modern operators and nullish handling',
    language: 'javascript',
    order: 6,
    chapter: 'Chapter 1: Modern Operators & Control Flow',
    content: {
      passThreshold: 0.8,
      testItems: [
        {
          id: 'c1_q1',
          type: 'mcq',
          question: 'What is the result of: `0 || "default"` vs `0 ?? "default"`?',
          options: ['"default" and "default"', '"default" and 0', '0 and "default"', '0 and 0'],
          correctIndex: 1
        },
        {
          id: 'c1_q2',
          type: 'mcq',
          question: 'If `obj` is `null`, what does `obj?.user?.name` return?',
          options: ['Throws TypeError', 'null', 'undefined', '""'],
          correctIndex: 2
        },
        {
          id: 'c1_q3',
          type: 'code',
          question: 'Write a ternary expression that checks if `score >= 50` return "Pass" else "Fail" and log the result for `score = 75`',
          initialCode: 'const score = 75;\n// Log the ternary result:\n',
          solutionCode: 'const score = 75;\nconsole.log(score >= 50 ? "Pass" : "Fail");',
          expectedOutput: 'Pass'
        },
        {
          id: 'c1_q4',
          type: 'mcq',
          question: 'Which statement about `NaN === NaN` is true?',
          options: ['It is true', 'It is false', 'It throws an error', 'It returns undefined'],
          correctIndex: 1
        }
      ]
    }
  },

  // ==========================================
  // CHAPTER 2: FUNCTIONS, SCOPE & CLOSURES
  // ==========================================
  {
    id: 'js_2_1',
    type: 'code',
    title: 'Arrow Functions & Lexical "this"',
    description: 'Concise syntax, implicit returns, and lexical scoping in modern JS',
    language: 'javascript',
    order: 7,
    chapter: 'Chapter 2: Functions, Scope & Closures',
    content: {
      intro: 'Arrow functions (`() => {}`) provide a clean, concise syntax for writing functions. When there is a single expression, you can omit curly brackets and the `return` keyword for an implicit return! Crucially, arrow functions do not bind their own `this`.',
      intro_hi: 'एरो फंक्शन्स (`=>`) मॉडर्न जावास्क्रिप्ट का मुख्य हिस्सा हैं। सिंगल लाइन एक्सप्रेशन में `return` लिखने की आवश्यकता नहीं होती।',
      intro_hinglish: 'Arrow functions syntax ko chota aur clean banate hain. Single line mein curly brackets aur `return` keyword ki zaroorat nahi hoti.',
      summary: [
        '`const add = (a, b) => a + b;` implicitly returns the sum.',
        'Single parameter does not require parentheses: `x => x * 2`.',
        'Lexically inherits `this` from the enclosing scope.'
      ],
      instructions: 'Create an arrow function `square` that takes `n` and implicitly returns `n * n`. Then log `square(7)`.',
      instructions_hi: 'एक एरो फंक्शन `square` बनाएं जो `n` लेकर `n * n` रिटर्न करे। फिर `square(7)` लॉग करें।',
      instructions_hinglish: 'Ek arrow function `square` banayein jo `n * n` return kare. Fir `square(7)` log karein.',
      initialCode: '// Define square arrow function:\n\n// Log square(7):\n',
      solutionCode: 'const square = n => n * n;\nconsole.log(square(7));',
      expectedOutput: '49',
      codeExplanation: '`const square = n => n * n;` uses implicit return to square the input number.'
    }
  },
  {
    id: 'js_2_2',
    type: 'code',
    title: 'Closures & Data Encapsulation',
    description: 'Understand how inner functions remember their lexical outer scope',
    language: 'javascript',
    order: 8,
    chapter: 'Chapter 2: Functions, Scope & Closures',
    content: {
      intro: 'A **closure** is created when an inner function retains access to variables in its outer enclosing function even after the outer function has finished executing. This is the cornerstone of private state in JavaScript!',
      intro_hi: 'क्लोजर (Closure) तब बनता है जब एक इनर फंक्शन अपने बाहर वाले फंक्शन के वेरिएबल्स को तब भी याद रखता है जब आउटर फंक्शन खत्म हो चुका हो।',
      intro_hinglish: 'Closure tab banta hai jab ek inner function apne outer function ke variables ko execute hone ke baad bhi yaad rakhta hai. Private variables ke liye yeh zaroori hai.',
      summary: [
        'Functions carry a reference to their lexical environment.',
        'Enables private state without class `#` fields.',
        'Widely used in React hooks (like useState), currying, and memoization.'
      ],
      instructions: 'Create a function `createCounter()` that initializes `let count = 0` and returns an inner function that increments `count` and returns the new value. Instantiate `const counter = createCounter()`, then log `counter()` and `counter()`.',
      instructions_hi: '`createCounter()` फंक्शन बनाएं जो एक इनर फंक्शन रिटर्न करे जो हर कॉल पर `count` को 1 बढ़ाकर रिटर्न करे। फिर दो बार कॉल करके आउटपुट लॉग करें।',
      instructions_hinglish: '`createCounter()` banayein jo `count` ko increment kare aur return kare. `const counter = createCounter()` banakar do baar call aur log karein.',
      initialCode: 'function createCounter() {\n  // your closure logic here\n}\n\nconst counter = createCounter();\n// Call counter() twice and log results\n',
      solutionCode: 'function createCounter() {\n  let count = 0;\n  return function() {\n    count += 1;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter());\nconsole.log(counter());',
      expectedOutput: '1\n2',
      codeExplanation: 'The inner function forms a closure over `count`, preserving its state between invocations.'
    }
  },
  {
    id: 'js_2_test',
    type: 'test',
    title: 'Chapter 2 Test: Functions & Closures',
    description: 'Validate your understanding of closures, scope, and arrow mechanics',
    language: 'javascript',
    order: 9,
    chapter: 'Chapter 2: Functions, Scope & Closures',
    content: {
      passThreshold: 0.8,
      testItems: [
        {
          id: 'c2_q1',
          type: 'mcq',
          question: 'What is a Closure in JavaScript?',
          options: [
            'A way to terminate a program early',
            'A function bundled together with references to its lexical environment',
            'A method to close network connections',
            'An encrypted variable'
          ],
          correctIndex: 1
        },
        {
          id: 'c2_q2',
          type: 'mcq',
          question: 'Do arrow functions have their own `arguments` object or `this` binding?',
          options: ['Yes, always', 'No, they inherit from outer lexical scope', 'Only in strict mode', 'Only inside classes'],
          correctIndex: 1
        },
        {
          id: 'c2_q3',
          type: 'code',
          question: 'Write a curried function `multiply(a)` that returns a function taking `b` and returning `a * b`. Log `multiply(5)(6)`.',
          initialCode: '// Define multiply(a)(b)\n',
          solutionCode: 'const multiply = a => b => a * b;\nconsole.log(multiply(5)(6));',
          expectedOutput: '30'
        }
      ]
    }
  },

  // ==========================================
  // CHAPTER 3: ARRAY MASTERY & FUNCTIONAL PROGRAMMING
  // ==========================================
  {
    id: 'js_3_1',
    type: 'code',
    title: 'Transformations with map() and filter()',
    description: 'Immutably transform and filter lists like a senior engineer',
    language: 'javascript',
    order: 10,
    chapter: 'Chapter 3: Array Mastery & Functional JS',
    content: {
      intro: 'In modern JavaScript, we prefer declarative array methods over imperative `for` loops. `map()` creates a new array by applying a function to every item. `filter()` creates a new array containing only elements that pass a test condition. Both are pure and do NOT mutate the original array.',
      intro_hi: '`map()` हर एलिमेंट को बदलता है और नया ऐरे देता है। `filter()` कंडीशन के अनुसार एलिमेंट्स चुनता है। दोनों ओरिजिनल ऐरे को नहीं बदलते।',
      intro_hinglish: '`map()` har item ko transform karke naya array deta hai, aur `filter()` conditions match karne wale items ko chunta hai. Dono immutability follow karte hain.',
      summary: [
        '`map` transforms elements 1-to-1.',
        '`filter` selects matching elements.',
        'Never mutate the original array when using functional methods.'
      ],
      instructions: 'Given `const numbers = [1, 2, 3, 4, 5, 6];`:\n1. Filter for only even numbers.\n2. Map those even numbers to their double (`n * 2`).\n3. Log the resulting array: `console.log(result)`.',
      instructions_hi: 'दिए गए नंबर्स में से ईवन (even) नंबर्स को फिल्टर करें, उन्हें डबल करें और रिजल्ट लॉग करें।',
      instructions_hinglish: 'Even numbers filter karke unhe double karein aur final array console.log karein.',
      initialCode: 'const numbers = [1, 2, 3, 4, 5, 6];\n// Chain filter and map:\n',
      solutionCode: 'const numbers = [1, 2, 3, 4, 5, 6];\nconst result = numbers.filter(n => n % 2 === 0).map(n => n * 2);\nconsole.log(result);',
      expectedOutput: '[4,8,12]',
      codeExplanation: '`filter` leaves `[2, 4, 6]`. `map` multiplies each by 2 to produce `[4, 8, 12]`.'
    }
  },
  {
    id: 'js_3_2',
    type: 'code',
    title: 'The Swiss Army Knife: Array.reduce()',
    description: 'Accumulate values, calculate totals, and reshape data structures',
    language: 'javascript',
    order: 11,
    chapter: 'Chapter 3: Array Mastery & Functional JS',
    content: {
      intro: '`reduce()` is the most powerful array method in JavaScript. It iterates through an array, carrying an `accumulator` from one iteration to the next, reducing the entire array into a single result (number, object, or new array).',
      intro_hi: '`reduce()` ऐरे के सभी एलिमेंट्स को प्रोसेस करके एक सिंगल वैल्यू (जैसे टोटल सम या ऑब्जेक्ट) में बदल देता है।',
      intro_hinglish: '`reduce()` sabse versatile method hai. Yeh array ko ek single value, object ya map mein accumulate kar deta hai.',
      summary: [
        'Syntax: `array.reduce((acc, current) => ..., initialValue)`.',
        'Always provide an `initialValue` to prevent runtime errors with empty arrays.',
        'Can replace both `map` and `filter` in a single pass.'
      ],
      instructions: 'Given `const cart = [{ price: 10 }, { price: 25 }, { price: 15 }];`, use `reduce` to compute the total sum of prices starting with `0`. Log `total`.',
      instructions_hi: '`reduce` का उपयोग करके कार्ट की सभी वस्तुओं की कीमतों का कुल योग (total) निकालें और लॉग करें।',
      instructions_hinglish: '`reduce` use karke total price calculate karein aur log karein.',
      initialCode: 'const cart = [{ price: 10 }, { price: 25 }, { price: 15 }];\n// Use reduce to find total sum:\n',
      solutionCode: 'const cart = [{ price: 10 }, { price: 25 }, { price: 15 }];\nconst total = cart.reduce((acc, item) => acc + item.price, 0);\nconsole.log(total);',
      expectedOutput: '50',
      codeExplanation: 'The accumulator begins at 0, adds each `item.price` (10 + 25 + 15), giving 50.'
    }
  },
  {
    id: 'js_3_test',
    type: 'test',
    title: 'Chapter 3 Test: Functional Arrays',
    description: 'Demonstrate your mastery over map, filter, and reduce operations',
    language: 'javascript',
    order: 12,
    chapter: 'Chapter 3: Array Mastery & Functional JS',
    content: {
      passThreshold: 0.8,
      testItems: [
        {
          id: 'c3_q1',
          type: 'mcq',
          question: 'Does `[1, 2, 3].map(x => x * 2)` modify the original array?',
          options: ['Yes, in place', 'No, returns a new array', 'Only if assigned', 'Throws an error'],
          correctIndex: 1
        },
        {
          id: 'c3_q2',
          type: 'code',
          question: 'Given `const items = ["apple", "banana", "cherry"];`, log true if every item has length > 3 using `every()`.',
          initialCode: 'const items = ["apple", "banana", "cherry"];\n// Log items.every(...)\n',
          solutionCode: 'const items = ["apple", "banana", "cherry"];\nconsole.log(items.every(item => item.length > 3));',
          expectedOutput: 'true'
        },
        {
          id: 'c3_q3',
          type: 'mcq',
          question: 'What is the return value of `[1, 2, 3].find(x => x > 5)`?',
          options: ['null', 'undefined', '-1', 'false'],
          correctIndex: 1
        }
      ]
    }
  },

  // ==========================================
  // CHAPTER 4: OBJECTS, PROTOTYPES & DESTRUCTURING
  // ==========================================
  {
    id: 'js_4_1',
    type: 'code',
    title: 'Destructuring & Rest / Spread Operator',
    description: 'Unpack values effortlessly and merge objects immutably',
    language: 'javascript',
    order: 13,
    chapter: 'Chapter 4: Objects, Prototypes & ES6+',
    content: {
      intro: 'Destructuring allows unpacking values from arrays or properties from objects into distinct variables. The spread operator (`...`) allows shallow copying and immutably merging objects and arrays with ease.',
      intro_hi: 'डिस्ट्रक्चरिंग से हम ऑब्जेक्ट्स और ऐरे से आसानी से प्रॉपर्टीज निकाल सकते हैं। `...` (Spread) ऑपरेटर से ऑब्जेक्ट्स को बिना बदले कॉपी और मर्ज किया जाता है।',
      intro_hinglish: 'Destructuring se object ki properties seedhe variable mein aa jaati hain. Spread operator `...` se shallow clone aur merge aasan ho jata hai.',
      summary: [
        '`const { name, role = "User" } = user;` extracts with defaults.',
        '`const updated = { ...original, active: true };` performs immutable update.',
        'Essential for modern React state management and Redux.'
      ],
      instructions: 'Given `const base = { id: 1, role: "dev" };`, create `const user = { ...base, name: "Max", active: true };`. Destructure `{ name, role }` from `user` and log `name, role`.',
      instructions_hi: 'बेस ऑब्जेक्ट को स्प्रेड करके `user` बनाएं, फिर `{ name, role }` डिस्ट्रक्चर करके लॉग करें।',
      instructions_hinglish: 'Base object ko spread karke `user` banayein, fir `name` aur `role` destructure karke log karein.',
      initialCode: 'const base = { id: 1, role: "dev" };\n// 1. Create user with spread\n// 2. Destructure name & role\n// 3. Log name, role\n',
      solutionCode: 'const base = { id: 1, role: "dev" };\nconst user = { ...base, name: "Max", active: true };\nconst { name, role } = user;\nconsole.log(name, role);',
      expectedOutput: 'Max dev',
      codeExplanation: '`...base` copies base properties, adds `name` and `active`. Destructuring binds `name` and `role`.'
    }
  },
  {
    id: 'js_4_2',
    type: 'code',
    title: 'The Prototype Chain & Object.create',
    description: 'Unravel how JavaScript achieves inheritance under the hood',
    language: 'javascript',
    order: 14,
    chapter: 'Chapter 4: Objects, Prototypes & ES6+',
    content: {
      intro: 'JavaScript is a prototype-based language. Every object has an internal `[[Prototype]]` link to another object. If a property is not found on the object itself, the JS engine traverses up the prototype chain until it finds it or reaches `null`.',
      intro_hi: 'जावास्क्रिप्ट में इनहेरिटेंस प्रोटोटाइप चेन से होता है। अगर कोई प्रॉपर्टी ऑब्जेक्ट में नहीं मिलती तो JS उसके प्रोटोटाइप में ढूंढता है।',
      intro_hinglish: 'JS mein har object ke paas ek prototype hota hai. Agar object mein property nahi milti toh engine uske prototype chain mein search karta hai.',
      summary: [
        '`Object.create(proto)` creates a new object with specified prototype.',
        'Properties on the prototype are shared and save memory.',
        'Modern `class` syntax is syntactic sugar over prototype chains.'
      ],
      instructions: '1. Create `const protoGreeter = { greet() { return "Hi, " + this.name; } };`.\n2. Create `const dev = Object.create(protoGreeter); dev.name = "Codie";`.\n3. Log `dev.greet()`.',
      instructions_hi: '`Object.create` का उपयोग करके `protoGreeter` से इनहेरिट होने वाला `dev` ऑब्जेक्ट बनाएं और `dev.greet()` लॉग करें।',
      instructions_hinglish: '`Object.create` se prototype based object banayein aur `dev.greet()` log karein.',
      initialCode: 'const protoGreeter = {\n  greet() {\n    return "Hi, " + this.name;\n  }\n};\n// Create dev inheriting from protoGreeter and log dev.greet():\n',
      solutionCode: 'const protoGreeter = {\n  greet() {\n    return "Hi, " + this.name;\n  }\n};\nconst dev = Object.create(protoGreeter);\ndev.name = "Codie";\nconsole.log(dev.greet());',
      expectedOutput: 'Hi, Codie',
      codeExplanation: '`dev` delegates `greet()` up the prototype chain to `protoGreeter`, where `this.name` resolves to "Codie".'
    }
  },

  // ==========================================
  // CHAPTER 5: MODERN CLASSES & OOP
  // ==========================================
  {
    id: 'js_5_1',
    type: 'code',
    title: 'ES6 Classes & Private Fields (#)',
    description: 'Clean OOP with constructor, methods, and true private state',
    language: 'javascript',
    order: 15,
    chapter: 'Chapter 5: Modern Classes & OOP',
    content: {
      intro: 'Modern JavaScript classes support true private fields using the `#` hash prefix. Private fields cannot be accessed or modified outside the class body, enforcing true encapsulation at the engine level.',
      intro_hi: 'मॉडर्न जावास्क्रिप्ट क्लासेज में `#` लगाकर प्राइवेट फील्ड्स बनाए जाते हैं, जिन्हें क्लास के बाहर से एक्सेस नहीं किया जा सकता।',
      intro_hinglish: 'JS classes mein `#` prefix lagane se fields truly private ho jaate hain aur bahar se unhe change nahi kiya ja sakta.',
      summary: [
        'Private fields start with `#` (e.g. `#balance = 0`).',
        '`constructor` initializes instance properties.',
        'Methods on classes reside on `Class.prototype`.'
      ],
      instructions: 'Create a class `BankAccount` with private field `#balance`. In constructor, take `initial` and set `#balance = initial`. Add a method `getBalance()` that returns `#balance`. Instantiate with `100` and log `account.getBalance()`.',
      instructions_hi: '`BankAccount` क्लास बनाएं जिसमें प्राइवेट फील्ड `#balance` हो। `getBalance()` मेथड बनाकर 100 से इनिशियलाइज करके बैलेंस लॉग करें।',
      instructions_hinglish: '`BankAccount` class banayein private `#balance` ke saath. Method `getBalance()` se 100 log karein.',
      initialCode: 'class BankAccount {\n  #balance = 0;\n  constructor(initial) {\n    this.#balance = initial;\n  }\n  getBalance() {\n    return this.#balance;\n  }\n}\n// Instantiate and log balance:\n',
      solutionCode: 'class BankAccount {\n  #balance = 0;\n  constructor(initial) {\n    this.#balance = initial;\n  }\n  getBalance() {\n    return this.#balance;\n  }\n}\nconst account = new BankAccount(100);\nconsole.log(account.getBalance());',
      expectedOutput: '100',
      codeExplanation: '`#balance` is securely encapsulated and only readable via `getBalance()`.'
    }
  },

  // ==========================================
  // CHAPTER 6: ASYNCHRONOUS JS, PROMISES & ASYNC/AWAIT
  // ==========================================
  {
    id: 'js_6_1',
    type: 'code',
    title: 'Promises & The JavaScript Event Loop',
    description: 'Understand the difference between synchronous code and microtasks',
    language: 'javascript',
    order: 16,
    chapter: 'Chapter 6: Async JS & Promises',
    content: {
      intro: 'JavaScript is single-threaded with an Event Loop. Synchronous code runs first on the Call Stack. Promise callbacks (`.then()`) enter the **Microtask Queue**, which executes immediately after the current call stack empties, BEFORE macrotasks (`setTimeout`).',
      intro_hi: 'जावास्क्रिप्ट सिंगल-थ्रेडेड है। प्रॉमिस माइक्रो-टास्क क्यू (Microtask Queue) में चलते हैं और सिंक्रोनस कोड के तुरंत बाद एग्जीक्यूट होते हैं।',
      intro_hinglish: 'JS single-threaded hai. Sync code pehle execute hota hai, fir Promises (Microtasks) run hote hain. Is concept ko Event Loop bolte hain.',
      summary: [
        'Call Stack -> Microtask Queue (Promises) -> Macrotask Queue (setTimeout).',
        '`Promise.resolve("value")` creates an immediately fulfilled promise.',
        'Never block the main thread with long synchronous loops.'
      ],
      instructions: 'Use `Promise.resolve("Resolved Data")` and attach a `.then(data => console.log(data))` to log the resolved value.',
      instructions_hi: '`Promise.resolve("Resolved Data")` बनाकर `.then` से वैल्यू को कंसोल में लॉग करें।',
      instructions_hinglish: '`Promise.resolve` use karke `.then` ke sath value console.log karein.',
      initialCode: '// Create and handle resolved promise:\n',
      solutionCode: 'Promise.resolve("Resolved Data").then(data => console.log(data));',
      expectedOutput: 'Resolved Data',
      codeExplanation: '`Promise.resolve` queues the callback in the microtask queue, outputting the result.'
    }
  },
  {
    id: 'js_6_2',
    type: 'code',
    title: 'Modern async/await & try/catch',
    description: 'Write asynchronous code that looks and behaves like clean synchronous code',
    language: 'javascript',
    order: 17,
    chapter: 'Chapter 6: Async JS & Promises',
    content: {
      intro: '`async` functions return a Promise automatically. Inside an `async` function, the `await` keyword pauses execution until the promise resolves, unpacking its value. Errors are handled elegantly using standard `try { ... } catch (err) { ... }` blocks.',
      intro_hi: '`async/await` से हम एसिंक्रोनस कोड को आसान और साफ़ तरीके से लिखते हैं। एरर हैंडलिंग के लिए `try/catch` का इस्तेमाल होता है।',
      intro_hinglish: '`async/await` se promise chaining `.then()` ki jagah clean synchronous jaisa code likh sakte hain aur `try/catch` se errors handle hote hain.',
      summary: [
        '`async` always wraps return value in `Promise.resolve()`.',
        '`await` can only be used inside async functions (or top-level in ES modules).',
        'Always wrap `await` calls in `try/catch` to handle network or API failures.'
      ],
      instructions: 'Define an `async function fetchStatus()` that awaits `Promise.resolve("Active")` and returns it. Call it and log the result using `await`: `const status = await fetchStatus(); console.log(status);`.',
      instructions_hi: '`async function fetchStatus()` बनाएं जो `Promise.resolve("Active")` को await करे और रिटर्न करे। फिर उसे await करके लॉग करें।',
      instructions_hinglish: '`async function fetchStatus()` banayein, `await fetchStatus()` karke status log karein.',
      initialCode: '// Define async function fetchStatus and await its result:\n',
      solutionCode: 'async function fetchStatus() {\n  const res = await Promise.resolve("Active");\n  return res;\n}\nconst status = await fetchStatus();\nconsole.log(status);',
      expectedOutput: 'Active',
      codeExplanation: '`await` pauses until `Promise.resolve("Active")` settles, returning "Active".'
    }
  },
  {
    id: 'js_6_test',
    type: 'test',
    title: 'Chapter 6 Test: Async Mastery',
    description: 'Test your understanding of Promises, event loop, and async/await',
    language: 'javascript',
    order: 18,
    chapter: 'Chapter 6: Async JS & Promises',
    content: {
      passThreshold: 0.8,
      testItems: [
        {
          id: 'c6_q1',
          type: 'mcq',
          question: 'In what order do these execute: 1. `console.log("A")`, 2. `Promise.resolve().then(() => console.log("B"))`, 3. `setTimeout(() => console.log("C"), 0)`?',
          options: ['A, B, C', 'A, C, B', 'B, A, C', 'C, A, B'],
          correctIndex: 0
        },
        {
          id: 'c6_q2',
          type: 'mcq',
          question: 'What does an async function return if you write `return 42`?',
          options: ['42', 'Promise { 42 }', 'undefined', 'Observable { 42 }'],
          correctIndex: 1
        },
        {
          id: 'c6_q3',
          type: 'code',
          question: 'Use `try...catch` to handle `Promise.reject(new Error("Failed"))` inside an async block and log "Caught Error"',
          initialCode: 'try {\n  await Promise.reject(new Error("Failed"));\n} catch (e) {\n  // Log "Caught Error"\n}\n',
          solutionCode: 'try {\n  await Promise.reject(new Error("Failed"));\n} catch (e) {\n  console.log("Caught Error");\n}',
          expectedOutput: 'Caught Error'
        }
      ]
    }
  },

  // ==========================================
  // CHAPTER 7: ADVANCED ASYNC & CONCURRENCY
  // ==========================================
  {
    id: 'js_7_1',
    type: 'code',
    title: 'Concurrent Execution with Promise.all()',
    description: 'Run multiple asynchronous operations in parallel for maximum performance',
    language: 'javascript',
    order: 19,
    chapter: 'Chapter 7: Advanced Concurrency',
    content: {
      intro: 'When fetching multiple independent resources, awaiting them sequentially causes unnecessary network waterfalls! `Promise.all([p1, p2, ...])` fires them concurrently and resolves when ALL promises settle, failing fast if any rejects.',
      intro_hi: '`Promise.all` एक साथ कई एसिंक ऑपरेशंस को पैरेलल (concurrent) रन करता है जिससे समय बचता है।',
      intro_hinglish: 'Sequential await karne ke bajay `Promise.all` use karne se saari API calls parallel mein execute hoti hain aur speed badhti hai.',
      summary: [
        'Executes promises in parallel, preserving original order of results in the array.',
        'Fails immediately if ANY promise in the array rejects.',
        'Use `Promise.allSettled` if you need all results even when some fail.'
      ],
      instructions: 'Create `const p1 = Promise.resolve(10);` and `const p2 = Promise.resolve(20);`. Use `await Promise.all([p1, p2])`, destructure `[a, b]`, and log `a + b`.',
      instructions_hi: 'दो प्रॉमिस बनाकर `Promise.all` से await करें और दोनों के रिज़ल्ट का जोड़ `a + b` लॉग करें।',
      instructions_hinglish: '`Promise.all` se dono promises await karke unka sum `a + b` log karein.',
      initialCode: 'const p1 = Promise.resolve(10);\nconst p2 = Promise.resolve(20);\n// Await Promise.all, destructure and log sum:\n',
      solutionCode: 'const p1 = Promise.resolve(10);\nconst p2 = Promise.resolve(20);\nconst [a, b] = await Promise.all([p1, p2]);\nconsole.log(a + b);',
      expectedOutput: '30',
      codeExplanation: 'Both promises resolve concurrently. Destructuring assigns 10 to `a` and 20 to `b`, logging 30.'
    }
  },

  // ==========================================
  // CHAPTER 8: ADVANCED PATTERNS & ALGORITHMS
  // ==========================================
  {
    id: 'js_8_1',
    type: 'code',
    title: 'The Debounce Function Pattern',
    description: 'Master rate-limiting function calls for search inputs and resize listeners',
    language: 'javascript',
    order: 20,
    chapter: 'Chapter 8: Senior JS Design Patterns',
    content: {
      intro: 'Debouncing ensures that a function is not called again until a specified delay has passed since its last invocation. It is one of the most critical performance optimizations for search autocomplete, window resize events, and form autosave.',
      intro_hi: 'डिबाउंसिंग (Debouncing) लगातार आने वाले इवेंट्स को रोककर सिर्फ आखिरी कॉल के कुछ देर बाद फंक्शन चलाता है (जैसे सर्च बार में)।',
      intro_hinglish: 'Debouncing continuous events (jaise typing ya scroll) ko limit karta hai taaki unnecessary functions run na hon. Har frontend interview ka favorite question hai!',
      summary: [
        'Cancels preceding timer with `clearTimeout` when called within the delay.',
        'Uses closures to maintain the `timerId` between calls.',
        'Crucial for UI responsiveness and reducing server load.'
      ],
      instructions: 'Implement a basic `debounce(fn, delay)` function. It should return a function that clears the previous timer and sets a new `setTimeout` to call `fn`. For this test, demonstrate with a mock: declare `let called = false; const fn = () => { called = true; };` and log "Debounce Mastered".',
      instructions_hi: 'डिबाउंस पैटर्न को समझें और कंसोल में "Debounce Mastered" लॉग करें।',
      instructions_hinglish: 'Debounce pattern ko implement karein aur "Debounce Mastered" log karein.',
      initialCode: '// Understand and implement debounce pattern:\nconsole.log("Debounce Mastered");\n',
      solutionCode: 'function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\nconsole.log("Debounce Mastered");',
      expectedOutput: 'Debounce Mastered',
      codeExplanation: '`debounce` captures `timer` in a closure, clearing it on every burst and scheduling `fn`.'
    }
  },
  {
    id: 'js_8_2',
    type: 'code',
    title: 'Deep Clone & Structured Cloning',
    description: 'Safely clone nested objects without mutating original data',
    language: 'javascript',
    order: 21,
    chapter: 'Chapter 8: Senior JS Design Patterns',
    content: {
      intro: 'Shallow copies like `{ ...obj }` or `Object.assign()` only copy top-level keys; nested objects and arrays still share memory references! Modern JavaScript provides `structuredClone()`, which deeply clones objects, dates, sets, maps, and typed arrays without external libraries.',
      intro_hi: '`structuredClone()` मॉडर्न जावास्क्रिप्ट का इन-बिल्ट मेथड है जो नेस्टेड ऑब्जेक्ट्स की पूरी डीप कॉपी बनाता है।',
      intro_hinglish: 'Spread `{ ...obj }` sirf 1st level copy karta hai. Nested values ke liye `structuredClone()` deep copy banata hai.',
      summary: [
        'Built-in `structuredClone(obj)` handles circular references, Dates, and Sets.',
        'Prevents accidental nested mutations in stateful apps.',
        'Supersedes the old `JSON.parse(JSON.stringify(obj))` hack.'
      ],
      instructions: 'Given `const original = { user: { name: "Aarav" } };`:\n1. Deep clone using `const cloned = structuredClone(original);`.\n2. Modify `cloned.user.name = "Kabir";`.\n3. Log `original.user.name` to prove the original was not mutated!',
      instructions_hi: '`structuredClone` से क्लोन बनाकर क्लोन में नाम बदलें, और ओरिजिनल का नाम प्रिंट करके साबित करें कि ओरिजिनल सुरक्षित है।',
      instructions_hinglish: '`structuredClone` use karke check karein ki original object modify nahi hua.',
      initialCode: 'const original = { user: { name: "Aarav" } };\n// 1. Deep clone with structuredClone\n// 2. Modify cloned.user.name\n// 3. Log original.user.name\n',
      solutionCode: 'const original = { user: { name: "Aarav" } };\nconst cloned = structuredClone(original);\ncloned.user.name = "Kabir";\nconsole.log(original.user.name);',
      expectedOutput: 'Aarav',
      codeExplanation: 'Because `cloned` is an independent deep copy, altering `cloned.user.name` leaves `original.user.name` as "Aarav".'
    }
  }
];