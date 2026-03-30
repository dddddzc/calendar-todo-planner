import { DragEvent } from "react";
import { COLOR_MAP, COLOR_OPTIONS } from "../lib/colors";
import { cn } from "../lib/cn";
import { formatRangeLabel } from "../lib/date";
import { DateRange, Task, TaskDraft } from "../types";

interface TaskPanelProps {
  draft: TaskDraft;
  draggingTaskId: string | null;
  editingTaskId: string | null;
  formError: string | null;
  isEditing: boolean;
  selectedRange: DateRange;
  selectionDayCount: number;
  selectionLabel: string;
  tasks: Task[];
  onCancelEdit: () => void;
  onDeleteTask: (taskId: string) => void;
  onDraftChange: <Key extends keyof TaskDraft>(field: Key, value: TaskDraft[Key]) => void;
  onEditTask: (taskId: string) => void;
  onSelectedRangeChange: (field: keyof DateRange, value: string) => void;
  onSubmitTask: () => void;
  onTaskDragEnd: () => void;
  onTaskDragStart: (taskId: string, event: DragEvent<HTMLElement>) => void;
}

export function TaskPanel({
  draft,
  draggingTaskId,
  editingTaskId,
  formError,
  isEditing,
  selectedRange,
  selectionDayCount,
  selectionLabel,
  tasks,
  onCancelEdit,
  onDeleteTask,
  onDraftChange,
  onEditTask,
  onSelectedRangeChange,
  onSubmitTask,
  onTaskDragEnd,
  onTaskDragStart,
}: TaskPanelProps) {
  return (
    <aside className="flex h-fit flex-col gap-5 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-soft backdrop-blur xl:sticky xl:top-6">
      <div className="rounded-[24px] bg-slate-950 p-5 text-white">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">当前选择</p>
        <h2 className="mt-3 text-xl font-semibold leading-snug">{selectionLabel}</h2>
        <p className="mt-3 text-sm text-slate-300">
          共 {selectionDayCount} 天，可直接为这段日期创建连续任务。
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex rounded-full border border-white/10 px-2.5 py-1">
            起始日 {selectedRange.start}
          </span>
          <span className="inline-flex rounded-full border border-white/10 px-2.5 py-1">
            结束日 {selectedRange.end}
          </span>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900">{isEditing ? "编辑任务" : "添加任务"}</h3>
            {isEditing ? (
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                编辑模式
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? "修改标题、描述、颜色，或重新框选日期后保存。也可以直接把任务拖到日历中的新日期。"
              : "标题必填，描述可选。新增任务默认使用当前选区，也可以手动微调开始和结束日期。"}
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">开始日期</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                onChange={(event) => onSelectedRangeChange("start", event.target.value)}
                type="date"
                value={selectedRange.start}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">结束日期</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                onChange={(event) => onSelectedRangeChange("end", event.target.value)}
                type="date"
                value={selectedRange.end}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">任务标题</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              onChange={(event) => onDraftChange("title", event.target.value)}
              placeholder="例如：完成季度规划文档"
              type="text"
              value={draft.title}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">描述</span>
            <textarea
              className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              onChange={(event) => onDraftChange("description", event.target.value)}
              placeholder="补充执行步骤、提醒事项或上下文"
              value={draft.description}
            />
          </label>

          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">颜色标记</span>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition",
                    draft.color === option.value
                      ? cn("bg-slate-900 text-white", option.ringClass, "ring-4")
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                  )}
                  key={option.value}
                  onClick={() => onDraftChange("color", option.value)}
                  type="button"
                >
                  <span className={cn("h-3 w-3 rounded-full", option.swatchClass)} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}

          <div className="flex gap-3">
            <button
              className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={onSubmitTask}
              type="button"
            >
              {isEditing ? "保存修改" : "添加到所选日期范围"}
            </button>
            {isEditing ? (
              <button
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                onClick={onCancelEdit}
                type="button"
              >
                取消
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">范围内任务</h3>
            <p className="mt-1 text-sm text-slate-500">显示与当前选择区间有交集的所有任务。</p>
          </div>
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 text-sm font-semibold text-slate-700">
            {tasks.length}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-500">
            这个时间段还没有任务。可以先拖拽一段日期，再创建第一个计划项。
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const color = COLOR_MAP[task.color];

              return (
                <article
                  className={cn(
                    "rounded-[24px] border bg-white px-4 py-4 shadow-sm",
                    color.borderClass,
                    editingTaskId === task.id && "ring-4 ring-sky-100",
                    draggingTaskId === task.id && "opacity-60",
                  )}
                  key={task.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-3 w-3 rounded-full", color.swatchClass)} />
                        <h4 className="truncate text-sm font-semibold text-slate-900">{task.title}</h4>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {formatRangeLabel({
                          start: task.startDate,
                          end: task.endDate,
                        })}
                      </p>
                    </div>
                    {editingTaskId === task.id ? (
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        正在编辑
                      </span>
                    ) : null}
                  </div>

                  {task.description ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">{task.description}</p>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">无额外描述</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-sky-200 hover:text-sky-700"
                      onClick={() => onEditTask(task.id)}
                      type="button"
                    >
                      编辑
                    </button>
                    <button
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                      onClick={() => onDeleteTask(task.id)}
                      type="button"
                    >
                      删除
                    </button>
                    <span
                      className="cursor-grab rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 active:cursor-grabbing"
                      draggable
                      onDragEnd={onTaskDragEnd}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", task.id);
                        onTaskDragStart(task.id, event);
                      }}
                    >
                      拖拽到日历改期
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </aside>
  );
}
