import { useEffect, useMemo, useState } from "react";
import { DateRange, Task, TaskColorFilter, TaskDraft, TaskFilterScope } from "../types";
import {
  addMonths,
  compareISODate,
  endOfMonth,
  formatRangeLabel,
  getMonthGrid,
  getRangeDayCount,
  isWithinRange,
  rangesOverlap,
  shiftRange,
  sortRange,
  startOfMonth,
  toISODate,
} from "../lib/date";
import { loadTasks, saveTasks } from "../lib/storage";

const DEFAULT_DRAFT: TaskDraft = {
  title: "",
  description: "",
  color: "sky",
};

function createDraft(task?: Task): TaskDraft {
  if (!task) {
    return { ...DEFAULT_DRAFT };
  }

  return {
    title: task.title,
    description: task.description,
    color: task.color,
  };
}

function compareTasks(left: Task, right: Task) {
  return (
    compareISODate(left.startDate, right.startDate) ||
    compareISODate(left.endDate, right.endDate) ||
    right.createdAt.localeCompare(left.createdAt)
  );
}

export function usePlanner() {
  const todayIso = toISODate(new Date());
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: todayIso,
    end: todayIso,
  });
  const [draft, setDraft] = useState<TaskDraft>(DEFAULT_DRAFT);
  const [formError, setFormError] = useState<string | null>(null);
  const [dragAnchor, setDragAnchor] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTargetIso, setDropTargetIso] = useState<string | null>(null);
  const [taskQuery, setTaskQuery] = useState("");
  const [taskColorFilter, setTaskColorFilter] = useState<TaskColorFilter>("all");
  const [taskScope, setTaskScope] = useState<TaskFilterScope>("selection");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const finishSelection = () => {
      setIsDragging(false);
      setDragAnchor(null);
    };

    window.addEventListener("mouseup", finishSelection);

    return () => {
      window.removeEventListener("mouseup", finishSelection);
    };
  }, []);

  useEffect(() => {
    if (editingTaskId && !tasks.some((task) => task.id === editingTaskId)) {
      setEditingTaskId(null);
      setDraft(createDraft());
    }
  }, [editingTaskId, tasks]);

  const calendarDays = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  const tasksByDate = useMemo(() => {
    return calendarDays.reduce<Record<string, Task[]>>((accumulator, day) => {
      accumulator[day.iso] = tasks
        .filter((task) =>
          isWithinRange(day.iso, {
            start: task.startDate,
            end: task.endDate,
          }),
        )
        .sort(compareTasks);

      return accumulator;
    }, {});
  }, [calendarDays, tasks]);

  const tasksInSelection = useMemo(() => {
    return tasks
      .filter((task) =>
        rangesOverlap(
          {
            start: task.startDate,
            end: task.endDate,
          },
          selectedRange,
        ),
      )
      .sort(compareTasks);
  }, [selectedRange, tasks]);

  const currentMonthRange = useMemo(
    () => ({
      start: toISODate(startOfMonth(currentMonth)),
      end: toISODate(endOfMonth(currentMonth)),
    }),
    [currentMonth],
  );

  const scopedTasks = useMemo(() => {
    const range = taskScope === "selection" ? selectedRange : currentMonthRange;

    if (taskScope === "all") {
      return tasks;
    }

    return tasks.filter((task) =>
      rangesOverlap(
        {
          start: task.startDate,
          end: task.endDate,
        },
        range,
      ),
    );
  }, [currentMonthRange, selectedRange, taskScope, tasks]);

  const filteredTasks = useMemo(() => {
    const query = taskQuery.trim().toLowerCase();

    return scopedTasks
      .filter((task) => {
        const matchesColor = taskColorFilter === "all" || task.color === taskColorFilter;

        if (!matchesColor) {
          return false;
        }

        if (!query) {
          return true;
        }

        const searchableText = [
          task.title,
          task.description,
          task.startDate,
          task.endDate,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort(compareTasks);
  }, [scopedTasks, taskColorFilter, taskQuery]);

  const editingTask = useMemo(() => {
    if (!editingTaskId) {
      return null;
    }

    return tasks.find((task) => task.id === editingTaskId) ?? null;
  }, [editingTaskId, tasks]);

  const monthTaskCount = useMemo(() => {
    const visibleStart = calendarDays[0]?.iso;
    const visibleEnd = calendarDays[calendarDays.length - 1]?.iso;

    if (!visibleStart || !visibleEnd) {
      return 0;
    }

    return tasks.filter((task) =>
      rangesOverlap(
        {
          start: task.startDate,
          end: task.endDate,
        },
        {
          start: visibleStart,
          end: visibleEnd,
        },
      ),
    ).length;
  }, [calendarDays, tasks]);

  const handleDayMouseDown = (iso: string) => {
    setDragAnchor(iso);
    setIsDragging(true);
    setSelectedRange({ start: iso, end: iso });
  };

  const handleDayMouseEnter = (iso: string) => {
    if (!isDragging || !dragAnchor) {
      return;
    }

    setSelectedRange(sortRange(dragAnchor, iso));
  };

  const handleDayMouseUp = () => {
    setIsDragging(false);
    setDragAnchor(null);
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setDraft(createDraft());
    setFormError(null);
  };

  const handleSubmitTask = () => {
    const title = draft.title.trim();

    if (!title) {
      setFormError("请输入任务标题。");
      return false;
    }

    const normalizedRange = sortRange(selectedRange.start, selectedRange.end);

    if (editingTaskId) {
      setTasks((currentTasks) =>
        currentTasks
          .map((task) =>
            task.id === editingTaskId
              ? {
                  ...task,
                  title,
                  description: draft.description.trim(),
                  color: draft.color,
                  startDate: normalizedRange.start,
                  endDate: normalizedRange.end,
                }
              : task,
          )
          .sort(compareTasks),
      );
    } else {
      const task: Task = {
        id: crypto.randomUUID(),
        title,
        description: draft.description.trim(),
        startDate: normalizedRange.start,
        endDate: normalizedRange.end,
        color: draft.color,
        createdAt: new Date().toISOString(),
      };

      setTasks((currentTasks) => [task, ...currentTasks].sort(compareTasks));
    }

    setSelectedRange(normalizedRange);
    resetForm();
    return true;
  };

  const handleDeleteTask = (taskId: string) => {
    if (taskId === editingTaskId) {
      resetForm();
    }

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    setEditingTaskId(taskId);
    setDraft(createDraft(task));
    setSelectedRange({
      start: task.startDate,
      end: task.endDate,
    });
    setFormError(null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSelectedRangeChange = (field: keyof DateRange, value: string) => {
    setSelectedRange((currentRange) => {
      const nextRange =
        field === "start"
          ? { start: value, end: currentRange.end }
          : { start: currentRange.start, end: value };

      return sortRange(nextRange.start, nextRange.end);
    });
  };

  const handleDraftChange = <Key extends keyof TaskDraft>(field: Key, value: TaskDraft[Key]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));

    if (field === "title" && formError) {
      setFormError(null);
    }
  };

  const handleTaskDragStart = (taskId: string) => {
    setDraggingTaskId(taskId);
    setDropTargetIso(null);
  };

  const handleTaskDragEnd = () => {
    setDraggingTaskId(null);
    setDropTargetIso(null);
  };

  const handleDayDragOver = (iso: string) => {
    if (!draggingTaskId) {
      return;
    }

    setDropTargetIso(iso);
  };

  const handleTaskDrop = (iso: string) => {
    if (!draggingTaskId) {
      return;
    }

    const task = tasks.find((currentTask) => currentTask.id === draggingTaskId);

    if (!task) {
      setDraggingTaskId(null);
      setDropTargetIso(null);
      return;
    }

    const nextRange = shiftRange(
      {
        start: task.startDate,
        end: task.endDate,
      },
      iso,
    );

    setTasks((currentTasks) =>
      currentTasks
        .map((currentTask) =>
          currentTask.id === draggingTaskId
            ? {
                ...currentTask,
                startDate: nextRange.start,
                endDate: nextRange.end,
              }
            : currentTask,
        )
        .sort(compareTasks),
    );
    if (!editingTaskId || editingTaskId === draggingTaskId) {
      setSelectedRange(nextRange);
    }
    setDraggingTaskId(null);
    setDropTargetIso(null);
    setFormError(null);
  };

  const selectionLabel = formatRangeLabel(selectedRange);
  const selectionDayCount = getRangeDayCount(selectedRange);
  const hasActiveTaskFilters =
    taskQuery.trim().length > 0 || taskColorFilter !== "all" || taskScope !== "selection";

  const clearTaskFilters = () => {
    setTaskQuery("");
    setTaskColorFilter("all");
    setTaskScope("selection");
  };

  return {
    calendarDays,
    clearTaskFilters,
    currentMonth,
    draft,
    draggingTaskId,
    dropTargetIso,
    editingTask,
    editingTaskId,
    filteredTaskCount: filteredTasks.length,
    filteredTasks,
    formError,
    handleCancelEdit,
    monthTaskCount,
    scopedTaskCount: scopedTasks.length,
    selectedRange,
    selectionDayCount,
    selectionLabel,
    taskColorFilter,
    taskQuery,
    taskScope,
    tasksByDate,
    tasksInSelection,
    hasActiveTaskFilters,
    goToPrevMonth: () => setCurrentMonth((month) => addMonths(month, -1)),
    goToNextMonth: () => setCurrentMonth((month) => addMonths(month, 1)),
    goToToday: () => {
      const now = new Date();
      const iso = toISODate(now);
      setCurrentMonth(startOfMonth(now));
      setSelectedRange({ start: iso, end: iso });
    },
    handleDayDragOver,
    handleDayMouseDown,
    handleDayMouseEnter,
    handleDayMouseUp,
    handleDeleteTask,
    handleDraftChange,
    handleEditTask,
    handleSelectedRangeChange,
    handleSubmitTask,
    handleTaskColorFilterChange: setTaskColorFilter,
    handleTaskDragEnd,
    handleTaskDragStart,
    handleTaskDrop,
    handleTaskQueryChange: setTaskQuery,
    handleTaskScopeChange: setTaskScope,
    isEditing: editingTaskId !== null,
  };
}
