import React, { useState } from 'react';
import { X, RotateCcw, MonitorPlay, CheckCircle, ChevronRight, BrainCircuit, Volume2, Terminal, Play, FileText, Target, Wand2, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Lesson, UserState, Theme, Translation, Language } from '../../types';
import { THEMES } from '../../constants';
import { playSound, speakText } from '../../utils/audio';
import { Button, Card, Console, Modal, MaxAvatar, QuizView, ChapterTestView } from '../UIComponents';
import { AIChat } from '../AIChat';
import { runJavaScript } from '../../utils/jsRunner';

interface LessonViewProps {
    lesson: Lesson;
    user: UserState;
    theme: Theme;
    t: Translation;
    activeLanguage: Language;
    onExit: () => void;
    onComplete: (score?: number, showModal?: boolean) => void;
    onNextLesson: () => void;
    onUpdateUser: (updates: Partial<UserState>) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ 
    lesson, user, theme, t, activeLanguage, onExit, onComplete, onNextLesson, onUpdateUser 
}) => {
    const [code, setCode] = useState(lesson.content.initialCode || '');
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [lessonFeedback, setLessonFeedback] = useState<'none' | 'success' | 'error'>('none');
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');
    const [showMobileConsole, setShowMobileConsole] = useState(false);
    const [lessonContentLang, setLessonContentLang] = useState<'en' | 'hi' | 'hinglish'>('en');
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showAssistMsg, setShowAssistMsg] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const themeStyles = THEMES[theme];

    // Handlers
    const handleRunCode = async () => {
        playSound('click');
        setIsRunning(true);
        try {
            const result = await runJavaScript(code);
            setConsoleOutput(result.output && result.output.length > 0 ? result.output : ['[Program finished with no console output]']);
        } catch (e: any) {
            setConsoleOutput([`Error: ${e?.message || e}`]);
        } finally {
            setIsRunning(false);
            if (window.innerWidth < 768) setShowMobileConsole(true);
        }
    };

    const handleCheckCode = async () => {
        playSound('click');
        setIsRunning(true);
        try {
            const result = await runJavaScript(code, {
                expectedOutput: lesson.content.expectedOutput
            });

            setConsoleOutput(result.output && result.output.length > 0 ? result.output : ['[Execution complete]']);

            if (result.passed) {
                setLessonFeedback('success');
                setFeedbackMessage(t.successMsg);
                playSound('success');
                onComplete(25, false); // Record completion in state
            } else {
                setLessonFeedback('error');
                setFeedbackMessage(result.feedback || result.error || t.errorMsg);
                playSound('error');
                if (window.innerWidth < 768) setShowMobileConsole(true);
            }
        } catch (e: any) {
            setLessonFeedback('error');
            setFeedbackMessage(`Error: ${e?.message || e}`);
            setConsoleOutput([`Error: ${e?.message || e}`]);
            playSound('error');
        } finally {
            setIsRunning(false);
        }
    };

    const handleLessonCompletion = () => {
        onComplete(25, true);
        setShowCompletionModal(true);
    };

    const toggleAssist = () => {
        playSound('pop');
        setShowAssistMsg(!showAssistMsg);
    };

    if (lesson.type === 'quiz') {
        return <QuizView questions={lesson.content.questions || []} onComplete={() => onComplete(50, true)} theme={theme} />;
    }

    if (lesson.type === 'test') {
        return (
            <div className="h-[100dvh] flex flex-col animate-pop" style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}>
                <div className="p-4 flex items-center justify-between border-b border-black/5 bg-opacity-90 backdrop-blur z-10" style={{backgroundColor:themeStyles.bg}}>
                    <button onClick={onExit} className="p-2 hover:bg-black/5 rounded-full"><X className="opacity-60" /></button>
                    <div className="font-bold text-[var(--color-primary)] uppercase tracking-wider text-sm">{lesson.title}</div>
                    <div className="w-8"></div>
                </div>
                
                <ChapterTestView 
                    items={lesson.content.testItems || []} 
                    passThreshold={lesson.content.passThreshold || 0.8}
                    onComplete={(passed) => { 
                        if (passed) {
                            onComplete(50, true);
                        } 
                    }}
                    onRetry={() => {}}
                    theme={theme}
                />
            </div>
        );
    }

    const content = lesson.content;
    const getLocalizedText = (en?: string, hi?: string, hinglish?: string) => {
        if (lessonContentLang === 'hi' && hi) return hi;
        if (lessonContentLang === 'hinglish' && hinglish) return hinglish;
        return en || "";
    };

    const intro = getLocalizedText(content.intro, content.intro_hi, content.intro_hinglish);
    const instructions = getLocalizedText(content.instructions, content.instructions_hi, content.instructions_hinglish);

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden relative animate-pop" style={{ backgroundColor: themeStyles.bg }}>
            {/* Mobile Header */}
            <div className="md:hidden p-4 flex items-center justify-between border-b border-gray-200 shadow-sm" style={{ backgroundColor: themeStyles.card }}>
                <button onClick={onExit}><X className="text-gray-400" /></button>
                <div className="font-black text-[var(--color-primary)] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                    Level {lesson.order}
                </div>
                <div className="w-8"></div>
            </div>

            {/* Left Panel: Instructions */}
            <div className="w-full md:w-1/3 lg:w-1/4 p-6 md:p-8 overflow-y-auto border-r border-black/5 flex flex-col gap-6 custom-scrollbar" style={{ backgroundColor: themeStyles.card, color: themeStyles.text }}>
                <div className="hidden md:flex items-center justify-between mb-2">
                    <button onClick={onExit} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"><X className="text-gray-400" /></button>
                    <div className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Level {lesson.order}
                    </div>
                </div>
                
                <div className="relative flex flex-col gap-5">
                    {/* Language Switcher */}
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-max border border-gray-200 shadow-inner">
                        <button onClick={() => setLessonContentLang('en')} className={clsx("px-3 py-1 text-[11px] font-black rounded-xl transition-all", lessonContentLang === 'en' ? "bg-white shadow text-amber-600" : "text-gray-400")}>EN</button>
                        <button onClick={() => setLessonContentLang('hi')} className={clsx("px-3 py-1 text-[11px] font-black rounded-xl transition-all", lessonContentLang === 'hi' ? "bg-white shadow text-amber-600" : "text-gray-400")}>हिन्दी</button>
                        <button onClick={() => setLessonContentLang('hinglish')} className={clsx("px-3 py-1 text-[11px] font-black rounded-xl transition-all", lessonContentLang === 'hinglish' ? "bg-white shadow text-amber-600" : "text-gray-400")}>Hinglish</button>
                    </div>

                    <div>
                        <div className="text-xs font-black uppercase tracking-wider text-amber-600 mb-1">{lesson.chapter}</div>
                        <h1 className="text-2xl font-black text-gray-900 leading-tight">{lesson.title}</h1>
                        <p className="opacity-70 leading-relaxed font-bold text-sm mt-1">{lesson.description}</p>
                    </div>
                    
                    {/* SECTION 1: CONCEPT */}
                    <div className="bg-amber-50/60 p-6 rounded-[2rem] border-2 border-amber-200/80 shadow-sm relative overflow-hidden group transition-all hover:bg-white hover:shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BrainCircuit size={80}/></div>
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <h3 className="font-black text-amber-800 flex items-center gap-2 uppercase tracking-widest text-xs">
                                <span className="text-lg">💡</span> Concept Explainer
                            </h3>
                            <button onClick={() => speakText(intro, lessonContentLang === 'hi' ? 'hi' : 'en')} className="text-gray-400 hover:text-amber-600 transition-colors">
                                <Volume2 size={18} />
                            </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm relative z-10 font-medium">
                            {intro}
                        </p>
                    </div>

                    {/* SECTION 2: MISSION / TASK */}
                    <Card theme={theme} className="!p-6 border-l-8 !border-l-amber-500 relative group hover:bg-[#FFFDF5] !rounded-[2rem]">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-black flex items-center gap-2 text-amber-700 uppercase tracking-widest text-xs">
                                <Target size={18} /> Mission Objective
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={toggleAssist} className={clsx("p-2 rounded-xl transition-all", showAssistMsg ? "bg-amber-400 text-white animate-pulse shadow-lg" : "bg-gray-100 text-gray-400 hover:text-amber-600")} title="Magic Assist">
                                    <Wand2 size={18} />
                                </button>
                                <button onClick={() => speakText(instructions, lessonContentLang === 'hi' ? 'hi' : 'en')} className="p-2 bg-gray-100 rounded-xl text-gray-400 hover:text-amber-600 transition-all">
                                    <Volume2 size={18} />
                                </button>
                            </div>
                        </div>
                        <p className="opacity-95 font-bold leading-relaxed text-gray-800">
                            {instructions}
                        </p>
                        
                        {content.expectedOutput && content.expectedOutput !== '...' && (
                            <div className="mt-3 p-3 bg-gray-900 rounded-xl font-mono text-xs text-yellow-300">
                                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider mb-1">Target Console Output:</span>
                                {content.expectedOutput}
                            </div>
                        )}

                        {showAssistMsg && (
                            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 animate-slide-up text-sm font-bold text-amber-900 flex items-start gap-3 shadow-inner">
                                <div className="mt-1"><Sparkles size={16} /></div>
                                <div>
                                    <p className="mb-2">Max Assist: Solution Preview</p>
                                    <code className="text-xs font-mono block bg-white p-2 rounded border border-amber-200 text-gray-800 whitespace-pre">
                                        {content.solutionCode}
                                    </code>
                                </div>
                            </div>
                        )}
                    </Card>
                    
                    {/* SECTION 3: QUICK SUMMARY */}
                    {content.summary && content.summary.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 relative group transition-all hover:bg-white">
                            <h3 className="font-black text-gray-400 flex items-center gap-2 mb-4 uppercase tracking-widest text-xs">
                                <FileText size={18} /> Key Takeaways
                            </h3>
                            <ul className="space-y-2 text-sm font-bold text-gray-600">
                                {content.summary.map((point, i) => (
                                    <li key={i} className="flex gap-2 items-start">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                                        <span className="leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Editor */}
            <div className="flex-1 flex flex-col relative border-r border-black/5 bg-[#1E1E1E]">
                <div className="bg-[#1E1E1E] p-3 flex items-center justify-between text-gray-400 text-xs border-b border-[#333]">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5 ml-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                        </div>
                        <span className="ml-4 font-mono text-yellow-400 font-bold tracking-widest text-[11px] flex items-center gap-1.5">
                            <Terminal size={14} /> lesson.js (JavaScript ES2024)
                        </span>
                    </div>
                    <div className="mr-2 text-gray-400 text-xs flex items-center gap-2">
                        <button onClick={() => setCode(content.initialCode || '')} className="hover:text-white transition-colors flex items-center gap-1">
                            <RotateCcw size={12} /> {t.reset}
                        </button>
                    </div>
                </div>

                <textarea
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setLessonFeedback('none');
                    }}
                    className="flex-1 w-full bg-[#18181B] text-[#E4E4E7] p-8 font-mono text-base resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-amber-500/30"
                    spellCheck={false}
                    autoFocus
                    placeholder="// Write your JavaScript code here..."
                />
                
                {/* Desktop Action Bar */}
                <div className="hidden md:flex p-5 bg-[#1E1E1E] border-t border-[#333] items-center justify-between gap-4 shadow-[0_-15px_30px_rgba(0,0,0,0.4)] z-10">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>Tip: Run code anytime to inspect console outputs before checking.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="secondary" 
                            onClick={handleRunCode} 
                            disabled={isRunning}
                            className="!px-6 !py-3 bg-gray-700 hover:bg-gray-600 text-white border-gray-900"
                        >
                            <MonitorPlay size={20} /> {t.run}
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleCheckCode} 
                            disabled={isRunning}
                            className="!px-8 !py-3 shadow-xl bg-amber-500 hover:bg-amber-400 text-black font-black border-amber-700"
                        >
                            <CheckCircle size={20} /> {t.check}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right: Console (Desktop) */}
            <div className="hidden md:flex w-1/4 flex-col bg-[#1E1E1E] border-l border-[#333] p-4">
                <Console output={consoleOutput} theme={theme} />
            </div>

            {/* Mobile Console Drawer */}
            {showMobileConsole && (
                <div className="fixed inset-x-0 bottom-0 z-30 bg-[#121826] border-t-4 border-amber-500 flex flex-col h-1/2 md:hidden shadow-2xl rounded-t-[3rem] pb-safe animate-slide-up">
                    <div className="flex justify-between items-center p-4 bg-[#1A2234] border-b border-slate-700/80 rounded-t-[3rem]">
                        <span className="text-xs font-black text-amber-400 pl-4 tracking-widest uppercase">Console Output</span>
                        <button onClick={() => setShowMobileConsole(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <Console output={consoleOutput} theme={theme} />
                    </div>
                </div>
            )}

            {/* Mobile Actions */}
            <div className="bg-white p-4 border-t-2 border-gray-100 flex justify-between items-center z-10 md:hidden pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setCode(content.initialCode || '')} className="!p-3"><RotateCcw size={22} /></Button>
                    <Button variant="outline" size="sm" onClick={() => setShowMobileConsole(!showMobileConsole)} className={clsx("!p-3 transition-all", showMobileConsole ? "bg-amber-50 border-amber-300" : "")}><Terminal size={22} /></Button>
                </div>
                <div className="flex gap-2 w-full ml-4">
                    <Button variant="secondary" className="flex-1 shadow-md bg-gray-200 text-gray-800" onClick={handleRunCode}><Play size={18} /></Button>
                    <Button variant="primary" className="flex-[2] shadow-xl bg-amber-500 text-black font-black" onClick={handleCheckCode}>{t.check}</Button>
                </div>
            </div>

            {/* AI Chat */}
            <AIChat 
                currentCode={code} 
                lessonContext={`JavaScript Lesson: ${lesson.title}. Concept: ${intro}. Task: ${instructions}. Solution: ${content.solutionCode}`} 
                appLanguage={user.settings.appLanguage}
                apiKey={user.apiKey}
                isDevMode={user.adminUnlocked}
                onUnlockDevMode={() => onUpdateUser({ adminUnlocked: true })}
                onSetApiKey={(k) => onUpdateUser({ apiKey: k })}
                onTranslateReq={() => setLessonContentLang('hi')}
            />

            {/* Feedback Toast */}
            <div className={clsx(
                "fixed bottom-24 md:bottom-28 left-6 right-6 md:left-auto md:right-12 md:w-[420px] p-2 transition-all duration-500 z-50",
                lessonFeedback === 'none' ? "translate-y-[150%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
            )}>
                <div className={clsx(
                    "rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-between border-4 backdrop-blur-xl animate-pop",
                    lessonFeedback === 'success' ? "bg-white/95 border-emerald-500 text-emerald-950" : "bg-white/95 border-rose-500 text-rose-950"
                )}>
                    <div className="flex items-center gap-4">
                        <div className={clsx("w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-lg transform rotate-3 shrink-0", 
                             lessonFeedback === 'success' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white")}>
                            {lessonFeedback === 'success' ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                        </div>
                        <div>
                            <h3 className="font-black text-xl leading-none mb-1">
                                {lessonFeedback === 'success' ? "Level Mastered!" : "Output Mismatch"}
                            </h3>
                            <p className="text-xs font-bold opacity-75 line-clamp-2">
                                {feedbackMessage}
                            </p>
                        </div>
                    </div>
                    {lessonFeedback === 'success' && (
                        <Button onClick={handleLessonCompletion} variant="success" size="sm" className="ml-4 shadow-xl !rounded-2xl shrink-0 !bg-emerald-600">
                            Continue <ChevronRight size={18} />
                        </Button>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            <Modal isOpen={showCompletionModal} onClose={onExit} title={t.completedTitle} type="success">
                <div className="flex flex-col items-center text-center gap-6 relative w-full p-2">
                    <div className="scale-150 animate-bounce-slow mb-4 mt-2">
                        <MaxAvatar mood="excited" />
                    </div>
                    
                    <div className="mb-2">
                        <div className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-2">+25 XP Earned!</div>
                        <h3 className="text-3xl font-black text-gray-800 leading-tight">Concept Conquered!</h3>
                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">{lesson.title}</p>
                    </div>

                    {/* SOLUTION BLOCK */}
                    {content.solutionCode && (
                        <div className="w-full text-left bg-gray-900 rounded-[2rem] p-6 border-4 border-white shadow-2xl mb-2 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Terminal size={64}/></div>
                            <div className="text-[10px] text-yellow-400 uppercase font-black tracking-widest mb-3 border-b border-gray-800 pb-2">Verified JavaScript Solution</div>
                            <code className="font-mono text-green-400 text-sm block whitespace-pre leading-relaxed">{content.solutionCode}</code>
                        </div>
                    )}

                    {/* EXPLANATION */}
                    {content.codeExplanation && (
                        <div className="w-full text-left bg-amber-50/70 rounded-[2rem] p-5 border-2 border-amber-200 shadow-inner">
                            <div className="text-[10px] text-amber-700 uppercase font-black tracking-widest mb-2 flex items-center gap-1"><BrainCircuit size={14}/> Max Insight</div>
                            <p className="text-sm text-gray-800 leading-relaxed font-bold">{content.codeExplanation}</p>
                        </div>
                    )}

                    <div className="w-full mt-4">
                        <Button fullWidth onClick={onNextLesson} variant="primary" size="lg" className="!py-5 shadow-2xl !rounded-[2rem] !bg-amber-500 hover:!bg-amber-400 text-black font-black border-amber-600">
                            Next Challenge <ChevronRight size={22} />
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
