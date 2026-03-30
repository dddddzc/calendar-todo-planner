export type TaskColorKey = "sky" | "amber" | "emerald" | "violet" | "rose";

export interface DateRange {
  start: string;
  end: string;
}

export interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: TaskColorKey;
  createdAt: string;
}

export interface TaskDraft {
  title: string;
  color: TaskColorKey;
}

export interface CalendarDay {
  iso: string;
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}
