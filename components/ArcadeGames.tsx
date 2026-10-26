import React, { useState, useEffect } from 'react';
import { Gamepad2, Bug, BrainCircuit, ArrowLeft, Trophy, AlertTriangle, Code2, ListOrdered, Zap, Flame, Eye, RefreshCw, ChevronRight } from 'lucide-react';
import { Button, MaxAvatar, Card } from './UIComponents';
import { playSound } from '../utils/audio';
import { BUG_HUNTER_LEVELS, SCRAMBLE_LEVELS } from '../constants';
import { clsx } from 'clsx';

// --- GAME: RAPID FIRE ---
const RapidFire: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [phase, setPhase] = useState<'mcq' | 'code' | 'result'>('mcq');
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [revealedCount, setRevealedCount] = useState(0);
    const [userCode, setUserCode] = useState("");
    const [showSolution, setShowSolution] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const mcqs = [
        { q: "What is `typeof NaN` in JavaScript?", opts: ["NaN", "number", "undefined", "object"], a: 1 },
        { q: "Which queue handles resolved Promise callbacks?", opts: ["Macrotask Queue", "Microtask Queue", "Render Queue", "Call Stack"], a: 1 },
        { q: "What does `const [a, ...b] = [1, 2, 3]` assign to `b`?", opts: ["[2, 3]", "2", "3", "undefined"], a: 0 },
        { q: "Which operator provides true null/undefined fallback without overwriting 0?", opts: ["||", "??", "&&", "?:"], a: 1 },
        { q: "Do arrow functions have their own `this` binding?", opts: ["Yes", "No, they inherit lexical this", "Only in classes", "Only with 'use strict'"], a: 1 }
    ];

    const codeTasks = [
        { q: "Log 'JS Master' using console.log()", sol: "console.log('JS Master')", lang: 'javascript' },
        { q: "Declare a const named 'score' set to 100", sol: "const score = 100;", lang: 'javascript' },
        { q: "Write an arrow function 'double' that doubles 'x': (x => x * 2)", sol: "const double = x => x * 2;", lang: 'javascript' }
    ];

    const handleMCQ = (idx: number) => {
        setSelectedOption(idx);
        const correct = idx === mcqs[currentStep].a;
        if (correct) {
            setScore(s => s + 50);
            playSound('success');
        } else {
            playSound('error');
        }

        setTimeout(() => {
            setSelectedOption(null);
            if (currentStep < mcqs.length - 1) {
                setCurrentStep(s => s + 1);
            } else {
                setPhase('code');
                setCurrentStep(0);
            }
        }, 600);
    };

    const handleCodeSubmit = () => {
        const task = codeTasks[currentStep];
        const normalizedUser = userCode.trim().replace(/"/g, "'").replace(/;/g, "").replace(/\s+/g, ' ');
        const normalizedSol = task.sol.trim().replace(/"/g, "'").replace(/;/g, "").replace(/\s+/g, ' ');

        if (normalizedUser.includes(normalizedSol) || normalizedUser === normalizedSol) {
            setScore(s => s + 100);
            playSound('success');
            moveToNextCode();
        } else {
            playSound('error');
        }
    };

    const handleReveal = () => {
        if (showSolution) return;
        setRevealedCount(r => r + 1);
        setShowSolution(true);
        playSound('pop');
    };

    const moveToNextCode = () => {
        setShowSolution(false);
        setUserCode("");
        if (currentStep < codeTasks.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            setPhase('result');
        }
    };

    if (phase === 'result') {
        const needsRelearn = revealedCount >= 2;
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-pop max-w-sm mx-auto">
                <div className="bg-amber-100 p-6 rounded-full mb-6 text-amber-600 shadow-xl border-4 border-amber-200 animate-bounce-slow">
                    <Trophy size={64} />
                </div>
                <h2 className="text-4xl font-black mb-2 text-white">JavaScript Rapid Fire Complete!</h2>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] w-full border border-white/10 mb-8 mt-4">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Final Performance</p>
                    <p className="text-5xl font-black text-[#FACE68]">{score}</p>
                    <div className="flex justify-center gap-4 mt-4 text-xs font-bold">
                        <span className="text-white/60">Revealed: {revealedCount}</span>
                        <span className="text-white/60">Mode: V8 Sprint</span>
                    </div>
                </div>

                {needsRelearn && (
                    <div className="mb-8 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-2xl animate-slide-up">
                        <div className="flex items-center gap-2 text-red-400 font-black justify-center mb-1">
                            <AlertTriangle size={18} /> RECOMMENDATION
                        </div>
                        <p className="text-sm text-red-200 font-bold">
                            You revealed answers {revealedCount} times. Revisit the roadmap lessons to sharpen your core JavaScript intuition!
                        </p>
                    </div>
                )}

                <Button onClick={onFinish} variant="secondary" size="lg" fullWidth className="bg-amber-400 text-black font-black">
                    Back to Arcade
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto w-full animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-[#FACE68] p-2 rounded-xl text-black animate-pulse">
                        <Flame size={20} />
                    </div>
                    <div>
                        <h2 className="text-white font-black uppercase tracking-widest text-sm">JS Rapid Fire</h2>
                        <p className="text-[10px] text-gray-500 font-bold">PHASE: {phase.toUpperCase()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[#FACE68] font-black text-2xl">{score}</p>
                    <p className="text-[10px] text-gray-500 font-bold">TOTAL SCORE</p>
                </div>
            </div>

            {phase === 'mcq' ? (
                <div className="animate-pop">
                    <div className="mb-6 flex gap-2">
                        {mcqs.map((_, i) => (
                            <div key={i} className={clsx("h-1.5 flex-1 rounded-full transition-all duration-500", i <= currentStep ? "bg-[#FACE68]" : "bg-white/10")} />
                        ))}
                    </div>
                    <Card className="!bg-[#1E293B] !border-[#334155] p-8 !rounded-[2.5rem] mb-6">
                        <h3 className="text-2xl font-black text-white leading-tight">{mcqs[currentStep].q}</h3>
                    </Card>
                    <div className="grid grid-cols-1 gap-3">
                        {mcqs[currentStep].opts.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleMCQ(i)}
                                className={clsx(
                                    "p-5 rounded-2xl border-2 font-bold transition-all text-left flex justify-between items-center group",
                                    selectedOption === i 
                                        ? (i === mcqs[currentStep].a ? "bg-green-500 border-green-400 text-white" : "bg-red-500 border-red-400 text-white")
                                        : "bg-[#334155] border-transparent text-gray-300 hover:border-white/20 hover:bg-[#3d4d63]"
                                )}
                            >
                                {opt}
                                <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-pop">
                    <div className="mb-6 flex gap-2">
                        {codeTasks.map((_, i) => (
                            <div key={i} className={clsx("h-1.5 flex-1 rounded-full transition-all duration-500", i <= currentStep ? "bg-[#FACE68]" : "bg-white/10")} />
                        ))}
                    </div>
                    <Card className="!bg-[#1E293B] !border-[#334155] p-8 !rounded-[2.5rem] mb-6">
                        <p className="text-xs font-black text-yellow-400 uppercase tracking-[0.2em] mb-2">JavaScript Task</p>
                        <h3 className="text-xl font-bold text-white leading-relaxed">{codeTasks[currentStep].q}</h3>
                    </Card>

                    <div className="relative group mb-6">
                        <textarea
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            className="w-full bg-[#0F172A] border-2 border-[#334155] p-6 rounded-3xl font-mono text-white focus:outline-none focus:border-amber-400 transition-all min-h-[150px]"
                            placeholder="Type JavaScript code here..."
                            spellCheck={false}
                        />
                        <button 
                            onClick={handleReveal}
                            className={clsx(
                                "absolute bottom-4 right-4 p-3 rounded-2xl transition-all flex items-center gap-2 text-xs font-black shadow-lg",
                                showSolution ? "bg-white text-black" : "bg-[#334155] text-gray-400 hover:text-white hover:bg-[#475569]"
                            )}
                        >
                            <Eye size={16} /> {showSolution ? "REVEALED" : "REVEAL ANSWER"}
                        </button>
                    </div>

                    {showSolution && (
                        <div className="mb-6 p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl animate-slide-up">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Reference Solution</p>
                            <code className="text-[#FACE68] font-mono">{codeTasks[currentStep].sol}</code>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {showSolution ? (
                            <Button fullWidth onClick={moveToNextCode} variant="outline" className="!text-white">Skip Task</Button>
                        ) : (
                            <Button fullWidth onClick={handleCodeSubmit} variant="primary" className="bg-amber-400 text-black font-black">Submit Code</Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- GAME: SYNTAX SPRINT ---
const SyntaxSprint: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [gameState, setGameState] = useState<'playing' | 'over'>('playing');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
        { q: "Log output in JS", opts: ["console.log()", "print()"], a: 0 },
        { q: "Immutable variable in JS", opts: ["const x = 5", "final int x = 5"], a: 0 },
        { q: "Check if array is array", opts: ["Array.isArray(x)", "x.isArray"], a: 0 },
        { q: "Object literal in JS", opts: ["{ key: 'val' }", "dict(key='val')"], a: 0 },
        { q: "Arrow function syntax", opts: ["(x) => x * 2", "lambda x: x * 2"], a: 0 },
        { q: "Strict equality operator", opts: ["===", "=="], a: 0 },
        { q: "Template string literal", opts: ["`Hi ${name}`", "'Hi ' % name"], a: 0 },
        { q: "Single line comment", opts: ["// Comment", "# Comment"], a: 0 },
        { q: "Nullish coalescing", opts: ["a ?? b", "a || b"], a: 0 },
        { q: "Await a promise", opts: ["await p", "sync p"], a: 0 },
    ];

    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { setGameState('over'); playSound('error'); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [gameState]);

    const handleAnswer = (idx: number) => {
        if (idx === questions[currentQuestion].a) {
            setScore(s => s + 20);
            setTimeLeft(t => Math.min(t + 2, 15));
            setCurrentQuestion(c => (c + 1) % questions.length);
            playSound('click');
        } else {
            setGameState('over');
            playSound('error');
        }
    };

    if (gameState === 'over') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-pop">
                <Trophy size={64} className="text-[#FACE68] mb-4" />
                <h2 className="text-3xl font-black mb-2 text-white">Time's Up!</h2>
                <p className="text-xl opacity-70 mb-8 text-white">Final Score: {score}</p>
                <Button onClick={onFinish} variant="secondary" className="bg-amber-400 text-black font-black">Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto w-full">
            <div className="flex justify-between mb-8 text-xl font-bold font-mono">
                <span className="text-[#FACE68]">Score: {score}</span>
                <span className={clsx(timeLeft < 5 ? "text-red-500 animate-pulse" : "text-white")}>Time: {timeLeft}s</span>
            </div>
            <div className="bg-[#1E293B] p-8 rounded-3xl border-4 border-amber-400 mb-8 shadow-[0_0_20px_rgba(245,158,11,0.3)] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                    <div className="h-full bg-[#FACE68] transition-all duration-1000" style={{ width: `${(timeLeft/15)*100}%` }}></div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-400 uppercase tracking-widest">Pick JS Syntax</h3>
                <h2 className="text-3xl font-black text-white">{questions[currentQuestion].q}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].opts.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(i)} className="bg-[#334155] hover:bg-[#475569] p-6 rounded-2xl text-xl font-mono font-bold border-b-4 border-[#0F172A] active:border-none active:translate-y-1 transition-all text-white">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- GAME: BUG HUNTER ---
const BugHunter: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [level, setLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [completed, setCompleted] = useState(false);

    const currentLevel = BUG_HUNTER_LEVELS[level];

    const handleLineClick = (idx: number) => {
        if (idx === currentLevel.errorLine) {
            playSound('success');
            if (level < BUG_HUNTER_LEVELS.length - 1) {
                setScore(s => s + (showHint ? 5 : 10));
                setLevel(l => l + 1);
                setShowHint(false);
            } else {
                setScore(s => s + 10);
                setCompleted(true);
                playSound('pop');
            }
        } else {
            playSound('error');
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-pop">
                <div className="bg-white/10 p-6 rounded-full mb-6">
                    <Bug size={64} className="text-[#FA6868]" />
                </div>
                <h2 className="text-3xl font-black mb-2 text-white">All JS Bugs Squashed!</h2>
                <p className="text-xl opacity-70 mb-8 text-white">Final Score: {score}</p>
                <Button onClick={onFinish} variant="secondary" className="bg-amber-400 text-black font-black">Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <span className="text-yellow-400 font-black uppercase tracking-widest bg-[#1E293B] px-4 py-2 rounded-xl">Level {level + 1} of {BUG_HUNTER_LEVELS.length}</span>
                <span className="text-[#FACE68] font-bold text-xl">Score: {score}</span>
            </div>

            <div className="bg-[#1E293B] rounded-3xl border-4 border-[#334155] overflow-hidden shadow-2xl relative">
                <div className="bg-[#0F172A] p-3 flex gap-2 items-center border-b border-[#334155]">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-yellow-400 font-mono ml-2">debug.js</span>
                    <span className="text-xs text-gray-500 ml-auto font-bold">Click the line with the bug!</span>
                </div>
                
                <div className="p-6 font-mono text-lg">
                    {currentLevel.code.map((line, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleLineClick(idx)}
                            className="group flex gap-4 p-2 hover:bg-white/5 cursor-pointer rounded transition-colors relative"
                        >
                            <span className="text-gray-600 select-none w-6 text-right">{idx + 1}</span>
                            <span className="text-gray-300 group-hover:text-white transition-colors">{line}</span>
                            <Bug className="absolute right-4 text-[#FA6868] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                {showHint ? (
                    <div className="bg-[#FA6868]/20 border border-[#FA6868] p-4 rounded-xl text-[#FA6868] animate-slide-up flex items-center gap-2 text-sm font-medium">
                        <AlertTriangle size={20} />
                        {currentLevel.hint}
                    </div>
                ) : (
                    <button onClick={() => setShowHint(true)} className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <BrainCircuit size={16} /> Need a hint? (-5 pts)
                    </button>
                )}
            </div>
        </div>
    );
};

// --- GAME: CODE SCRAMBLE ---
const CodeScramble: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [level, setLevel] = useState(0);
    const [lines, setLines] = useState<string[]>([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (level < SCRAMBLE_LEVELS.length) {
            setLines([...SCRAMBLE_LEVELS[level].display]);
        } else {
            setCompleted(true);
        }
    }, [level]);

    const moveLine = (index: number, direction: -1 | 1) => {
        const newLines = [...lines];
        if (index + direction < 0 || index + direction >= newLines.length) return;
        
        const temp = newLines[index];
        newLines[index] = newLines[index + direction];
        newLines[index + direction] = temp;
        
        setLines(newLines);
        playSound('click');
    };

    const checkOrder = () => {
        const correct = SCRAMBLE_LEVELS[level].correctOrder;
        const isCorrect = lines.every((line, i) => line === correct[i]);
        
        if (isCorrect) {
            playSound('success');
            setLevel(l => l + 1);
        } else {
            playSound('error');
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-pop">
                <ListOrdered size={64} className="text-[#FACE68] mb-4" />
                <h2 className="text-3xl font-black mb-2 text-white">JavaScript Structure Restored!</h2>
                <p className="text-xl opacity-70 mb-8 text-white">You fixed all program logic orders.</p>
                <Button onClick={onFinish} variant="secondary" className="bg-amber-400 text-black font-black">Back to Menu</Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-bold text-xl flex items-center gap-2"><ListOrdered className="text-[#FACE68]" /> JS Code Scramble</h2>
                <span className="text-[#FACE68] bg-[#1E293B] px-3 py-1 rounded-lg text-sm font-bold">Level {level + 1} of {SCRAMBLE_LEVELS.length}</span>
            </div>
            
            <p className="text-gray-400 mb-6 text-center text-sm">Rearrange lines using the arrows to create valid, working JavaScript.</p>

            <div className="space-y-3 mb-8">
                {lines.map((line, idx) => (
                    <div key={idx} className="bg-[#1E293B] p-4 rounded-xl border-2 border-[#334155] flex items-center justify-between font-mono text-white group hover:border-[#FACE68] transition-colors">
                        <span>{line}</span>
                        <div className="flex flex-col gap-1 opacity-50 group-hover:opacity-100">
                            <button onClick={() => moveLine(idx, -1)} disabled={idx === 0} className="hover:text-[#FACE68] disabled:opacity-30">▲</button>
                            <button onClick={() => moveLine(idx, 1)} disabled={idx === lines.length - 1} className="hover:text-[#FACE68] disabled:opacity-30">▼</button>
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={checkOrder} fullWidth variant="primary" className="bg-amber-400 text-black font-black">Check Order</Button>
        </div>
    );
};

// --- MAIN ARCADE VIEW ---
export const ArcadeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [game, setGame] = useState<'menu' | 'sprint' | 'bugs' | 'scramble' | 'rapid'>('menu');

    const renderMenu = () => (
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <button onClick={() => { setGame('rapid'); playSound('click'); }} className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#334155] hover:border-[#FACE68] hover:scale-105 transition-all text-left group relative overflow-hidden ring-4 ring-yellow-500/20">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FACE68]/10 rounded-full group-hover:bg-[#FACE68]/20 transition-colors"></div>
                <Flame size={40} className="text-[#FACE68] mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Rapid Fire</h3>
                <p className="text-gray-400 text-sm">Fast-paced JS Quiz & Code tasks without checking hints!</p>
            </button>

            <button onClick={() => { setGame('sprint'); playSound('click'); }} className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#334155] hover:border-[#FACE68] hover:scale-105 transition-all text-left group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FACE68]/10 rounded-full group-hover:bg-[#FACE68]/20 transition-colors"></div>
                <Zap size={40} className="text-[#FACE68] mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Syntax Sprint</h3>
                <p className="text-gray-400 text-sm">Race the timer to pick the correct ES2024 JavaScript syntax.</p>
            </button>

            <button onClick={() => { setGame('bugs'); playSound('click'); }} className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#334155] hover:border-[#FA6868] hover:scale-105 transition-all text-left group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FA6868]/10 rounded-full group-hover:bg-[#FA6868]/20 transition-colors"></div>
                <Bug size={40} className="text-[#FA6868] mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Bug Hunter</h3>
                <p className="text-gray-400 text-sm">Spot syntax and runtime bugs before they trigger an error!</p>
            </button>

            <button onClick={() => { setGame('scramble'); playSound('click'); }} className="bg-[#1E293B] p-8 rounded-3xl border-4 border-[#334155] hover:border-amber-400 hover:scale-105 transition-all text-left group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/10 rounded-full group-hover:bg-amber-400/20 transition-colors"></div>
                <ListOrdered size={40} className="text-[#FACE68] mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Code Scramble</h3>
                <p className="text-gray-400 text-sm">Rearrange shuffled JavaScript blocks to fix the execution logic.</p>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-[#0F172A] text-white">
            <div className="p-6 flex items-center justify-between">
                <button onClick={game === 'menu' ? onBack : () => setGame('menu')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="text-white" />
                </button>
                <h1 className="text-xl font-black text-[#FACE68] tracking-widest uppercase">
                    {game === 'menu' ? 'Max Arcade (JavaScript Edition)' : game === 'rapid' ? 'Rapid Fire' : game === 'sprint' ? 'Syntax Sprint' : game === 'bugs' ? 'Bug Hunter' : 'Code Scramble'}
                </h1>
                <div className="w-8">
                    <MaxAvatar mood={game === 'menu' ? 'happy' : 'excited'} />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
                {game === 'menu' && renderMenu()}
                {game === 'rapid' && <RapidFire onFinish={() => setGame('menu')} />}
                {game === 'sprint' && <SyntaxSprint onFinish={() => setGame('menu')} />}
                {game === 'bugs' && <BugHunter onFinish={() => setGame('menu')} />}
                {game === 'scramble' && <CodeScramble onFinish={() => setGame('menu')} />}
            </div>
        </div>
    );
};