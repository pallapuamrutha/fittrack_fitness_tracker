import React, { useState } from 'react';
import { Footprints, Flame, Clock, Droplet, Moon } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { StatCard } from '../components/common/StatCard';
import { WeeklyActivityChart } from '../components/dashboard/WeeklyActivityChart';
import { TodayWorkoutList } from '../components/dashboard/TodayWorkoutList';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatNumber, formatDecimal } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { todayMetrics, goals, removeActivity } = useFitness();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      removeActivity(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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
            subtitle="Daily step goal"
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
