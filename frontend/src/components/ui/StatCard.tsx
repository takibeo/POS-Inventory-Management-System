import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  isLoading?: boolean;
};

const trendColors = {
  up: 'text-emerald-600',
  down: 'text-red-600',
  neutral: 'text-slate-500',
};

const trendIcons = {
  up: '↑',
  down: '↓',
  neutral: '',
};

export default function StatCard({
                                   label,
                                   value,
                                   hint,
                                   trend = 'neutral',
                                   icon,
                                   isLoading = false,
                                 }: StatCardProps) {
  if (isLoading) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-32 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
        </div>
    );
  }

  return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm
      transition hover:shadow-md">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl
            bg-slate-100 text-slate-600">
            {icon}
          </span>
          )}
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        {hint && (
            <p className={`mt-1 flex items-center gap-1 text-xs ${trendColors[trend]}`}>
              {trendIcons[trend] && <span>{trendIcons[trend]}</span>}
              {hint}
            </p>
        )}
      </div>
  );
}