import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Languages, Lock, Key, Shield, UserCheck, HelpCircle, Code2, AlertTriangle, MessageCircle } from 'lucide-react';
import { getGeminiHelp } from '../services/geminiService';
import { ChatMessage, AppLanguage } from '../types';
import { Button } from './UIComponents';
import { clsx } from 'clsx';
import { playSound } from '../utils/audio';

const SYSTEM_API_KEY = "AIzaSyACytzzLB8dfuowpIdhhcyPd0jS0RXKwmo";

interface AIChatProps {
  currentCode: string;
  lessonContext: string;
  appLanguage: AppLanguage;
  apiKey: string | null;
  isDevMode: boolean;
  onTranslateReq?: () => void;
  onUnlockDevMode: () => void;
  onSetApiKey: (key: string) => void;
}

export const AIChat: React.FC<AIChatProps> = ({ 
    currentCode, 
    lessonContext, 
    appLanguage, 
    apiKey, 
    isDevMode,
    onTranslateReq, 
    onUnlockDevMode, 
    onSetApiKey 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTesterWarning, setShowTesterWarning] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authType, setAuthType] = useState<'developer' | 'tester' | 'apikey'>('developer');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'m your Code Companion. Need me to write a solution or discuss a doubt? 🚀' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOpenRequest = () => {
      playSound('click');
      if (apiKey) {
          setIsOpen(true);
      } else {
          setShowAuthModal(true);
      }
  };

  const handleAuthSubmit = () => {
      if (authType === 'developer') {
          if (authInput === 'hc1') {
              onUnlockDevMode(); 
              onSetApiKey(SYSTEM_API_KEY);
              setIsOpen(true);
              setShowAuthModal(false);
              playSound('success');
          } else {
              playSound('error');
              alert("Incorrect Developer Password");
          }
      } else if (authType === 'tester') {
          if (authInput === 'horizoncorp32') {
              onSetApiKey(SYSTEM_API_KEY); 
              setShowAuthModal(false);
              setShowTesterWarning(true);
              playSound('success');
          } else {
              playSound('error');
              alert("Incorrect Tester Password");
          }
      } else {
          if (authInput.trim().length > 10) {
              onSetApiKey(authInput.trim());
              setIsOpen(true);
              setShowAuthModal(false);
              playSound('success');
          } else {
              playSound('error');
              alert("Invalid API Key format");
          }
      }
      setAuthInput('');
  };

  const confirmTesterAccess = () => {
      setShowTesterWarning(false);
      setIsOpen(true);
      playSound('click');
  };

  const handleSend = async (overrideText?: string | any) => {
    const textToSend = (typeof overrideText === 'string' ? overrideText : input) || input;
    
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    playSound('click');

    const responseText = await getGeminiHelp(currentCode, userMsg.text, lessonContext, appLanguage, apiKey);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
    playSound('pop');
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={handleOpenRequest}
          className="fixed bottom-24 right-6 z-40 bg-white p-3 rounded-full shadow-xl border-4 border-[#5A9CB5] hover:scale-110 transition-all group"
        >
          <Bot size={32} className="text-[#5A9CB5] group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 bg-[#FA6868] text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
            AI
          </div>
        </button>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden animate-pop">
                  <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24}/></button>
                  
                  <div className="text-center mb-6">
                      <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#5A9CB5] shadow-inner">
                          <Lock size={36} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-800">Unlock Max</h2>
                      <p className="text-sm text-gray-500 mt-2">Choose your access method.</p>
                  </div>

                  <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
                      <button 
                        className={clsx("flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1", authType === 'developer' ? "bg-white shadow text-[#5A9CB5]" : "text-gray-500")}
                        onClick={() => setAuthType('developer')}
                      >
                          <Shield size={14} /> Dev
                      </button>
                      <button 
                        className={clsx("flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1", authType === 'tester' ? "bg-white shadow text-[#5A9CB5]" : "text-gray-500")}
                        onClick={() => setAuthType('tester')}
                      >
                          <UserCheck size={14} /> Tester
                      </button>
                      <button 
                        className={clsx("flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1", authType === 'apikey' ? "bg-white shadow text-[#5A9CB5]" : "text-gray-500")}
                        onClick={() => setAuthType('apikey')}
                      >
                          <Key size={14} /> Key
                      </button>
                  </div>

                  <input 
                      type={authType === 'apikey' ? "text" : "password"}
                      placeholder={authType === 'developer' ? "Dev Password..." : authType === 'tester' ? "Tester Password..." : "API Key..."}
                      className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-4 focus:border-[#5A9CB5] focus:outline-none transition-all font-bold"
                      value={authInput}
                      onChange={(e) => setAuthInput(e.target.value)}
                  />

                  <Button fullWidth onClick={handleAuthSubmit} size="lg">Unlock Helper</Button>
              </div>
          </div>
      )}

      {/* Tester Warning Modal */}
      {showTesterWarning && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
              <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative overflow-hidden animate-pop border-4 border-yellow-400">
                  <div className="text-center mb-6">
                      <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 animate-pulse">
                          <AlertTriangle size={40} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-800">Caution!</h2>
                      <p className="text-sm text-gray-700 mt-4 font-bold leading-relaxed bg-yellow-50 p-4 rounded-2xl border border-yellow-200 shadow-inner">
                          API. Please use it carefully; do not overuse it like that. Use it when you have to test something.
                      </p>
                  </div>
                  <Button fullWidth onClick={confirmTesterAccess} variant="primary" size="lg">
                      I Understand
                  </Button>
              </div>
          </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white w-full sm:w-[480px] h-[90vh] sm:h-[680px] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up border-4 border-white ring-8 ring-black/5">
            
            {/* Header */}
            <div className="bg-[#5A9CB5] p-6 flex justify-between items-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
                   <Bot className="animate-pulse" />
                </div>
                <div>
                    <span className="font-black text-xl block leading-tight">Max Helper</span>
                    <span className="text-[10px] opacity-80 uppercase font-black tracking-widest">Code & Discussion</span>
                </div>
              </div>
              <div className="flex gap-2 relative z-10">
                 {onTranslateReq && (
                   <button onClick={onTranslateReq} className="hover:bg-white/20 p-2 rounded-xl transition-colors" title="Translate">
                      <Languages size={20} />
                   </button>
                 )}
                 <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                    <X size={22} />
                 </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8FAFC] custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={clsx(
                    "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap font-medium border-2 animate-pop",
                    msg.role === 'user' 
                      ? "bg-[#FACE68] border-yellow-300 text-gray-800 rounded-tr-none" 
                      : "bg-white border-gray-100 text-gray-700 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-gray-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-3 shadow-sm">
                     <Sparkles size={18} className="text-[#FACE68] animate-spin" />
                     <span className="text-xs text-gray-400 font-black animate-pulse uppercase tracking-wider">Writing Solution...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Actions */}
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
              
              {/* Quick Actions Scroll */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                <button 
                    onClick={() => handleSend("Write the full, correct code solution for this task.")}
                    className="flex items-center gap-2 text-xs bg-emerald-50 border-2 border-emerald-100 px-4 py-2 rounded-2xl whitespace-nowrap hover:bg-emerald-100 text-emerald-700 font-black transition-all hover:scale-105 active:scale-95"
                >
                    <Code2 size={16} /> Write Code
                </button>
                <button 
                    onClick={() => handleSend("I have a doubt. Let's discuss the core concept behind this.")}
                    className="flex items-center gap-2 text-xs bg-indigo-50 border-2 border-indigo-100 px-4 py-2 rounded-2xl whitespace-nowrap hover:bg-indigo-100 text-indigo-700 font-black transition-all hover:scale-105 active:scale-95"
                >
                    <MessageCircle size={16} /> Discuss Doubt
                </button>
                <button 
                    onClick={() => handleSend("Give me a hint for this problem without showing the code.")}
                    className="flex items-center gap-2 text-xs bg-orange-50 border-2 border-orange-100 px-4 py-2 rounded-2xl whitespace-nowrap hover:bg-orange-100 text-orange-700 font-black transition-all hover:scale-105 active:scale-95"
                >
                    Need Hint
                </button>
              </div>

              {/* Text Input */}
              <div className="flex gap-3 relative items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for code or discuss doubts..."
                  className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl pl-5 pr-24 py-4 text-sm font-bold focus:outline-none focus:border-[#5A9CB5] focus:bg-white focus:ring-4 focus:ring-[#5A9CB5]/10 transition-all shadow-inner"
                />
                
                <div className="absolute right-16 flex gap-1">
                  <button 
                    onClick={() => handleSend("I have a doubt, can you explain this?")}
                    className="p-2 text-gray-300 hover:text-indigo-500 transition-colors"
                    title="Discuss"
                  >
                      <HelpCircle size={20} />
                  </button>
                </div>

                <Button size="sm" onClick={() => handleSend()} disabled={loading} className="!px-4 !py-3 rounded-2xl shadow-xl">
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};