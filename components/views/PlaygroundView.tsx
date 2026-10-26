import React, { useState } from 'react';
import { ArrowLeft, Terminal, RotateCcw, Play, MonitorPlay, X, Copy, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { UserState, Theme, Translation, Language } from '../../types';
import { THEMES } from '../../constants';
import { Button, Console } from '../UIComponents';
import { AIChat } from '../AIChat';
import { playSound } from '../../utils/audio';
import { runJavaScript } from '../../utils/jsRunner';

interface PlaygroundViewProps {
    user: UserState;
    theme: Theme;
    t: Translation;
    activeLanguage: Language;
    setActiveLanguage?: (lang: Language) => void;
    onExit: () => void;
    onUpdateUser: (updates: Partial<UserState>) => void;
}

const JS_TEMPLATES = [
  {
    name: "Async / Await & Concurrency",
    code: `// Modern Asynchronous JavaScript Demo
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchUserData(id) {
  console.log(\`Fetching user \${id}...\`);
  await delay(150);
  return { id, username: \`dev_\${id}\`, role: 'Architect' };
}

async function run() {
  console.log('Initiating parallel requests with Promise.all:');
  const [user1, user2] = await Promise.all([
    fetchUserData(101),
    fetchUserData(102)
  ]);
  
  console.log('Results received:', user1, user2);
}

run();`
  },
  {
    name: "Array Pipeline (Map, Filter, Reduce)",
    code: `// Functional Array Transformation Pipeline
const products = [
  { name: 'Mechanical Keyboard', price: 120, inStock: true },
  { name: '4K Monitor', price: 400, inStock: false },
  { name: 'Wireless Mouse', price: 60, inStock: true },
  { name: 'USB-C Dock', price: 90, inStock: true },
];

// 1. Filter in-stock items
const available = products.filter(p => p.inStock);

// 2. Map discounted prices (10% off)
const discounted = available.map(p => ({
  ...p,
  discountPrice: p.price * 0.9
}));

// 3. Reduce to total cart cost
const totalCost = discounted.reduce((sum, item) => sum + item.discountPrice, 0);

console.log('Discounted items:', discounted);
console.log('Total Cart Value: $' + totalCost);`
  },
  {
    name: "Closure & Private State",
    code: `// JavaScript Closure Pattern
function createBankVault(initialDeposit) {
  let balance = initialDeposit; // Private variable enclosed
  
  return {
    deposit(amount) {
      if (amount <= 0) return 'Invalid amount';
      balance += amount;
      return \`Deposited \$\${amount}. Current balance: \$\${balance}\`;
    },
    withdraw(amount) {
      if (amount > balance) return 'Insufficient funds';
      balance -= amount;
      return \`Withdrew \$\${amount}. Remaining: \$\${balance}\`;
    },
    getBalance() {
      return balance;
    }
  };
}

const vault = createBankVault(500);
console.log(vault.deposit(200));
console.log(vault.withdraw(150));
console.log('Vault Balance verified:', vault.getBalance());`
  },
  {
    name: "Debounce Function Pattern",
    code: `// Debouncing: Limits rapid-fire function execution
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handleSearch = (query) => {
  console.log(\`Searching API for: "\${query}"\`);
};

const debouncedSearch = debounce(handleSearch, 300);

console.log('Typing simulation:');
debouncedSearch('j');
debouncedSearch('jav');
debouncedSearch('javascript');
console.log('Only the last debounced call will execute after 300ms!');`
  }
];

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({ 
    user, theme, t, onExit, onUpdateUser 
}) => {
    const [code, setCode] = useState(JS_TEMPLATES[0].code);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [showMobileConsole, setShowMobileConsole] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const themeStyles = THEMES[theme];

    const handleRunCode = async () => {
        playSound('click');
        setIsRunning(true);
        try {
            const result = await runJavaScript(code);
            setConsoleOutput(result.output && result.output.length > 0 ? result.output : ['[Program finished with no output]']);
        } catch (e: any) {
            setConsoleOutput([`Error: ${e?.message || e}`]);
        } finally {
            setIsRunning(false);
            if (window.innerWidth < 768) setShowMobileConsole(true);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        playSound('pop');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLoadTemplate = (tplCode: string) => {
        setCode(tplCode);
        setConsoleOutput([]);
        playSound('pop');
    };

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden relative" style={{ backgroundColor: themeStyles.bg }}>
             <div className="md:hidden p-4 flex items-center justify-between border-b border-gray-200 shadow-sm" style={{ backgroundColor: themeStyles.card }}>
                <button onClick={onExit}><ArrowLeft className="text-gray-400" /></button>
                <div className="font-bold text-amber-600 flex items-center gap-2">
                    <Terminal size={18} /> JS Playground
                </div>
                <div className="w-8"></div>
            </div>

            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4 p-6 md:p-8 overflow-y-auto border-r border-black/5 flex flex-col gap-6 custom-scrollbar" style={{ backgroundColor: themeStyles.card, color: themeStyles.text }}>
                 <div className="hidden md:flex items-center justify-between mb-2">
                     <button onClick={onExit} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"><ArrowLeft className="text-gray-400" /></button>
                     <div className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                         Live JavaScript V8
                     </div>
                 </div>
                 
                 <div>
                     <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                         <span className="text-amber-500 font-mono font-black">JS</span> {t.playground}
                     </h1>
                     <p className="opacity-75 leading-relaxed font-medium text-sm mt-1">
                         A real-time JavaScript sandbox. Write async functions, test closures, array methods, or experiment freely.
                     </p>
                 </div>

                 {/* Snippet Templates */}
                 <div className="bg-amber-50/60 p-4 rounded-2xl border-2 border-amber-200/70">
                     <h4 className="font-black mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-800">
                         <Layers size={14}/> Code Presets
                     </h4>
                     <div className="space-y-2">
                         {JS_TEMPLATES.map((tpl, i) => (
                             <button
                                 key={i}
                                 onClick={() => handleLoadTemplate(tpl.code)}
                                 className="w-full text-left p-3 rounded-xl bg-white border border-amber-100 hover:border-amber-400 hover:shadow-sm transition-all text-xs font-bold text-gray-800 flex items-center justify-between group"
                             >
                                 <span>{tpl.name}</span>
                                 <Sparkles size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </button>
                         ))}
                     </div>
                 </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col relative border-r border-black/5 bg-[#1E1E1E]">
                 <div className="bg-[#1E1E1E] p-3 flex items-center justify-between text-gray-400 text-xs border-b border-[#333]">
                     <div className="flex items-center gap-2 ml-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                          <span className="font-mono text-yellow-300 font-bold text-xs tracking-wider">playground.js (ESNext / Async)</span>
                     </div>
                     <div className="flex items-center gap-3">
                         <button onClick={handleCopy} className="hover:text-white transition-colors flex items-center gap-1 text-xs">
                             {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                             {copied ? 'Copied' : 'Copy'}
                         </button>
                         <button onClick={() => { setCode(''); setConsoleOutput([]); }} className="hover:text-white transition-colors flex items-center gap-1 text-xs">
                             <RotateCcw size={14} /> Clear
                         </button>
                     </div>
                 </div>

                 <textarea
                     value={code}
                     onChange={(e) => setCode(e.target.value)}
                     className="flex-1 w-full bg-[#18181B] text-[#E4E4E7] p-8 font-mono text-base resize-none focus:outline-none leading-relaxed custom-scrollbar selection:bg-amber-500/30"
                     spellCheck={false}
                     placeholder="// Write any JavaScript here..."
                 />

                 <div className="hidden md:flex p-4 bg-[#1E1E1E] border-t border-[#333] items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-10">
                     <div className="text-xs text-gray-500 font-mono">
                         Console output updates in real time on run.
                     </div>
                     <Button 
                         variant="primary" 
                         onClick={handleRunCode}
                         disabled={isRunning}
                         className="!px-8 !py-3 bg-amber-500 hover:bg-amber-400 text-black font-black border-amber-700 shadow-xl"
                     >
                         <MonitorPlay size={20} /> Run JavaScript
                     </Button>
                 </div>
            </div>

            {/* Console (Desktop) */}
            <div className="hidden md:flex w-1/4 flex-col bg-[#1E1E1E] border-l border-[#333]">
               <div className="flex-1 p-4 overflow-hidden">
                   <Console output={consoleOutput} theme={user.settings.theme} />
               </div>
            </div>

            {/* Mobile Console Drawer */}
            {showMobileConsole && (
                <div className="fixed inset-x-0 bottom-0 z-30 bg-[#121826] border-t-4 border-amber-500 flex flex-col h-1/2 md:hidden shadow-2xl rounded-t-3xl pb-safe animate-slide-up">
                    <div className="flex justify-between items-center p-3 bg-[#1A2234] border-b border-slate-700/80 rounded-t-3xl">
                        <span className="text-xs font-bold text-amber-400 pl-4 tracking-widest uppercase">Console Output</span>
                        <button onClick={() => setShowMobileConsole(false)} className="p-2 text-slate-400 hover:text-white"><X size={20}/></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <Console output={consoleOutput} theme={user.settings.theme} />
                    </div>
                </div>
            )}

            {/* Mobile Actions */}
            <div className="bg-white p-3 border-t border-gray-200 flex justify-between items-center z-10 md:hidden pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setCode(''); setConsoleOutput([]); }}><RotateCcw size={18} /></Button>
                    <Button variant="outline" size="sm" onClick={() => setShowMobileConsole(!showMobileConsole)} className={showMobileConsole ? "bg-amber-50 border-amber-300" : ""}><Terminal size={18} /></Button>
                </div>
                <div className="flex gap-2 w-full ml-4">
                     <Button variant="primary" fullWidth onClick={handleRunCode} className="bg-amber-500 text-black font-black"><Play size={18} /> Run JS</Button>
                </div>
            </div>
             
            {/* AI Chat */}
            <AIChat 
                currentCode={code} 
                lessonContext={`JavaScript Playground Sandbox Mode.`} 
                appLanguage={user.settings.appLanguage}
                apiKey={user.apiKey}
                isDevMode={user.adminUnlocked}
                onUnlockDevMode={() => onUpdateUser({ adminUnlocked: true })}
                onSetApiKey={(k) => onUpdateUser({ apiKey: k })}
            />
         </div>
    );
};