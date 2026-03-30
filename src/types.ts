export type TaskColorKey = "sky" | "amber" | "emerald" | "violet" | "rose";
export type TaskColorFilter = TaskColorKey | "all";
export type TaskFilterScope = "selection" | "month" | "all";

export interface DateRange {
  start: string;
  end: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  color: TaskColorKey;
  createdAt: string;
}

export interface TaskDraft {
  title: string;
  description: string;
  color: TaskColorKey;
}

export interface CalendarDay {
  iso: string;
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}
