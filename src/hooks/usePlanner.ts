import { useEffect, useMemo, useState } from "react";
import { DateRange, Task, TaskDraft } from "../types";
import {
  addMonths,
  compareISODate,
  endOfMonth,
  formatRangeLabel,
  getMonthGrid,
  getRangeDayCount,
  rangesOverlap,
  sortRange,
  startOfMonth,
  toISODate,
} from "../lib/date";
import { loadTasks, saveTasks } from "../lib/storage";

const DEFAULT_DRAFT: TaskDraft = {
  title: "",
  color: "sky",
};

type ResizeEdge = "start" | "end";

interface ResizeState {
  taskId: string;
  edge: ResizeEdge;
}

function createDraft(task?: Task): TaskDraft {
  if (!task) {
    return { ...DEFAULT_DRAFT };
  }

  return {
    title: task.title,
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
  const today = new Date();
  const todayIso = toISODate(today);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(today));
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    start: todayIso,
    end: todayIso,
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TaskDraft>(DEFAULT_DRAFT);
  const [formError, setFormError] = useState<string | null>(null);
  const [dragAnchor, setDragAnchor] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const finishInteractions = () => {
      setIsSelecting(false);
      setDragAnchor(null);
      setResizeState(null);
    };

    window.addEventListener("mouseup", finishInteractions);

    return () => {
      window.removeEventListener("mouseup", finishInteractions);
    };
  }, []);

  const calendarDays = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  const currentMonthRange = useMemo(
    () => ({
      start: toISODate(startOfMonth(currentMonth)),
      end: toISODate(endOfMonth(currentMonth)),
    }),
    [currentMonth],
  );

  const currentMonthTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        rangesOverlap(
          {
            start: task.startDate,
            end: task.endDate,
          },
          currentMonthRange,
        ),
      )
      .sort(compareTasks);
  }, [currentMonthRange, tasks]);

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) {
      return null;
    }

    return tasks.find((task) => task.id === selectedTaskId) ?? null;
  }, [selectedTaskId, tasks]);

  useEffect(() => {
    if (!selectedTaskId) {
      return;
    }

    if (!selectedTask) {
      setSelectedTaskId(null);
      setDraft((currentDraft) => ({
        title: "",
        color: currentDraft.color,
      }));
      setFormError(null);
      return;
    }

    setSelectedRange({
      start: selectedTask.startDate,
      end: selectedTask.endDate,
    });
  }, [selectedTask, selectedTaskId]);

  const enterCreateMode = (range: DateRange) => {
    setSelectedTaskId(null);
    setSelectedRange(range);
    setDraft((currentDraft) => ({
      title: "",
      color: currentDraft.color,
    }));
    setFormError(null);
  };

  const handleDayMouseDown = (iso: string) => {
    const nextRange = { start: iso, end: iso };
    setDragAnchor(iso);
    setIsSelecting(true);
    enterCreateMode(nextRange);
  };

  const handleDayMouseEnter = (iso: string) => {
    if (resizeState) {
      const task = tasks.find((currentTask) => currentTask.id === resizeState.taskId);

      if (!task) {
        return;
      }

      const nextRange =
        resizeState.edge === "start"
          ? {
              start: compareISODate(iso, task.endDate) <= 0 ? iso : task.endDate,
              end: task.endDate,
            }
          : {
              start: task.startDate,
              end: compareISODate(iso, task.startDate) >= 0 ? iso : task.startDate,
            };

      if (
        nextRange.start === task.startDate &&
        nextRange.end === task.endDate
      ) {
        return;
      }

      setTasks((currentTasks) =>
        currentTasks
          .map((currentTask) =>
            currentTask.id === resizeState.taskId
              ? {
                  ...currentTask,
                  startDate: nextRange.start,
                  endDate: nextRange.end,
                }
              : currentTask,
          )
          .sort(compareTasks),
      );
      setSelectedRange(nextRange);
      return;
    }

    if (!isSelecting || !dragAnchor) {
      return;
    }

    setSelectedRange(sortRange(dragAnchor, iso));
  };

  const handleDayMouseUp = () => {
    setIsSelecting(false);
    setDragAnchor(null);
    setResizeState(null);
  };

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((currentTask) => currentTask.id === taskId);

    if (!task) {
      return;
    }

    setSelectedTaskId(taskId);
    setSelectedRange({
      start: task.startDate,
      end: task.endDate,
    });
    setDraft(createDraft(task));
    setFormError(null);
  };

  const handleTaskResizeStart = (taskId: string, edge: ResizeEdge) => {
    handleTaskSelect(taskId);
    setResizeState({
      taskId,
      edge,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
      setDraft((currentDraft) => ({
        title: "",
        color: currentDraft.color,
      }));
      setFormError(null);
    }
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

  const handleSubmitTask = () => {
    const title = draft.title.trim();

    if (!title) {
      setFormError("请输入任务名称。");
      return false;
    }

    const normalizedRange = sortRange(selectedRange.start, selectedRange.end);

    if (selectedTaskId) {
      setTasks((currentTasks) =>
        currentTasks
          .map((task) =>
            task.id === selectedTaskId
              ? {
                  ...task,
                  title,
                  color: draft.color,
                  startDate: normalizedRange.start,
                  endDate: normalizedRange.end,
                }
              : task,
          )
          .sort(compareTasks),
      );
      setDraft({
        title,
        color: draft.color,
      });
    } else {
      const task: Task = {
        id: crypto.randomUUID(),
        title,
        color: draft.color,
        startDate: normalizedRange.start,
        endDate: normalizedRange.end,
        createdAt: new Date().toISOString(),
      };

      setTasks((currentTasks) => [task, ...currentTasks].sort(compareTasks));
      setSelectedTaskId(task.id);
      setDraft(createDraft(task));
    }

    setSelectedRange(normalizedRange);
    setFormError(null);
    return true;
  };

  const handleClearSelection = () => {
    setSelectedTaskId(null);
    setDraft((currentDraft) => ({
      title: "",
      color: currentDraft.color,
    }));
    setFormError(null);
  };

  const selectionLabel = formatRangeLabel(selectedRange);
  const selectionDayCount = getRangeDayCount(selectedRange);

  return {
    calendarDays,
    currentMonth,
    currentMonthTasks,
    draft,
    formError,
    monthTaskCount: currentMonthTasks.length,
    resizeState,
    selectedRange,
    selectedTask,
    selectedTaskId,
    selectionDayCount,
    selectionLabel,
    setCurrentMonthByMonth: (monthIndex: number) =>
      setCurrentMonth((current) => startOfMonth(new Date(current.getFullYear(), monthIndex, 1))),
    setCurrentMonthByYear: (year: number) =>
      setCurrentMonth((current) => startOfMonth(new Date(year, current.getMonth(), 1))),
    goToPrevMonth: () => setCurrentMonth((month) => addMonths(month, -1)),
    goToNextMonth: () => setCurrentMonth((month) => addMonths(month, 1)),
    goToToday: () => {
      const now = new Date();
      const iso = toISODate(now);
      setCurrentMonth(startOfMonth(now));
      enterCreateMode({ start: iso, end: iso });
    },
    handleClearSelection,
    handleDayMouseDown,
    handleDayMouseEnter,
    handleDayMouseUp,
    handleDeleteTask,
    handleDraftChange,
    handleSubmitTask,
    handleTaskResizeStart,
    handleTaskSelect,
    isEditingTask: selectedTaskId !== null,
  };
}
