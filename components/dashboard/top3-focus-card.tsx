"use client";

import { useState } from "react";
import { Check, Compass, Plus, X } from "lucide-react";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface TopTaskItem {
  id: string;
  position: 1 | 2 | 3;
  task_id: string;
  tasks?: {
    id: string;
    title: string;
    status: string;
    due_date?: string | null;
    projects?: { id?: string; title: string } | null;
    goals?: { id?: string; title: string } | null;
  } | null;
}

interface Top3FocusCardProps {
  topTasks: TopTaskItem[];
  stats: {
    topTasksDone: number;
    topTasksTotal: number;
  };
  themes?: Array<{ id: string; name: string; color?: string }>;
  visions?: Array<{ id: string; title: string }>;
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
  themes = [],
  visions = [],
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
    if (!quickTitle.trim() || !onQuickAddTask) return;
    onQuickAddTask(quickTitle.trim());
    setQuickTitle("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
            Today&apos;s Focus
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Your three focal commitments for today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20 tabular-nums">
            {stats.topTasksDone} / {Math.max(stats.topTasksTotal, 3)}
          </span>
          <CreateEntityModal
            themes={themes}
            visions={visions}
            goals={goals}
            projects={projects}
            defaultTab="task"
            buttonLabel="Action"
          />
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
              placeholder="Add a commitment for today..."
              className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#235789]/30 focus:border-[#235789] bg-white transition-all"
            />
            {quickTitle && (
              <button
                type="button"
                onClick={() => setQuickTitle("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-3.5 py-2 rounded-lg bg-[#235789] text-white text-xs font-medium hover:bg-[#1b456e] disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      )}

      {/* 3 Main Task Slots */}
      <div className="space-y-2">
        {([1, 2, 3] as const).map((pos) => {
          const focusItem = topTasks.find((t) => t.position === pos);
          const task = focusItem?.tasks;
          const isCompleted = task?.status === "COMPLETED";

          return task ? (
            <div
              key={pos}
              className={`group flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                isCompleted
                  ? "bg-zinc-50/60 border-black/[0.04] text-zinc-400"
                  : "bg-white border-black/[0.07] hover:border-black/[0.12] shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Circular toggle button */}
                <button
                  onClick={() => onToggleTask(task.id, task.status)}
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? "bg-[#00A896] border-[#00A896] text-white"
                      : "border-zinc-300 hover:border-zinc-800 bg-white"
                  }`}
                  aria-label={isCompleted ? "Mark incomplete" : "Complete task"}
                >
                  {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                </button>

                <div className="min-w-0 space-y-0.5">
                  <span
                    className={`text-xs sm:text-sm font-medium truncate block ${
                      isCompleted ? "line-through text-zinc-400" : "text-zinc-900"
                    }`}
                  >
                    {task.title}
                  </span>

                  {/* Context breadcrumb */}
                  <div className="flex items-center gap-2 text-[11px]">
                    {task.projects?.title && (
                      <button
                        type="button"
                        onClick={() => onInspectLineage(task.id)}
                        className="text-[#235789] hover:underline transition-colors flex items-center gap-1 font-medium"
                        title="View Why This Matters"
                      >
                        <span className="text-[#235789]/60">↳</span>
                        <span>{task.projects.title}</span>
                      </button>
                    )}
                    {task.goals?.title && !task.projects?.title && (
                      <button
                        type="button"
                        onClick={() => onInspectLineage(task.id)}
                        className="text-[#00A896] hover:underline transition-colors flex items-center gap-1 font-medium"
                        title="View Why This Matters"
                      >
                        <span className="text-[#00A896]/60">↳</span>
                        <span>{task.goals.title}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover-revealed action controls */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onInspectLineage(task.id)}
                  className="p-1.5 text-zinc-400 hover:text-[#235789] hover:bg-[#235789]/10 rounded-md transition-colors"
                  title="Why this matters"
                  aria-label="Why this matters"
                >
                  <Compass className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onRemoveTop3(pos)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors"
                  title="Remove from today's focus"
                  aria-label="Remove from today's focus"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              key={pos}
              className="p-3.5 rounded-lg border border-dashed border-black/[0.08] hover:border-black/[0.15] bg-zinc-50/40 text-xs text-zinc-400 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-4.5 h-4.5 rounded-full border border-dashed border-zinc-200 flex items-center justify-center text-[10px] text-zinc-300 font-mono">
                  {pos}
                </span>
                <span>Focus slot {pos} is open</span>
              </span>
              <CreateEntityModal
                themes={themes}
                visions={visions}
                goals={goals}
                projects={projects}
                defaultTab="task"
                buttonLabel="Fill"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
