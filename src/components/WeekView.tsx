import { ALGORITHMS, PHASE0_ITEMS, PROJECTS, WEEKS, deliverableId } from '../data/plan';
import type { AppState } from '../types';
import { getPlanDay, getWeekNumber } from '../utils/planUtils';
import { ProgressBar } from './ProgressBar';

interface WeekViewProps {
  state: AppState;
  toggleMapItem: (
    key: 'algorithmsDone' | 'projectsDone' | 'deliverablesDone' | 'phase0Done',
    id: string,
  ) => void;
}

export function WeekView({ state, toggleMapItem }: WeekViewProps) {
  const planDay = getPlanDay(state.startDate);
  const currentWeek = getWeekNumber(planDay);
  const weekPlan = WEEKS.find((w) => w.week === currentWeek);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Week {currentWeek} Milestones</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{weekPlan?.title}</p>
      </header>

      {currentWeek <= 1 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-white">Phase 0 — Before Week 1</h2>
          <div className="space-y-2">
            {PHASE0_ITEMS.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
              >
                <input
                  type="checkbox"
                  checked={!!state.phase0Done[item.id]}
                  onChange={() => toggleMapItem('phase0Done', item.id)}
                  className="h-4 w-4 accent-indigo-500"
                />
                <span className={state.phase0Done[item.id] ? 'text-[var(--color-muted)] line-through' : 'text-white'}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </section>
      )}

      {weekPlan && weekPlan.deliverables.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-white">Week {currentWeek} Deliverables</h2>
          <div className="space-y-2">
            {weekPlan.deliverables.map((label, i) => {
              const id = deliverableId(currentWeek, i);
              return (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
                >
                  <input
                    type="checkbox"
                    checked={!!state.deliverablesDone[id]}
                    onChange={() => toggleMapItem('deliverablesDone', id)}
                    className="h-4 w-4 accent-indigo-500"
                  />
                  <span className={state.deliverablesDone[id] ? 'text-[var(--color-muted)] line-through' : 'text-white'}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="mt-3">
            <ProgressBar
              label="Deliverables"
              value={weekPlan.deliverables.filter((_, i) => state.deliverablesDone[deliverableId(currentWeek, i)]).length}
              max={weekPlan.deliverables.length}
              color="bg-emerald-500"
            />
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">9 Algorithms (mark when owned)</h2>
        <div className="space-y-2">
          {ALGORITHMS.map((algo) => (
            <label
              key={algo.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                currentWeek >= algo.week
                  ? 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                  : 'border-[var(--color-border)]/50 bg-[var(--color-surface-2)]/50 opacity-60'
              }`}
            >
              <input
                type="checkbox"
                checked={!!state.algorithmsDone[algo.id]}
                onChange={() => toggleMapItem('algorithmsDone', algo.id)}
                disabled={currentWeek < algo.week}
                className="mt-0.5 h-4 w-4 accent-indigo-500"
              />
              <div>
                <span className={state.algorithmsDone[algo.id] ? 'text-[var(--color-muted)] line-through' : 'text-white'}>
                  W{algo.week} — {algo.name}
                </span>
                <p className="mt-0.5 font-mono text-xs text-[var(--color-muted)]">{algo.bigO}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">7 Portfolio Projects</h2>
        <div className="space-y-2">
          {PROJECTS.map((proj) => (
            <label
              key={proj.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                currentWeek >= proj.week
                  ? 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
                  : 'border-[var(--color-border)]/50 bg-[var(--color-surface-2)]/50 opacity-60'
              }`}
            >
              <input
                type="checkbox"
                checked={!!state.projectsDone[proj.id]}
                onChange={() => toggleMapItem('projectsDone', proj.id)}
                disabled={currentWeek < proj.week}
                className="mt-0.5 h-4 w-4 accent-indigo-500"
              />
              <div>
                <span className={state.projectsDone[proj.id] ? 'text-[var(--color-muted)] line-through' : 'text-white'}>
                  W{proj.week} — {proj.name}
                </span>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">{proj.tech}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">Full 18-Week Roadmap</h2>
        <div className="space-y-2">
          {WEEKS.map((w) => (
            <div
              key={w.week}
              className={`rounded-lg border p-3 ${
                w.week === currentWeek
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : w.week < currentWeek
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">
                  Week {w.week}: {w.title}
                </span>
                {w.week === currentWeek && (
                  <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">current</span>
                )}
                {w.week < currentWeek && (
                  <span className="text-xs text-emerald-400">passed</span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{w.phase}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
