import React from 'react';
import { ActivityForm } from '../components/forms/ActivityForm';
import { useFitness } from '../context/FitnessContext';
import { Sparkles, Info, ShieldCheck } from 'lucide-react';

export const AddActivityPage: React.FC = () => {
  const { editingActivity, setEditingActivity, setActiveTab } = useFitness();

  const handleSuccess = () => {
    setActiveTab('dashboard');
  };

  const handleCancel = () => {
    setEditingActivity(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {editingActivity ? 'Edit Fitness Activity' : 'Log New Fitness Activity'}
            </h2>
            <p className="text-xs text-slate-400">
              {editingActivity
                ? 'Update the recorded statistics for this workout session.'
                : 'Record your daily steps, exercise duration, hydration, and sleep to keep your streak alive.'}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <ActivityForm
            initialActivity={editingActivity}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Helpful Tips Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300 block mb-0.5">Multi-session logging</span>
            Multiple activities logged on the same date will automatically sum your steps, calories, and duration on the dashboard.
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300 block mb-0.5">Offline-Ready & Persistent</span>
            All activities are securely stored inside your browser's local storage and survive restarts and reloads.
          </div>
        </div>
      </div>
    </div>
  );
};
