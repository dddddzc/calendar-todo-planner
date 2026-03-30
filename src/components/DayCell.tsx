import { DragEvent } from "react";
import { COLOR_MAP } from "../lib/colors";
import { cn } from "../lib/cn";
import { formatLongDate, formatRangeLabel } from "../lib/date";
import { CalendarDay, DateRange, Task } from "../types";

interface DayCellProps {
  day: CalendarDay;
  tasks: Task[];
  selectedRange: DateRange;
  onMouseDown: (iso: string) => void;
  onMouseEnter: (iso: string) => void;
  onMouseUp: () => void;
  onDayDragOver: (iso: string) => void;
  onTaskDrop: (iso: string) => void;
  onTaskDragStart: (taskId: string, event: DragEvent<HTMLElement>) => void;
  onTaskDragEnd: () => void;
  isSelected: boolean;
  isDropTarget: boolean;
  draggingTaskId: string | null;
}

export function DayCell({
  day,
  tasks,
  selectedRange,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onDayDragOver,
  onTaskDrop,
  onTaskDragStart,
  onTaskDragEnd,
  isSelected,
  isDropTarget,
  draggingTaskId,
}: DayCellProps) {
  return (
    <div
      className={cn(
        "group relative min-h-[124px] select-none rounded-3xl border p-3 transition duration-200",
        day.isCurrentMonth
          ? "border-slate-200/70 bg-white/90 shadow-sm"
          : "border-slate-200/50 bg-slate-50/70 text-slate-400",
        isSelected && "border-sky-300 bg-sky-50 shadow-[0_14px_40px_-28px_rgba(14,165,233,0.7)]",
        isDropTarget && "border-emerald-300 bg-emerald-50/90 shadow-[0_18px_48px_-28px_rgba(16,185,129,0.7)]",
        !isSelected && "hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDayDragOver(day.iso);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onTaskDrop(day.iso);
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown(day.iso);
      }}
      onMouseEnter={() => onMouseEnter(day.iso)}
      onMouseUp={onMouseUp}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onMouseDown(day.iso);
          onMouseUp();
        }
      }}
      aria-label={formatLongDate(day.iso)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
            day.isToday
              ? "bg-slate-950 text-white"
              : day.isCurrentMonth
                ? "text-slate-700"
                : "text-slate-400",
          )}
        >
          {day.dayNumber}
        </span>
        <div className="flex items-center gap-1">
          {tasks.slice(0, 3).map((task) => (
            <span
              className={cn("h-2.5 w-2.5 rounded-full", COLOR_MAP[task.color].swatchClass)}
              key={task.id}
            />
          ))}
          {tasks.length > 0 ? (
            <span className="text-[11px] font-medium text-slate-400">{tasks.length}</span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {tasks.slice(0, 2).map((task) => {
          const color = COLOR_MAP[task.color];

          return (
            <div
              className={cn(
                "cursor-grab rounded-2xl border px-2.5 py-1.5 text-[11px] font-medium leading-tight active:cursor-grabbing",
                color.chipClass,
                draggingTaskId === task.id && "opacity-45",
              )}
              key={task.id}
              draggable
              onDragEnd={onTaskDragEnd}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", task.id);
                onTaskDragStart(task.id, event);
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <p className="truncate">{task.title}</p>
            </div>
          );
        })}

        {tasks.length > 2 ? (
          <p className="px-1 text-[11px] text-slate-400">+{tasks.length - 2} 条更多任务</p>
        ) : null}

        {tasks.length === 0 ? (
          <p className="px-1 pt-5 text-[11px] text-slate-300">
            {day.iso === selectedRange.start && day.iso === selectedRange.end ? "已选中" : "暂无安排"}
          </p>
        ) : null}
      </div>

      {isSelected ? (
        <div className="absolute inset-x-3 bottom-3 h-1 rounded-full bg-sky-400/70" />
      ) : null}

      {isDropTarget ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl border border-dashed border-emerald-300 bg-emerald-100/80 px-3 py-2 text-[11px] font-medium text-emerald-700">
          释放以将任务移动到这一天
        </div>
      ) : null}

      {tasks.length > 0 ? (
        <div className="pointer-events-none absolute left-1/2 top-full z-30 hidden w-72 -translate-x-1/2 pt-3 group-hover:block">
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">{formatLongDate(day.iso)}</p>
            <div className="mt-3 space-y-2.5">
              {tasks.map((task) => {
                const color = COLOR_MAP[task.color];

                return (
                  <div
                    className={cn(
                      "rounded-2xl border px-3 py-2",
                      color.borderClass,
                      color.softClass,
                    )}
                    key={task.id}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", color.swatchClass)} />
                      <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatRangeLabel({
                        start: task.startDate,
                        end: task.endDate,
                      })}
                    </p>
                    {task.description ? (
                      <p className="mt-2 text-xs leading-5 text-slate-600">{task.description}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
