import { CalendarDay, DateRange } from "../types";

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
});

const MONTH_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
});

const DAY_MS = 24 * 60 * 60 * 1000;

export const WEEKDAY_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export function createLocalDate(year: number, month: number, day: number) {
  return new Date(year, month, day, 12, 0, 0, 0);
}

export function parseISODate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return createLocalDate(year, month - 1, day);
}

export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  next.setHours(12, 0, 0, 0);
  return next;
}

export function addMonths(date: Date, amount: number) {
  return createLocalDate(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfMonth(date: Date) {
  return createLocalDate(date.getFullYear(), date.getMonth(), 1);
}

export function compareISODate(left: string, right: string) {
  return left.localeCompare(right);
}

export function sortRange(left: string, right: string): DateRange {
  return compareISODate(left, right) <= 0
    ? { start: left, end: right }
    : { start: right, end: left };
}

export function isWithinRange(date: string, range: DateRange) {
  return compareISODate(date, range.start) >= 0 && compareISODate(date, range.end) <= 0;
}

export function rangesOverlap(left: DateRange, right: DateRange) {
  return compareISODate(left.start, right.end) <= 0 && compareISODate(left.end, right.start) >= 0;
}

export function getRangeDayCount(range: DateRange) {
  const start = parseISODate(range.start).getTime();
  const end = parseISODate(range.end).getTime();
  return Math.round((end - start) / DAY_MS) + 1;
}

export function shiftRange(range: DateRange, nextStartIso: string): DateRange {
  const dayCount = getRangeDayCount(range);
  const nextEndDate = addDays(parseISODate(nextStartIso), dayCount - 1);

  return {
    start: nextStartIso,
    end: toISODate(nextEndDate),
  };
}

export function formatMonthLabel(date: Date) {
  return MONTH_FORMATTER.format(date);
}

export function formatLongDate(iso: string) {
  return LONG_DATE_FORMATTER.format(parseISODate(iso));
}

export function formatRangeLabel(range: DateRange) {
  if (range.start === range.end) {
    return formatLongDate(range.start);
  }

  return `${formatLongDate(range.start)} - ${formatLongDate(range.end)}`;
}

export function getMonthGrid(month: Date): CalendarDay[] {
  const monthStart = startOfMonth(month);
  const offset = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -offset);
  const todayIso = toISODate(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    const iso = toISODate(date);

    return {
      iso,
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month.getMonth(),
      isToday: iso === todayIso,
    };
  });
}
