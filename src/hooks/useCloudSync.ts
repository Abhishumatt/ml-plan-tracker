import { useCallback, useEffect, useRef, useState } from 'react';
import { createBackupPayload } from './usePlanStore';
import { pullFromGist, pushToGist } from '../lib/githubSync';
import { getGistId, getGithubPat, isCloudSyncEnabled, setLastSyncTime } from '../lib/syncConfig';
import type { AppState } from '../types';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export function useCloudSync(state: AppState, importState: (state: AppState) => void) {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const applyingRemote = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const pullRemote = useCallback(async () => {
    const pat = getGithubPat();
    const gistId = getGistId();
    if (!pat || !gistId) return;

    setStatus('syncing');
    setError(null);
    try {
      const remote = await pullFromGist(pat, gistId);
      const localExportedAt = createBackupPayload(stateRef.current).exportedAt;

      if (remote.exportedAt > localExportedAt) {
        applyingRemote.current = true;
        importState(remote.data);
        applyingRemote.current = false;
      }

      setLastSyncTime(new Date().toISOString());
      setStatus('synced');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
  }, [importState]);

  const pushRemote = useCallback(async () => {
    const pat = getGithubPat();
    const gistId = getGistId();
    if (!pat || !gistId) return;

    setStatus('syncing');
    setError(null);
    try {
      await pushToGist(pat, gistId, stateRef.current);
      setLastSyncTime(new Date().toISOString());
      setStatus('synced');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
  }, []);

  const syncNow = useCallback(async () => {
    const pat = getGithubPat();
    const gistId = getGistId();
    if (!pat || !gistId) return;

    setStatus('syncing');
    setError(null);
    try {
      const remote = await pullFromGist(pat, gistId);
      const localExportedAt = createBackupPayload(stateRef.current).exportedAt;

      if (remote.exportedAt > localExportedAt) {
        applyingRemote.current = true;
        importState(remote.data);
        applyingRemote.current = false;
      } else if (localExportedAt > remote.exportedAt) {
        await pushToGist(pat, gistId, stateRef.current);
      }

      setLastSyncTime(new Date().toISOString());
      setStatus('synced');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
  }, [importState]);

  useEffect(() => {
    if (!isCloudSyncEnabled()) return;
    void pullRemote();
  }, [pullRemote]);

  useEffect(() => {
    if (!isCloudSyncEnabled() || applyingRemote.current) return;

    const timer = window.setTimeout(() => {
      void pushRemote();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [state, pushRemote]);

  useEffect(() => {
    if (!isCloudSyncEnabled()) return;

    const onVisible = () => {
      if (document.visibilityState === 'visible') void pullRemote();
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [pullRemote]);

  return { status, error, syncNow, pullRemote, pushRemote };
}
