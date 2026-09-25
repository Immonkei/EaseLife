import { Sparkles, Check, Network } from "lucide-react";

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
  onToggleTask: (taskId: string, currentStatus: string) => void;
  onRemoveTop3: (position: 1 | 2 | 3) => void;
  onInspectLineage: (taskId: string) => void;
}

export function Top3FocusCard({
  topTasks,
  stats,
  onToggleTask,
  onRemoveTop3,
  onInspectLineage,
}: Top3FocusCardProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="font-bold text-base text-[var(--foreground)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4D35E]" />
            Today&apos;s Focus
          </h2>
          <p className="text-xs text-[var(--foreground-muted)]">
            3 main tasks selected for today&apos;s execution runway.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF2F4] text-[#235789] tabular-nums">
          {stats.topTasksDone} of {stats.topTasksTotal} Done
        </span>
      </div>

      {/* 3 Main Tasks Slots with circular checkboxes */}
      <div className="space-y-3">
        {([1, 2, 3] as const).map((pos) => {
          const focusItem = topTasks.find((t) => t.position === pos);
          const task = focusItem?.tasks;
          const isCompleted = task?.status === "COMPLETED";

          return (
            <div
              key={pos}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-150 ${
                task
                  ? isCompleted
                    ? "bg-slate-50 border-slate-200 text-slate-400"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                  : "bg-[#EDF2F4]/50 border-dashed border-slate-200 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Circular check button */}
                <button
                  onClick={() => task && onToggleTask(task.id, task.status)}
                  disabled={!task}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-[#00A896] border-[#00A896] text-white"
                      : task
                      ? "border-slate-300 hover:border-[#00A896] bg-white"
                      : "border-slate-200 bg-transparent"
                  }`}
                  title={isCompleted ? "Mark incomplete" : "Complete task"}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {task ? (
                  <div className="min-w-0 space-y-0.5">
                    <span
                      className={`text-sm font-semibold truncate block ${
                        isCompleted
                          ? "line-through text-slate-400"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]">
                      {task.projects?.title && (
                        <span className="font-medium text-[#235789]">
                          Project: {task.projects.title}
                        </span>
                      )}
                      {task.goals?.title && (
                        <span className="font-medium text-[#00A896]">
                          Goal: {task.goals.title}
                        </span>
                      )}
                      <span>&bull;</span>
                      <span className="tabular-nums font-semibold">Weight {task.weight}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Main task #{pos} slot is open — assign from queue below
                  </span>
                )}
              </div>

              {task && (
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => onInspectLineage(task.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#235789] bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Lineage</span>
                  </button>
                  <button
                    onClick={() => onRemoveTop3(pos)}
                    className="text-slate-400 hover:text-red-500 text-sm p-1 rounded"
                    title="Remove from Today's Focus"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
