import React from 'react';
import { Activity, Plus, RotateCcw } from 'lucide-react';
import { formatFullDate, getGreeting } from '../../utils/formatters';
import { useFitness } from '../../context/FitnessContext';

export const Navbar: React.FC = () => {
  const { setActiveTab, resetSampleData } = useFitness();
  const todayFormatted = formatFullDate();
  const greeting = getGreeting();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-20 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Mobile Brand & Greeting */}
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

            <button
              onClick={resetSampleData}
              title="Reset sample data"
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Demo Data</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {greeting}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track your fitness journey and stay consistent. •{' '}
            <span className="text-slate-300 font-medium">{todayFormatted}</span>
          </p>
        </div>

        {/* Right: Quick Actions */}
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
        </div>
      </div>
    </header>
  );
};
