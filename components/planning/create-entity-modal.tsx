"use client";

import { useState } from "react";
import { Plus, X, CheckSquare, Repeat, FolderKanban, Target } from "lucide-react";
import { actionCreateGoal, actionCreateProject } from "@/actions/planning";
import { actionCreateTask } from "@/actions/execution";
import { actionCreateHabit } from "@/actions/habits";

export function CreateEntityModal({
  visions = [],
  goals = [],
  projects = [],
  buttonLabel = "New Item",
  defaultTab = "task",
  onSuccess,
}: {
  visions?: { id: string; title: string }[];
  goals?: { id: string; title: string }[];
  projects?: { id: string; title: string }[];
  buttonLabel?: string;
  defaultTab?: "task" | "habit" | "project" | "goal";
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"task" | "habit" | "project" | "goal">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || "");
  const [selectedVisionId] = useState(visions[0]?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [habitFrequency, setHabitFrequency] = useState<"daily" | "weekly" | "specific_days">("daily");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedProjectId("");
    setDueDate("");
    setError(null);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res: { error?: string } | undefined;

    if (tab === "task") {
      res = await actionCreateTask({
        title,
        description: description || undefined,
        project_id: selectedProjectId || null,
        goal_id: null,
        weight: 1,
        due_date: dueDate || null,
      });
    } else if (tab === "habit") {
      res = await actionCreateHabit({
        title,
        frequency: { type: habitFrequency },
      });
    } else if (tab === "project") {
      res = await actionCreateProject({
        goal_id: selectedGoalId || null,
        title,
        description: description || undefined,
      });
    } else if (tab === "goal") {
      res = await actionCreateGoal({
        vision_id: selectedVisionId || null,
        title,
        description: description || undefined,
      });
    }

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      resetForm();
      setIsOpen(false);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setTab(defaultTab);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#235789] text-white text-xs font-semibold hover:bg-[#1b456e] transition-colors shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="h-14 px-5 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900">
                {tab === "task" && "Add Task"}
                {tab === "habit" && "Create Habit"}
                {tab === "project" && "Start Project"}
                {tab === "goal" && "Set Goal"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector tabs as modern segmented control */}
            <div className="px-5 pt-4">
              <div className="p-1 bg-slate-100 rounded-lg flex gap-1 text-xs">
                {[
                  { id: "task", label: "Task", icon: CheckSquare },
                  { id: "habit", label: "Habit", icon: Repeat },
                  { id: "project", label: "Project", icon: FolderKanban },
                  { id: "goal", label: "Goal", icon: Target },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id as typeof tab)}
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-md text-xs transition-all ${
                        isActive
                          ? "bg-white text-slate-900 font-semibold shadow-2xs"
                          : "text-slate-500 hover:text-slate-800 font-medium"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#235789]" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-[#EE6352] text-xs rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    tab === "task"
                      ? "e.g. Finalize presentation slides"
                      : tab === "habit"
                      ? "e.g. Read for 20 minutes"
                      : tab === "project"
                      ? "e.g. Website Redesign"
                      : "e.g. Improve daily physical health"
                  }
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                />
              </div>

              {tab === "task" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                    >
                      <option value="">No Project (Standalone Task)</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Due Date <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                    />
                  </div>
                </div>
              )}

              {tab === "habit" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value as typeof habitFrequency)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                  >
                    <option value="daily">Every day</option>
                    <option value="specific_days">Weekdays (Mon - Fri)</option>
                    <option value="weekly">Once a week</option>
                  </select>
                </div>
              )}

              {tab === "project" && goals.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Connects to Goal <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                  >
                    <option value="">No Goal</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any extra details or reminders..."
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#235789] hover:bg-[#1b456e] rounded-lg disabled:opacity-50 transition-colors shadow-2xs"
                >
                  {loading ? "Adding..." : `Add ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
