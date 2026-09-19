import type { Activity, DailySummary, FitnessGoals, TodayMetrics, WeeklyAnalytics, WorkoutType } from '../types/fitness';
import { getTodayDateString } from './formatters';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Group activities by date and sum appropriate metrics
 */
export function groupActivitiesByDate(activities: Activity[]): Map<string, DailySummary> {
  const map = new Map<string, DailySummary>();

  const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));

  for (const act of sorted) {
    const existing = map.get(act.date);
    const [y, m, d] = act.date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayName = DAYS_OF_WEEK[dateObj.getDay()];
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!existing) {
      map.set(act.date, {
        date: act.date,
        dayName,
        formattedDate,
        steps: Number(act.steps) || 0,
        calories: Number(act.calories) || 0,
        workoutDuration: Number(act.duration) || 0,
        water: Number(act.water) || 0,
        sleep: Number(act.sleep) || 0,
        activitiesCount: 1,
      });
    } else {
      existing.steps += Number(act.steps) || 0;
      existing.calories += Number(act.calories) || 0;
      existing.workoutDuration += Number(act.duration) || 0;
      existing.water = Math.round((existing.water + (Number(act.water) || 0)) * 10) / 10;
      existing.sleep = Math.max(existing.sleep, Number(act.sleep) || 0);
      existing.activitiesCount += 1;
    }
  }

  return map;
}

/**
 * Calculate metrics for today against current goals
 * If healthConnectSteps is provided and valid, it replaces manually entered steps
 */
export function calculateTodayMetrics(
  activities: Activity[],
  goals: FitnessGoals,
  healthConnectSteps?: number | null
): TodayMetrics {
  const todayStr = getTodayDateString();
  const todayActivities = activities.filter((a) => a.date === todayStr);

  let manualSteps = 0;
  let calories = 0;
  let workoutDuration = 0;
  let water = 0;
  let sleep = 0;

  for (const act of todayActivities) {
    manualSteps += Number(act.steps) || 0;
    calories += Number(act.calories) || 0;
    workoutDuration += Number(act.duration) || 0;
    water += Number(act.water) || 0;
    sleep = Math.max(sleep, Number(act.sleep) || 0);
  }

  const isHealthConnectActive = typeof healthConnectSteps === 'number' && !isNaN(healthConnectSteps);
  const steps = isHealthConnectActive ? healthConnectSteps : manualSteps;
  const stepsSource: 'health_connect' | 'manual' = isHealthConnectActive ? 'health_connect' : 'manual';

  water = Math.round(water * 10) / 10;

  const safeGoal = (val: number, fallback: number) => (val > 0 ? val : fallback);

  return {
    steps,
    calories,
    workoutDuration,
    water,
    sleep,
    stepsPercent: Math.round((steps / safeGoal(goals.steps, 10000)) * 100),
    caloriesPercent: Math.round((calories / safeGoal(goals.calories, 500)) * 100),
    workoutPercent: Math.round((workoutDuration / safeGoal(goals.workoutDuration, 60)) * 100),
    waterPercent: Math.round((water / safeGoal(goals.water, 3.0)) * 100),
    sleepPercent: Math.round((sleep / safeGoal(goals.sleep, 8.0)) * 100),
    activitiesCount: todayActivities.length,
    stepsSource,
  };
}

/**
 * Get weekly chart data for Monday through Sunday of the current week
 * Optionally overlays Health Connect daily steps
 */
export function getWeeklyChartData(
  activities: Activity[],
  healthConnectDailySteps?: Record<string, number>
): Array<{
  date: string;
  day: string;
  fullDay: string;
  steps: number;
  calories: number;
  workoutDuration: number;
  water: number;
  sleep: number;
  hasActivity: boolean;
  stepsSource: 'health_connect' | 'manual';
}> {
  const grouped = groupActivitiesByDate(activities);
  const now = new Date();
  
  const currentDayIndex = now.getDay();
  const distanceToMonday = currentDayIndex === 0 ? -6 : 1 - currentDayIndex;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);

  const weekData = [];
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);

    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const summary = grouped.get(dateStr);
    const manualSteps = summary ? summary.steps : 0;
    const hasHcSteps = Boolean(healthConnectDailySteps && typeof healthConnectDailySteps[dateStr] === 'number');
    const steps = hasHcSteps ? (healthConnectDailySteps![dateStr]) : manualSteps;

    weekData.push({
      date: dateStr,
      day: shortDays[i],
      fullDay: daysOrder[i],
      steps,
      calories: summary ? summary.calories : 0,
      workoutDuration: summary ? summary.workoutDuration : 0,
      water: summary ? summary.water : 0,
      sleep: summary ? summary.sleep : 0,
      hasActivity: Boolean((summary && summary.activitiesCount > 0) || steps > 0),
      stepsSource: hasHcSteps ? ('health_connect' as const) : ('manual' as const),
    });
  }

  return weekData;
}

/**
 * Calculate weekly analytics: totals, averages, workout breakdown, and active streaks
 */
export function calculateWeeklyAnalytics(
  activities: Activity[],
  _goals?: FitnessGoals,
  healthConnectDailySteps?: Record<string, number>
): WeeklyAnalytics {
  const weekData = getWeeklyChartData(activities, healthConnectDailySteps);
  
  let totalSteps = 0;
  let totalCalories = 0;
  let totalWorkoutMinutes = 0;
  let totalSleep = 0;
  let totalWater = 0;
  let activeDaysCount = 0;

  for (const day of weekData) {
    totalSteps += day.steps;
    totalCalories += day.calories;
    totalWorkoutMinutes += day.workoutDuration;
    totalWater += day.water;
    totalSleep += day.sleep;
    if (day.hasActivity || day.steps > 0 || day.workoutDuration > 0) {
      activeDaysCount++;
    }
  }

  const weekDateSet = new Set(weekData.map((d) => d.date));
  const weekActivities = activities.filter((a) => weekDateSet.has(a.date));

  const typeMap = new Map<WorkoutType, { count: number; minutes: number; calories: number }>();
  for (const act of weekActivities) {
    const existing = typeMap.get(act.workoutType) || { count: 0, minutes: 0, calories: 0 };
    existing.count += 1;
    existing.minutes += Number(act.duration) || 0;
    existing.calories += Number(act.calories) || 0;
    typeMap.set(act.workoutType, existing);
  }

  const workoutTypeBreakdown = Array.from(typeMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    minutes: data.minutes,
    calories: data.calories,
  }));

  const grouped = groupActivitiesByDate(activities);
  let currentStreak = 0;
  const checkDate = new Date();
  
  const todayStr = getTodayDateString();
  const hasToday = (grouped.get(todayStr)?.steps || 0) > 0 || (grouped.get(todayStr)?.workoutDuration || 0) > 0;
  
  if (!hasToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, '0');
    const d = String(checkDate.getDate()).padStart(2, '0');
    const str = `${y}-${m}-${d}`;
    const dayData = grouped.get(str);

    if (dayData && (dayData.steps > 0 || dayData.workoutDuration > 0 || dayData.activitiesCount > 0)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const divisor = Math.max(activeDaysCount, 1);

  return {
    totalSteps,
    totalCalories,
    totalWorkoutMinutes,
    avgDailySteps: Math.round(totalSteps / 7),
    avgSleep: Math.round((totalSleep / divisor) * 10) / 10,
    avgWater: Math.round((totalWater / divisor) * 10) / 10,
    activeDaysCount,
    currentStreak: hasToday ? currentStreak : Math.max(currentStreak, 0),
    workoutTypeBreakdown,
  };
}
