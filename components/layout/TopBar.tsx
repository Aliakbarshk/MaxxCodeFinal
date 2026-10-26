import React from 'react';
import { Code2, Zap, Star, LockOpen, Lock, Sparkles, User, LogIn, Cloud, CheckCircle2 } from 'lucide-react';
import { Theme, Translation, Language, UserState, AuthUser } from '../../types';
import { THEMES } from '../../constants';

interface TopBarProps {
    user: UserState;
    t: Translation;
    theme: Theme;
    activeLanguage?: Language;
    setActiveLanguage?: (lang: Language) => void;
    onLogoClick: () => void;
    onUnlockClick: () => void;
    authUser?: AuthUser | null;
    onOpenAuth?: () => void;
    onProfileClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
    user, 
    t, 
    theme, 
    onLogoClick,
    onUnlockClick,
    authUser,
    onOpenAuth,
    onProfileClick,
}) => {
    const themeStyles = THEMES[theme];

    return (
        <div className="p-4 flex justify-between items-center border-b border-black/5 sticky top-0 z-10 shadow-sm backdrop-blur-md" 
             style={{ backgroundColor: themeStyles.sidebar + 'F0' }}>
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-sm shadow-md">
                    JS
                </div>
                <span className="font-black text-gray-900 tracking-tight">MaXxCode</span>
            </div>

            {/* Language Tag & Developer Unlock */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200/80 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-black text-amber-900 font-mono tracking-wider flex items-center gap-1">
                        JavaScript ES2024
                    </span>
                 </div>
                 
                 <button 
                    onClick={onUnlockClick} 
                    className="p-2 text-gray-400 hover:text-amber-500 transition-colors rounded-xl border border-gray-200 hover:border-amber-400 flex items-center gap-1.5 text-xs font-bold"
                    title={t.unlockAll}
                 >
                     {user.adminUnlocked ? <LockOpen size={18} className="text-emerald-500" /> : <Lock size={18} />}
                     <span className="hidden sm:inline">{user.adminUnlocked ? "Unlocked" : "Unlock All"}</span>
                 </button>
            </div>

            {/* Right side stats + Auth Profile */}
            <div className="flex gap-2.5 sm:gap-4 items-center ml-4">
                {/* Streak */}
                <div className="hidden sm:flex items-center gap-1.5 text-amber-500 bg-amber-50/80 px-3 py-1 rounded-full border border-amber-100">
                    <Zap fill="currentColor" size={18} className="animate-pulse" />
                    <span className="font-black text-sm">{user.currentStreak}d</span>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-100/60 px-3.5 py-1 rounded-full border border-amber-200 shadow-sm">
                    <Star fill="currentColor" size={18} className="animate-bounce-slow text-amber-500" />
                    <span className="font-black text-sm text-amber-950">{user.xp} XP</span>
                </div>

                {/* Auth / ID Section */}
                {authUser ? (
                    <button
                        onClick={onProfileClick}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full font-bold text-xs shadow-sm transition-all active:scale-95 group"
                        title={`Signed in as ${authUser.name} (${authUser.email}) - Synced to Cloud`}
                    >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black uppercase">
                            {authUser.name.charAt(0)}
                        </div>
                        <span className="hidden md:inline max-w-[100px] truncate">{authUser.name}</span>
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    </button>
                ) : (
                    <button
                        onClick={onOpenAuth}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-full border-b-2 border-amber-600 shadow-sm transition-all active:translate-y-0.5 active:border-b-0"
                    >
                        <LogIn size={15} />
                        <span>Sign In</span>
                    </button>
                )}
            </div>
        </div>
    );
};
