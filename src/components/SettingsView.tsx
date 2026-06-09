import { useRef, useState } from 'react';
import type { AppState } from '../types';
import { downloadBackup, parseBackupPayload } from '../hooks/usePlanStore';
import { createSyncGist } from '../lib/githubSync';
import {
  PHONE_APP_URL,
  clearCloudSync,
  getGistId,
  getGithubPat,
  getLastSyncTime,
  isCloudSyncEnabled,
  setGistId,
  setGithubPat,
} from '../lib/syncConfig';

interface SettingsViewProps {
  state: AppState;
  startDate: string;
  setStartDate: (date: string) => void;
  importState: (state: AppState) => void;
  resetState: () => void;
  syncNow: () => Promise<void>;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  syncError: string | null;
}

export function SettingsView({
  state,
  startDate,
  setStartDate,
  importState,
  resetState,
  syncNow,
  syncStatus,
  syncError,
}: SettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [pat, setPat] = useState(getGithubPat);
  const [gistId, setGistIdLocal] = useState(getGistId);
  const [syncSetupMessage, setSyncSetupMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const savePat = () => {
    setGithubPat(pat);
    setSyncSetupMessage('Token saved on this device.');
  };

  const handleCreateSync = async () => {
    if (!pat.trim()) {
      setSyncSetupMessage('Paste your GitHub token first.');
      return;
    }
    setSyncSetupMessage('Creating private sync gist…');
    try {
      setGithubPat(pat);
      const id = await createSyncGist(pat, state);
      setGistId(id);
      setGistIdLocal(id);
      setSyncSetupMessage(`Cloud sync enabled. Gist ID: ${id}`);
      await syncNow();
    } catch (err) {
      setSyncSetupMessage(err instanceof Error ? err.message : 'Could not create sync gist.');
    }
  };

  const handleConnectGist = async () => {
    if (!pat.trim() || !gistId.trim()) {
      setSyncSetupMessage('Enter both token and Gist ID.');
      return;
    }
    setGithubPat(pat);
    setGistId(gistId);
    setSyncSetupMessage('Connected. Pulling latest data…');
    try {
      await syncNow();
      setSyncSetupMessage('Connected and synced.');
    } catch (err) {
      setSyncSetupMessage(err instanceof Error ? err.message : 'Could not connect.');
    }
  };

  const copyPhoneUrl = async () => {
    await navigator.clipboard.writeText(PHONE_APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lastSync = getLastSyncTime();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Set when you started (or plan to start) the 18-week sprint.
        </p>
      </header>

      <section className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
        <h2 className="text-sm font-medium text-indigo-300">Use on your phone</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Open this URL in Safari on your iPhone. Set up cloud sync below so Mac and phone share the same
          progress automatically.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <code className="rounded bg-[var(--color-surface-3)] px-2 py-1 text-xs text-indigo-200">
            {PHONE_APP_URL}
          </code>
          <button
            type="button"
            onClick={() => void copyPhoneUrl()}
            className="rounded-lg border border-indigo-500/40 px-3 py-1.5 text-xs text-indigo-300"
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--color-muted)]">
          <li>Create a GitHub token with <strong className="text-white">gist</strong> scope (see below).</li>
          <li>On your Mac: paste token → <strong className="text-white">Create cloud sync</strong>.</li>
          <li>On your phone: open the link above → Settings → paste same token + Gist ID → Connect.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <h2 className="text-sm font-medium text-white">Cloud sync (Mac ↔ phone)</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Stores progress in a private GitHub Gist. Changes sync within a few seconds. Create a token at{' '}
          <a
            href="https://github.com/settings/tokens/new?scopes=gist&description=ML%20Plan%20Tracker%20sync"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 underline"
          >
            github.com/settings/tokens
          </a>{' '}
          with <strong className="text-white">gist</strong> scope only.
        </p>

        <label className="mt-4 block text-sm">
          <span className="text-[var(--color-muted)]">GitHub token (gist scope)</span>
          <input
            type="password"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            placeholder="ghp_…"
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 font-mono text-sm text-white"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={savePat}
            className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-white"
          >
            Save token
          </button>
          <button
            type="button"
            onClick={() => void handleCreateSync()}
            className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-300"
          >
            Create cloud sync
          </button>
        </div>

        <label className="mt-4 block text-sm">
          <span className="text-[var(--color-muted)]">Gist ID (copy from Mac after creating sync)</span>
          <input
            type="text"
            value={gistId}
            onChange={(e) => setGistIdLocal(e.target.value)}
            placeholder="abc123def456…"
            className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 font-mono text-sm text-white"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleConnectGist()}
            className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-white"
          >
            Connect on this device
          </button>
          {isCloudSyncEnabled() && (
            <button
              type="button"
              onClick={() => void syncNow()}
              className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-300"
            >
              Sync now
            </button>
          )}
        </div>

        {isCloudSyncEnabled() && (
          <p className="mt-3 text-xs text-emerald-400">
            Sync active
            {syncStatus === 'syncing' && ' · syncing…'}
            {syncStatus === 'synced' && lastSync && ` · last sync ${new Date(lastSync).toLocaleString()}`}
            {syncStatus === 'error' && syncError && ` · ${syncError}`}
          </p>
        )}
        {syncSetupMessage && <p className="mt-2 text-sm text-[var(--color-muted)]">{syncSetupMessage}</p>}

        {isCloudSyncEnabled() && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Disconnect cloud sync on this device? Your gist is not deleted.')) {
                clearCloudSync();
                setPat('');
                setGistIdLocal('');
                setSyncSetupMessage('Cloud sync disconnected on this device.');
              }
            }}
            className="mt-4 text-xs text-[var(--color-muted)] underline"
          >
            Disconnect sync on this device
          </button>
        )}
      </section>

      <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <h2 className="text-sm font-medium text-emerald-300">Your data is safe on this device</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Progress saves automatically in your browser. A shutdown or restart does not delete it. Cloud sync
          keeps a second copy in your private GitHub Gist.
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
        <h2 className="text-sm font-medium text-white">Manual backup file</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Optional JSON export to iCloud Drive as an extra safety net.
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
      </section>

      <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <h2 className="text-sm font-medium text-red-300">Danger zone</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Reset all completion data on this device. This cannot be undone.
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
