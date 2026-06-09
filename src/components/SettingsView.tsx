import { useRef, useState } from 'react';
import type { AppState } from '../types';
import { downloadBackup, parseBackupPayload } from '../hooks/usePlanStore';

interface SettingsViewProps {
  state: AppState;
  startDate: string;
  setStartDate: (date: string) => void;
  importState: (state: AppState) => void;
  resetState: () => void;
}

export function SettingsView({ state, startDate, setStartDate, importState, resetState }: SettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const restored = parseBackupPayload(text);
      importState(restored);
      setImportMessage(`Restored backup from ${restored.startDate}.`);
    } catch {
      setImportMessage('Could not read that file. Use a backup exported from this app.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Set when you started (or plan to start) the 18-week sprint.
        </p>
      </header>

      <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <h2 className="text-sm font-medium text-emerald-300">Your data is safe on this Mac</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Progress saves automatically to your browser every time you check something off. A Mac shutdown,
          restart, or closing Safari does <strong className="text-white">not</strong> delete it.
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          You only lose data if you clear Safari website data, use a different browser/machine without
          restoring a backup, or hit Reset below.
        </p>
      </section>

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
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <h2 className="text-sm font-medium text-white">Backup & restore</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Export a JSON file to iCloud Drive, Google Drive, or email. Restore it on this Mac or another
          machine after cloning the repo.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadBackup(state)}
            className="rounded-lg bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-500/30"
          >
            Export backup
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-white hover:border-indigo-500/50"
          >
            Import backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.target.value = '';
            }}
          />
        </div>
        {importMessage && <p className="mt-3 text-sm text-emerald-400">{importMessage}</p>}
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Tip: export once a week (or after a big day) so you always have a copy outside the browser.
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
