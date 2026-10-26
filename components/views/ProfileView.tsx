import React from 'react';
import { User, Zap, Star, Trophy, CheckCircle, BrainCircuit, ShieldCheck, LogOut, LogIn, Database, Cloud } from 'lucide-react';
import { UserState, Theme, Translation, AuthUser } from '../../types';
import { BADGES, THEMES } from '../../constants';
import { Card, BadgeItem, MaxAvatar, Button } from '../UIComponents';

interface ProfileViewProps {
    user: UserState;
    theme: Theme;
    t: Translation;
    authUser?: AuthUser | null;
    onOpenAuth?: () => void;
    onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
    user, 
    theme, 
    t,
    authUser,
    onOpenAuth,
    onLogout
}) => {
    const themeStyles = THEMES[theme];
    const earnedBadgeIds = new Set(user.badges);

    return (
        <div className="flex-1 p-6 md:p-12 overflow-y-auto pb-24" style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}>
            {/* Top Auth Banner */}
            <div className="mb-8 p-5 rounded-3xl border-2 border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black shadow-md shrink-0">
                        {authUser ? authUser.name.charAt(0).toUpperCase() : <User size={24} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-black text-lg text-gray-900">
                                {authUser ? authUser.name : 'Guest Coder'}
                            </h2>
                            {authUser ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full flex items-center gap-1">
                                    <Cloud size={10} /> Cloud ID
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full">
                                    Local Guest
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 font-bold">
                            {authUser ? authUser.email : 'Your progress is stored only in this local browser'}
                        </p>
                    </div>
                </div>

                <div>
                    {authUser ? (
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-2xl border border-red-200 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                        >
                            <LogOut size={14} /> Log Out
                        </button>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onOpenAuth}
                            className="shadow-sm"
                        >
                            <LogIn size={15} /> Save to Cloud / Sign In
                        </Button>
                    )}
                </div>
            </div>

            <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
                <User size={32} className="text-[var(--color-primary)]"/> {t.profile}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card theme={theme} className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern-dots opacity-10" />
                    <div className="w-36 h-36 mb-6 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-8 border-white shadow-xl relative z-10">
                         <div className="scale-125">
                            <MaxAvatar mood="happy" />
                         </div>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--color-primary)] mb-1">Coder {user.xp > 1000 ? 'Pro' : user.xp > 100 ? 'Apprentice' : 'Novice'}</h2>
                    <p className="text-gray-500 font-bold mb-6 text-lg">Level {Math.floor(user.xp / 100) + 1}</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div className="bg-[var(--color-primary)] h-full relative" style={{ width: `${Math.min(100, user.xp % 100)}%` }}>
                            <div className="absolute inset-0 animate-shimmer" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">{user.xp % 100} / 100 XP to next level</p>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                     <Card theme={theme} className="flex flex-col items-center justify-center p-6 hover:scale-105 transition-transform">
                         <div className="bg-yellow-100 p-4 rounded-full mb-3 shadow-sm"><Zap className="text-[var(--color-secondary)]" size={28}/></div>
                         <h3 className="font-bold text-3xl text-gray-800">{user.currentStreak}</h3>
                         <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t.streak}</p>
                     </Card>
                     <Card theme={theme} className="flex flex-col items-center justify-center p-6 hover:scale-105 transition-transform">
                         <div className="bg-green-100 p-4 rounded-full mb-3 shadow-sm"><CheckCircle className="text-[#347433]" size={28}/></div>
                         <h3 className="font-bold text-3xl text-gray-800">{user.completedLessons.length}</h3>
                         <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t.lessons}</p>
                     </Card>
                     <Card theme={theme} className="flex flex-col items-center justify-center p-6 hover:scale-105 transition-transform">
                         <div className="bg-blue-100 p-4 rounded-full mb-3 shadow-sm"><Star className="text-[var(--color-primary)]" size={28}/></div>
                         <h3 className="font-bold text-3xl text-gray-800">{user.xp}</h3>
                         <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t.xp}</p>
                     </Card>
                     <Card theme={theme} className="flex flex-col items-center justify-center p-6 hover:scale-105 transition-transform">
                         <div className="bg-red-100 p-4 rounded-full mb-3 shadow-sm"><BrainCircuit className="text-[var(--color-accent)]" size={28}/></div>
                         <h3 className="font-bold text-3xl text-gray-800">{user.completedProblems.length}</h3>
                         <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{t.problems}</p>
                     </Card>
                </div>
            </div>

            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Trophy className="text-[var(--color-secondary)]" size={28} /> Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {BADGES.map(badge => (
                    <BadgeItem
                        key={badge.id}
                        icon={badge.icon}
                        name={badge.name}
                        color={badge.color}
                        earned={earnedBadgeIds.has(badge.id)}
                    />
                ))}
            </div>
        </div>
    );
};
