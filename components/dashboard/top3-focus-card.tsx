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
}: Top3FocusCardProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="font-semibold text-base text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F4D35E]" />
            Today&apos;s Focus
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            3 main tasks selected for today&apos;s execution runway.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 tabular-nums">
            {stats.topTasksDone} / {stats.topTasksTotal} Done
          </span>
          <CreateEntityModal visions={visions} goals={goals} projects={projects} />
        </div>
      </div>

      {/* 3 Main Task Slots (Mockup Matching) */}
      <div className="space-y-2.5">
        {([1, 2, 3] as const).map((pos) => {
          const focusItem = topTasks.find((t) => t.position === pos);
          const task = focusItem?.tasks;
          const isCompleted = task?.status === "COMPLETED";

          return task ? (
            <div
              key={pos}
              className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
                isCompleted
                  ? "bg-slate-50/70 border-slate-200/60 text-slate-400"
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
                    className={`text-sm font-medium truncate block ${
                      isCompleted ? "line-through text-slate-400" : "text-slate-800"
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
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                {/* Completed badge matching mockup */}
                {isCompleted && (
                  <span className="w-5 h-5 rounded-full bg-[#00A896] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </span>
                )}

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
            </div>
          ) : (
            /* Clean, inviting empty slot */
            <div
              key={pos}
              className="p-3.5 rounded-lg border border-dashed border-slate-200/90 bg-slate-50/40 flex items-center justify-between text-xs text-slate-400"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                  {pos}
                </span>
                <span>Main task #{pos} slot is open</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Assign from queue below or create new
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
