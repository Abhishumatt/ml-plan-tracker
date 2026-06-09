import { useCallback, useEffect, useState } from 'react';
import type { AppState, TaskCompletion } from '../types';
import { formatDate } from '../utils/planUtils';

const STORAGE_KEY = 'ml-plan-tracker-state';
const BACKUP_KEY = 'ml-plan-tracker-state-backup';
const EXPORT_VERSION = 1;

const defaultState = (): AppState => ({
  startDate: formatDate(new Date()),
  dayLogs: {},
  algorithmsDone: {},
  projectsDone: {},
  deliverablesDone: {},
  phase0Done: {},
});

function parseStoredState(raw: string): AppState | null {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.startDate !== 'string') return null;
    return { ...defaultState(), ...parsed };
  } catch {
    return null;
  }
}

function loadState(): AppState {
  const primary = localStorage.getItem(STORAGE_KEY);
  if (primary) {
    const state = parseStoredState(primary);
    if (state) return state;
  }

  const backup = localStorage.getItem(BACKUP_KEY);
  if (backup) {
    const state = parseStoredState(backup);
    if (state) {
      saveState(state);
      return state;
    }
  }

  return defaultState();
}

function saveState(state: AppState) {
  const serialized = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, serialized);
  localStorage.setItem(BACKUP_KEY, serialized);
}

export function createBackupPayload(state: AppState) {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'ml-plan-tracker',
    data: state,
  };
}

export function parseBackupPayload(raw: string): AppState {
  const parsed = JSON.parse(raw);
  const data = parsed?.data ?? parsed;
  const state = parseStoredState(JSON.stringify(data));
  if (!state) throw new Error('Invalid backup file');
  return state;
}

export function downloadBackup(state: AppState) {
  const payload = createBackupPayload(state);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ml-plan-tracker-backup-${state.startDate}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function usePlanStore() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setStartDate = useCallback((startDate: string) => {
    setState((s) => ({ ...s, startDate }));
  }, []);

  const toggleTask = useCallback((date: string, taskId: string, completed?: boolean) => {
    setState((s) => {
      const dayLog = s.dayLogs[date] ?? { date, tasks: {} };
      const current = dayLog.tasks[taskId]?.completed ?? false;
      const next = completed ?? !current;
      return {
        ...s,
        dayLogs: {
          ...s.dayLogs,
          [date]: {
            ...dayLog,
            tasks: {
              ...dayLog.tasks,
              [taskId]: { ...dayLog.tasks[taskId], completed: next },
            },
          },
        },
      };
    });
  }, []);

  const updateTask = useCallback((date: string, taskId: string, update: Partial<TaskCompletion>) => {
    setState((s) => {
      const dayLog = s.dayLogs[date] ?? { date, tasks: {} };
      return {
        ...s,
        dayLogs: {
          ...s.dayLogs,
          [date]: {
            ...dayLog,
            tasks: {
              ...dayLog.tasks,
              [taskId]: { ...dayLog.tasks[taskId], ...update },
            },
          },
        },
      };
    });
  }, []);

  const setDayMeta = useCallback(
    (date: string, meta: { studyMinutes?: number; projectMinutes?: number; dailyNote?: string }) => {
      setState((s) => {
        const dayLog = s.dayLogs[date] ?? { date, tasks: {} };
        return {
          ...s,
          dayLogs: {
            ...s.dayLogs,
            [date]: { ...dayLog, ...meta },
          },
        };
      });
    },
    [],
  );

  const toggleMapItem = useCallback(
    (key: 'algorithmsDone' | 'projectsDone' | 'deliverablesDone' | 'phase0Done', id: string) => {
      setState((s) => ({
        ...s,
        [key]: { ...s[key], [id]: !s[key][id] },
      }));
    },
    [],
  );

  const resetState = useCallback(() => {
    const fresh = defaultState();
    setState(fresh);
    saveState(fresh);
  }, []);

  const importState = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  return {
    state,
    setStartDate,
    toggleTask,
    updateTask,
    setDayMeta,
    toggleMapItem,
    resetState,
    importState,
  };
}
