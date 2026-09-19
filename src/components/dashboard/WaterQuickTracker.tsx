import React, { useState } from 'react';
import { Droplet, Plus, Check } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { ProgressBar } from '../common/ProgressBar';
import { formatDecimal } from '../../utils/formatters';

export const WaterQuickTracker: React.FC = () => {
  const { todayMetrics, goals, quickAddWater } = useFitness();
  const [customMl, setCustomMl] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const handleQuickAdd = (liters: number) => {
    quickAddWater(liters);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = Number(customMl);
    if (!isNaN(ml) && ml > 0) {
      const liters = Math.round((ml / 1000) * 10) / 10;
      quickAddWater(liters);
      setCustomMl('');
      setShowCustomInput(false);
    }
  };

  const currentWater = todayMetrics.water;
  const targetWater = goals.water;
  const percent = todayMetrics.waterPercent;

  return (
    <div className="glass-panel rounded-2xl p-5 lg:p-6 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 fill-blue-500/20" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Hydration Tracker</span>
              <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                Manual Logging
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Sensors cannot detect water intake. Quick-log your hydration throughout the day.
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
          <span className="text-2xl font-black text-white">{formatDecimal(currentWater, 1)}</span>
          <span className="text-slate-400 font-medium text-xs">/ {formatDecimal(targetWater, 1)} L</span>
          <span
            className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
              percent >= 100
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {percent}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <ProgressBar progress={percent} color="blue" height="md" />
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
          <span>
            {currentWater >= targetWater ? (
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Daily hydration target met!
              </span>
            ) : (
              <span>{formatDecimal(Math.max(0, targetWater - currentWater), 1)} L remaining</span>
            )}
          </span>
          <span>Goal: {formatDecimal(targetWater, 1)} L / day</span>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="pt-1 flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleQuickAdd(0.25)}
          className="flex-1 min-w-[80px] py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/80 text-xs font-semibold text-slate-200 transition-all active:scale-95"
        >
          +250 ml
        </button>
        <button
          onClick={() => handleQuickAdd(0.5)}
          className="flex-1 min-w-[80px] py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/80 text-xs font-semibold text-slate-200 transition-all active:scale-95"
        >
          +500 ml
        </button>
        <button
          onClick={() => handleQuickAdd(0.75)}
          className="flex-1 min-w-[80px] py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/80 text-xs font-semibold text-slate-200 transition-all active:scale-95"
        >
          +750 ml
        </button>
        <button
          onClick={() => setShowCustomInput((prev) => !prev)}
          className="py-2 px-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-xs font-semibold text-blue-400 transition-all"
        >
          Custom amount
        </button>
      </div>

      {/* Custom Amount Form */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-2 animate-in fade-in duration-150">
          <input
            type="number"
            min="50"
            max="3000"
            step="50"
            placeholder="Amount in ml (e.g. 350)"
            value={customMl}
            onChange={(e) => setCustomMl(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl text-slate-950 bg-blue-400 hover:bg-blue-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCustomInput(false)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};
