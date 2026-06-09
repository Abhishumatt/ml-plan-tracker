interface SettingsViewProps {
  startDate: string;
  setStartDate: (date: string) => void;
  resetState: () => void;
}

export function SettingsView({ startDate, setStartDate, resetState }: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Set when you started (or plan to start) the 18-week sprint.
        </p>
      </header>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <label className="block text-sm">
          <span className="text-[var(--color-muted)]">Plan start date (Day 1)</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 w-full max-w-xs rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-white"
          />
        </label>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          The app calculates your current plan day from this date. All progress is saved locally in your browser.
        </p>
      </section>

      <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <h2 className="text-sm font-medium text-red-300">Danger zone</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Reset all completion data. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) {
              resetState();
            }
          }}
          className="mt-3 rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
        >
          Reset all progress
        </button>
      </section>
    </div>
  );
}
