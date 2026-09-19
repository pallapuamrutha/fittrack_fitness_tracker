import type {
  AndroidHealthConnectBridge,
  DailyStepRecord,
  HealthConnectAvailability,
  HealthConnectPermission,
  HealthConnectSyncState,
  PermissionStatus,
} from '../types/healthConnect';
import { getDayOffsetDateString, getTodayDateString } from '../utils/formatters';

const STORAGE_KEYS = {
  HEALTH_CONNECT_STEPS: 'fittrack_health_connect_steps_v1',
  HEALTH_CONNECT_STATE: 'fittrack_health_connect_state_v1',
  SIMULATION_CONFIG: 'fittrack_health_connect_sim_v1',
};

const DEFAULT_SYNC_STATE: HealthConnectSyncState = {
  isConnected: false,
  availability: 'WEB_ENVIRONMENT',
  permissions: {
    READ_STEPS: 'not_requested',
    READ_EXERCISE: 'not_requested',
    READ_SLEEP: 'not_requested',
  },
  lastSyncTime: null,
  isSyncing: false,
  errorMessage: null,
  hasRecords: true,
};

/**
 * Generates initial realistic Health Connect step records (e.g. Sept 18: 9,245 steps, etc.)
 */
export function getSampleHealthConnectSteps(): Record<string, DailyStepRecord> {
  const stepsByOffset: Record<number, number> = {
    0: 9245, // Today
    1: 8120, // Yesterday
    2: 10450, // 2 days ago
    3: 7890, // 3 days ago
    4: 11340, // 4 days ago
    5: 8900, // 5 days ago
    6: 12500, // 6 days ago
  };

  const records: Record<string, DailyStepRecord> = {};
  for (const [offsetStr, steps] of Object.entries(stepsByOffset)) {
    const offset = -Number(offsetStr);
    const dateStr = getDayOffsetDateString(offset);
    records[dateStr] = {
      date: dateStr,
      steps,
      lastUpdated: new Date().toISOString(),
      source: 'health_connect',
      deviceName: 'Pixel Watch 2 / Android Phone',
    };
  }
  return records;
}

