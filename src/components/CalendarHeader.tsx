interface CalendarHeaderProps {
  currentMonth: Date;
  monthTaskCount: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onMonthChange: (monthIndex: number) => void;
  onToggleTaskList: () => void;
  onYearChange: (year: number) => void;
  taskListOpen: boolean;
}

export function CalendarHeader({
  currentMonth,
  monthTaskCount,
  onPrev,
  onNext,
  onToday,
  onMonthChange,
  onToggleTaskList,
  onYearChange,
  taskListOpen,
}: CalendarHeaderProps) {
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  const yearOptions = Array.from({ length: 21 }, (_, index) => currentYear - 10 + index);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200/80 bg-white/88 px-3 py-2.5 shadow-soft backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={onToday}
          type="button"
        >
          今天
        </button>
        <button
          aria-label="上一个月"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={onPrev}
          type="button"
        >
          ‹
        </button>
        <button
          aria-label="下一个月"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={onNext}
          type="button"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          onChange={(event) => onYearChange(Number(event.target.value))}
          value={currentYear}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year} 年
            </option>
          ))}
        </select>

        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          onChange={(event) => onMonthChange(Number(event.target.value))}
          value={currentMonthIndex}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {index + 1} 月
            </option>
          ))}
        </select>

        <p className="hidden text-xs text-slate-500 md:block">本月共 {monthTaskCount} 个任务</p>
      </div>

      <button
        className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
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
