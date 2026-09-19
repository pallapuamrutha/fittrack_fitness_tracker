import React, { useState } from 'react';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, setAuthView, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errs.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    if (!password) {
      errs.password = 'Please enter your password.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    const res = await login({ email, password, rememberMe });
    if (!res.success) {
      setErrors({ general: res.error || 'Login failed. Please verify your credentials.' });
    }
  };

  const handleQuickDemo = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Password123!');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black mx-auto mb-3">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            Fit<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Track</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back! Sign in to access your personal fitness metrics.
          </p>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-400 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`w-full bg-slate-900/90 border rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.email
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-slate-700/80 focus:border-emerald-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className={`w-full bg-slate-900/90 border rounded-xl pl-9 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.password
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-slate-700/80 focus:border-emerald-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="p-1.5 text-slate-400 hover:text-slate-200 absolute right-2.5 top-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Signing In...' : 'Log In to FitTrack'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* 1-Click Demo Accounts Selector (User A vs User B) */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Demo Logins</span>
            </span>
            <span className="text-[10px] text-slate-500">Test multi-user isolation</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('alex@fittrack.com')}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60 text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                  AJ
                </div>
                <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                  User A (Alex)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">alex@fittrack.com</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">~9,000 steps • 450 kcal</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('sarah@fittrack.com')}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">
                  SM
                </div>
                <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                  User B (Sarah)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">sarah@fittrack.com</p>
              <p className="text-[10px] text-cyan-400 mt-0.5">~5,000 steps • 300 kcal</p>
            </button>
          </div>
        </div>

        {/* Sign Up Redirect */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Don't have an account yet? </span>
          <button
            type="button"
            onClick={() => setAuthView('signup')}
            className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>Password Assistance</span>
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In this demo version, passwords for pre-configured demo users are:
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
              <div>
                <strong>Alex:</strong> alex@fittrack.com / Password123!
              </div>
              <div>
                <strong>Sarah:</strong> sarah@fittrack.com / Password123!
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              When using custom accounts, passwords are saved securely in your browser's local store.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
