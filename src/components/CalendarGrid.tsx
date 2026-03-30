import { MouseEvent, useMemo } from "react";
import { COLOR_MAP } from "../lib/colors";
import { cn } from "../lib/cn";
import {
  WEEKDAY_LABELS,
  compareISODate,
  formatLongDate,
  isWithinRange,
  rangesOverlap,
} from "../lib/date";
import { CalendarDay, DateRange, Task } from "../types";

interface CalendarGridProps {
  days: CalendarDay[];
  selectedRange: DateRange;
  selectedTaskId: string | null;
  resizeState: {
    taskId: string;
    edge: "start" | "end";
  } | null;
  tasks: Task[];
  onDayMouseDown: (iso: string) => void;
  onDayMouseEnter: (iso: string) => void;
  onDayMouseUp: () => void;
  onTaskResizeStart: (taskId: string, edge: "start" | "end") => void;
  onTaskSelect: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

interface TaskSegment {
  task: Task;
  startCol: number;
  endCol: number;
  lane: number;
  startsHere: boolean;
  endsHere: boolean;
}

function getIsoFromPointer(
  event: MouseEvent<HTMLDivElement>,
  week: CalendarDay[],
) {
  const bounds = event.currentTarget.getBoundingClientRect();

  if (bounds.width <= 0) {
    return week[0].iso;
  }

  const relativeX = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width - 1);
  const column = Math.min(6, Math.max(0, Math.floor((relativeX / bounds.width) * 7)));

  return week[column].iso;
}

function buildWeekSegments(week: CalendarDay[], tasks: Task[]) {
  const weekRange = {
    start: week[0].iso,
    end: week[6].iso,
  };

  const overlappingTasks = tasks
    .filter((task) =>
      rangesOverlap(
        {
          start: task.startDate,
          end: task.endDate,
        },
        weekRange,
      ),
    )
    .sort((left, right) => {
      return (
        compareISODate(left.startDate, right.startDate) ||
        compareISODate(right.endDate, left.endDate) ||
        right.createdAt.localeCompare(left.createdAt)
      );
    });

  const laneEndColumns: number[] = [];

  return overlappingTasks.map<TaskSegment>((task) => {
    const visibleStart = compareISODate(task.startDate, weekRange.start) <= 0 ? weekRange.start : task.startDate;
    const visibleEnd = compareISODate(task.endDate, weekRange.end) >= 0 ? weekRange.end : task.endDate;
    const startCol = week.findIndex((day) => day.iso === visibleStart);
    const endCol = week.findIndex((day) => day.iso === visibleEnd);

    let lane = 0;

    while (laneEndColumns[lane] !== undefined && laneEndColumns[lane] >= startCol) {
      lane += 1;
    }

    laneEndColumns[lane] = endCol;

    return {
      task,
      startCol,
      endCol,
      lane,
      startsHere: task.startDate === visibleStart,
      endsHere: task.endDate === visibleEnd,
    };
  });
}

