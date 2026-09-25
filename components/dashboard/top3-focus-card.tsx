import { Sparkles, Check, Network, X } from "lucide-react";

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F4D35E]" />
            Today&apos;s Focus
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary 3 tasks selected for today&apos;s execution runway.
          </p>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 tabular-nums">
          {stats.topTasksDone} / {stats.topTasksTotal} Done
        </span>
      </div>

      {/* 3 Main Task Slots */}
      <div className="space-y-2.5">
        {([1, 2, 3] as const).map((pos) => {
          const focusItem = topTasks.find((t) => t.position === pos);
          const task = focusItem?.tasks;
          const isCompleted = task?.status === "COMPLETED";

          return (
            <div
              key={pos}
              className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
                task
                  ? isCompleted
                    ? "bg-slate-50/60 border-slate-200/60 text-slate-400"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                  : "bg-slate-50/40 border-dashed border-slate-200 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Circular checkbox */}
                <button
                  onClick={() => task && onToggleTask(task.id, task.status)}
                  disabled={!task}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-[#00A896] border-[#00A896] text-white"
                      : task
                      ? "border-slate-300 hover:border-[#00A896] bg-white"
                      : "border-slate-200 bg-transparent cursor-default"
                  }`}
                  aria-label={isCompleted ? "Mark incomplete" : "Complete task"}
                >
                  {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                </button>

                {task ? (
                  <div className="min-w-0 space-y-0.5">
                    <span
                      className={`text-sm font-medium truncate block ${
                        isCompleted
                          ? "line-through text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      {task.projects?.title && (
                        <span className="font-medium text-[#235789]">
                          {task.projects.title}
                        </span>
                      )}
                      {task.goals?.title && (
                        <span className="font-medium text-[#00A896]">
                          {task.goals.title}
                        </span>
                      )}
                      <span>&bull;</span>
                      <span className="tabular-nums">Weight {task.weight}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Slot {pos} is open &mdash; assign from queue below
                  </span>
                )}
              </div>

              {task && (
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <button
                    onClick={() => onInspectLineage(task.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-[#235789] hover:bg-slate-100 transition-colors"
                    title="View Lineage"
                  >
                    <Network className="w-3 h-3" />
                    <span>Lineage</span>
                  </button>
                  <button
                    onClick={() => onRemoveTop3(pos)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                    title="Remove from Focus"
                  >
                    <X className="w-3.5 h-3.5" />
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
