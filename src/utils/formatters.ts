import type { WorkoutType } from '../types/fitness';

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}

export function formatDecimal(num: number, decimals: number = 1): string {
  return Number(num).toFixed(decimals);
}

export function formatDateString(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning! 👋';
  if (hour < 17) return 'Good Afternoon! ☀️';
  return 'Good Evening! 🌙';
}

export interface WorkoutMeta {
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const WORKOUT_TYPE_CONFIG: Record<WorkoutType, WorkoutMeta> = {
  Running: {
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  Walking: {
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
  Cycling: {
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  Gym: {
    color: '#8b5cf6',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  },
  Yoga: {
    color: '#ec4899',
    badgeBg: 'bg-pink-500/10',
    badgeText: 'text-pink-400',
    borderColor: 'border-pink-500/30',
  },
  Swimming: {
    color: '#0284c7',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400',
    borderColor: 'border-sky-500/30',
  },
  Sports: {
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  Other: {
    color: '#94a3b8',
    badgeBg: 'bg-slate-500/10',
    badgeText: 'text-slate-400',
    borderColor: 'border-slate-500/30',
  },
};
