"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { actionCreateVision, actionCreateGoal, actionCreateMilestone, actionCreateProject } from "@/actions/planning";
import { actionCreateTask } from "@/actions/execution";

export function CreateEntityModal({
  visions = [],
  goals = [],
  projects = [],
}: {
  visions?: { id: string; title: string }[];
  goals?: { id: string; title: string }[];
  projects?: { id: string; title: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"task" | "project" | "milestone" | "goal" | "vision">("task");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVisionId, setSelectedVisionId] = useState(visions[0]?.id || "");
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || "");
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [taskTarget, setTaskTarget] = useState<"project" | "goal">("project");
  const [weight, setWeight] = useState(1);
  const [dueDate, setDueDate] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setError(null);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res: { error?: string } | undefined;

    if (tab === "vision") {
      res = await actionCreateVision({ title, description });
    } else if (tab === "goal") {
      res = await actionCreateGoal({ vision_id: selectedVisionId, title, description });
    } else if (tab === "milestone") {
      res = await actionCreateMilestone({ goal_id: selectedGoalId, title });
    } else if (tab === "project") {
      res = await actionCreateProject({ goal_id: selectedGoalId, title, description });
    } else if (tab === "task") {
      res = await actionCreateTask({
        title,
        description,
        project_id: taskTarget === "project" ? selectedProjectId : null,
        goal_id: taskTarget === "goal" ? selectedGoalId : null,
        weight: Number(weight),
        due_date: dueDate || null,
      });
    }

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      resetForm();
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#235789] text-white text-xs font-semibold hover:bg-[#1b456e] transition-colors shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>New Item</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="h-14 px-5 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900">Create New Life Work</h3>
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
              <div className="p-1 bg-slate-100/90 rounded-lg flex gap-1 text-xs">
                {(["task", "project", "milestone", "goal", "vision"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 capitalize rounded-md transition-all ${
                      tab === t
                        ? "bg-white text-slate-900 font-semibold shadow-2xs"
                        : "text-slate-500 hover:text-slate-800 font-medium"
                    }`}
                  >
                    {t}
                  </button>
                ))}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`What is this ${tab} called?`}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                />
              </div>

              {tab === "goal" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Connects to Life Vision
                  </label>
                  <select
                    value={selectedVisionId}
                    onChange={(e) => setSelectedVisionId(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                  >
                    {visions.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(tab === "project" || tab === "milestone") && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Connects to Goal
                  </label>
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                  >
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {tab === "task" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Task Connection (XOR Constraint)
                    </label>
                    <div className="flex gap-4 text-xs font-medium mb-2 text-slate-700">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="target"
                          checked={taskTarget === "project"}
                          onChange={() => setTaskTarget("project")}
                          className="accent-[#235789]"
                        />
                        Under Project
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="target"
                          checked={taskTarget === "goal"}
                          onChange={() => setTaskTarget("goal")}
                          className="accent-[#235789]"
                        />
                        Direct Goal Task
                      </label>
                    </div>

                    {taskTarget === "project" ? (
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={selectedGoalId}
                        onChange={(e) => setSelectedGoalId(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                      >
                        {goals.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Task Weight
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Context (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
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
                  {loading ? "Creating..." : `Create ${tab}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
