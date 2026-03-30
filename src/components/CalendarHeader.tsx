import { formatMonthLabel } from "../lib/date";

interface CalendarHeaderProps {
  currentMonth: Date;
  monthTaskCount: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentMonth,
  monthTaskCount,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          Calendar Planner
        </span>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            {formatMonthLabel(currentMonth)}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            拖拽选择连续日期，单击即可选中一天。本月视图内共有 {monthTaskCount} 个任务事件。
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
    </div>
  );
}
