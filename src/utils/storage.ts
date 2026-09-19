import type { Activity, FitnessGoals, WorkoutType } from '../types/fitness';
import { getDayOffsetDateString } from './formatters';

export const DEFAULT_GOALS: FitnessGoals = {
  steps: 10000,
  calories: 500,
  workoutDuration: 60,
  water: 3.0,
  sleep: 8.0,
};

export const USER_B_GOALS: FitnessGoals = {
  steps: 6000,
  calories: 350,
  workoutDuration: 45,
  water: 2.0,
  sleep: 8.0,
};

// User-scoped storage keys
export function getActivitiesKey(userId: string): string {
  return `fittrack_data_${userId}`;
}

export function getGoalsKey(userId: string): string {
  return `fittrack_goals_${userId}`;
}

export function getSeededKey(userId: string): string {
  return `fittrack_seeded_${userId}`;
}

/**
 * Generates user-specific sample activities to demonstrate data isolation
 * User A: ~9,000 steps, ~450 kcal, 2.5 L water, 7.5 hrs sleep
 * User B: ~5,000 steps, ~300 kcal, 1.5 L water, 8.0 hrs sleep
 */
export function generateSampleActivities(userId: string = 'user_alex_01'): Activity[] {
  const isUserB = userId === 'user_sarah_02';

  const samplesUserA: Array<{
    dayOffset: number;
    steps: number;
    workoutType: WorkoutType;
    duration: number;
    calories: number;
    water: number;
    sleep: number;
    notes: string;
  }> = [
    {
      dayOffset: -6,
      steps: 9240,
      workoutType: 'Running',
      duration: 45,
      calories: 460,
      water: 2.8,
      sleep: 7.5,
      notes: 'Morning outdoor 5k run in the park. Felt energetic!',
    },
    {
      dayOffset: -5,
      steps: 11200,
      workoutType: 'Gym',
      duration: 65,
      calories: 580,
      water: 3.4,
      sleep: 8.0,
      notes: 'Upper body hypertrophy session: chest, shoulders, and triceps.',
    },
    {
      dayOffset: -4,
      steps: 8430,
      workoutType: 'Cycling',
      duration: 40,
      calories: 390,
      water: 2.6,
      sleep: 7.0,
      notes: 'Scenic evening riverside cycling interval session.',
    },
    {
      dayOffset: -3,
      steps: 10650,
      workoutType: 'Walking',
      duration: 50,
      calories: 320,
      water: 3.0,
      sleep: 8.5,
      notes: 'Long brisk walk around the city with music and fresh air.',
    },
    {
      dayOffset: -2,
      steps: 12100,
      workoutType: 'Gym',
      duration: 70,
      calories: 620,
      water: 3.5,
      sleep: 7.8,
      notes: 'Leg day! Heavy barbell squats, lunges, and calf raises.',
    },
    {
      dayOffset: -1,
      steps: 7800,
      workoutType: 'Yoga',
      duration: 45,
      calories: 260,
      water: 2.7,
      sleep: 8.2,
      notes: 'Full body vinyasa flow and deep mobility stretches.',
    },
    {
      dayOffset: 0,
      steps: 9000,
      workoutType: 'Running',
      duration: 45,
      calories: 450,
      water: 2.5,
      sleep: 7.0,
      notes: 'Tempo run. Hit target pace and hydration goal!',
    },
  ];

  const samplesUserB: Array<{
    dayOffset: number;
    steps: number;
    workoutType: WorkoutType;
    duration: number;
    calories: number;
    water: number;
    sleep: number;
    notes: string;
  }> = [
    {
      dayOffset: -6,
      steps: 4800,
      workoutType: 'Walking',
      duration: 30,
      calories: 210,
      water: 1.5,
      sleep: 8.0,
      notes: 'Morning walk in neighborhood.',
    },
    {
      dayOffset: -5,
      steps: 5300,
      workoutType: 'Yoga',
      duration: 35,
      calories: 240,
      water: 1.8,
      sleep: 8.5,
      notes: 'Relaxing restorative yoga session.',
    },
    {
      dayOffset: -4,
      steps: 4600,
      workoutType: 'Walking',
      duration: 25,
      calories: 190,
      water: 1.4,
      sleep: 7.8,
      notes: 'Light afternoon stroll.',
    },
    {
      dayOffset: -3,
      steps: 5800,
      workoutType: 'Cycling',
      duration: 30,
      calories: 310,
      water: 1.6,
      sleep: 8.2,
      notes: 'Stationary bike cardio.',
    },
    {
      dayOffset: -2,
      steps: 5100,
      workoutType: 'Walking',
      duration: 35,
      calories: 230,
      water: 1.5,
      sleep: 8.0,
      notes: 'Evening park walk with dog.',
    },
    {
      dayOffset: -1,
      steps: 4950,
      workoutType: 'Swimming',
      duration: 30,
      calories: 280,
      water: 1.7,
      sleep: 8.0,
      notes: 'Casual pool laps and relaxation.',
    },
    {
      dayOffset: 0,
      steps: 5000,
      workoutType: 'Walking',
      duration: 35,
      calories: 300,
      water: 1.5,
      sleep: 8.0,
      notes: 'Active commute and brisk walking.',
    },
  ];

  const source = isUserB ? samplesUserB : samplesUserA;

  return source.map((sample, index) => ({
    id: `act-${userId}-${index + 1}-${Date.now()}`,
    date: getDayOffsetDateString(sample.dayOffset),
    steps: sample.steps,
    workoutType: sample.workoutType,
    duration: sample.duration,
    calories: sample.calories,
    water: sample.water,
    sleep: sample.sleep,
    notes: sample.notes,
    createdAt: new Date(Date.now() - Math.abs(sample.dayOffset) * 86400000).toISOString(),
  }));
}

