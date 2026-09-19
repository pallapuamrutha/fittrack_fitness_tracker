import React, { useState } from 'react';
import { Footprints, Flame, Clock, Droplet, Moon, Info } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { StatCard } from '../components/common/StatCard';
import { WeeklyActivityChart } from '../components/dashboard/WeeklyActivityChart';
import { TodayWorkoutList } from '../components/dashboard/TodayWorkoutList';
import { WaterQuickTracker } from '../components/dashboard/WaterQuickTracker';
import { HealthConnectBanner } from '../components/healthConnect/HealthConnectBanner';
import { HealthConnectModal } from '../components/healthConnect/HealthConnectModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatNumber, formatDecimal } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const {
    todayMetrics,
    goals,
    removeActivity,
    healthConnectState,
    healthConnectDailySteps,
    syncHealthData,
  } = useFitness();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const isHcConnected =
    healthConnectState.isConnected && healthConnectState.permissions.READ_STEPS === 'granted';
  const hasNoHcRecords = isHcConnected && Object.keys(healthConnectDailySteps).length === 0;

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      removeActivity(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Android Health Connect Integration Banner */}
      <HealthConnectBanner />

      {/* Empty State Banner if Health Connect is connected but no records exist */}
      {hasNoHcRecords && (
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-950/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                No Health Connect Records Found
              </h4>
              <p className="text-xs text-slate-400">
                Health Connect is connected, but no step records were reported for your device. Start walking or sync again.
              </p>
            </div>
          </div>
          <button
            onClick={() => syncHealthData(false)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold shrink-0"
          >
            Check Sync
          </button>
        </div>
      )}

      {/* 5 Core Metric Cards */}
      <section aria-label="Daily Fitness Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            id="stat-steps"
            title="Steps"
            currentValue={formatNumber(todayMetrics.steps)}
            goalValue={formatNumber(goals.steps)}
            unit=""
            percent={todayMetrics.stepsPercent}
            icon={Footprints}
            colorTheme="emerald"
            subtitle={
              isHcConnected
                ? 'Synced via Health Connect'
                : 'Manual entry • Tap to link Health Connect'
            }
          />

          <StatCard
            id="stat-calories"
            title="Calories Burned"
            currentValue={formatNumber(todayMetrics.calories)}
            goalValue={formatNumber(goals.calories)}
            unit="kcal"
            percent={todayMetrics.caloriesPercent}
            icon={Flame}
            colorTheme="amber"
            subtitle="Active energy burn"
          />

          <StatCard
            id="stat-workout"
            title="Workout Duration"
            currentValue={todayMetrics.workoutDuration}
            goalValue={goals.workoutDuration}
            unit="min"
            percent={todayMetrics.workoutPercent}
            icon={Clock}
            colorTheme="cyan"
            subtitle="Active exercise time"
          />

          <StatCard
            id="stat-water"
            title="Water Intake"
            currentValue={formatDecimal(todayMetrics.water, 1)}
            goalValue={formatDecimal(goals.water, 1)}
            unit="L"
            percent={todayMetrics.waterPercent}
            icon={Droplet}
            colorTheme="blue"
            subtitle="Hydration target"
          />

          <StatCard
            id="stat-sleep"
            title="Sleep"
            currentValue={formatDecimal(todayMetrics.sleep, 1)}
            goalValue={formatDecimal(goals.sleep, 1)}
            unit="hrs"
            percent={todayMetrics.sleepPercent}
            icon={Moon}
            colorTheme="purple"
            subtitle="Rest & recovery"
          />
        </div>
      </section>

      {/* Water Quick Tracker Widget (Manual Logging) */}
      <WaterQuickTracker />

      {/* Main Grid: Weekly Chart & Today's Workout Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyActivityChart />
        </div>

        <div className="lg:col-span-1">
          <TodayWorkoutList
            onDeleteClick={(id: string, title: string) => setDeleteTarget({ id, title })}
          />
        </div>
      </div>

      {/* Health Connect Configuration Modal */}
      <HealthConnectModal />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Workout Entry?"
        message={`Are you sure you want to permanently delete this workout (${deleteTarget?.title})? This will update your dashboard metrics.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
