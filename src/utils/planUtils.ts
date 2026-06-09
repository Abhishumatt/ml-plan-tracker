import {
  ALGORITHMS,
  DAILY_ROUTINE,
  OUTREACH_TARGETS,
  PHASE0_ITEMS,
  PROJECTS,
  TOTAL_DAYS,
  deliverableId,
  getPhaseForWeek,
  getWeekPlan,
} from '../data/plan';
import type { AppState, DayLog, Track } from '../types';

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function getPlanDay(startDate: string, today = new Date()): number {
  const start = parseDate(startDate);
  const diff = daysBetween(start, today) + 1;
  return Math.max(1, Math.min(diff, TOTAL_DAYS));
}

export function getWeekNumber(planDay: number): number {
  return Math.ceil(planDay / 7);
}

export function getDayInWeek(planDay: number): number {
  return ((planDay - 1) % 7) + 1;
}

export function getStudyDayForPlanDay(planDay: number) {
  const week = getWeekNumber(planDay);
  const weekPlan = getWeekPlan(week);
  if (!weekPlan) return undefined;
  return weekPlan.studyDays.find((s) => s.day === planDay);
}

export function getActiveRoutineItems(week: number) {
  return DAILY_ROUTINE.filter((item) => week >= item.startsWeek);
}

export function getActiveOutreachTargets(week: number) {
  return OUTREACH_TARGETS.filter((item) => week >= item.startsWeek);
}

export function taskIdForRoutine(id: string, date: string): string {
  return `routine:${id}:${date}`;
}

export function taskIdForStudy(date: string): string {
  return `study:${date}`;
}

export function taskIdForOutreach(id: string, date: string): string {
  return `outreach:${id}:${date}`;
}

export function ensureDayLog(state: AppState, date: string): DayLog {
  if (!state.dayLogs[date]) {
    return { date, tasks: {} };
  }
  return state.dayLogs[date];
}

export function getTaskCompletion(state: AppState, date: string, taskId: string) {
  return state.dayLogs[date]?.tasks[taskId];
}

export function isTaskDone(state: AppState, date: string, taskId: string): boolean {
  return !!getTaskCompletion(state, date, taskId)?.completed;
}

export function getTodayTaskIds(_state: AppState, date: string, planDay: number): string[] {
  const week = getWeekNumber(planDay);
  const ids: string[] = [];

  for (const item of getActiveRoutineItems(week)) {
    ids.push(taskIdForRoutine(item.id, date));
  }

  const study = getStudyDayForPlanDay(planDay);
  if (study) {
    ids.push(taskIdForStudy(date));
  }

  for (const target of getActiveOutreachTargets(week)) {
    if (target.id !== 'outreach-cold-email') {
      ids.push(taskIdForOutreach(target.id, date));
    }
  }

  return ids;
}

export function completionRate(state: AppState, date: string, planDay: number): number {
  const ids = getTodayTaskIds(state, date, planDay);
  if (ids.length === 0) return 0;
  const done = ids.filter((id) => isTaskDone(state, date, id)).length;
  return Math.round((done / ids.length) * 100);
}

