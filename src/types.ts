export type Track = 'A' | 'B' | 'C';

export interface DailyRoutineItem {
  id: string;
  label: string;
  track: Track;
  durationMin: number;
  startsWeek: number;
}

export interface StudyDay {
  day: number;
  topic: string;
  goal: string;
  source: string;
}

export interface WeekPlan {
  week: number;
  title: string;
  phase: string;
  studyDays: StudyDay[];
  deliverables: string[];
  stopAndCheck?: string;
  outreach?: string[];
}

export interface Algorithm {
  id: string;
  name: string;
  week: number;
  bigO: string;
}

export interface Project {
  id: string;
  name: string;
  week: number;
  tech: string;
}

export interface OutreachTarget {
  id: string;
  label: string;
  dailyTarget: number;
  startsWeek: number;
}

export interface TaskCompletion {
  completed: boolean;
  actual?: number;
  notes?: string;
}

export interface DayLog {
  date: string;
  tasks: Record<string, TaskCompletion>;
  studyMinutes?: number;
  projectMinutes?: number;
  dailyNote?: string;
}

export interface AppState {
  startDate: string;
  dayLogs: Record<string, DayLog>;
  algorithmsDone: Record<string, boolean>;
  projectsDone: Record<string, boolean>;
  deliverablesDone: Record<string, boolean>;
  phase0Done: Record<string, boolean>;
}
