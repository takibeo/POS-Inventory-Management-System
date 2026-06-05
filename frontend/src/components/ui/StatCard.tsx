type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: 'up' | 'down' | 'neutral';
};

const trendColors = {
  up: 'text-emerald-600',
  down: 'text-red-600',
  neutral: 'text-slate-500',
};

export default function StatCard({ label, value, hint, trend = 'neutral' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {hint && <p className={`mt-1 text-xs ${trendColors[trend]}`}>{hint}</p>}
    </div>
  );
}
