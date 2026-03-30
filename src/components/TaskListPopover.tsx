import { COLOR_MAP } from "../lib/colors";
import { cn } from "../lib/cn";
import { formatRangeLabel } from "../lib/date";
import { Task } from "../types";

interface TaskListPopoverProps {
  isOpen: boolean;
  tasks: Task[];
  onClose: () => void;
  onTaskDelete: (taskId: string) => void;
  onTaskSelect: (taskId: string) => void;
}

export function TaskListPopover({
  isOpen,
  tasks,
  onClose,
  onTaskDelete,
  onTaskSelect,
}: TaskListPopoverProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 bg-slate-950/10 backdrop-blur-[1px]" onClick={onClose}>
      <div className="mx-auto max-w-[1480px] px-4 pt-20 md:px-6">
        <div className="flex justify-end">
          <section
            className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/96 p-4 shadow-soft backdrop-blur"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  当前月任务汇总
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{tasks.length} 个任务</h2>
              </div>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] space-y-3 overflow-auto pr-1">
              {tasks.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-500">
                  当前月份还没有任务。
                </div>
              ) : (
                tasks.map((task) => {
                  const color = COLOR_MAP[task.color];

                  return (
                    <article
                      className={cn(
                        "rounded-[22px] border bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5",
                        color.borderClass,
                      )}
                      key={task.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          className="min-w-0 flex-1 text-left"
                          onClick={() => {
                            onTaskSelect(task.id);
                            onClose();
                          }}
                          type="button"
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn("h-3 w-3 rounded-full", color.swatchClass)} />
                            <p className="truncate text-sm font-semibold text-slate-900">{task.title}</p>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            {formatRangeLabel({
                              start: task.startDate,
                              end: task.endDate,
                            })}
                          </p>
                        </button>

                        <button
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                          onClick={() => {
                            if (window.confirm(`删除任务「${task.title}」？`)) {
                              onTaskDelete(task.id);
                            }
                          }}
                          type="button"
                        >
                          删除
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
