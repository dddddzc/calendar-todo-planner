import { useState } from "react";
import { CalendarGrid } from "./components/CalendarGrid";
import { CalendarHeader } from "./components/CalendarHeader";
import { TaskComposer } from "./components/TaskComposer";
import { TaskListPopover } from "./components/TaskListPopover";
import { usePlanner } from "./hooks/usePlanner";

function App() {
  const planner = usePlanner();
  const [taskListOpen, setTaskListOpen] = useState(false);

  return (
    <main className="min-h-screen bg-app-grid px-3 py-3 text-slate-900 md:px-5 md:py-5">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1480px] flex-col gap-3 pb-28 md:pb-32">
        <CalendarHeader
          currentMonth={planner.currentMonth}
          monthTaskCount={planner.monthTaskCount}
          onNext={planner.goToNextMonth}
          onPrev={planner.goToPrevMonth}
          onToday={planner.goToToday}
          onToggleTaskList={() => setTaskListOpen((currentState) => !currentState)}
          taskListOpen={taskListOpen}
        />

        <CalendarGrid
          days={planner.calendarDays}
          onDayMouseDown={planner.handleDayMouseDown}
          onDayMouseEnter={planner.handleDayMouseEnter}
          onDayMouseUp={planner.handleDayMouseUp}
          onTaskDelete={planner.handleDeleteTask}
          onTaskResizeStart={planner.handleTaskResizeStart}
          onTaskSelect={planner.handleTaskSelect}
          resizeState={planner.resizeState}
          selectedRange={planner.selectedRange}
          selectedTaskId={planner.selectedTaskId}
          tasks={planner.currentMonthTasks}
        />

        <TaskListPopover
          isOpen={taskListOpen}
          onClose={() => setTaskListOpen(false)}
          onTaskSelect={planner.handleTaskSelect}
          tasks={planner.currentMonthTasks}
        />
      </div>

      <TaskComposer
        draft={planner.draft}
        formError={planner.formError}
        isEditingTask={planner.isEditingTask}
        onClearSelection={planner.handleClearSelection}
        onDraftChange={planner.handleDraftChange}
        onSubmitTask={planner.handleSubmitTask}
        selectedTaskId={planner.selectedTaskId}
        selectionDayCount={planner.selectionDayCount}
        selectionLabel={planner.selectionLabel}
      />
    </main>
  );
}

export default App;
