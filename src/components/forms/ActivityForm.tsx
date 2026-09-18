import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Footprints,
  Dumbbell,
  Clock,
  Flame,
  Droplet,
  Moon,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { Activity, WorkoutType } from '../../types/fitness';
import { useFitness } from '../../context/FitnessContext';
import { getTodayDateString, getDayOffsetDateString } from '../../utils/formatters';

const WORKOUT_TYPES: WorkoutType[] = [
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Yoga',
  'Swimming',
  'Sports',
  'Other',
];

interface ActivityFormProps {
  initialActivity?: Activity | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  initialActivity,
  onSuccess,
  onCancel,
}) => {
  const { addActivity, editActivity, setActiveTab, setEditingActivity } = useFitness();

  const isEditing = Boolean(initialActivity);

  const [date, setDate] = useState<string>(initialActivity?.date || getTodayDateString());
  const [steps, setSteps] = useState<string>(
    initialActivity ? String(initialActivity.steps) : ''
  );
  const [workoutType, setWorkoutType] = useState<WorkoutType>(
    initialActivity?.workoutType || 'Running'
  );
  const [duration, setDuration] = useState<string>(
    initialActivity ? String(initialActivity.duration) : ''
  );
  const [calories, setCalories] = useState<string>(
    initialActivity ? String(initialActivity.calories) : ''
  );
  const [water, setWater] = useState<string>(
    initialActivity ? String(initialActivity.water) : ''
  );
  const [sleep, setSleep] = useState<string>(
    initialActivity ? String(initialActivity.sleep) : ''
  );
  const [notes, setNotes] = useState<string>(initialActivity?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialActivity) {
      setDate(initialActivity.date);
      setSteps(String(initialActivity.steps));
      setWorkoutType(initialActivity.workoutType);
      setDuration(String(initialActivity.duration));
      setCalories(String(initialActivity.calories));
      setWater(String(initialActivity.water));
      setSleep(String(initialActivity.sleep));
      setNotes(initialActivity.notes || '');
    }
  }, [initialActivity]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!date) {
      errs.date = 'Date is required';
    }

    const numSteps = steps === '' ? 0 : Number(steps);
    if (isNaN(numSteps) || numSteps < 0) {
      errs.steps = 'Steps cannot be negative';
    }

    const numDuration = duration === '' ? 0 : Number(duration);
    if (isNaN(numDuration) || numDuration < 0) {
      errs.duration = 'Duration cannot be negative';
    }

    const numCalories = calories === '' ? 0 : Number(calories);
    if (isNaN(numCalories) || numCalories < 0) {
      errs.calories = 'Calories cannot be negative';
    }

    const numWater = water === '' ? 0 : Number(water);
    if (isNaN(numWater) || numWater < 0) {
      errs.water = 'Water cannot be negative';
    }

    const numSleep = sleep === '' ? 0 : Number(sleep);
    if (isNaN(numSleep) || numSleep < 0 || numSleep > 24) {
      errs.sleep = 'Sleep hours must be between 0 and 24';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      date,
      steps: Number(steps) || 0,
      workoutType,
      duration: Number(duration) || 0,
      calories: Number(calories) || 0,
      water: Math.round((Number(water) || 0) * 10) / 10,
      sleep: Math.round((Number(sleep) || 0) * 10) / 10,
      notes: notes.trim(),
    };

    if (isEditing && initialActivity) {
      editActivity(initialActivity.id, payload);
      setEditingActivity(null);
    } else {
      addActivity(payload);
    }

    if (onSuccess) {
      onSuccess();
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleClear = () => {
    setDate(getTodayDateString());
    setSteps('');
    setWorkoutType('Running');
    setDuration('');
    setCalories('');
    setWater('');
    setSleep('');
    setNotes('');
    setErrors({});
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setEditingActivity(null);
      setActiveTab('dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date & Preset selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Date</span>
          <span className="text-rose-400">*</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="activity-date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full bg-slate-900/90 border ${
              errors.date ? 'border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
            } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
          />
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDate(getTodayDateString())}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                date === getTodayDateString()
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDate(getDayOffsetDateString(-1))}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                date === getDayOffsetDateString(-1)
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Yesterday
            </button>
          </div>
        </div>
        {errors.date && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.date}
          </p>
        )}
      </div>

      {/* Workout Type & Duration in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="workout-type-select"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            <span>Workout Type</span>
          </label>
          <select
            id="workout-type-select"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
            className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
          >
            {WORKOUT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-slate-900 text-white">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="workout-duration-input"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Workout Duration (Minutes)</span>
          </label>
          <div className="relative">
            <input
              id="workout-duration-input"
              type="number"
              min="0"
              placeholder="e.g. 45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`w-full bg-slate-900/90 border ${
                errors.duration ? 'border-rose-500' : 'border-slate-700/80 focus:border-cyan-500'
              } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all`}
            />
            <span className="absolute right-4 top-2.5 text-xs text-slate-400 pointer-events-none">
              min
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[15, 30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(String(mins))}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                +{mins}m
              </button>
            ))}
          </div>
          {errors.duration && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.duration}
            </p>
          )}
        </div>
      </div>

      {/* Steps & Calories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="steps-input"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            <Footprints className="w-4 h-4 text-emerald-400" />
            <span>Steps</span>
          </label>
          <div className="relative">
            <input
              id="steps-input"
              type="number"
              min="0"
              placeholder="e.g. 8500"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className={`w-full bg-slate-900/90 border ${
                errors.steps ? 'border-rose-500' : 'border-slate-700/80 focus:border-emerald-500'
              } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all`}
            />
            <span className="absolute right-4 top-2.5 text-xs text-slate-400 pointer-events-none">
              steps
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[2500, 5000, 8000, 10000].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSteps(String(s))}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {s.toLocaleString()}
              </button>
            ))}
          </div>
          {errors.steps && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.steps}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="calories-input"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Calories Burned</span>
          </label>
          <div className="relative">
            <input
              id="calories-input"
              type="number"
              min="0"
              placeholder="e.g. 350"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className={`w-full bg-slate-900/90 border ${
                errors.calories ? 'border-rose-500' : 'border-slate-700/80 focus:border-amber-500'
              } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all`}
            />
            <span className="absolute right-4 top-2.5 text-xs text-slate-400 pointer-events-none">
              kcal
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[200, 350, 500, 750].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCalories(String(c))}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {c} kcal
              </button>
            ))}
          </div>
          {errors.calories && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.calories}
            </p>
          )}
        </div>
      </div>

      {/* Water & Sleep Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="water-input"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            <Droplet className="w-4 h-4 text-blue-400" />
            <span>Water Intake</span>
          </label>
          <div className="relative">
            <input
              id="water-input"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 2.5"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className={`w-full bg-slate-900/90 border ${
                errors.water ? 'border-rose-500' : 'border-slate-700/80 focus:border-blue-500'
              } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
            <span className="absolute right-4 top-2.5 text-xs text-slate-400 pointer-events-none">
              Liters
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[1.0, 2.0, 2.5, 3.0, 3.5].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWater(String(w))}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {w} L
              </button>
            ))}
          </div>
          {errors.water && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.water}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sleep-input"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Sleep Hours</span>
          </label>
          <div className="relative">
            <input
              id="sleep-input"
              type="number"
              step="0.5"
              min="0"
              max="24"
              placeholder="e.g. 7.5"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className={`w-full bg-slate-900/90 border ${
                errors.sleep ? 'border-rose-500' : 'border-slate-700/80 focus:border-purple-500'
              } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all`}
            />
            <span className="absolute right-4 top-2.5 text-xs text-slate-400 pointer-events-none">
              Hours
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[6.0, 7.0, 7.5, 8.0, 8.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSleep(String(s))}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {s} hrs
              </button>
            ))}
          </div>
          {errors.sleep && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.sleep}
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label
          htmlFor="notes-input"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
        >
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Workout Notes (Optional)</span>
        </label>
        <textarea
          id="notes-input"
          rows={3}
          placeholder="How did you feel? Intensity, personal bests, muscle soreness..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <div>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isEditing && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="submit"
            id="save-activity-btn"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
          >
            {isEditing ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Update Activity</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>Save Activity</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
