"use client";

import { useState } from "react";
import { Network, Check } from "lucide-react";
import { LineageDrawer } from "@/components/lineage/lineage-drawer";
import { actionToggleTaskStatus } from "@/actions/execution";

export function TasksClient({
  initialTasks,
}: {
  initialTasks: Array<{
    id: string;
    title: string;
    status: string;
    weight: number;
    priority: string;
    due_date: string | null;
    projects?: { id: string; title: string } | null;
    goals?: { id: string; title: string } | null;
  }>;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [inspectTaskId, setInspectTaskId] = useState<string | null>(null);

  const handleToggle = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    await actionToggleTaskStatus(taskId, currentStatus);
  };

  return (
    <div className="space-y-4">
      {tasks && tasks.length > 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";
            return (
              <div
                key={task.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  isCompleted ? "bg-slate-50/50" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggle(task.id, task.status)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? "bg-[#00A896] border-[#00A896] text-white"
                        : "border-slate-300 hover:border-[#00A896] bg-white"
                    }`}
                    aria-label={isCompleted ? "Mark incomplete" : "Complete task"}
                  >
                    {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>

                  <div className="space-y-0.5 min-w-0">
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
                      {task.projects?.title ? (
                        <span className="text-[#235789] font-medium">
                          {task.projects.title}
                        </span>
                      ) : task.goals?.title ? (
                        <span className="text-[#00A896] font-medium">
                          {task.goals.title}
                        </span>
                      ) : (
                        <span>Direct Task</span>
                      )}
                      <span>&bull;</span>
                      <span className="tabular-nums">Weight {task.weight}</span>
                      {task.due_date && (
                        <>
                          <span>&bull;</span>
                          <span className="tabular-nums">Due {task.due_date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setInspectTaskId(task.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[#235789] hover:bg-slate-100 transition-colors shrink-0"
                >
                  <Network className="w-3 h-3" />
                  <span>Lineage</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
          <p className="text-xs font-medium text-slate-600">No tasks created yet.</p>
          <p className="text-[11px] text-slate-400">
            Create tasks from the Daily Runway to populate your execution list.
          </p>
        </div>
      )}

      {/* Lineage Drawer */}
      <LineageDrawer taskId={inspectTaskId} onClose={() => setInspectTaskId(null)} />
    </div>
  );
}
