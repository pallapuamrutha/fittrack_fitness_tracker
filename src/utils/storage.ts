import type { Activity, FitnessGoals, WorkoutType } from '../types/fitness';
import { getDayOffsetDateString } from './formatters';

const STORAGE_KEYS = {
  ACTIVITIES: 'fittrack_activities_v1',
  GOALS: 'fittrack_goals_v1',
  SEEDED: 'fittrack_seeded_v1',
};

export const DEFAULT_GOALS: FitnessGoals = {
  steps: 10000,
  calories: 500,
  workoutDuration: 60,
  water: 3.0,
  sleep: 8.0,
};

export function generateSampleActivities(): Activity[] {
  const samples: Array<{
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
      steps: 8540,
      workoutType: 'Running',
      duration: 45,
      calories: 350,
      water: 2.0,
      sleep: 7.5,
      notes: 'Today morning interval run. Feeling focused and consistent!',
    },
  ];

  return samples.map((sample, index) => ({
    id: `sample-${index + 1}-${Date.now()}`,
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

export function getStoredActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const hasSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);

    if (!raw && !hasSeeded) {
      const initial = generateSampleActivities();
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initial));
      localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
      return initial;
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
  activityData: Omit<Activity, 'id' | 'createdAt'>
): Activity {
  const current = getStoredActivities();
  const newActivity: Activity = {
    ...activityData,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newActivity, ...current];
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
  localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  return newActivity;
}

export function updateActivityInStorage(
  id: string,
  updates: Partial<Omit<Activity, 'id' | 'createdAt'>>
): Activity | null {
  const current = getStoredActivities();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updatedActivity: Activity = {
    ...current[index],
    ...updates,
  };

  current[index] = updatedActivity;
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(current));
  return updatedActivity;
}

export function deleteActivityFromStorage(id: string): boolean {
  const current = getStoredActivities();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length === current.length) return false;

  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filtered));
  return true;
}

export function getStoredGoals(): FitnessGoals {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
      return DEFAULT_GOALS;
    }
    const parsed = JSON.parse(raw);
    return {
      steps: parsed.steps || DEFAULT_GOALS.steps,
      calories: parsed.calories || DEFAULT_GOALS.calories,
      workoutDuration: parsed.workoutDuration || DEFAULT_GOALS.workoutDuration,
      water: parsed.water || DEFAULT_GOALS.water,
      sleep: parsed.sleep || DEFAULT_GOALS.sleep,
    };
  } catch (error) {
    console.error('Failed to load goals from LocalStorage:', error);
    return DEFAULT_GOALS;
  }
}

export function saveGoalsToStorage(goals: FitnessGoals): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals to LocalStorage:', error);
  }
}

export function resetToDemoData(): Activity[] {
  const samples = generateSampleActivities();
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(samples));
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
  localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  return samples;
}

export function clearAllStoredActivities(): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
}
