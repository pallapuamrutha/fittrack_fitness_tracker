import React from 'react';
import { Activity as ActivityIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No fitness activities yet',
  description = 'Start tracking your journey today!',
  actionLabel = 'Log First Activity',
  onAction,
  icon: Icon = ActivityIcon,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-800 my-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-lg shadow-emerald-950/20">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
