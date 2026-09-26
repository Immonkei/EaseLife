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
            placeholder="Add an action and press Enter..."
            className="w-full text-xs sm:text-sm border border-black/[0.08] rounded-lg pl-3.5 pr-8 py-2 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 bg-white transition-all"
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
          disabled={!quickTitle.trim() || isSubmitting}
          className="px-3.5 py-2 rounded-lg bg-[#235789] text-white text-xs font-medium hover:bg-[#1b456e] disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-1 bg-zinc-100/80 p-0.5 rounded-md text-xs font-medium border border-black/[0.04]">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-sm transition-colors text-xs ${
              filter === "all"
                ? "bg-white text-[#235789] font-semibold shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("todo")}
            className={`px-2.5 py-1 rounded-sm transition-colors text-xs ${
              filter === "todo"
                ? "bg-white text-[#235789] font-semibold shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            To Do ({todoCount})
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-2.5 py-1 rounded-sm transition-colors text-xs ${
              filter === "done"
                ? "bg-white text-[#235789] font-semibold shadow-2xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Completed ({doneCount})
          </button>
        </div>

        <span className="text-xs text-zinc-400 font-normal">
          {todoCount} remaining
        </span>
      </div>

      {/* Tasks List */}
      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="bg-white border border-black/[0.06] rounded-xl divide-y divide-black/[0.04] overflow-hidden">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";
            return (
              <div
                key={task.id}
                className={`group px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                  isCompleted ? "bg-zinc-50/50" : "hover:bg-zinc-50/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggle(task.id, task.status)}
                    className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? "bg-[#00A896] border-[#00A896] text-white"
                        : "border-zinc-300 hover:border-[#00A896] bg-white"
                    }`}
                    aria-label={isCompleted ? "Mark incomplete" : "Complete task"}
                  >
                    {isCompleted && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                  </button>

                  <div className="space-y-0.5 min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-normal truncate block ${
                        isCompleted
                          ? "line-through text-zinc-400"
                          : "text-zinc-800"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      {task.projects?.title && (
                        <span className="text-[#235789] bg-[#235789]/10 px-1.5 py-0.5 rounded text-[10px] font-medium">
                          {task.projects.title}
                        </span>
                      )}
                      {task.goals?.title && (
                        <span className="text-[#00A896] bg-[#00A896]/10 px-1.5 py-0.5 rounded text-[10px] font-medium">
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
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-[#235789] hover:bg-[#235789]/10 rounded transition-all shrink-0"
                  title="Why this matters"
                  aria-label="Why this matters"
                >
                  <Network className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white border border-dashed border-zinc-200 rounded-xl text-center space-y-1.5">
          <p className="text-xs font-medium text-zinc-600">
            {filter === "done" ? "No completed actions yet." : "No actions found."}
          </p>
          <p className="text-[11px] text-zinc-400">
            Type an action in the field above to get started.
          </p>
        </div>
      )}

      {/* Goal Connection Lineage Drawer */}
      <LineageDrawer taskId={inspectTaskId} onClose={() => setInspectTaskId(null)} />
    </div>
  );
}
