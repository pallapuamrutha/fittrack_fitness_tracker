import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-sm py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">FitTrack</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">Track. Improve. Stay Consistent.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Browser LocalStorage Encrypted & Private</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>React + TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
