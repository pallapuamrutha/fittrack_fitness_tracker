export type WorkoutType =
  | 'Running'
  | 'Walking'
  | 'Cycling'
  | 'Gym'
  | 'Yoga'
  | 'Swimming'
  | 'Sports'
  | 'Other';

export interface Activity {
  id: string;
  date: string; // YYYY-MM-DD
  steps: number;
  workoutType: WorkoutType;
  duration: number; // in minutes
  calories: number; // in kcal
  water: number; // in liters
  sleep: number; // in hours
  notes?: string;
  createdAt: string; // ISO string
}

export interface FitnessGoals {
  steps: number; // default: 10,000
  calories: number; // default: 500 kcal
  workoutDuration: number; // default: 60 min
  water: number; // default: 3.0 L
  sleep: number; // default: 8.0 hrs
}

export type NavigationTab = 'dashboard' | 'add' | 'progress' | 'history' | 'goals';

export interface DailySummary {
  date: string;
  dayName: string; // 'Mon', 'Tue', etc.
  formattedDate: string;
  steps: number;
  calories: number;
  workoutDuration: number;
  water: number;
  sleep: number;
  activitiesCount: number;
}

export interface TodayMetrics {
  steps: number;
  calories: number;
  workoutDuration: number;
  water: number;
  sleep: number;
  stepsPercent: number;
  caloriesPercent: number;
  workoutPercent: number;
  waterPercent: number;
  sleepPercent: number;
  activitiesCount: number;
  stepsSource?: 'health_connect' | 'manual';
}

export interface WeeklyAnalytics {
  totalSteps: number;
  totalCalories: number;
  totalWorkoutMinutes: number;
  avgDailySteps: number;
  avgSleep: number;
  avgWater: number;
  activeDaysCount: number;
  currentStreak: number;
  workoutTypeBreakdown: { name: WorkoutType; count: number; minutes: number; calories: number }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
