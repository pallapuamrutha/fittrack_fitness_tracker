import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  History,
  Target,
  Flame,
  Activity,
  RotateCcw,
  LogOut,
} from 'lucide-react';
import type { NavigationTab } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { weeklyAnalytics, resetSampleData } = useFitness();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add' as NavigationTab, label: 'Add Activity', icon: PlusCircle },
    { id: 'progress' as NavigationTab, label: 'Progress', icon: TrendingUp },
    { id: 'history' as NavigationTab, label: 'Activity History', icon: History },
    { id: 'goals' as NavigationTab, label: 'Goals', icon: Target },
  ];

  // Derive initials from user name
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
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl h-screen sticky top-0 p-5 select-none z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
          <Activity className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Fit<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Track</span>
          </h1>
          <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
            Activity & Metrics
          </p>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="space-y-1.5 flex-1" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="tracking-wide">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Streak & Consistency Card */}
      <div className="my-4 p-4 rounded-2xl glass-panel border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900/50">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Daily Streak</div>
            <div className="text-[11px] text-slate-400">Keep up the rhythm!</div>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-black text-amber-400">{weeklyAnalytics.currentStreak}</span>
          <span className="text-xs text-slate-400 font-medium">days active</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Active this week</span>
          <span className="font-semibold text-emerald-400">{weeklyAnalytics.activeDaysCount} / 7 days</span>
        </div>
      </div>

      {/* User Profile & Logout Section */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate" title={user?.name}>
              {user?.name || 'User'}
            </div>
            <div className="text-[11px] text-slate-400 truncate" title={user?.email}>
              {user?.email || 'Logged in'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={resetSampleData}
            title="Reset to sample data"
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition-colors"
            aria-label="Reset demo sample data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            aria-label="Log out of account"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
