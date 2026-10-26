import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, BrainCircuit, CheckCircle, LockOpen, Sparkles, Terminal, Code2, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

// Components
import { FloatingBackground } from './components/layout/FloatingBackground';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/views/DashboardView';
import { LessonView } from './components/views/LessonView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { PlaygroundView } from './components/views/PlaygroundView';
import { ProblemSolveView } from './components/views/ProblemSolveView';
import { ArcadeView } from './components/ArcadeGames';
import { CheatsheetView, Modal, Button, MaxAvatar, Card } from './components/UIComponents';
import { AuthModal } from './components/auth/AuthModal';

// Data & Utils
import { BADGES, TRANSLATIONS, THEMES, PROBLEMS } from './constants';
import { LESSONS } from './services/curriculum';
import { UserState, Language, Badge, AuthUser } from './types';
import { getUserState, saveUserState, updateStreak, checkBadges } from './utils/storage';
import { playSound } from './utils/audio';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'lesson' | 'profile' | 'settings' | 'problems' | 'problem_solve' | 'playground' | 'arcade' | 'resources'>('dashboard');
  const [user, setUser] = useState<UserState>(getUserState());
  const [authUser, setAuthUser] = useState<AuthUser | null>(authService.getSavedUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const activeLanguage: Language = 'javascript';
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentProblemId, setCurrentProblemId] = useState<string | null>(null);

  const t = TRANSLATIONS[user.settings.appLanguage] || TRANSLATIONS.en;
  const theme = THEMES[user.settings.theme] || THEMES.light;
  const activeLessons = LESSONS.filter(l => l.language === 'javascript').sort((a, b) => a.order - b.order);
  const activeProblems = PROBLEMS.filter(p => p.language === 'javascript');

  useEffect(() => {
    const updatedUser = updateStreak(getUserState());
    setUser(updatedUser);
    saveUserState(updatedUser);

    // Verify session with backend on load
    if (authService.getToken()) {
      authService.getMe().then((res) => {
        if (res.success && res.user) {
          setAuthUser(res.user);
          // Sync state with cloud
          setUser((prev) => {
            const merged: UserState = {
              ...prev,
              xp: Math.max(prev.xp, res.user?.xp || 0),
              currentStreak: Math.max(prev.currentStreak, res.user?.currentStreak || 1),
              completedLessons: Array.from(new Set([...prev.completedLessons, ...(res.user?.completedLessons || [])])),
              completedProblems: Array.from(new Set([...prev.completedProblems, ...(res.user?.completedProblems || [])])),
              badges: Array.from(new Set([...prev.badges, ...(res.user?.badges || [])])),
              adminUnlocked: prev.adminUnlocked || !!res.user?.adminUnlocked,
            };
            saveUserState(merged);
            return merged;
          });
        } else {
          setAuthUser(null);
        }
      });
    }
  }, []);

  useEffect(() => {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-accent', theme.accent);
      root.style.setProperty('--color-bg', theme.bg);
      root.style.setProperty('--color-card', theme.card);
      root.style.setProperty('--color-text', theme.text);
      root.style.setProperty('--color-sidebar', theme.sidebar);
  }, [theme]);

  const handleUpdateUser = (updates: Partial<UserState>) => {
      const newState = { ...user, ...updates };
      setUser(newState);
      saveUserState(newState);

      // Auto sync with cloud if logged in
      if (authUser) {
        authService.syncProgress(newState).catch((err) => {
          console.warn('Background cloud sync notice:', err);
        });
      }
  };

  const handleAuthSuccess = (loggedUser: AuthUser) => {
    setAuthUser(loggedUser);
    playSound('success');

    // Merge logged in profile data into local app state
    const mergedState: UserState = {
      ...user,
      xp: Math.max(user.xp, loggedUser.xp || 0),
      currentStreak: Math.max(user.currentStreak, loggedUser.currentStreak || 1),
      completedLessons: Array.from(new Set([...user.completedLessons, ...(loggedUser.completedLessons || [])])),
      completedProblems: Array.from(new Set([...user.completedProblems, ...(loggedUser.completedProblems || [])])),
      badges: Array.from(new Set([...user.badges, ...(loggedUser.badges || [])])),
      adminUnlocked: user.adminUnlocked || !!loggedUser.adminUnlocked,
    };
    setUser(mergedState);
    saveUserState(mergedState);
  };

  const handleLogout = () => {
    authService.clearSession();
    setAuthUser(null);
    playSound('click');
  };

  const startLesson = (lessonId: string) => {
    const lesson = LESSONS.find(l => l.id === lessonId);
    if (lesson) {
      playSound('click');
      setCurrentLessonId(lessonId);
      setCurrentProblemId(null);
      setView('lesson');
    }
  };

  const completeLesson = (xpGain: number = 25, showModal: boolean = true) => {
    if (currentLessonId) {
        const newCompleted = [...new Set([...user.completedLessons, currentLessonId])];
        let newState = {
            ...user,
            completedLessons: newCompleted,
            xp: user.xp + xpGain,
        };
        const newBadgeIds = checkBadges(newState);
        if (newBadgeIds.length > 0) {
            newState.badges = [...newState.badges, ...newBadgeIds];
            playSound('success');
        }
        handleUpdateUser(newState);
    }
  };

  const nextLesson = () => {
      if (currentLessonId) {
        const currentIndex = activeLessons.findIndex(l => l.id === currentLessonId);
        if (currentIndex >= 0 && currentIndex < activeLessons.length - 1) {
            exitLesson();
            setTimeout(() => {
                startLesson(activeLessons[currentIndex + 1].id);
            }, 100);
        } else {
            exitLesson();
        }
      } else {
          exitLesson();
      }
  };

  const exitLesson = () => {
    setView(currentProblemId ? 'problems' : 'dashboard');
    setCurrentLessonId(null);
    setCurrentProblemId(null);
    playSound('click');
    window.speechSynthesis.cancel();
  };

  const startProblem = (problemId: string) => {
    playSound('click');
    setCurrentProblemId(problemId);
    setView('problem_solve');
  };

  const handleSolveProblem = (problemId: string, xpEarned: number = 50) => {
    const newCompletedProblems = [...new Set([...user.completedProblems, problemId])];
    let newState = {
      ...user,
      completedProblems: newCompletedProblems,
      xp: user.xp + xpEarned,
    };
    const newBadgeIds = checkBadges(newState);
    if (!newState.badges.includes('problem_solver')) {
      newBadgeIds.push('problem_solver');
    }
    if (newBadgeIds.length > 0) {
      newState.badges = [...new Set([...newState.badges, ...newBadgeIds])];
    }
    handleUpdateUser(newState);
  };

  const currentProblem = PROBLEMS.find(p => p.id === currentProblemId) || PROBLEMS[0];

  return (
    <>
      {view === 'lesson' && currentLessonId && (
          <LessonView 
            lesson={LESSONS.find(l => l.id === currentLessonId)!}
            user={user}
            theme={user.settings.theme}
            t={t}
            activeLanguage={activeLanguage}
            onExit={exitLesson}
            onComplete={completeLesson}
            onNextLesson={nextLesson}
            onUpdateUser={handleUpdateUser}
          />
      )}

      {view === 'problem_solve' && currentProblem && (
          <ProblemSolveView
            problem={currentProblem}
            user={user}
            theme={user.settings.theme}
            t={t}
            onBack={() => { setView('problems'); setCurrentProblemId(null); }}
            onSolve={handleSolveProblem}
          />
      )}
      
      {view === 'arcade' && <ArcadeView onBack={() => setView('dashboard')} />}

      {view === 'playground' && (
          <PlaygroundView 
            user={user}
            theme={user.settings.theme}
            t={t}
            activeLanguage={activeLanguage}
            onExit={() => setView('dashboard')}
            onUpdateUser={handleUpdateUser}
          />
      )}

      {['dashboard', 'profile', 'settings', 'resources', 'problems'].includes(view) && (
        <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
            <Sidebar view={view} setView={setView} t={t} theme={user.settings.theme} onLogoClick={() => setLogoClicks(c => c + 1)} />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <FloatingBackground />
                <TopBar 
                    user={user} 
                    t={t} 
                    theme={user.settings.theme} 
                    activeLanguage={activeLanguage}
                    onLogoClick={() => setLogoClicks(c => c + 1)} 
                    onUnlockClick={() => setShowUnlockModal(true)}
                    authUser={authUser}
                    onOpenAuth={() => setShowAuthModal(true)}
                    onProfileClick={() => setView('profile')}
                />
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {view === 'dashboard' && <DashboardView lessons={activeLessons} user={user} theme={user.settings.theme} onStartLesson={startLesson} />}
                    {view === 'profile' && (
                      <ProfileView 
                        user={user} 
                        theme={user.settings.theme} 
                        t={t} 
                        authUser={authUser}
                        onOpenAuth={() => setShowAuthModal(true)}
                        onLogout={handleLogout}
                      />
                    )}
                    {view === 'settings' && <SettingsView user={user} theme={user.settings.theme} t={t} onUpdateSetting={(k,v) => handleUpdateUser({ settings: { ...user.settings, [k]: v } })} onUpdateApiKey={(k) => handleUpdateUser({ apiKey: k })} />}
                    {view === 'resources' && <CheatsheetView theme={user.settings.theme} />}
                    {view === 'problems' && (
                        <div className="p-6 md:p-12 pb-24 max-w-6xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h1 className="text-3xl font-black flex items-center gap-3 text-gray-900">
                                        <BrainCircuit size={36} className="text-amber-500"/> JavaScript Coding Challenges
                                    </h1>
                                    <p className="text-sm font-bold text-gray-500 mt-1">
                                        Practice real interview problems, algorithms, and JS patterns with automated test verification.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm text-xs font-black text-gray-700">
                                    <Trophy size={16} className="text-amber-500" />
                                    <span>{user.completedProblems.length} / {activeProblems.length} Solved</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {activeProblems.map(p => {
                                    const isDone = user.completedProblems.includes(p.id);
                                    const diffStyles = {
                                        easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                                        medium: 'bg-amber-100 text-amber-800 border-amber-200',
                                        hard: 'bg-rose-100 text-rose-800 border-rose-200',
                                    }[p.difficulty];

                                    return (
                                        <button 
                                            key={p.id} 
                                            onClick={() => startProblem(p.id)} 
                                            className="text-left p-7 bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl hover:border-amber-400 active:scale-95 group relative overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                        {p.category}
                                                    </span>
                                                    <span className={clsx("text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border", diffStyles)}>
                                                        {p.difficulty}
                                                    </span>
                                                </div>
                                                {isDone && (
                                                    <span className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                                        <CheckCircle size={14} /> Solved
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">
                                                {p.title}
                                            </h3>
                                            <p className="text-gray-500 mt-2 font-medium text-sm leading-relaxed line-clamp-2">
                                                {p.description}
                                            </p>
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-600">
                                                <span>Solve Challenge</span>
                                                <span className="text-gray-400 font-mono">+50 XP</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                <MobileNav view={view} setView={setView} t={t} theme={user.settings.theme} />
            </div>
        </div>
      )}

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        guestProgress={user}
        onAuthSuccess={handleAuthSuccess}
        theme={user.settings.theme}
      />

      {/* Developer Mode Modal */}
      <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} title="Developer Mode">
           <div className="space-y-4">
               <p className="text-xs text-gray-500 font-medium">Enter password to unlock developer access:</p>
               <input 
                  type="password" 
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:outline-none focus:border-amber-400" 
                  placeholder="Password..." 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
               />
               <Button 
                  fullWidth 
                  onClick={() => { 
                      if (adminPassword === 'hc1' || adminPassword === 'dev' || adminPassword === 'admin') { 
                          handleUpdateUser({ adminUnlocked: true }); 
                          setShowAdminModal(false); 
                          playSound('success');
                      } else { 
                          playSound('error');
                      }
                  }}
                  className="bg-amber-400 text-black font-black"
               >
                   Unlock All Chapters
               </Button>
           </div>
      </Modal>

      {/* Quick Unlock All Modal */}
      <Modal isOpen={showUnlockModal} onClose={() => setShowUnlockModal(false)} title={t.unlockAll}>
          <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl mx-auto flex items-center justify-center border-2 border-amber-200">
                  <LockOpen size={32} />
              </div>
              <p className="text-gray-600 leading-relaxed font-bold text-sm">{t.unlockMsg}</p>
              <Button 
                  fullWidth 
                  variant="primary" 
                  size="lg" 
                  onClick={() => { 
                      handleUpdateUser({ adminUnlocked: true }); 
                      setShowUnlockModal(false); 
                      playSound('success');
                  }}
                  className="bg-amber-400 text-black font-black"
              >
                  {t.confirmUnlock}
              </Button>
          </div>
      </Modal>
    </>
  );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
