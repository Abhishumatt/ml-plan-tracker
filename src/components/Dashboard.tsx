import { ALGORITHMS, OUTREACH_TARGETS, PROJECTS } from '../data/plan';
import type { AppState } from '../types';
import { getL0Metrics, getRecentHistory } from '../utils/planUtils';
import { MetricCard } from './MetricCard';
import { ProgressBar } from './ProgressBar';

interface DashboardProps {
  state: AppState;
}

const trackColors = {
  A: 'bg-indigo-500',
  B: 'bg-emerald-500',
  C: 'bg-pink-500',
};

const trackLabels = {
  A: 'Track A — Study',
  B: 'Track B — Projects',
  C: 'Track C — Outreach',
};

export function Dashboard({ state }: DashboardProps) {
  const metrics = getL0Metrics(state);
  const history = getRecentHistory(state, state.startDate);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-[var(--color-muted)]">{metrics.phase}</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          Week {metrics.week}: {metrics.weekTitle}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Day {metrics.planDay} of {metrics.totalDays} · {metrics.date}
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          L0 Metrics
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard label="Today" value={`${metrics.todayCompletion}%`} accent="accent" sub="completion" />
          <MetricCard label="This Week" value={`${metrics.weekCompletion}%`} sub="7-day rollup" />
          <MetricCard label="Streak" value={metrics.streak} accent="success" sub="days ≥70% done" />
          <MetricCard
            label="Plan Progress"
            value={`${Math.round((metrics.planDay / metrics.totalDays) * 100)}%`}
            sub={`${metrics.planDay}/${metrics.totalDays} days`}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h3 className="mb-4 text-sm font-medium text-white">Track Completion (This Week)</h3>
          <div className="space-y-4">
            {(['A', 'B', 'C'] as const).map((track) => {
              const { done, total } = metrics.tracks[track];
              return (
                <ProgressBar
                  key={track}
                  label={trackLabels[track]}
                  value={done}
                  max={total || 1}
                  color={trackColors[track]}
                />
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h3 className="mb-4 text-sm font-medium text-white">Outreach This Week</h3>
          <div className="space-y-3">
            {OUTREACH_TARGETS.filter((t) => metrics.outreach[t.id]).map((target) => {
              const { actual, target: tgt } = metrics.outreach[target.id];
              return (
                <div key={target.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-muted)]">{target.label}</span>
                  <span className="font-mono text-white">
                    {actual}
                    <span className="text-[var(--color-muted)]"> / {tgt}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Milestone Progress
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricCard
            label="Algorithms"
            value={`${metrics.algorithmsDone}/${metrics.algorithmsTotal}`}
            sub="from scratch"
          />
          <MetricCard label="Projects" value={`${metrics.projectsDone}/${metrics.projectsTotal}`} sub="deployed" />
          <MetricCard
            label="Week Deliverables"
            value={`${metrics.deliverablesDone}/${metrics.deliverablesTotal}`}
            accent={metrics.deliverablesDone === metrics.deliverablesTotal && metrics.deliverablesTotal > 0 ? 'success' : 'default'}
          />
          <MetricCard label="Phase 0 Setup" value={`${metrics.phase0Done}/${metrics.phase0Total}`} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h3 className="mb-3 text-sm font-medium text-white">Today's Time Logged</h3>
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-mono font-semibold text-indigo-400">{metrics.studyMinutesToday}</p>
              <p className="text-xs text-[var(--color-muted)]">study min (target 90)</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-emerald-400">{metrics.projectMinutesToday}</p>
              <p className="text-xs text-[var(--color-muted)]">project min (target 60)</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h3 className="mb-3 text-sm font-medium text-white">14-Day Completion Trend</h3>
          <div className="flex h-20 items-end gap-1">
            {history.map((day) => (
              <div key={day.date} className="group flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-colors"
                  style={{
                    height: `${Math.max(4, day.completion)}%`,
                    backgroundColor:
                      day.completion >= 70
                        ? 'var(--color-success)'
                        : day.completion >= 40
                          ? 'var(--color-warning)'
                          : 'var(--color-danger)',
                    opacity: 0.85,
                  }}
                  title={`Day ${day.planDay}: ${day.completion}%`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-[var(--color-muted)]">
            <span>14d ago</span>
            <span>today</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <h3 className="mb-3 text-sm font-medium text-white">Algorithms & Projects Status</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-[var(--color-muted)]">Algorithms</p>
            <div className="space-y-1">
              {ALGORITHMS.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-sm">
                  <span className={state.algorithmsDone[a.id] ? 'text-emerald-400' : 'text-[var(--color-muted)]'}>
                    {state.algorithmsDone[a.id] ? '✓' : '○'}
                  </span>
                  <span className={state.algorithmsDone[a.id] ? 'text-white' : 'text-[var(--color-muted)]'}>
                    W{a.week} — {a.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-[var(--color-muted)]">Projects</p>
            <div className="space-y-1">
              {PROJECTS.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <span className={state.projectsDone[p.id] ? 'text-emerald-400' : 'text-[var(--color-muted)]'}>
                    {state.projectsDone[p.id] ? '✓' : '○'}
                  </span>
                  <span className={state.projectsDone[p.id] ? 'text-white' : 'text-[var(--color-muted)]'}>
                    W{p.week} — {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
