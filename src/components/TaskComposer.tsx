import { COLOR_OPTIONS } from "../lib/colors";
import { cn } from "../lib/cn";
import { TaskColorKey, TaskDraft } from "../types";

interface TaskComposerProps {
  draft: TaskDraft;
  formError: string | null;
  isEditingTask: boolean;
  selectionDayCount: number;
  selectionLabel: string;
  selectedTaskId: string | null;
  onClearSelection: () => void;
  onDraftChange: <Key extends keyof TaskDraft>(field: Key, value: TaskDraft[Key]) => void;
  onSubmitTask: () => void;
}

export function TaskComposer({
  draft,
  formError,
  isEditingTask,
  selectionDayCount,
  selectionLabel,
  selectedTaskId,
  onClearSelection,
  onDraftChange,
  onSubmitTask,
}: TaskComposerProps) {
  const handleColorChange = (color: TaskColorKey) => {
    onDraftChange("color", color);
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 md:left-4 md:right-4">
      <div className="mx-auto max-w-[1480px] rounded-[26px] border border-slate-200/80 bg-white/94 p-3 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 xl:max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {isEditingTask ? "选中任务" : "创建任务"}
            </p>
            <h2 className="mt-1 truncate text-base font-semibold text-slate-900 md:text-lg">
              {selectionLabel}
            </h2>
            <p className="mt-1 text-xs text-slate-500 md:text-sm">
              {isEditingTask
                ? "可直接拖动日历任务条的左右边界调整范围，右键可删除。名称和颜色在这里修改。"
                : `当前选择共 ${selectionDayCount} 天，输入任务名称并选择颜色后创建。`}
            </p>
          </div>

          <div className="flex-1 space-y-2.5">
            <div className="flex flex-col gap-2.5 lg:flex-row">
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                onChange={(event) => onDraftChange("title", event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onSubmitTask();
                  }
                }}
                placeholder="输入任务名称"
                type="text"
                value={draft.title}
              />

              <div className="flex gap-2">
                <button
                  className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={onSubmitTask}
                  type="button"
                >
                  {isEditingTask ? "保存任务" : "创建任务"}
                </button>
                {selectedTaskId ? (
                  <button
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    onClick={onClearSelection}
                    type="button"
                  >
                    取消选中
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                    draft.color === option.value
                      ? cn("bg-slate-900 text-white", option.ringClass, "ring-4")
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                  )}
                  key={option.value}
                  onClick={() => handleColorChange(option.value)}
                  type="button"
                >
                  <span className={cn("h-3 w-3 rounded-full", option.swatchClass)} />
                  {option.label}
                </button>
              ))}
            </div>

            {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
