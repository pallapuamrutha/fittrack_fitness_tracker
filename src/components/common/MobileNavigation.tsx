import React from 'react';
import { LayoutDashboard, PlusCircle, TrendingUp, History, Target } from 'lucide-react';
import type { NavigationTab } from '../../types/fitness';

interface MobileNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Home', icon: LayoutDashboard },
    { id: 'progress' as NavigationTab, label: 'Progress', icon: TrendingUp },
    { id: 'add' as NavigationTab, label: 'Add', icon: PlusCircle, isPrimary: true },
    { id: 'history' as NavigationTab, label: 'History', icon: History },
    { id: 'goals' as NavigationTab, label: 'Goals', icon: Target },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-area-pb"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
                aria-label={item.label}
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform">
                  <Icon className="w-7 h-7 stroke-[2.3]" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
