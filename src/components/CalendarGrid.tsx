import { WEEKDAY_LABELS, isWithinRange } from "../lib/date";
import { CalendarDay, DateRange, Task } from "../types";
import { DayCell } from "./DayCell";
import { DragEvent } from "react";

interface CalendarGridProps {
  days: CalendarDay[];
  selectedRange: DateRange;
  tasksByDate: Record<string, Task[]>;
  onDayMouseDown: (iso: string) => void;
  onDayMouseEnter: (iso: string) => void;
  onDayMouseUp: () => void;
  onDayDragOver: (iso: string) => void;
  onTaskDrop: (iso: string) => void;
  onTaskDragStart: (taskId: string, event: DragEvent<HTMLElement>) => void;
  onTaskDragEnd: () => void;
  dropTargetIso: string | null;
  draggingTaskId: string | null;
}

export function CalendarGrid({
  days,
  selectedRange,
  tasksByDate,
  onDayMouseDown,
  onDayMouseEnter,
  onDayMouseUp,
  onDayDragOver,
  onTaskDrop,
  onTaskDragStart,
  onTaskDragEnd,
  dropTargetIso,
  draggingTaskId,
}: CalendarGridProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {WEEKDAY_LABELS.map((label) => (
          <div className="py-2" key={label}>
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <DayCell
            day={day}
            isSelected={isWithinRange(day.iso, selectedRange)}
            key={day.iso}
            draggingTaskId={draggingTaskId}
            isDropTarget={dropTargetIso === day.iso}
            onMouseDown={onDayMouseDown}
            onMouseEnter={onDayMouseEnter}
            onMouseUp={onDayMouseUp}
            onDayDragOver={onDayDragOver}
            onTaskDrop={onTaskDrop}
            onTaskDragEnd={onTaskDragEnd}
            onTaskDragStart={onTaskDragStart}
            selectedRange={selectedRange}
            tasks={tasksByDate[day.iso] ?? []}
          />
        ))}
      </div>
    </div>
  );
}