export function CalendarGrid({
  days,
  selectedRange,
  selectedTaskId,
  resizeState,
  tasks,
  onDayMouseDown,
  onDayMouseEnter,
  onDayMouseUp,
  onTaskResizeStart,
  onTaskSelect,
  onTaskDelete,
}: CalendarGridProps) {
  const weeks = useMemo(
    () => Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7)),
    [days],
  );

  const segmentsByWeek = useMemo(
    () => weeks.map((week) => buildWeekSegments(week, tasks)),
    [tasks, weeks],
  );

  return (
    <div className="flex-1 rounded-[28px] border border-slate-200/80 bg-white/74 p-2.5 shadow-soft backdrop-blur">
      <div className="grid grid-cols-7 gap-1.5 border-b border-slate-200/80 pb-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {WEEKDAY_LABELS.map((label) => (
          <div className="py-1" key={label}>
            {label}
          </div>
        ))}
      </div>

      <div className="mt-2.5 space-y-1.5">
        {weeks.map((week, weekIndex) => {
          const segments = segmentsByWeek[weekIndex];
          const laneCount = Math.max(
            1,
            ...segments.map((segment) => segment.lane + 1),
          );

          return (
            <div
              className="grid gap-1.5"
              key={week[0]?.iso ?? weekIndex}
              onMouseMove={(event) => onDayMouseEnter(getIsoFromPointer(event, week))}
              onMouseUp={onDayMouseUp}
              style={{
                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                gridTemplateRows: `minmax(72px, auto) repeat(${laneCount}, minmax(0, 22px))`,
              }}
            >
              {week.map((day, dayIndex) => (
                <button
                  aria-label={formatLongDate(day.iso)}
                  className={cn(
                    "relative rounded-[18px] border px-2 py-2 text-left transition",
                    day.isCurrentMonth
                      ? "border-slate-200/80 bg-white/88"
                      : "border-slate-200/50 bg-slate-50/75 text-slate-400",
                    isWithinRange(day.iso, selectedRange) &&
                      "border-sky-300 bg-sky-50 shadow-[0_18px_48px_-30px_rgba(14,165,233,0.65)]",
                    !isWithinRange(day.iso, selectedRange) &&
                      "hover:border-slate-300 hover:bg-white",
                  )}
                  key={day.iso}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onDayMouseDown(day.iso);
                  }}
                  onMouseEnter={() => onDayMouseEnter(day.iso)}
                  onMouseUp={onDayMouseUp}
                  style={{
                    gridColumn: dayIndex + 1,
                    gridRow: 1,
                  }}
                  type="button"
                >
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      day.isToday
                        ? "bg-slate-950 text-white"
                        : day.isCurrentMonth
                          ? "text-slate-800"
                          : "text-slate-400",
                    )}
                  >
                    {day.dayNumber}
                  </span>

                  <div className="absolute inset-x-2 bottom-2 text-[10px] text-slate-300">
                    {selectedTaskId && isWithinRange(day.iso, selectedRange)
                      ? "已选中任务范围"
                      : isWithinRange(day.iso, selectedRange)
                        ? "创建任务范围"
                        : ""}
                  </div>
                </button>
              ))}

              {segments.map((segment) => {
                const color = COLOR_MAP[segment.task.color];
                const isSelected = selectedTaskId === segment.task.id;

                return (
                  <div
                    className={cn(
                      "flex h-5 min-w-0 items-center gap-1 border px-1 shadow-sm transition",
                      color.chipClass,
                      segment.startsHere ? "rounded-l-lg" : "rounded-l-md",
                      segment.endsHere ? "rounded-r-lg" : "rounded-r-md",
                      isSelected && "ring-2 ring-slate-900/15 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.55)]",
                    )}
                    key={`${segment.task.id}-${weekIndex}`}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      onTaskSelect(segment.task.id);

                      if (window.confirm(`删除任务「${segment.task.title}」？`)) {
                        onTaskDelete(segment.task.id);
                      }
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                    style={{
                      gridColumn: `${segment.startCol + 1} / ${segment.endCol + 2}`,
                      gridRow: segment.lane + 2,
                    }}
                  >
                    {segment.startsHere ? (
                      <button
                        className={cn(
                          "h-4 w-2 shrink-0 cursor-ew-resize rounded-full transition",
                          isSelected
                            ? "bg-slate-900/40 hover:bg-slate-900/60"
                            : "bg-slate-900/15 hover:bg-slate-900/30",
                        )}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onTaskResizeStart(segment.task.id, "start");
                        }}
                        title="拖动左边界调整开始日期"
                        type="button"
                      />
                    ) : (
                      <span className="w-2 shrink-0" />
                    )}

                    <button
                      className="min-w-0 flex-1 truncate text-left text-[10px] font-semibold"
                      onClick={() => onTaskSelect(segment.task.id)}
                      title={`${segment.task.title} · 右键删除`}
                      type="button"
                    >
                      {segment.task.title}
                    </button>

                    {segment.endsHere ? (
                      <button
                        className={cn(
                          "h-4 w-2 shrink-0 cursor-ew-resize rounded-full transition",
                          isSelected
                            ? "bg-slate-900/40 hover:bg-slate-900/60"
                            : "bg-slate-900/15 hover:bg-slate-900/30",
                        )}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onTaskResizeStart(segment.task.id, "end");
                        }}
                        title="拖动右边界调整结束日期"
                        type="button"
                      />
                    ) : (
                      <span className="w-2 shrink-0" />
                    )}

                    {isSelected && resizeState?.taskId === segment.task.id ? (
                      <span className="sr-only">
                        正在调整{resizeState.edge === "start" ? "开始日期" : "结束日期"}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
