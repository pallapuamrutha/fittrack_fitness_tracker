import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../../types/fitness';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const config = {
          success: {
            icon: CheckCircle2,
            iconClass: 'text-emerald-400',
            borderClass: 'border-emerald-500/30',
            bgClass: 'bg-slate-900/95 shadow-emerald-950/30',
          },
          error: {
            icon: AlertCircle,
            iconClass: 'text-rose-400',
            borderClass: 'border-rose-500/30',
            bgClass: 'bg-slate-900/95 shadow-rose-950/30',
          },
          info: {
            icon: Info,
            iconClass: 'text-cyan-400',
            borderClass: 'border-cyan-500/30',
            bgClass: 'bg-slate-900/95 shadow-cyan-950/30',
          },
        }[toast.type];

        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${config.borderClass} ${config.bgClass} shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconClass}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
