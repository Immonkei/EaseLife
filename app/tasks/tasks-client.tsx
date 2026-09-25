"use client";

import { useState } from "react";
import { Network, CheckSquare } from "lucide-react";
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
        <div className="bg-white border border-[var(--border)] rounded-xl shadow-xs divide-y divide-slate-100 overflow-hidden">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                task.status === "COMPLETED" ? "bg-slate-50 opacity-60" : "hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(task.id, task.status)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    task.status === "COMPLETED"
                      ? "bg-[var(--growth)] border-[var(--growth)] text-white"
                      : "border-slate-300 hover:border-[var(--primary)]"
                  }`}
                >
                  {task.status === "COMPLETED" && <CheckSquare className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-0.5">
                  <span
                    className={`text-sm font-semibold ${
                      task.status === "COMPLETED"
                        ? "line-through text-slate-400"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]">
                    {task.projects?.title ? (
                      <span className="text-indigo-600 font-medium">
                        Project: {task.projects.title}
                      </span>
                    ) : task.goals?.title ? (
                      <span className="text-emerald-600 font-medium">
                        Goal: {task.goals.title}
                      </span>
                    ) : (
                      <span>Direct Task</span>
                    )}
                    <span>&bull;</span>
                    <span>Weight: {task.weight}</span>
                    {task.due_date && (
                      <>
                        <span>&bull;</span>
                        <span>Due: {task.due_date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectTaskId(task.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--primary)] bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Network className="w-3.5 h-3.5" />
                Lineage
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
          <p className="text-sm font-medium text-slate-600">No tasks found.</p>
          <p className="text-xs text-slate-400">
            Create tasks from the Daily Runway dashboard.
          </p>
        </div>
      )}

      {/* Lineage Drawer */}
      <LineageDrawer taskId={inspectTaskId} onClose={() => setInspectTaskId(null)} />
    </div>
  );
}
