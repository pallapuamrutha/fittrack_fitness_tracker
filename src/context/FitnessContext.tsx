import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type {
  Activity,
  FitnessGoals,
  NavigationTab,
  ToastMessage,
  TodayMetrics,
  WeeklyAnalytics,
} from '../types/fitness';
import type {
  DailyStepRecord,
  HealthConnectSyncState,
} from '../types/healthConnect';
import {
  calculateTodayMetrics,
  calculateWeeklyAnalytics,
  getWeeklyChartData,
} from '../utils/calculations';
import { getTodayDateString } from '../utils/formatters';
import { healthConnectService } from '../services/healthConnectService';
import {
  clearAllStoredActivities,
  deleteActivityFromStorage,
  getStoredActivities,
  getStoredGoals,
  resetToDemoData,
  saveActivityToStorage,
  saveGoalsToStorage,
  updateActivityInStorage,
} from '../utils/storage';
import { useAuth } from './AuthContext';

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

  // Health Connect Phase 1 Integrations
  healthConnectState: HealthConnectSyncState;
  healthConnectDailySteps: Record<string, DailyStepRecord>;
  isHealthConnectModalOpen: boolean;
  setHealthConnectModalOpen: (open: boolean) => void;
  connectHealth: (action?: 'grant' | 'deny') => Promise<boolean>;
  syncHealthData: (forceEmpty?: boolean) => Promise<void>;
  revokeHealthPermissions: () => void;
  disconnectHealth: () => void;

  // Manual Water quick-log helper
  quickAddWater: (amountLiters: number) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'default';

  const [activities, setActivities] = useState<Activity[]>(() => getStoredActivities(userId));
  const [goals, setGoals] = useState<FitnessGoals>(() => getStoredGoals(userId));
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Sync state with active user
  useEffect(() => {
    setActivities(getStoredActivities(userId));
    setGoals(getStoredGoals(userId));
    setEditingActivity(null);
  }, [userId]);

  // Health Connect state
  const [healthConnectState, setHealthConnectState] = useState<HealthConnectSyncState>(() =>
    healthConnectService.getSavedState()
  );
  const [healthConnectDailySteps, setHealthConnectDailySteps] = useState<Record<string, DailyStepRecord>>(
    () => healthConnectService.getStoredDailySteps()
  );
  const [isHealthConnectModalOpen, setHealthConnectModalOpen] = useState<boolean>(false);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync health data handler
  const syncHealthData = useCallback(
    async (forceEmpty: boolean = false): Promise<void> => {
      setHealthConnectState((prev) => ({ ...prev, isSyncing: true }));
      try {
        const result = await healthConnectService.syncSteps(forceEmpty);
        setHealthConnectDailySteps(result.dailyRecords);
        const updatedState = healthConnectService.getSavedState();
        setHealthConnectState({ ...updatedState, isSyncing: false });
        if (forceEmpty || Object.keys(result.dailyRecords).length === 0) {
          showToast('info', 'Health Connect Synced', '0 step records found in Health Connect.');
        } else {
          showToast(
            'success',
            'Health Data Synchronized',
            `Synced today's steps (${result.todaySteps.toLocaleString()}) via Health Connect.`
          );
        }
      } catch (err: any) {
        setHealthConnectState((prev) => ({
          ...prev,
          isSyncing: false,
          errorMessage: err?.message || 'Sync failed',
        }));
        showToast('error', 'Health Connect Sync Error', err?.message || 'Failed to sync health data.');
      }
    },
    [showToast]
  );

  // Connect & request permissions
  const connectHealth = async (action: 'grant' | 'deny' = 'grant'): Promise<boolean> => {
    try {
      const status = await healthConnectService.requestPermission('READ_STEPS', action);
      const updatedState = healthConnectService.getSavedState();
      setHealthConnectState(updatedState);

      if (status === 'granted') {
        showToast('success', 'Health Connect Connected', 'READ_STEPS permission granted.');
        await syncHealthData(false);
        return true;
      } else {
        showToast('error', 'Permission Denied', 'FitTrack cannot sync steps without READ_STEPS permission.');
        return false;
      }
    } catch (err: any) {
      showToast('error', 'Connection Error', err?.message || 'Failed to connect to Health Connect.');
      return false;
    }
  };

  const revokeHealthPermissions = () => {
    healthConnectService.revokePermission('READ_STEPS');
    const updatedState = healthConnectService.getSavedState();
    setHealthConnectState(updatedState);
    showToast('info', 'Permissions Revoked', 'Health Connect READ_STEPS access has been revoked.');
  };

  const disconnectHealth = () => {
    healthConnectService.revokePermission('READ_STEPS');
    healthConnectService.clearAllHealthConnectData();
    const updatedState = healthConnectService.getSavedState();
    setHealthConnectState(updatedState);
    setHealthConnectDailySteps({});
    showToast('info', 'Health Connect Disconnected', 'Health Connect steps unlinked. Reverted to manual records.');
  };

  // Check initial availability on mount
  useEffect(() => {
    healthConnectService.checkAvailability().then((avail) => {
      setHealthConnectState((prev) => ({ ...prev, availability: avail }));
    });
  }, []);

  const addActivity = (data: Omit<Activity, 'id' | 'createdAt'>): Activity => {
    const newActivity = saveActivityToStorage(data, userId);
    setActivities((prev) => [newActivity, ...prev]);
    showToast('success', 'Activity Logged!', `Successfully recorded ${data.workoutType} activity.`);
    return newActivity;
  };

  const editActivity = (
    id: string,
    updates: Partial<Omit<Activity, 'id' | 'createdAt'>>
  ): boolean => {
    const updated = updateActivityInStorage(id, updates, userId);
    if (updated) {
      setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('success', 'Activity Updated', 'Your workout details have been saved.');
      return true;
    }
    showToast('error', 'Update Failed', 'Could not find activity to update.');
    return false;
  };

  const removeActivity = (id: string): boolean => {
    const success = deleteActivityFromStorage(id, userId);
    if (success) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      showToast('info', 'Activity Deleted', 'The activity record has been removed.');
      return true;
    }
    showToast('error', 'Error', 'Failed to delete activity.');
    return false;
  };

  const updateGoals = (newGoals: FitnessGoals) => {
    saveGoalsToStorage(newGoals, userId);
    setGoals(newGoals);
    showToast('success', 'Goals Updated', 'Your daily fitness targets have been updated.');
  };

  const resetSampleData = () => {
    const data = resetToDemoData(userId);
    setActivities(data);
    setGoals(getStoredGoals(userId));
    showToast('info', 'Demo Data Restored', '7 days of sample fitness activities loaded.');
  };

  const clearAllData = () => {
    clearAllStoredActivities(userId);
    setActivities([]);
    showToast('info', 'Data Cleared', 'All fitness records have been cleared.');
  };

  // Water quick-add: adds specified liters (e.g. 0.25, 0.5, 0.75) to today's hydration
  const quickAddWater = (amountLiters: number) => {
    const todayStr = getTodayDateString();
    const todayActs = activities.filter((a) => a.date === todayStr);

    if (todayActs.length > 0) {
      const targetAct = todayActs[0];
      const newWater = Math.round(((targetAct.water || 0) + amountLiters) * 10) / 10;
      editActivity(targetAct.id, { water: newWater });
    } else {
      addActivity({
        date: todayStr,
        steps: 0,
        workoutType: 'Other',
        duration: 0,
        calories: 0,
        water: amountLiters,
        sleep: 0,
        notes: 'Hydration log',
      });
    }
  };

  // Synchronized steps map for weekly chart
  const hcDailyStepsMap = useMemo(() => {
    if (!healthConnectState.isConnected || healthConnectState.permissions.READ_STEPS !== 'granted') {
      return undefined;
    }
    const map: Record<string, number> = {};
    for (const [date, rec] of Object.entries(healthConnectDailySteps)) {
      map[date] = rec.steps;
    }
    return map;
  }, [healthConnectState.isConnected, healthConnectState.permissions.READ_STEPS, healthConnectDailySteps]);

  // Today's steps from Health Connect (if active and granted)
  const todayDateStr = getTodayDateString();
  const todayHcSteps = useMemo(() => {
    if (
      healthConnectState.isConnected &&
      healthConnectState.permissions.READ_STEPS === 'granted' &&
      healthConnectDailySteps[todayDateStr]
    ) {
      return healthConnectDailySteps[todayDateStr].steps;
    }
    return null;
  }, [
    healthConnectState.isConnected,
    healthConnectState.permissions.READ_STEPS,
    healthConnectDailySteps,
    todayDateStr,
  ]);

  const todayMetrics = useMemo(
    () => calculateTodayMetrics(activities, goals, todayHcSteps),
    [activities, goals, todayHcSteps]
  );

  const weeklyChartData = useMemo(
    () => getWeeklyChartData(activities, hcDailyStepsMap),
    [activities, hcDailyStepsMap]
  );

  const weeklyAnalytics = useMemo(
    () => calculateWeeklyAnalytics(activities, goals, hcDailyStepsMap),
    [activities, goals, hcDailyStepsMap]
  );

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
        healthConnectState,
        healthConnectDailySteps,
        isHealthConnectModalOpen,
        setHealthConnectModalOpen,
        connectHealth,
        syncHealthData,
        revokeHealthPermissions,
        disconnectHealth,
        quickAddWater,
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
