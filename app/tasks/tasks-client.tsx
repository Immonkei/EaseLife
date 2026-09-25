"use client";

import { useState } from "react";
import { Network, Check, Plus, X } from "lucide-react";
import { LineageDrawer } from "@/components/lineage/lineage-drawer";
import { actionToggleTaskStatus, actionCreateTask } from "@/actions/execution";

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
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [quickTitle, setQuickTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    await actionToggleTaskStatus(taskId, currentStatus);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const res = await actionCreateTask({ title: quickTitle.trim(), weight: 1 });
    if (res.data) {
      setTasks((prev) => [
        {
          id: res.data!.id,
          title: res.data!.title,
          status: "TODO",
          weight: 1,
          priority: "medium",
          due_date: null,
          projects: null,
          goals: null,
        },
        ...prev,
      ]);
      setQuickTitle("");
    }
    setIsSubmitting(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "todo") return t.status !== "COMPLETED";
    if (filter === "done") return t.status === "COMPLETED";
    return true;
  });

  const todoCount = tasks.filter((t) => t.status !== "COMPLETED").length;
  const doneCount = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-4">
      {/* Inline Quick Add Bar */}
      <form onSubmit={handleQuickAdd} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Add a new task and press Enter..."
            className="w-full text-sm border border-slate-200/90 rounded-lg pl-3.5 pr-8 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] bg-white transition-all shadow-2xs"
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
          disabled={!quickTitle.trim() || isSubmitting}
          className="px-4 py-2.5 rounded-lg bg-[#235789] text-white text-xs font-semibold hover:bg-[#1b456e] disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === "all"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("todo")}
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === "todo"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            To Do ({todoCount})
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === "done"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Completed ({doneCount})
          </button>
        </div>

        <span className="text-xs text-slate-400">
          {todoCount} remaining
        </span>
      </div>

      {/* Tasks List */}
      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {filteredTasks.map((task) => {
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
                      {task.projects?.title && (
                        <span className="text-[#235789] bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                          {task.projects.title}
                        </span>
                      )}
                      {task.goals?.title && (
                        <span className="text-[#00A896] bg-teal-50 px-1.5 py-0.2 rounded font-medium">
                          {task.goals.title}
                        </span>
                      )}
                      {task.due_date && (
                        <span>Due {task.due_date}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setInspectTaskId(task.id)}
                  className="p-1.5 text-slate-400 hover:text-[#235789] hover:bg-slate-100 rounded-md transition-colors shrink-0"
                  title="View Goal Connection"
                  aria-label="View Goal Connection"
                >
                  <Network className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
          <p className="text-xs font-semibold text-slate-600">
            {filter === "done" ? "No completed tasks yet." : "No tasks found."}
          </p>
          <p className="text-[11px] text-slate-400">
            Type a task in the field above to get started.
          </p>
        </div>
      )}

      {/* Goal Connection Lineage Drawer */}
      <LineageDrawer taskId={inspectTaskId} onClose={() => setInspectTaskId(null)} />
    </div>
  );
}
