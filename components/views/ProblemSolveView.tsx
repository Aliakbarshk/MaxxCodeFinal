import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, RotateCcw, MonitorPlay, Send, Terminal, Sparkles, HelpCircle, Code2, AlertCircle, Trophy, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Problem, UserState, Theme, Translation } from '../../types';
import { THEMES } from '../../constants';
import { Button, Card, Console, Modal, MaxAvatar } from '../UIComponents';
import { playSound } from '../../utils/audio';
import { runJavaScript } from '../../utils/jsRunner';

interface ProblemSolveViewProps {
  problem: Problem;
  user: UserState;
  theme: Theme;
  t: Translation;
  onBack: () => void;
  onSolve: (problemId: string, xpEarned: number) => void;
}

export const ProblemSolveView: React.FC<ProblemSolveViewProps> = ({
  problem,
  user,
  theme,
  t,
  onBack,
  onSolve
}) => {
  const [code, setCode] = useState(problem.initialCode || '');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const themeStyles = THEMES[theme];

  const handleRun = async () => {
    playSound('click');
    setIsRunning(true);
    setStatus('running');
    try {
      const result = await runJavaScript(code);
      setConsoleOutput(result.output && result.output.length > 0 ? result.output : ['[No console output logged]']);
    } catch (e: any) {
      setConsoleOutput([`Error: ${e?.message || e}`]);
    } finally {
      setIsRunning(false);
      setStatus('idle');
    }
  };

  const handleSubmit = async () => {
    playSound('click');
    setIsRunning(true);
    setStatus('running');

    try {
      const result = await runJavaScript(code, {
        expectedOutput: problem.expectedOutput
      });

      setConsoleOutput(result.output && result.output.length > 0 ? result.output : ['[Execution complete]']);

      if (result.passed) {
        setStatus('passed');
        playSound('success');
        onSolve(problem.id, 50);
        setShowSuccessModal(true);
      } else {
        setStatus('failed');
        setErrorMessage(result.feedback || result.error || 'Output did not match expected result.');
        playSound('error');
      }
    } catch (e: any) {
      setStatus('failed');
      setErrorMessage(`Error: ${e?.message || e}`);
      setConsoleOutput([`Error: ${e?.message || e}`]);
      playSound('error');
    } finally {
      setIsRunning(false);
    }
  };

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    medium: 'bg-amber-100 text-amber-700 border-amber-300',
    hard: 'bg-rose-100 text-rose-700 border-rose-300'
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden relative animate-pop" style={{ backgroundColor: themeStyles.bg }}>
      {/* Left Column: Problem Details */}
      <div 
        className="w-full md:w-1/3 p-6 md:p-8 overflow-y-auto border-r border-black/5 flex flex-col gap-6 custom-scrollbar" 
        style={{ backgroundColor: themeStyles.card, color: themeStyles.text }}
      >
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="text-gray-500" />
          </button>
          <div className="flex gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {problem.category}
            </span>
            <span className={clsx("text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border", difficultyColors[problem.difficulty])}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">{problem.title}</h1>
          <p className="opacity-75 leading-relaxed font-medium text-sm mt-2">{problem.description}</p>
        </div>

        <Card theme={theme} className="!p-5 border-l-8 !border-l-amber-500 !rounded-2xl">
          <h3 className="font-black text-xs uppercase tracking-widest text-amber-700 mb-2 flex items-center gap-1.5">
            <Code2 size={16} /> Problem Requirements
          </h3>
          <p className="text-sm font-semibold text-gray-800 leading-relaxed whitespace-pre-line">
            {problem.instructions}
          </p>
        </Card>

        {problem.expectedOutput && (
          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 text-xs font-mono text-amber-300">
            <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Expected Console Output:</div>
            <div className="bg-black/50 p-2.5 rounded-lg border border-gray-800 overflow-x-auto">
              {problem.expectedOutput}
            </div>
          </div>
        )}

        {problem.hints && problem.hints.length > 0 && (
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle size={16} /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>
            {showHint && (
              <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-medium text-amber-900 animate-slide-up">
                {problem.hints.map((h, i) => (
                  <p key={i}>💡 {h}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {status === 'failed' && (
          <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs font-bold text-rose-900 flex items-start gap-2.5 animate-slide-up">
            <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
            <div>
              <p className="font-black mb-1">Test Failed</p>
              <p className="font-normal opacity-90">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Center Column: Editor */}
      <div className="flex-1 flex flex-col relative border-r border-black/5 bg-[#1E1E1E]">
        <div className="bg-[#1E1E1E] p-3 flex items-center justify-between text-gray-400 text-xs border-b border-[#333]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 ml-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <span className="ml-3 font-mono text-yellow-400 font-bold text-xs flex items-center gap-1.5">
              <Terminal size={14} /> solution.js
            </span>
          </div>
          <button 
            onClick={() => setCode(problem.initialCode || '')}
            className="hover:text-white transition-colors flex items-center gap-1 text-xs"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          className="flex-1 w-full bg-[#18181B] text-[#E4E4E7] p-8 font-mono text-base resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-amber-500/30"
          spellCheck={false}
          autoFocus
          placeholder="// Type your solution here..."
        />

        <div className="p-4 bg-[#1E1E1E] border-t border-[#333] flex items-center justify-between gap-4">
          <div className="text-xs text-gray-400">
            Write modular code with proper returns and console outputs.
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleRun}
              disabled={isRunning}
              className="!px-6 !py-3 bg-gray-700 hover:bg-gray-600 text-white border-gray-900"
            >
              <MonitorPlay size={18} /> Run Code
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isRunning}
              className="!px-8 !py-3 bg-amber-500 hover:bg-amber-400 text-black font-black border-amber-700 shadow-lg"
            >
              <Send size={18} /> Submit Solution
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Console */}
      <div className="hidden md:flex w-1/4 flex-col bg-[#1E1E1E] border-l border-[#333] p-4">
        <Console output={consoleOutput} theme={theme} />
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Challenge Completed!" type="success">
        <div className="flex flex-col items-center text-center gap-6 p-2">
          <div className="scale-125 animate-bounce-slow mt-2">
            <MaxAvatar mood="excited" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-2">+50 XP Awarded!</div>
            <h3 className="text-2xl font-black text-gray-800 leading-tight">Algorithm Conquered!</h3>
            <p className="text-sm text-gray-500 mt-1">{problem.title}</p>
          </div>

          <div className="w-full text-left bg-gray-900 rounded-2xl p-5 border border-gray-800 text-xs font-mono">
            <div className="text-yellow-400 font-bold uppercase tracking-wider mb-2">Verified Solution:</div>
            <code className="text-green-400 whitespace-pre block overflow-x-auto">{problem.solutionCode}</code>
          </div>

          <div className="w-full">
            <Button fullWidth onClick={onBack} variant="primary" size="lg" className="!py-4 !rounded-2xl !bg-amber-500 hover:!bg-amber-400 text-black font-black border-amber-600 shadow-xl">
              Back to Challenges <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
