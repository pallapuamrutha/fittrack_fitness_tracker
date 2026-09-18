import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type {
  Activity,
  FitnessGoals,
  NavigationTab,
  ToastMessage,
  TodayMetrics,
  WeeklyAnalytics,
} from '../types/fitness';
import {
  calculateTodayMetrics,
  calculateWeeklyAnalytics,
  getWeeklyChartData,
} from '../utils/calculations';
import {
  clearAllStoredActivities,
  DEFAULT_GOALS,
  deleteActivityFromStorage,
  getStoredActivities,
  getStoredGoals,
  resetToDemoData,
  saveActivityToStorage,
  saveGoalsToStorage,
  updateActivityInStorage,
} from '../utils/storage';

interface FitnessContextType {
  activities: Activity[];
  goals: FitnessGoals;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  todayMetrics: TodayMetrics;
  weeklyChartData: ReturnType<typeof getWeeklyChartData>;
  weeklyAnalytics: WeeklyAnalytics;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Activity;
  editActivity: (id: string, updates: Partial<Omit<Activity, 'id' | 'createdAt'>>) => boolean;
  removeActivity: (id: string) => boolean;
  updateGoals: (goals: FitnessGoals) => void;
  resetSampleData: () => void;
  clearAllData: () => void;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
  editingActivity: Activity | null;
  setEditingActivity: (activity: Activity | null) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => getStoredActivities());
  const [goals, setGoals] = useState<FitnessGoals>(() => getStoredGoals());
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    // Initial sync complete
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (data: Omit<Activity, 'id' | 'createdAt'>): Activity => {
    const newActivity = saveActivityToStorage(data);
    setActivities((prev) => [newActivity, ...prev]);
    showToast('success', 'Activity Logged!', `Successfully recorded ${data.workoutType} activity.`);
    return newActivity;
  };

  const editActivity = (
    id: string,
    updates: Partial<Omit<Activity, 'id' | 'createdAt'>>
  ): boolean => {
    const updated = updateActivityInStorage(id, updates);
    if (updated) {
      setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('success', 'Activity Updated', 'Your workout details have been saved.');
      return true;
    }
    showToast('error', 'Update Failed', 'Could not find activity to update.');
    return false;
  };

  const removeActivity = (id: string): boolean => {
    const success = deleteActivityFromStorage(id);
    if (success) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      showToast('info', 'Activity Deleted', 'The activity record has been removed.');
      return true;
    }
    showToast('error', 'Error', 'Failed to delete activity.');
    return false;
  };

  const updateGoals = (newGoals: FitnessGoals) => {
    saveGoalsToStorage(newGoals);
    setGoals(newGoals);
    showToast('success', 'Goals Updated', 'Your daily fitness targets have been updated.');
  };

  const resetSampleData = () => {
    const data = resetToDemoData();
    setActivities(data);
    setGoals(DEFAULT_GOALS);
    showToast('info', 'Demo Data Restored', '7 days of sample fitness activities loaded.');
  };

  const clearAllData = () => {
    clearAllStoredActivities();
    setActivities([]);
    showToast('info', 'Data Cleared', 'All fitness records have been cleared.');
  };

  const todayMetrics = useMemo(() => calculateTodayMetrics(activities, goals), [activities, goals]);
  const weeklyChartData = useMemo(() => getWeeklyChartData(activities), [activities]);
  const weeklyAnalytics = useMemo(() => calculateWeeklyAnalytics(activities, goals), [activities, goals]);

  return (
    <FitnessContext.Provider
      value={{
        activities,
        goals,
        activeTab,
        setActiveTab,
        todayMetrics,
        weeklyChartData,
        weeklyAnalytics,
        addActivity,
        editActivity,
        removeActivity,
        updateGoals,
        resetSampleData,
        clearAllData,
        toasts,
        showToast,
        removeToast,
        editingActivity,
        setEditingActivity,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export function useFitness(): FitnessContextType {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}
