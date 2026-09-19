import React, { useState } from 'react';
import {
  Target,
  Footprints,
  Flame,
  Clock,
  Droplet,
  Moon,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { DEFAULT_GOALS } from '../utils/storage';
import { formatNumber, formatDecimal } from '../utils/formatters';

export const GoalsPage: React.FC = () => {
  const { goals, updateGoals, todayMetrics } = useFitness();

  const [formGoals, setFormGoals] = useState({
    steps: String(goals.steps),
    calories: String(goals.calories),
    workoutDuration: String(goals.workoutDuration),
    water: String(goals.water),
    sleep: String(goals.sleep),
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newGoals = {
      steps: Math.max(100, Number(formGoals.steps) || DEFAULT_GOALS.steps),
      calories: Math.max(50, Number(formGoals.calories) || DEFAULT_GOALS.calories),
      workoutDuration: Math.max(5, Number(formGoals.workoutDuration) || DEFAULT_GOALS.workoutDuration),
      water: Math.max(0.5, Math.round((Number(formGoals.water) || DEFAULT_GOALS.water) * 10) / 10),
      sleep: Math.max(1, Math.round((Number(formGoals.sleep) || DEFAULT_GOALS.sleep) * 10) / 10),
    };

    updateGoals(newGoals);
    setIsEditing(false);
  };

  const handleResetDefaults = () => {
    setFormGoals({
      steps: String(DEFAULT_GOALS.steps),
      calories: String(DEFAULT_GOALS.calories),
      workoutDuration: String(DEFAULT_GOALS.workoutDuration),
      water: String(DEFAULT_GOALS.water),
      sleep: String(DEFAULT_GOALS.sleep),
    });
    updateGoals(DEFAULT_GOALS);
    setIsEditing(false);
  };

  const applyPreset = (preset: 'casual' | 'standard' | 'athlete') => {
    let presetValues = DEFAULT_GOALS;
    if (preset === 'casual') {
      presetValues = { steps: 6000, calories: 350, workoutDuration: 30, water: 2.5, sleep: 8.0 };
    } else if (preset === 'athlete') {
      presetValues = { steps: 14000, calories: 800, workoutDuration: 90, water: 4.0, sleep: 8.5 };
    }

    setFormGoals({
      steps: String(presetValues.steps),
      calories: String(presetValues.calories),
      workoutDuration: String(presetValues.workoutDuration),
      water: String(presetValues.water),
      sleep: String(presetValues.sleep),
    });
    updateGoals(presetValues);
    setIsEditing(false);
  };

  const goalCards = [
    {
      id: 'steps',
      label: 'Daily Steps',
      current: formatNumber(todayMetrics.steps),
      target: formatNumber(goals.steps),
      unit: 'steps',
      percent: todayMetrics.stepsPercent,
      icon: Footprints,
      color: 'emerald' as const,
      desc: 'Walking increases cardiovascular health and daily activity count.',
    },
    {
      id: 'calories',
      label: 'Daily Active Calories',
      current: formatNumber(todayMetrics.calories),
      target: formatNumber(goals.calories),
      unit: 'kcal',
      percent: todayMetrics.caloriesPercent,
      icon: Flame,
      color: 'amber' as const,
      desc: 'Active expenditure from workouts, cardio, and intense exercises.',
    },
    {
      id: 'workout',
      label: 'Daily Workout Duration',
      current: todayMetrics.workoutDuration,
      target: goals.workoutDuration,
      unit: 'minutes',
      percent: todayMetrics.workoutPercent,
      icon: Clock,
      color: 'cyan' as const,
      desc: 'Recommended 30-60 minutes of moderate to vigorous exercise daily.',
    },
    {
      id: 'water',
      label: 'Daily Water Intake',
      current: formatDecimal(todayMetrics.water, 1),
      target: formatDecimal(goals.water, 1),
      unit: 'liters',
      percent: todayMetrics.waterPercent,
      icon: Droplet,
      color: 'blue' as const,
      desc: 'Optimal hydration for muscle function, energy levels, and recovery.',
    },
    {
      id: 'sleep',
      label: 'Nightly Sleep & Rest',
      current: formatDecimal(todayMetrics.sleep, 1),
      target: formatDecimal(goals.sleep, 1),
      unit: 'hours',
      percent: todayMetrics.sleepPercent,
      icon: Moon,
      color: 'purple' as const,
      desc: 'Essential for cellular repair, growth hormone release, and mental focus.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Daily Fitness Goals
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Set personalized daily targets. These update dashboard progress and charts in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 border border-slate-700/80 text-white hover:bg-slate-800 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isEditing ? 'Close Editor' : 'Customize Goals'}</span>
          </button>
        </div>
      </div>

      {/* Goal Disclaimer Alert */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Application Notice:</strong> The daily targets above (10,000 steps, 500 kcal, 60 min workout, 3.0 L water, 8.0 hrs sleep) are customizable application goals designed for personal tracking and motivation, and should not be considered universal medical or clinical recommendations.
        </p>
      </div>

      {isEditing && (
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 to-emerald-950/20 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span>Customize Your Targets</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved instantly to your browser's local storage.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset('casual')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => applyPreset('athlete')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Intense
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Daily Steps</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={formGoals.steps}
                  onChange={(e) => setFormGoals({ ...formGoals, steps: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Default: 10,000</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Calories (kcal)</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={formGoals.calories}
                  onChange={(e) => setFormGoals({ ...formGoals, calories: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500">Default: 500</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Workout (min)</label>
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={formGoals.workoutDuration}
                  onChange={(e) =>
                    setFormGoals({ ...formGoals, workoutDuration: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500">Default: 60</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Water (Liters)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.1"
                  value={formGoals.water}
                  onChange={(e) => setFormGoals({ ...formGoals, water: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500">Default: 3.0</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Sleep (Hours)</label>
                <input
                  type="number"
                  min="4"
                  max="14"
                  step="0.5"
                  value={formGoals.sleep}
                  onChange={(e) => setFormGoals({ ...formGoals, sleep: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-500">Default: 8.0</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Defaults</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Goal Cards */}
      <div className="space-y-4">
        {goalCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700/80 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{card.label}</h3>
                    <p className="text-xs text-slate-400">{card.desc}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 self-start sm:self-auto">
                  <span className="text-2xl font-black text-white">{card.current}</span>
                  <span className="text-slate-400 font-semibold text-sm">
                    / {card.target} {card.unit}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      card.percent >= 100
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {card.percent}%
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <ProgressBar progress={card.percent} color={card.color} height="md" />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                <span>Today's status</span>
                <span>
                  {card.percent >= 100 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Goal Achieved!
                    </span>
                  ) : (
                    <span>
                      {100 - card.percent}% remaining to reach target
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
