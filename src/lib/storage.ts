import { Task } from "../types";

const STORAGE_KEY = "calendar-todo-planner:v1";

function isTaskRecord(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Task>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.startDate === "string" &&
    typeof candidate.endDate === "string" &&
    typeof candidate.color === "string" &&
    typeof candidate.createdAt === "string"
  );
}

function normalizeTask(value: unknown): Task | null {
  if (!isTaskRecord(value)) {
    return null;
  }

  const candidate = value as Partial<Task>;

  return {
    id: candidate.id!,
    title: candidate.title!,
    startDate: candidate.startDate!,
    endDate: candidate.endDate!,
    color: candidate.color as Task["color"],
    createdAt: candidate.createdAt!,
  };
}

export function loadTasks() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeTask(item))
      .filter((task): task is Task => task !== null);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
