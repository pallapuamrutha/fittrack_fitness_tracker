import React, { useState, useMemo } from 'react';
import {
  Search,
  Trash2,
  Edit3,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import type { Activity, WorkoutType } from '../types/fitness';
import { useFitness } from '../context/FitnessContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { formatDateString, formatNumber, WORKOUT_TYPE_CONFIG } from '../utils/formatters';

const ALL_WORKOUT_TYPES: Array<WorkoutType | 'All'> = [
  'All',
  'Running',
  'Walking',
  'Cycling',
  'Gym',
  'Yoga',
  'Swimming',
  'Sports',
  'Other',
];

export const HistoryPage: React.FC = () => {
  const { activities, removeActivity, setActiveTab, setEditingActivity } = useFitness();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<WorkoutType | 'All'>('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const filteredActivities = useMemo(() => {
    return activities
      .filter((act: Activity) => {
        const matchesSearch =
          searchTerm.trim() === '' ||
          act.workoutType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (act.notes && act.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = selectedType === 'All' || act.workoutType === selectedType;

        const matchesDate = !selectedDate || act.date === selectedDate;

        return matchesSearch && matchesType && matchesDate;
      })
      .sort((a: Activity, b: Activity) => {
        const dateComparison = a.date.localeCompare(b.date);
        return sortOrder === 'desc' ? -dateComparison : dateComparison;
      });
  }, [activities, searchTerm, selectedType, selectedDate, sortOrder]);

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setActiveTab('add');
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      removeActivity(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fittrack-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Activity History
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            View, search, edit, and manage all your past fitness workout sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activities.length > 0 && (
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              title="Export all activities as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingActivity(null);
              setActiveTab('add');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 transition-all"
          >
            + New Activity
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search workouts or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="w-full md:w-44 shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {ALL_WORKOUT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-slate-900 text-white">
                {t === 'All' ? 'All Workout Types' : t}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44 shrink-0 relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {(searchTerm || selectedType !== 'All' || selectedDate) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('All');
                setSelectedDate('');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 px-2 py-2"
            >
              Reset
            </button>
          )}

          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 hover:text-white"
            title={`Sort ${sortOrder === 'desc' ? 'Oldest First' : 'Newest First'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <EmptyState
          title={activities.length === 0 ? 'No fitness activities yet.' : 'No matching activities found'}
          description={
            activities.length === 0
              ? 'Start tracking your journey today!'
              : 'Try clearing your search query or date filters.'
          }
          actionLabel={activities.length === 0 ? 'Log First Activity' : 'Clear Filters'}
          onAction={() => {
            if (activities.length === 0) {
              setActiveTab('add');
            } else {
              setSearchTerm('');
              setSelectedType('All');
              setSelectedDate('');
            }
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/60 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Workout</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Calories</th>
                    <th className="py-3.5 px-4">Steps</th>
                    <th className="py-3.5 px-4">Water</th>
                    <th className="py-3.5 px-4">Sleep</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredActivities.map((act: Activity) => {
                    const meta = WORKOUT_TYPE_CONFIG[act.workoutType] || WORKOUT_TYPE_CONFIG.Other;

                    return (
                      <tr
                        key={act.id}
                        className="hover:bg-slate-900/40 transition-colors group"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-white">
                            {formatDateString(act.date)}
                          </span>
                          <span className="block text-[11px] text-slate-500">{act.date}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}
                            >
                              {act.workoutType}
                            </span>
                          </div>
                          {act.notes && (
                            <p className="text-xs text-slate-400 mt-1 max-w-xs truncate italic">
                              "{act.notes}"
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-slate-200 font-medium">{act.duration} min</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-amber-400 font-medium">
                            {formatNumber(act.calories)} kcal
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-emerald-400 font-medium">
                            {formatNumber(act.steps)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-blue-400 font-medium">{act.water} L</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-purple-400 font-medium">{act.sleep} hrs</span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(act)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit record"
                              aria-label="Edit activity record"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  id: act.id,
                                  title: `${act.workoutType} (${act.date})`,
                                })
                              }
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Delete record"
                              aria-label="Delete activity record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredActivities.map((act: Activity) => {
              const meta = WORKOUT_TYPE_CONFIG[act.workoutType] || WORKOUT_TYPE_CONFIG.Other;

              return (
                <div
                  key={act.id}
                  className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border mb-1.5 ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}
                      >
                        {act.workoutType}
                      </span>
                      <div className="text-sm font-bold text-white">
                        {formatDateString(act.date)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(act)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                        aria-label="Edit activity"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            id: act.id,
                            title: `${act.workoutType} on ${act.date}`,
                          })
                        }
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                        aria-label="Delete activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">DURATION</span>
                      <span className="font-semibold text-slate-200">{act.duration} min</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">CALORIES</span>
                      <span className="font-semibold text-amber-400">
                        {formatNumber(act.calories)} kcal
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">STEPS</span>
                      <span className="font-semibold text-emerald-400">
                        {formatNumber(act.steps)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">WATER</span>
                      <span className="font-semibold text-blue-400">{act.water} L</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">SLEEP</span>
                      <span className="font-semibold text-purple-400">{act.sleep} hrs</span>
                    </div>
                  </div>

                  {act.notes && (
                    <p className="text-xs text-slate-400 italic">
                      "{act.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Fitness Activity"
        message={`Are you sure you want to permanently delete this record (${deleteTarget?.title})? This will update your charts and totals.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
