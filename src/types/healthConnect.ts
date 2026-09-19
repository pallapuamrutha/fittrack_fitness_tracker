/**
 * Android Health Connect TypeScript Definitions
 * 
 * Supports Phase 1 (Steps), and prepares types for Phase 2 (Exercise) and Phase 3 (Sleep).
 */

export type HealthConnectPermission = 'READ_STEPS' | 'READ_EXERCISE' | 'READ_SLEEP';

export type PermissionStatus = 'not_requested' | 'granted' | 'denied' | 'revoked';

export type HealthConnectAvailability =
  | 'AVAILABLE'
  | 'NOT_INSTALLED'
  | 'NOT_SUPPORTED'
  | 'WEB_ENVIRONMENT';

export interface DailyStepRecord {
  date: string; // YYYY-MM-DD
  steps: number;
  lastUpdated: string; // ISO string
  source: 'health_connect' | 'manual';
  deviceName?: string;
}

export interface HealthConnectSyncState {
  isConnected: boolean;
  availability: HealthConnectAvailability;
  permissions: Record<HealthConnectPermission, PermissionStatus>;
  lastSyncTime: string | null; // ISO string or null
  isSyncing: boolean;
  errorMessage: string | null;
  hasRecords: boolean;
}

/**
 * Interface contract for the native Android bridge (`window.AndroidHealthConnect`).
 * Injected by an Android WebView (@JavascriptInterface) or Capacitor plugin.
 */
export interface AndroidHealthConnectBridge {
  checkAvailability: () => Promise<'AVAILABLE' | 'NOT_INSTALLED' | 'NOT_SUPPORTED'> | string;
  checkPermission: (permission: HealthConnectPermission) => Promise<boolean> | boolean;
  requestPermission: (permission: HealthConnectPermission) => Promise<boolean> | boolean;
  getTodaySteps: () => Promise<number> | number;
  getStepsHistory: (startDate: string, endDate: string) => Promise<string> | string; // JSON string of DailyStepRecord[]
  revokePermissions?: () => Promise<boolean> | boolean;
  openHealthConnectSettings?: () => void;
}

declare global {
  interface Window {
    AndroidHealthConnect?: AndroidHealthConnectBridge;
  }
}
