import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  Footprints,
  Flame,
  Clock,
  Moon,
  Droplet,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { formatNumber, formatDecimal } from '../utils/formatters';

export const ProgressPage: React.FC = () => {
  const { weeklyAnalytics, weeklyChartData, todayMetrics, goals } = useFitness();

  const PIE_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#0284c7', '#94a3b8'];

  const CustomStepsTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-white text-sm">{data.fullDay}</p>
          <div className="flex items-center justify-between text-emerald-400 gap-4">
            <span>Steps:</span>
            <span className="font-semibold">{formatNumber(data.steps)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 gap-4">
            <span>Daily Goal:</span>
            <span>{formatNumber(goals.steps)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomCaloriesTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-white text-sm">{data.fullDay}</p>
          <div className="flex items-center justify-between text-amber-400 gap-4">
            <span>Calories Burned:</span>
            <span className="font-semibold">{formatNumber(data.calories)} kcal</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Fitness Analytics & Progress
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Comprehensive review of your weekly trends, cumulative volume, and personal milestones.
        </p>
      </div>

      {/* Section 1: Fitness Statistics */}
      <section aria-labelledby="weekly-stats-heading">
        <h3 id="weekly-stats-heading" className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Weekly Fitness Statistics</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 bg-emerald-950/10">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
              <Footprints className="w-4 h-4" />
              <span>Total Steps</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatNumber(weeklyAnalytics.totalSteps)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">This week's volume</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 bg-amber-950/10">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
              <Flame className="w-4 h-4" />
              <span>Total Calories</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatNumber(weeklyAnalytics.totalCalories)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">kcal burned</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 bg-cyan-950/10">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-2">
              <Clock className="w-4 h-4" />
              <span>Total Workout</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {weeklyAnalytics.totalWorkoutMinutes}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">active minutes</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Avg Daily Steps</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatNumber(weeklyAnalytics.avgDailySteps)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">steps / day</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span>Avg Sleep</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatDecimal(weeklyAnalytics.avgSleep, 1)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">hours / night</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-2">
              <Droplet className="w-4 h-4 text-blue-400" />
              <span>Avg Water</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatDecimal(weeklyAnalytics.avgWater, 1)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">liters / day</div>
          </div>
        </div>
      </section>

      {/* Section 2: Today's Goal Completion Breakdown */}
      <section aria-labelledby="today-progress-heading">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 id="today-progress-heading" className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>Today's Goal Completion</span>
            </h3>
            <span className="text-xs text-slate-400">Target vs Actual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Daily Steps</span>
                <span className="text-emerald-400 font-bold">{todayMetrics.stepsPercent}%</span>
              </div>
              <ProgressBar progress={todayMetrics.stepsPercent} color="emerald" height="md" />
              <div className="text-[11px] text-slate-400">
                {formatNumber(todayMetrics.steps)} / {formatNumber(goals.steps)} steps
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Active Calories</span>
                <span className="text-amber-400 font-bold">{todayMetrics.caloriesPercent}%</span>
              </div>
              <ProgressBar progress={todayMetrics.caloriesPercent} color="amber" height="md" />
              <div className="text-[11px] text-slate-400">
                {formatNumber(todayMetrics.calories)} / {formatNumber(goals.calories)} kcal
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Workout Duration</span>
                <span className="text-cyan-400 font-bold">{todayMetrics.workoutPercent}%</span>
              </div>
              <ProgressBar progress={todayMetrics.workoutPercent} color="cyan" height="md" />
              <div className="text-[11px] text-slate-400">
                {todayMetrics.workoutDuration} / {goals.workoutDuration} mins
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Hydration</span>
                <span className="text-blue-400 font-bold">{todayMetrics.waterPercent}%</span>
              </div>
              <ProgressBar progress={todayMetrics.waterPercent} color="blue" height="md" />
              <div className="text-[11px] text-slate-400">
                {formatDecimal(todayMetrics.water, 1)} / {formatDecimal(goals.water, 1)} L
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Sleep & Rest</span>
                <span className="text-purple-400 font-bold">{todayMetrics.sleepPercent}%</span>
              </div>
              <ProgressBar progress={todayMetrics.sleepPercent} color="purple" height="md" />
              <div className="text-[11px] text-slate-400">
                {formatDecimal(todayMetrics.sleep, 1)} / {formatDecimal(goals.sleep, 1)} hrs
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Average Daily Fulfillment</span>
                <span className="text-emerald-400 font-bold">
                  {Math.round(
                    (todayMetrics.stepsPercent +
                      todayMetrics.caloriesPercent +
                      todayMetrics.workoutPercent +
                      todayMetrics.waterPercent +
                      todayMetrics.sleepPercent) /
                      5
                  )}
                  %
                </span>
              </div>
              <ProgressBar
                progress={Math.round(
                  (todayMetrics.stepsPercent +
                    todayMetrics.caloriesPercent +
                    todayMetrics.workoutPercent +
                    todayMetrics.waterPercent +
                    todayMetrics.sleepPercent) /
                    5
                )}
                color="emerald"
                height="md"
              />
              <div className="text-[11px] text-slate-400">Composite score across 5 health pillars</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Visual Charts Grid */}
      <section aria-labelledby="charts-grid-heading" className="space-y-6">
        <h3 id="charts-grid-heading" className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Weekly Trends & Distribution</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Weekly Steps Bar Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-white text-base">Weekly Steps Distribution</h4>
                <p className="text-xs text-slate-400">Daily walk volume with target line</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Target: {formatNumber(goals.steps)}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                  />
                  <Tooltip content={<CustomStepsTooltip />} />
                  <ReferenceLine
                    y={goals.steps}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <Bar dataKey="steps" fill="#10b981" radius={[6, 6, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Weekly Calories Line Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-white text-base">Weekly Calorie Burn</h4>
                <p className="text-xs text-slate-400">Daily active energy expenditure curve</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                Goal: {goals.calories} kcal
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip content={<CustomCaloriesTooltip />} />
                  <ReferenceLine
                    y={goals.calories}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#090d16' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Workout Duration per Day Bar Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-white text-base">Daily Workout Duration</h4>
                <p className="text-xs text-slate-400">Minutes exercised per day of the week</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                Goal: {goals.workoutDuration} min
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val} minutes`, 'Workout Time']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#334155',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="workoutDuration" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Workout Type Distribution */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-white text-base">Workout Variety Breakdown</h4>
                <p className="text-xs text-slate-400">Time split across workout modalities</p>
              </div>
              <span className="text-xs text-slate-400">This Week</span>
            </div>

            {weeklyAnalytics.workoutTypeBreakdown.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
                <span>No workouts logged for this week yet.</span>
              </div>
            ) : (
              <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weeklyAnalytics.workoutTypeBreakdown}
                      dataKey="minutes"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {weeklyAnalytics.workoutTypeBreakdown.map((entry, index: number) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, _name, entry: any) => [
                        `${val} min (${entry.payload.calories} kcal)`,
                        `${entry.payload.name}`,
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        borderColor: '#334155',
                        borderRadius: '12px',
                      }}
                    />
                    <Legend
                      formatter={(val) => <span className="text-xs text-slate-300">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
