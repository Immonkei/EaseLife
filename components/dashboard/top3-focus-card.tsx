"use client";

import { useState } from "react";
import { Sparkles, Check, Network, X, Plus } from "lucide-react";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface TopTaskItem {
  id: string;
  position: 1 | 2 | 3;
  task_id: string;
  tasks: {
    id: string;
    title: string;
    status: string;
    weight: number;
    projects?: { title: string } | null;
    goals?: { title: string } | null;
  };
}

interface Top3FocusCardProps {
  topTasks: TopTaskItem[];
  stats: {
    topTasksDone: number;
    topTasksTotal: number;
  };
  visions: Array<{ id: string; title: string }>;
  goals: Array<{ id: string; title: string }>;
  projects: Array<{ id: string; title: string }>;
  onToggleTask: (taskId: string, currentStatus: string) => void;
  onRemoveTop3: (position: 1 | 2 | 3) => void;
  onInspectLineage: (taskId: string) => void;
  onQuickAddTask?: (title: string) => void;
}

export function Top3FocusCard({
  topTasks,
  stats,
  visions,
  goals,
  projects,
  onToggleTask,
  onRemoveTop3,
  onInspectLineage,
  onQuickAddTask,
}: Top3FocusCardProps) {
  const [quickTitle, setQuickTitle] = useState("");

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    if (onQuickAddTask) {
      onQuickAddTask(quickTitle.trim());
      setQuickTitle("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="font-semibold text-base text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            Today&apos;s Focus
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your 3 most important priorities for today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
            {stats.topTasksDone} of {Math.max(stats.topTasksTotal, 3)} Done
          </span>
          <CreateEntityModal visions={visions} goals={goals} projects={projects} defaultTab="task" buttonLabel="+ New Task" />
        </div>
      </div>

      {/* Inline Quick Add Bar */}
      {onQuickAddTask && (
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Add a task for today and press Enter..."
              className="w-full text-xs border border-slate-200/90 rounded-lg pl-3 pr-8 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] bg-slate-50/60 hover:bg-white focus:bg-white transition-all"
            />
            {quickTitle && (
              <button
                type="button"
                onClick={() => setQuickTitle("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-3.5 py-2 rounded-lg bg-[#235789] text-white text-xs font-semibold hover:bg-[#1b456e] disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      )}

      {/* 3 Main Task Slots */}
      <div className="space-y-2.5">
        {([1, 2, 3] as const).map((pos) => {
          const focusItem = topTasks.find((t) => t.position === pos);
          const task = focusItem?.tasks;
          const isCompleted = task?.status === "COMPLETED";

          return task ? (
            <div
              key={pos}
              className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                isCompleted
                  ? "bg-slate-50/60 border-slate-200/60 text-slate-400"
                  : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Circular toggle button */}
                <button
                  onClick={() => onToggleTask(task.id, task.status)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-[#00A896] border-[#00A896] text-white"
                      : "border-slate-300 hover:border-[#00A896] bg-white"
                  }`}
                  aria-label={isCompleted ? "Mark incomplete" : "Complete task"}
                >
                  {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                </button>

                <div className="min-w-0 space-y-0.5">
                  <span
                    className={`text-xs sm:text-sm font-medium truncate block ${
                      isCompleted ? "line-through text-slate-400" : "text-slate-800"
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    {task.projects?.title && (
                      <span className="font-medium text-[#235789] bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                        {task.projects.title}
                      </span>
                    )}
                    {task.goals?.title && (
                      <span className="font-medium text-[#00A896] bg-teal-50 px-1.5 py-0.5 rounded text-[10px]">
                        {task.goals.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  onClick={() => onInspectLineage(task.id)}
                  className="p-1.5 text-slate-400 hover:text-[#235789] hover:bg-slate-100 rounded-md transition-colors"
                  title="View Goal Connection"
                  aria-label="View Goal Connection"
                >
                  <Network className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onRemoveTop3(pos)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="Remove from Today's Focus"
                  aria-label="Remove from Today's Focus"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Clean, inviting empty slot */
            <div
              key={pos}
              className="p-3 rounded-lg border border-dashed border-slate-200/90 bg-slate-50/30 flex items-center justify-between text-xs text-slate-400"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-semibold">
                  {pos}
                </span>
                <span>Focus slot #{pos} is available</span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Star a task below or type above
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
