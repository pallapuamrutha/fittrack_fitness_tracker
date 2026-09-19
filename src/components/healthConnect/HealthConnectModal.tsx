import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  Footprints,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  ServerOff,
  Cpu,
  Trash2,
  FileCode2,
} from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const HealthConnectModal: React.FC = () => {
  const {
    isHealthConnectModalOpen,
    setHealthConnectModalOpen,
    healthConnectState,
    connectHealth,
    syncHealthData,
    revokeHealthPermissions,
    disconnectHealth,
    healthConnectDailySteps,
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'permission' | 'privacy' | 'bridge'>('permission');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isHealthConnectModalOpen) return null;

  const isConnected =
    healthConnectState.isConnected && healthConnectState.permissions.READ_STEPS === 'granted';
  const isDenied = healthConnectState.permissions.READ_STEPS === 'denied';
  const isRevoked = healthConnectState.permissions.READ_STEPS === 'revoked';
  const recordCount = Object.keys(healthConnectDailySteps).length;

  const handleGrant = async () => {
    setIsProcessing(true);
    await connectHealth('grant');
    setIsProcessing(false);
  };

  const handleDeny = async () => {
    setIsProcessing(true);
    await connectHealth('deny');
    setIsProcessing(false);
  };

  const handleRevoke = () => {
    revokeHealthPermissions();
  };

  const handleDisconnect = () => {
    disconnectHealth();
    setHealthConnectModalOpen(false);
  };

  const handleForceEmptySync = async () => {
    setIsProcessing(true);
    await syncHealthData(true);
    setIsProcessing(false);
  };

  const handlePopulatedSync = async () => {
    setIsProcessing(true);
    await syncHealthData(false);
    setIsProcessing(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="health-connect-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md">
              <Smartphone className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <h2 id="health-connect-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
                Android Health Connect Integration
              </h2>
              <p className="text-xs text-slate-400">
                Synchronize steps and physical activity from your Android device
              </p>
            </div>
          </div>

          <button
            onClick={() => setHealthConnectModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('permission')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'permission'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Permissions & Status
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Privacy & Security
          </button>
          <button
            onClick={() => setActiveTab('bridge')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'bridge'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Android Bridge & Architecture
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'permission' && (
            <div className="space-y-6">
              {/* Status Pill & Overview */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Connection State</span>
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Connected (READ_STEPS Granted)
                    </span>
                  ) : isDenied ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Permission Denied
                    </span>
                  ) : isRevoked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Permission Revoked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      <Info className="w-3.5 h-3.5" />
                      Not Linked
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">ENVIRONMENT</span>
                    <span className="text-white font-medium">
                      {healthConnectState.availability === 'AVAILABLE'
                        ? 'Android Native Health Connect'
                        : 'Web Preview / Simulation Mode'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">RECORDS LOADED</span>
                    <span className="text-white font-medium">{recordCount} daily step records</span>
                  </div>
                </div>
              </div>

              {/* Clear Permission Explanation (Why FitTrack needs this) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Why FitTrack Needs Step Access</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
                  FitTrack requests access to <strong>READ_STEPS</strong> so it can automatically read your
                  daily step count recorded by Android sensors and wearable devices (e.g. Pixel Watch, Galaxy Watch).
                  This eliminates manual step logging and provides accurate progress towards your daily step goals.
                </p>
              </div>

              {/* Minimal Permission Scope */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Requested Android Health Permissions
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Footprints className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">android.permission.health.READ_STEPS</div>
                        <div className="text-[11px] text-slate-400">Read daily aggregated step totals</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                        healthConnectState.permissions.READ_STEPS === 'granted'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : healthConnectState.permissions.READ_STEPS === 'denied'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {healthConnectState.permissions.READ_STEPS.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800/50 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400">READ_EXERCISE & READ_SLEEP</div>
                        <div className="text-[11px] text-slate-500">Reserved for Phase 2 & 3 (Not requested yet)</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                      Future Phase
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                {!isConnected ? (
                  <>
                    <button
                      onClick={handleGrant}
                      disabled={isProcessing}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>{isDenied || isRevoked ? 'Try Granting Again' : 'Grant Permission & Connect'}</span>
                    </button>

                    <button
                      onClick={handleDeny}
                      disabled={isProcessing}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
                    >
                      Deny Permission
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handlePopulatedSync}
                      disabled={isProcessing}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 stroke-[2.5] ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>Sync Latest Steps</span>
                    </button>

                    <button
                      onClick={handleRevoke}
                      disabled={isProcessing}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
                      title="Simulate permission revocation by user or system"
                    >
                      Revoke Permission
                    </button>

                    <button
                      onClick={handleDisconnect}
                      disabled={isProcessing}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                    >
                      Disconnect
                    </button>
                  </>
                )}
              </div>

              {/* Edge Case Testing & Empty State Simulation Panel */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Health Connect Test Harness & Edge Cases</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Requirement 12 & 13</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Quickly toggle edge case conditions to test UI reaction to zero records or permission changes:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleForceEmptySync}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:bg-slate-800 text-[11px]"
                  >
                    Simulate Empty Health Records (0 records)
                  </button>
                  <button
                    onClick={handlePopulatedSync}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-slate-800 text-[11px]"
                  >
                    Restore Synced Health Records (9,245 steps)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ServerOff className="w-4 h-4" />
                  <span>Local-First Health Data Processing</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  FitTrack takes health privacy seriously. We adhere to the following principles:
                </p>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                  <li>
                    <strong>Zero External Transmission</strong>: Your step counts and health metrics are processed
                    strictly on your local device. Nothing is uploaded to any external server or third-party analytics.
                  </li>
                  <li>
                    <strong>No Hardcoded Personal Data</strong>: All calculations use dynamic, aggregated daily
                    records read directly from the Health Connect API or local cache.
                  </li>
                  <li>
                    <strong>Granular Permission Control</strong>: You can revoke FitTrack's access at any time via this
                    screen or through the Android OS Health Connect permissions manager.
                  </li>
                  <li>
                    <strong>Immediate Unlinking</strong>: Disconnecting clears local Health Connect caches and restores
                    manual tracking without losing your manually logged workout records.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Clear Health Connect Cache</h4>
                  <p className="text-[11px] text-slate-400">Purge locally cached synchronized steps</p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Cache</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bridge' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <FileCode2 className="w-4 h-4" />
                  <span>Native Android Layer Specification</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Standard web browsers lack direct access to Android's native Health Connect API (`androidx.health.connect`).
                  To deploy FitTrack as a production Android app, compile this web frontend inside an <strong>Android WebView</strong> or <strong>Capacitor</strong> container with our provided bridge:
                </p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  <code>
                    {`// Native Bridge Interface in Kotlin:
class HealthConnectBridge(private val context: Context) {
  private val client = HealthConnectClient.getOrCreate(context)
  
  @JavascriptInterface
  fun checkPermission(permission: String): Boolean { ... }
  
  @JavascriptInterface
  fun getTodaySteps(): Long { ... }
  
  @JavascriptInterface
  fun getStepsHistory(start: String, end: String): String { ... }
}`}
                  </code>
                </div>

                <p className="text-[11px] text-slate-400">
                  The complete Kotlin bridge class and AndroidManifest.xml declarations are saved in the project's
                  <code className="text-slate-200 ml-1">/android</code> directory.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            FitTrack Android Health Connect v1.0 • Phase 1: Steps
          </span>
          <button
            onClick={() => setHealthConnectModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
