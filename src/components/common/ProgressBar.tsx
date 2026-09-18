import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100+
  color?: 'emerald' | 'cyan' | 'blue' | 'purple' | 'amber';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'emerald',
  height = 'md',
  showLabel = false,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const colorClasses = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-400',
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-400',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className="w-full">
      <div
        className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${heightClasses[height]}`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClasses[color]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
          <span>0%</span>
          <span className="font-semibold text-slate-200">{progress}%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};