export function weekCompletionRate(state: AppState, startDate: string, week: number): number {
  const weekStartDay = (week - 1) * 7 + 1;
  const weekEndDay = week * 7;
  let total = 0;
  let done = 0;

  for (let planDay = weekStartDay; planDay <= weekEndDay; planDay++) {
    const date = formatDate(addDays(parseDate(startDate), planDay - 1));
    const ids = getTodayTaskIds(state, date, planDay);
    total += ids.length;
    done += ids.filter((id) => isTaskDone(state, date, id)).length;
  }

  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

export function calculateStreak(state: AppState, startDate: string, today = new Date()): number {
  let streak = 0;
  const start = parseDate(startDate);
  const currentPlanDay = getPlanDay(startDate, today);

  for (let planDay = currentPlanDay; planDay >= 1; planDay--) {
    const date = formatDate(addDays(start, planDay - 1));
    const rate = completionRate(state, date, planDay);
    if (rate >= 70) {
      streak++;
    } else if (planDay !== currentPlanDay || rate < 70) {
      break;
    }
  }

  return streak;
}

export function trackCompletionThisWeek(
  state: AppState,
  startDate: string,
  week: number,
): Record<Track, { done: number; total: number }> {
  const tracks: Record<Track, { done: number; total: number }> = {
    A: { done: 0, total: 0 },
    B: { done: 0, total: 0 },
    C: { done: 0, total: 0 },
  };

  const weekStartDay = (week - 1) * 7 + 1;
  const weekEndDay = week * 7;

  for (let planDay = weekStartDay; planDay <= weekEndDay; planDay++) {
    const date = formatDate(addDays(parseDate(startDate), planDay - 1));
    const w = getWeekNumber(planDay);

    for (const item of getActiveRoutineItems(w)) {
      const id = taskIdForRoutine(item.id, date);
      tracks[item.track].total++;
      if (isTaskDone(state, date, id)) tracks[item.track].done++;
    }

    if (getStudyDayForPlanDay(planDay)) {
      const id = taskIdForStudy(date);
      tracks.A.total++;
      if (isTaskDone(state, date, id)) tracks.A.done++;
    }
  }

  return tracks;
}

export function outreachTotalsThisWeek(state: AppState, startDate: string, week: number) {
  const weekStartDay = (week - 1) * 7 + 1;
  const weekEndDay = week * 7;
  const totals: Record<string, { actual: number; target: number }> = {};

  for (const target of OUTREACH_TARGETS) {
    if (week < target.startsWeek) continue;
    totals[target.id] = { actual: 0, target: 0 };
  }

  for (let planDay = weekStartDay; planDay <= weekEndDay; planDay++) {
    const date = formatDate(addDays(parseDate(startDate), planDay - 1));
    const w = getWeekNumber(planDay);

    for (const target of getActiveOutreachTargets(w)) {
      if (!totals[target.id]) continue;
      const taskId = taskIdForOutreach(target.id, date);
      const completion = getTaskCompletion(state, date, taskId);
      const actual = completion?.actual ?? (completion?.completed ? target.dailyTarget : 0);
      totals[target.id].actual += actual;
      totals[target.id].target +=
        target.id === 'outreach-cold-email' ? target.dailyTarget : target.dailyTarget;
    }
  }

  return totals;
}

export function getWeekDeliverables(week: number) {
  const plan = getWeekPlan(week);
  if (!plan) return [];
  return plan.deliverables.map((label, i) => ({
    id: deliverableId(week, i),
    label,
    week,
  }));
}

export function countDone<T extends Record<string, boolean>>(map: T): number {
  return Object.values(map).filter(Boolean).length;
}

export function getL0Metrics(state: AppState, today = new Date()) {
  const date = formatDate(today);
  const planDay = getPlanDay(state.startDate, today);
  const week = getWeekNumber(planDay);
  const weekPlan = getWeekPlan(week);
  const tracks = trackCompletionThisWeek(state, state.startDate, week);
  const outreach = outreachTotalsThisWeek(state, state.startDate, week);
  const weekDeliverables = getWeekDeliverables(week);

  return {
    date,
    planDay,
    totalDays: TOTAL_DAYS,
    week,
    dayInWeek: getDayInWeek(planDay),
    phase: getPhaseForWeek(week),
    weekTitle: weekPlan?.title ?? '',
    todayCompletion: completionRate(state, date, planDay),
    weekCompletion: weekCompletionRate(state, state.startDate, week),
    streak: calculateStreak(state, state.startDate, today),
    tracks,
    outreach,
    algorithmsDone: countDone(state.algorithmsDone),
    algorithmsTotal: ALGORITHMS.length,
    projectsDone: countDone(state.projectsDone),
    projectsTotal: PROJECTS.length,
    deliverablesDone: weekDeliverables.filter((d) => state.deliverablesDone[d.id]).length,
    deliverablesTotal: weekDeliverables.length,
    phase0Done: countDone(state.phase0Done),
    phase0Total: PHASE0_ITEMS.length,
    studyMinutesToday: state.dayLogs[date]?.studyMinutes ?? 0,
    projectMinutesToday: state.dayLogs[date]?.projectMinutes ?? 0,
  };
}

export function getRecentHistory(state: AppState, startDate: string, days = 14, today = new Date()) {
  const history: { date: string; planDay: number; completion: number; note?: string }[] = [];
  const currentPlanDay = getPlanDay(startDate, today);

  for (let i = 0; i < days; i++) {
    const planDay = currentPlanDay - i;
    if (planDay < 1) break;
    const date = formatDate(addDays(parseDate(startDate), planDay - 1));
    history.push({
      date,
      planDay,
      completion: completionRate(state, date, planDay),
      note: state.dayLogs[date]?.dailyNote,
    });
  }

  return history.reverse();
}
