import React from 'react';
import { Plus, Flame, Clock, Footprints, Droplet, Edit3, Trash2 } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { getTodayDateString, WORKOUT_TYPE_CONFIG } from '../../utils/formatters';

interface TodayWorkoutListProps {
  onDeleteClick: (id: string, title: string) => void;
}

export const TodayWorkoutList: React.FC<TodayWorkoutListProps> = ({ onDeleteClick }) => {
  const { activities, setActiveTab, setEditingActivity } = useFitness();
  const todayStr = getTodayDateString();
  const todayActivities = activities.filter((a) => a.date === todayStr);

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setActiveTab('add');
  };

  return (
    <div className="glass-panel rounded-2xl p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Today's Sessions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {todayActivities.length} {todayActivities.length === 1 ? 'activity' : 'activities'} logged today
          </p>
        </div>

        <button
          onClick={() => {
            setEditingActivity(null);
            setActiveTab('add');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Session</span>
        </button>
      </div>

      {todayActivities.length === 0 ? (
        <div className="py-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
          <p className="text-sm font-medium text-slate-300">No workout logged yet today</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Get moving and record your steps, gym session, or outdoor run!
          </p>
          <button
            onClick={() => setActiveTab('add')}
            className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
          >
            + Log Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {todayActivities.map((act) => {
            const meta = WORKOUT_TYPE_CONFIG[act.workoutType] || WORKOUT_TYPE_CONFIG.Other;

            return (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}
                  >
                    {act.workoutType}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-medium">
                      {act.duration > 0 && (
                        <span className="flex items-center gap-1 text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {act.duration} min
                        </span>
                      )}
                      {act.calories > 0 && (
                        <span className="flex items-center gap-1 text-amber-300">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          {act.calories} kcal
                        </span>
                      )}
                      {act.steps > 0 && (
                        <span className="flex items-center gap-1 text-emerald-300">
                          <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                          {act.steps.toLocaleString()} steps
                        </span>
                      )}
                      {act.water > 0 && (
                        <span className="flex items-center gap-1 text-blue-300">
                          <Droplet className="w-3.5 h-3.5 text-blue-400" />
                          {act.water} L
                        </span>
                      )}
                    </div>
                    {act.notes && (
                      <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">
                        "{act.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(act)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Activity"
                    aria-label="Edit activity"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteClick(act.id, `${act.workoutType} on ${act.date}`)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Activity"
                    aria-label="Delete activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
