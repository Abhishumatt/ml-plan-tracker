interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'default' | 'success' | 'warning' | 'accent';
}

const accentClasses = {
  default: 'text-white',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  accent: 'text-indigo-400',
};

export function MetricCard({ label, value, sub, accent = 'default' }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-semibold ${accentClasses[accent]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-[var(--color-muted)]">{sub}</p>}
    </div>
  );
}
