import { OUTREACH_TARGETS } from '../data/plan';
import type { AppState } from '../types';
import { getWeekPlan } from '../data/plan';
import {
  getActiveOutreachTargets,
  getActiveRoutineItems,
  getPlanDay,
  getStudyDayForPlanDay,
  getWeekNumber,
  taskIdForOutreach,
  taskIdForRoutine,
  taskIdForStudy,
} from '../utils/planUtils';
import { ProgressBar } from './ProgressBar';

interface TodayViewProps {
  state: AppState;
  toggleTask: (date: string, taskId: string) => void;
  updateTask: (date: string, taskId: string, update: { completed?: boolean; actual?: number; notes?: string }) => void;
  setDayMeta: (date: string, meta: { studyMinutes?: number; projectMinutes?: number; dailyNote?: string }) => void;
}

const trackBadge: Record<string, string> = {
  A: 'bg-indigo-500/20 text-indigo-300',
  B: 'bg-emerald-500/20 text-emerald-300',
  C: 'bg-pink-500/20 text-pink-300',
};

export function TodayView({ state, toggleTask, updateTask, setDayMeta }: TodayViewProps) {
  const today = new Date();
  const date = today.toISOString().slice(0, 10);
  const planDay = getPlanDay(state.startDate, today);
  const week = getWeekNumber(planDay);
  const weekPlan = getWeekPlan(week);
  const studyDay = getStudyDayForPlanDay(planDay);
  const routine = getActiveRoutineItems(week);
  const outreach = getActiveOutreachTargets(week).filter((t) => t.id !== 'outreach-cold-email');
  const dayLog = state.dayLogs[date];

  const routineDone = routine.filter((r) => dayLog?.tasks[taskIdForRoutine(r.id, date)]?.completed).length;
  const studyDone = studyDay ? !!dayLog?.tasks[taskIdForStudy(date)]?.completed : true;
  const outreachDone = outreach.filter((o) => dayLog?.tasks[taskIdForOutreach(o.id, date)]?.completed).length;
  const totalTasks = routine.length + (studyDay ? 1 : 0) + outreach.length;
  const doneTasks = routineDone + (studyDone ? 1 : 0) + outreachDone;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-[var(--color-muted)]">Today · Plan Day {planDay}</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          {studyDay ? studyDay.topic : weekPlan?.title ?? 'Rest / Catch-up Day'}
        </h1>
        {studyDay && <p className="mt-2 text-sm text-[var(--color-muted)]">{studyDay.goal}</p>}
      </header>

      <ProgressBar
        label="Today's progress"
        value={doneTasks}
        max={totalTasks || 1}
        color="bg-indigo-500"
      />

      {studyDay && (
        <section className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="rounded px-2 py-0.5 text-xs font-medium bg-indigo-500/20 text-indigo-300">
                Track A · Day {studyDay.day}
              </span>
              <h2 className="mt-2 font-medium text-white">{studyDay.topic}</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{studyDay.goal}</p>
              <p className="mt-2 text-xs text-[var(--color-muted)]">Source: {studyDay.source}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleTask(date, taskIdForStudy(date))}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dayLog?.tasks[taskIdForStudy(date)]?.completed
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-[var(--color-surface-3)] text-white hover:bg-indigo-500/20'
              }`}
            >
              {dayLog?.tasks[taskIdForStudy(date)]?.completed ? 'Done ✓' : 'Mark done'}
            </button>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">Daily Routine</h2>
        <div className="space-y-2">
          {routine.map((item) => {
            const taskId = taskIdForRoutine(item.id, date);
            const done = !!dayLog?.tasks[taskId]?.completed;
            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  done
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-indigo-500/30'
                }`}
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleTask(date, taskId)}
                  className="h-4 w-4 rounded border-[var(--color-border)] accent-indigo-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${trackBadge[item.track]}`}>
                      {item.track}
                    </span>
                    <span className={`text-sm ${done ? 'text-[var(--color-muted)] line-through' : 'text-white'}`}>
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">{item.durationMin} min</p>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">Outreach Targets</h2>
        <div className="space-y-2">
          {outreach.map((target) => {
            const taskId = taskIdForOutreach(target.id, date);
            const task = dayLog?.tasks[taskId];
            const actual = task?.actual ?? 0;
            const done = !!task?.completed;
            return (
              <div
                key={target.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{target.label}</span>
                  <span className="text-xs text-[var(--color-muted)]">target: {target.dailyTarget}/day</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    value={actual}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      updateTask(date, taskId, {
                        actual: val,
                        completed: val >= target.dailyTarget,
                      });
                    }}
                    className="w-20 rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] px-2 py-1 font-mono text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateTask(date, taskId, {
                        actual: target.dailyTarget,
                        completed: true,
                      })
                    }
                    className={`rounded px-3 py-1 text-xs font-medium ${
                      done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-pink-500/20 text-pink-300'
                    }`}
                  >
                    {done ? 'Target hit ✓' : 'Hit target'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {week >= 8 && (
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Cold email weekly target: {OUTREACH_TARGETS.find((t) => t.id === 'outreach-cold-email')?.dailyTarget}/week
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <h2 className="mb-3 text-sm font-medium text-white">Time & Notes</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="text-[var(--color-muted)]">Study minutes</span>
            <input
              type="number"
              min={0}
              value={dayLog?.studyMinutes ?? ''}
              onChange={(e) => setDayMeta(date, { studyMinutes: parseInt(e.target.value, 10) || 0 })}
              placeholder="90"
              className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 font-mono text-white"
            />
          </label>
          <label className="text-sm">
            <span className="text-[var(--color-muted)]">Project minutes</span>
            <input
              type="number"
              min={0}
              value={dayLog?.projectMinutes ?? ''}
              onChange={(e) => setDayMeta(date, { projectMinutes: parseInt(e.target.value, 10) || 0 })}
              placeholder="60"
              className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 font-mono text-white"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm">
          <span className="text-[var(--color-muted)]">What confused me today (one sentence)</span>
          <textarea
            value={dayLog?.dailyNote ?? ''}
            onChange={(e) => setDayMeta(date, { dailyNote: e.target.value })}
            rows={2}
            placeholder="e.g. Still fuzzy on broadcasting rules for 3D arrays..."
            className="mt-1 w-full resize-none rounded border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-2 text-white placeholder:text-[var(--color-muted)]"
          />
        </label>
      </section>

      {weekPlan?.stopAndCheck && (
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h2 className="text-sm font-medium text-amber-300">Stop-and-check (end of week)</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{weekPlan.stopAndCheck}</p>
        </section>
      )}
    </div>
  );
}