class HealthConnectService {
  private bridge: AndroidHealthConnectBridge | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.AndroidHealthConnect) {
      this.bridge = window.AndroidHealthConnect;
    }
  }

  public isNativeBridgeAvailable(): boolean {
    return Boolean(typeof window !== 'undefined' && window.AndroidHealthConnect);
  }

  public getSavedState(): HealthConnectSyncState {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_CONNECT_STATE);
      if (!raw) return { ...DEFAULT_SYNC_STATE };
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SYNC_STATE,
        ...parsed,
        availability: this.isNativeBridgeAvailable() ? 'AVAILABLE' : 'WEB_ENVIRONMENT',
      };
    } catch {
      return { ...DEFAULT_SYNC_STATE };
    }
  }

  public saveState(state: HealthConnectSyncState): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HEALTH_CONNECT_STATE, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save Health Connect state:', err);
    }
  }

  public getStoredDailySteps(): Record<string, DailyStepRecord> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_CONNECT_STEPS);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (err) {
      console.error('Failed to load Health Connect steps:', err);
      return {};
    }
  }

  public saveStoredDailySteps(steps: Record<string, DailyStepRecord>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HEALTH_CONNECT_STEPS, JSON.stringify(steps));
    } catch (err) {
      console.error('Failed to save Health Connect steps:', err);
    }
  }

  public async checkAvailability(): Promise<HealthConnectAvailability> {
    if (this.bridge) {
      try {
        const res = await Promise.resolve(this.bridge.checkAvailability());
        if (res === 'AVAILABLE') return 'AVAILABLE';
        if (res === 'NOT_INSTALLED') return 'NOT_INSTALLED';
        return 'NOT_SUPPORTED';
      } catch {
        return 'NOT_SUPPORTED';
      }
    }
    return 'WEB_ENVIRONMENT';
  }

  public async checkPermission(permission: HealthConnectPermission): Promise<PermissionStatus> {
    if (this.bridge) {
      try {
        const granted = await Promise.resolve(this.bridge.checkPermission(permission));
        return granted ? 'granted' : 'denied';
      } catch {
        return 'denied';
      }
    }
    const state = this.getSavedState();
    return state.permissions[permission] || 'not_requested';
  }

  public async requestPermission(
    permission: HealthConnectPermission,
    userAction: 'grant' | 'deny' = 'grant'
  ): Promise<PermissionStatus> {
    if (this.bridge) {
      try {
        const granted = await Promise.resolve(this.bridge.requestPermission(permission));
        const status: PermissionStatus = granted ? 'granted' : 'denied';
        const state = this.getSavedState();
        state.permissions[permission] = status;
        state.isConnected = status === 'granted';
        this.saveState(state);
        return status;
      } catch {
        return 'denied';
      }
    }

    // In Web environment, honor the user's action
    const status: PermissionStatus = userAction === 'grant' ? 'granted' : 'denied';
    const state = this.getSavedState();
    state.permissions[permission] = status;
    state.isConnected = status === 'granted';
    state.errorMessage = status === 'denied' ? 'Permission was denied by user.' : null;
    this.saveState(state);
    return status;
  }

  public revokePermission(permission: HealthConnectPermission): void {
    const state = this.getSavedState();
    state.permissions[permission] = 'revoked';
    state.isConnected = false;
    this.saveState(state);
    if (this.bridge?.revokePermissions) {
      try {
        this.bridge.revokePermissions();
      } catch (err) {
        console.error('Failed to revoke native permissions:', err);
      }
    }
  }

  /**
   * Reads today's aggregated steps and recent history from Health Connect
   */
  public async syncSteps(forceEmpty: boolean = false): Promise<{
    todaySteps: number;
    dailyRecords: Record<string, DailyStepRecord>;
    lastSyncTime: string;
  }> {
    const todayStr = getTodayDateString();

    if (this.bridge) {
      const todaySteps = await Promise.resolve(this.bridge.getTodaySteps());
      let dailyRecords: Record<string, DailyStepRecord> = {};

      if (this.bridge.getStepsHistory) {
        const weekAgoStr = getDayOffsetDateString(-7);
        const historyJson = await Promise.resolve(
          this.bridge.getStepsHistory(weekAgoStr, todayStr)
        );
        try {
          const arr = JSON.parse(historyJson);
          if (Array.isArray(arr)) {
            arr.forEach((r: DailyStepRecord) => {
              dailyRecords[r.date] = r;
            });
          }
        } catch {
          dailyRecords[todayStr] = {
            date: todayStr,
            steps: todaySteps,
            lastUpdated: new Date().toISOString(),
            source: 'health_connect',
          };
        }
      }

      const lastSyncTime = new Date().toISOString();
      this.saveStoredDailySteps(dailyRecords);
      const state = this.getSavedState();
      state.lastSyncTime = lastSyncTime;
      state.hasRecords = Object.keys(dailyRecords).length > 0;
      this.saveState(state);

      return { todaySteps, dailyRecords, lastSyncTime };
    }

    // Web Environment Sync (honors forceEmpty for testing empty states)
    const existing = this.getStoredDailySteps();
    let recordsToUse: Record<string, DailyStepRecord>;

    if (forceEmpty) {
      recordsToUse = {};
    } else if (Object.keys(existing).length > 0) {
      recordsToUse = { ...existing };
      // Keep today updated
      if (!recordsToUse[todayStr]) {
        recordsToUse[todayStr] = {
          date: todayStr,
          steps: 9245,
          lastUpdated: new Date().toISOString(),
          source: 'health_connect',
          deviceName: 'Android Device (Health Connect)',
        };
      }
    } else {
      recordsToUse = getSampleHealthConnectSteps();
    }

    const todaySteps = recordsToUse[todayStr]?.steps || 0;
    const lastSyncTime = new Date().toISOString();

    this.saveStoredDailySteps(recordsToUse);
    const state = this.getSavedState();
    state.lastSyncTime = lastSyncTime;
    state.hasRecords = Object.keys(recordsToUse).length > 0;
    this.saveState(state);

    return {
      todaySteps,
      dailyRecords: recordsToUse,
      lastSyncTime,
    };
  }

  public clearAllHealthConnectData(): void {
    localStorage.removeItem(STORAGE_KEYS.HEALTH_CONNECT_STEPS);
    const state = this.getSavedState();
    state.hasRecords = false;
    state.lastSyncTime = null;
    this.saveState(state);
  }
}

export const healthConnectService = new HealthConnectService();
