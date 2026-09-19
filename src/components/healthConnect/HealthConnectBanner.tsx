import React from 'react';
import { Smartphone, RefreshCw, CheckCircle2, AlertCircle, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const HealthConnectBanner: React.FC = () => {
  const {
    healthConnectState,
    syncHealthData,
    setHealthConnectModalOpen,
    healthConnectDailySteps,
  } = useFitness();

  const isConnected = healthConnectState.isConnected && healthConnectState.permissions.READ_STEPS === 'granted';
  const isDenied = healthConnectState.permissions.READ_STEPS === 'denied';
  const isRevoked = healthConnectState.permissions.READ_STEPS === 'revoked';
  const isSyncing = healthConnectState.isSyncing;
  const recordCount = Object.keys(healthConnectDailySteps).length;

  const formatLastSync = (isoString: string | null) => {
    if (!isoString) return 'Not yet synced';
    const date = new Date(isoString);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 relative overflow-hidden ${
        isConnected
          ? 'glass-panel border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/90 to-cyan-950/20 shadow-lg shadow-emerald-950/20'
          : isDenied || isRevoked
          ? 'glass-panel border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900/90'
          : 'glass-panel border-slate-800 bg-gradient-to-r from-slate-900/90 to-slate-950/80'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Health Connect Branding & Status */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              isConnected
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : isDenied || isRevoked
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-cyan-400'
            }`}
          >
            <Smartphone className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Android Health Connect
              </h3>

              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected & Synced
                </span>
              ) : isDenied ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Permission Denied
                </span>
              ) : isRevoked ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Permission Revoked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ready to Link
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {isConnected ? (
                <>
                  Synchronizing daily step data automatically.{' '}
                  <span className="text-slate-300 font-medium">
                    Last sync: {formatLastSync(healthConnectState.lastSyncTime)}
                  </span>
                  {recordCount === 0 && (
                    <span className="text-amber-400 ml-1.5 font-medium">(0 records available)</span>
                  )}
                </>
              ) : isDenied ? (
                'Permission to read steps was denied. Grant permission to automatically import steps.'
              ) : isRevoked ? (
                'Health Connect permissions were revoked. Reconnect to resume automatic step sync.'
              ) : (
                'Connect to Android Health Connect to automatically sync your steps without manual logging.'
              )}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          {isConnected && (
            <button
              id="sync-health-data-btn"
              onClick={() => syncHealthData(false)}
              disabled={isSyncing}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                isSyncing
                  ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800 hover:border-emerald-500/40 active:scale-95'
              }`}
              title="Sync health data from Health Connect"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Health Data'}</span>
            </button>
          )}

          <button
            id="open-health-connect-modal-btn"
            onClick={() => setHealthConnectModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isConnected
                ? 'bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:from-emerald-300 hover:to-teal-300 shadow-emerald-500/20'
            }`}
          >
            <span>{isConnected ? 'Manage Health Connect' : 'Connect Health'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
};
