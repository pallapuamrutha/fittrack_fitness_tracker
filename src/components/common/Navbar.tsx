import React from 'react';
import { Activity, Plus, RotateCcw, LogOut } from 'lucide-react';
import { formatFullDate, getGreeting } from '../../utils/formatters';
import { useFitness } from '../../context/FitnessContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { setActiveTab, resetSampleData } = useFitness();
  const { user, logout } = useAuth();
  const todayFormatted = formatFullDate();
  const greeting = getGreeting();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const avatarGradient = user?.avatarColor || 'from-cyan-500 to-blue-600';

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-20 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Mobile Brand, User, & Greeting */}
        <div>
          <div className="flex items-center justify-between lg:hidden mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Fit<span className="text-emerald-400">Track</span>
              </span>
            </div>

            {/* Mobile User & Actions */}
            <div className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white font-bold text-xs shadow`}>
                {initials}
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {greeting}
              {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track your fitness journey and stay consistent. •{' '}
            <span className="text-slate-300 font-medium">{todayFormatted}</span>
          </p>
        </div>

        {/* Right: Quick Actions & Desktop User Profile */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={resetSampleData}
            title="Reset to sample data"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            id="quick-log-btn"
            onClick={() => setActiveTab('add')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Activity</span>
          </button>

          {/* Desktop User Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white font-bold text-xs shadow-md`}
              title={`${user?.name} (${user?.email})`}
            >
              {initials}
            </div>
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              aria-label="Log out of account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
