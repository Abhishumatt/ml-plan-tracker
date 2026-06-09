import { useCallback, useEffect, useState } from 'react';
import type { AppState, TaskCompletion } from '../types';
import { formatDate } from '../utils/planUtils';

const STORAGE_KEY = 'ml-plan-tracker-state';

const defaultState = (): AppState => ({
  startDate: formatDate(new Date()),
  dayLogs: {},
  algorithmsDone: {},
  projectsDone: {},
  deliverablesDone: {},
  phase0Done: {},
});

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultState();
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  return {
    state,
    setStartDate,
    toggleTask,
    updateTask,
    setDayMeta,
    toggleMapItem,
    resetState,
  };
}
