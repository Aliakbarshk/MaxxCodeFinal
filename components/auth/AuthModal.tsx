import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Database, CheckCircle, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { Theme, UserState, AuthUser } from '../../types';
import { THEMES } from '../../constants';
import { Button, MaxAvatar } from '../UIComponents';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestProgress: UserState;
  onAuthSuccess: (user: AuthUser) => void;
  theme: Theme;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  guestProgress,
  onAuthSuccess,
  theme,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const themeStyles = THEMES[theme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setErrorMessage('Please tell us your name!');
          setIsLoading(false);
          return;
        }

        const res = await authService.register(name, email, password, guestProgress);
        if (res.success && res.user) {
          setSuccessMessage('Welcome aboard! Your cloud ID is ready.');
          setTimeout(() => {
            onAuthSuccess(res.user!);
            onClose();
          }, 800);
        } else {
          setErrorMessage(res.error || 'Registration failed');
        }
      } else {
        const res = await authService.login(email, password);
        if (res.success && res.user) {
          setSuccessMessage(`Welcome back, ${res.user.name}!`);
          setTimeout(() => {
            onAuthSuccess(res.user!);
            onClose();
          }, 800);
        } else {
          setErrorMessage(res.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl border-4 p-6 sm:p-8 shadow-2xl relative animate-pop overflow-hidden"
        style={{ 
          backgroundColor: themeStyles.card,
          borderColor: themeStyles.primary + '55',
          color: themeStyles.text 
        }}
      >
        {/* Background Decorative Glow */}
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: themeStyles.primary }}
        />
        <div 
          className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: themeStyles.secondary }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl hover:bg-black/5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header Mascot */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center border-4 border-white shadow-lg mb-3 relative">
            <div className="scale-110">
              <MaxAvatar mood={errorMessage ? 'thinking' : successMessage ? 'happy' : 'neutral'} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
              <Database size={14} />
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Coder ID'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mt-1 flex items-center justify-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" />
            MongoDB Atlas Cloud Authentication
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-6 border border-black/5 font-bold text-sm">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white shadow-md text-amber-900 font-black'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white shadow-md text-amber-900 font-black'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Guest Progress Merge Banner */}
        {mode === 'register' && (guestProgress.xp > 0 || guestProgress.completedLessons.length > 0) && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 font-bold">
            <Sparkles size={16} className="text-amber-500 shrink-0 animate-spin-slow" />
            <span>
              Awesome! Your current <strong>{guestProgress.xp} XP</strong> &amp; <strong>{guestProgress.completedLessons.length} lessons</strong> will be linked to your new ID!
            </span>
          </div>
        )}

        {/* Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-pop">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-pop">
            <CheckCircle size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
                Your Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Coder"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/80 rounded-2xl border-2 border-gray-200 focus:border-amber-400 focus:bg-white outline-none font-bold text-sm transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-gray-50/80 rounded-2xl border-2 border-gray-200 focus:border-amber-400 focus:bg-white outline-none font-bold text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
              Password {mode === 'register' && <span className="font-normal text-gray-400">(min. 6 chars)</span>}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-gray-50/80 rounded-2xl border-2 border-gray-200 focus:border-amber-400 focus:bg-white outline-none font-bold text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
            className="mt-6 py-3.5 text-base shadow-md"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : mode === 'login' ? (
              'Log In to MaXxCode'
            ) : (
              'Create My Free Account'
            )}
          </Button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-black/5 text-center">
          <p className="text-xs text-gray-400 font-bold">
            All your code, XP, badges &amp; streak will be stored securely.
          </p>
        </div>
      </div>
    </div>
  );
};
