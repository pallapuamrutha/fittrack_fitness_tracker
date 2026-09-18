import type { LucideIcon } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface StatCardProps {
  id?: string;
  title: string;
  currentValue: string | number;
  goalValue: string | number;
  unit: string;
  percent: number;
  icon: LucideIcon;
  colorTheme: 'emerald' | 'cyan' | 'blue' | 'purple' | 'amber';
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  currentValue,
  goalValue,
  unit,
  percent,
  icon: Icon,
  colorTheme,
  subtitle,
  onClick,
}) => {
  const themeStyles = {
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'hover:border-emerald-500/40 hover:shadow-emerald-950/40',
      accentColor: '#10b981',
    },
    cyan: {
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'hover:border-cyan-500/40 hover:shadow-cyan-950/40',
      accentColor: '#06b6d4',
    },
    blue: {
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'hover:border-blue-500/40 hover:shadow-blue-950/40',
      accentColor: '#3b82f6',
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'hover:border-purple-500/40 hover:shadow-purple-950/40',
      accentColor: '#a855f7',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'hover:border-amber-500/40 hover:shadow-amber-950/40',
      accentColor: '#f59e0b',
    },
  }[colorTheme];

  const isCompleted = percent >= 100;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${themeStyles.glow}`}
    >
      {/* Subtle background ambient gradient spot */}
      <div
        className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full blur-2xl opacity-10 pointer-events-none"
        style={{ backgroundColor: themeStyles.accentColor }}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${themeStyles.iconBg} transition-transform duration-300 group-hover:scale-105`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 text-sm tracking-wide">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>

        <div
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${themeStyles.badge} flex items-center gap-1`}
        >
          <span>{percent}%</span>
          {isCompleted && <span className="text-[10px]">✓</span>}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            {currentValue}
          </span>
          <span className="text-slate-400 text-sm font-medium">
            / {goalValue} {unit}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {percent}% completed
        </p>
      </div>

      <div className="mt-4">
        <ProgressBar progress={percent} color={colorTheme} height="sm" />
      </div>
    </div>
  );
};