export function getStoredActivities(userId: string = 'default'): Activity[] {
  try {
    const key = getActivitiesKey(userId);
    const seededKey = getSeededKey(userId);
    const raw = localStorage.getItem(key);
    const hasSeeded = localStorage.getItem(seededKey);

    // Initial seed for demo users
    if (!raw && !hasSeeded) {
      // Demo users get distinct starting data
      if (userId === 'user_alex_01' || userId === 'user_sarah_02' || userId === 'default') {
        const initial = generateSampleActivities(userId);
        localStorage.setItem(key, JSON.stringify(initial));
        localStorage.setItem(seededKey, 'true');
        return initial;
      }
      // New custom signed-up users start clean
      localStorage.setItem(key, JSON.stringify([]));
      localStorage.setItem(seededKey, 'true');
      return [];
    }

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load activities from LocalStorage:', error);
    return [];
  }
}

export function saveActivityToStorage(
  activityData: Omit<Activity, 'id' | 'createdAt'>,
  userId: string = 'default'
): Activity {
  const current = getStoredActivities(userId);
  const newActivity: Activity = {
    ...activityData,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newActivity, ...current];
  localStorage.setItem(getActivitiesKey(userId), JSON.stringify(updated));
  localStorage.setItem(getSeededKey(userId), 'true');
  return newActivity;
}

export function updateActivityInStorage(
  id: string,
  updates: Partial<Omit<Activity, 'id' | 'createdAt'>>,
  userId: string = 'default'
): Activity | null {
  const current = getStoredActivities(userId);
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updatedActivity: Activity = {
    ...current[index],
    ...updates,
  };

  current[index] = updatedActivity;
  localStorage.setItem(getActivitiesKey(userId), JSON.stringify(current));
  return updatedActivity;
}

export function deleteActivityFromStorage(id: string, userId: string = 'default'): boolean {
  const current = getStoredActivities(userId);
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length === current.length) return false;

  localStorage.setItem(getActivitiesKey(userId), JSON.stringify(filtered));
  return true;
}

export function getStoredGoals(userId: string = 'default'): FitnessGoals {
  try {
    const key = getGoalsKey(userId);
    const raw = localStorage.getItem(key);
    const fallback = userId === 'user_sarah_02' ? USER_B_GOALS : DEFAULT_GOALS;

    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return {
      steps: parsed.steps || fallback.steps,
      calories: parsed.calories || fallback.calories,
      workoutDuration: parsed.workoutDuration || fallback.workoutDuration,
      water: parsed.water || fallback.water,
      sleep: parsed.sleep || fallback.sleep,
    };
  } catch (error) {
    console.error('Failed to load goals from LocalStorage:', error);
    return DEFAULT_GOALS;
  }
}

export function saveGoalsToStorage(goals: FitnessGoals, userId: string = 'default'): void {
  try {
    localStorage.setItem(getGoalsKey(userId), JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals to LocalStorage:', error);
  }
}

export function resetToDemoData(userId: string = 'default'): Activity[] {
  const samples = generateSampleActivities(userId);
  const goals = userId === 'user_sarah_02' ? USER_B_GOALS : DEFAULT_GOALS;
  localStorage.setItem(getActivitiesKey(userId), JSON.stringify(samples));
  localStorage.setItem(getGoalsKey(userId), JSON.stringify(goals));
  localStorage.setItem(getSeededKey(userId), 'true');
  return samples;
}

export function clearAllStoredActivities(userId: string = 'default'): void {
  localStorage.setItem(getActivitiesKey(userId), JSON.stringify([]));
  localStorage.setItem(getSeededKey(userId), 'true');
}
