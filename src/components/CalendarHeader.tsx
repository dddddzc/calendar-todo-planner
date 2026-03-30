import { formatMonthLabel } from "../lib/date";

interface CalendarHeaderProps {
  currentMonth: Date;
  monthTaskCount: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onToggleTaskList: () => void;
  taskListOpen: boolean;
}

export function CalendarHeader({
  currentMonth,
  monthTaskCount,
  onPrev,
  onNext,
  onToday,
  onToggleTaskList,
  taskListOpen,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-200/80 bg-white/88 px-4 py-3 shadow-soft backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={onToday}
          type="button"
        >
          今天
        </button>
        <button
          aria-label="上一个月"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={onPrev}
          type="button"
        >
          ‹
        </button>
        <button
          aria-label="下一个月"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={onNext}
          type="button"
        >
          ›
        </button>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold tracking-tight text-slate-900">
          {formatMonthLabel(currentMonth)}
        </p>
        <p className="text-sm text-slate-500">本月共 {monthTaskCount} 个任务</p>
      </div>

      <button
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
          taskListOpen
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
        }`}
        onClick={onToggleTaskList}
        type="button"
      >
        任务列表
      </button>
    </div>
  );
}
