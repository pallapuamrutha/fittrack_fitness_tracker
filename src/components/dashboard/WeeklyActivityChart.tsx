import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useFitness } from '../../context/FitnessContext';
import { formatNumber } from '../../utils/formatters';

type ChartFilter = 'all' | 'steps' | 'calories' | 'workout';

export const WeeklyActivityChart: React.FC = () => {
  const { weeklyChartData, goals } = useFitness();
  const [filter, setFilter] = useState<ChartFilter>('all');

  const filterOptions: Array<{ id: ChartFilter; label: string }> = [
    { id: 'all', label: 'All Metrics' },
    { id: 'steps', label: 'Steps' },
    { id: 'calories', label: 'Calories' },
    { id: 'workout', label: 'Workout' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs space-y-1.5 min-w-[150px]">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1">
            {data.fullDay} <span className="text-slate-400 font-normal">({data.date})</span>
          </p>
          <div className="flex items-center justify-between text-emerald-400">
            <span>👟 Steps:</span>
            <span className="font-semibold">{formatNumber(data.steps)}</span>
          </div>
          <div className="flex items-center justify-between text-amber-400">
            <span>🔥 Calories:</span>
            <span className="font-semibold">{formatNumber(data.calories)} kcal</span>
          </div>
          <div className="flex items-center justify-between text-cyan-400">
            <span>⏱️ Workout:</span>
            <span className="font-semibold">{data.workoutDuration} mins</span>
          </div>
          <div className="flex items-center justify-between text-blue-400">
            <span>💧 Water:</span>
            <span className="font-semibold">{data.water} L</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 lg:p-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Weekly Activity</h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Mon – Sun
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare your daily steps, active burn, and workout duration across this week.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start sm:self-auto">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === opt.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={weeklyChartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorStepsBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorWorkoutBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#0891b2" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
            />
            {filter === 'all' && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                tickFormatter={(value) => `${value}`}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
              formatter={(value) => <span className="text-slate-300 capitalize">{value}</span>}
            />

            {(filter === 'all' || filter === 'steps') && (
              <Bar
                yAxisId="left"
                dataKey="steps"
                name="Steps"
                fill="url(#colorStepsBar)"
                radius={[6, 6, 0, 0]}
                barSize={filter === 'steps' ? 32 : 22}
              />
            )}

            {filter === 'steps' && goals.steps > 0 && (
              <ReferenceLine
                yAxisId="left"
                y={goals.steps}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: `Goal: ${formatNumber(goals.steps)}`,
                  fill: '#10b981',
                  fontSize: 11,
                  position: 'top',
                }}
              />
            )}

            {(filter === 'all' || filter === 'calories') && (
              <Line
                yAxisId={filter === 'all' ? 'right' : 'left'}
                type="monotone"
                dataKey="calories"
                name="Calories (kcal)"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#090d16' }}
                activeDot={{ r: 6 }}
              />
            )}

            {filter === 'workout' && (
              <Bar
                yAxisId="left"
                dataKey="workoutDuration"
                name="Workout (min)"
                fill="url(#colorWorkoutBar)"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
