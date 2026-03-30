import { CalendarGrid } from "./components/CalendarGrid";
import { CalendarHeader } from "./components/CalendarHeader";
import { TaskPanel } from "./components/TaskPanel";
import { usePlanner } from "./hooks/usePlanner";

function App() {
  const planner = usePlanner();

  return (
    <main className="min-h-screen bg-app-grid px-4 py-5 text-slate-900 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur md:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-600">
                React + TypeScript
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                基于日历的 ToDo 规划应用
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                面向浏览器运行的轻量任务规划工具。用月历快速圈选日期区间，把任务像事件一样挂载到日历上，并自动持久化到本地存储。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">选择方式</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">点击单天 / 拖拽连续多天</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">数据存储</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">自动写入 localStorage</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">任务展示</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">摘要 + 编辑改期 + 搜索筛选</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-[32px] border border-white/60 bg-white/78 p-5 shadow-soft backdrop-blur md:p-6">
            <CalendarHeader
              currentMonth={planner.currentMonth}
              monthTaskCount={planner.monthTaskCount}
              onNext={planner.goToNextMonth}
              onPrev={planner.goToPrevMonth}
              onToday={planner.goToToday}
            />

            <div className="mt-6">
              <CalendarGrid
                days={planner.calendarDays}
                draggingTaskId={planner.draggingTaskId}
                dropTargetIso={planner.dropTargetIso}
                onDayDragOver={planner.handleDayDragOver}
                onDayMouseDown={planner.handleDayMouseDown}
                onDayMouseEnter={planner.handleDayMouseEnter}
                onDayMouseUp={planner.handleDayMouseUp}
                onTaskDragEnd={planner.handleTaskDragEnd}
                onTaskDragStart={planner.handleTaskDragStart}
                onTaskDrop={planner.handleTaskDrop}
                selectedRange={planner.selectedRange}
                tasksByDate={planner.tasksByDate}
              />
            </div>
          </section>

          <TaskPanel
            filteredTaskCount={planner.filteredTaskCount}
            hasActiveTaskFilters={planner.hasActiveTaskFilters}
            draft={planner.draft}
            draggingTaskId={planner.draggingTaskId}
            editingTaskId={planner.editingTaskId}
            formError={planner.formError}
            isEditing={planner.isEditing}
            scopedTaskCount={planner.scopedTaskCount}
            taskColorFilter={planner.taskColorFilter}
            taskQuery={planner.taskQuery}
            taskScope={planner.taskScope}
            onClearTaskFilters={planner.clearTaskFilters}
            onCancelEdit={planner.handleCancelEdit}
            onDeleteTask={planner.handleDeleteTask}
            onDraftChange={planner.handleDraftChange}
            onEditTask={planner.handleEditTask}
            onSelectedRangeChange={planner.handleSelectedRangeChange}
            onSubmitTask={planner.handleSubmitTask}
            onTaskColorFilterChange={planner.handleTaskColorFilterChange}
            onTaskDragEnd={planner.handleTaskDragEnd}
            onTaskDragStart={planner.handleTaskDragStart}
            onTaskQueryChange={planner.handleTaskQueryChange}
            onTaskScopeChange={planner.handleTaskScopeChange}
            selectedRange={planner.selectedRange}
            selectionDayCount={planner.selectionDayCount}
            selectionLabel={planner.selectionLabel}
            tasks={planner.filteredTasks}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
