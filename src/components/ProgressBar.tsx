interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'bg-indigo-500',
  label,
  showPercent = true,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          {label && <span className="text-[var(--color-muted)]">{label}</span>}
          {showPercent && <span className="font-mono text-xs text-white">{pct}%</span>}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
