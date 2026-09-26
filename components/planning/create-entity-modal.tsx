"use client";

import { useState } from "react";
import { Plus, X, CheckSquare, Repeat, FolderKanban, Target, Sparkles } from "lucide-react";
import { actionCreateGoal, actionCreateProject, actionCreateTheme } from "@/actions/planning";
import { actionCreateTask } from "@/actions/execution";
import { actionCreateHabit } from "@/actions/habits";

interface ThemeOption {
  id: string;
  name: string;
  color?: string;
}

export function CreateEntityModal({
  themes = [],
  visions = [],
  goals = [],
  projects = [],
  buttonLabel = "New Item",
  defaultTab = "task",
  onSuccess,
}: {
  themes?: ThemeOption[];
  visions?: { id: string; title: string }[];
  goals?: { id: string; title: string }[];
  projects?: { id: string; title: string }[];
  buttonLabel?: string;
  defaultTab?: "task" | "habit" | "project" | "goal" | "theme";
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"task" | "habit" | "project" | "goal" | "theme">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(themes[0]?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [habitFrequency, setHabitFrequency] = useState<"daily" | "weekly" | "specific_days">("daily");
  const [themeColor, setThemeColor] = useState("#235789");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedProjectId("");
    setSelectedGoalId("");
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
        goal_id: selectedGoalId || null,
        weight: 1,
        due_date: dueDate || null,
      });
    } else if (tab === "habit") {
      res = await actionCreateHabit({
        title,
        description: description || undefined,
        goal_id: selectedGoalId || null,
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
        theme_id: selectedThemeId || null,
        title,
        description: description || undefined,
      });
    } else if (tab === "theme") {
      res = await actionCreateTheme({
        name: title,
        vision_statement: description || undefined,
        color: themeColor,
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

  const effectiveThemes = themes.length > 0 ? themes : visions.map((v) => ({ id: v.id, name: v.title }));

  return (
    <>
      <button
        onClick={() => {
          setTab(defaultTab);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#235789] text-white text-xs font-medium hover:bg-[#1b456e] transition-colors shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{buttonLabel.replace(/^\+\s*/, "")}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-black/[0.06] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="h-13 px-5 border-b border-black/[0.05] flex items-center justify-between">
              <h3 className="font-semibold text-xs text-zinc-900">
                {tab === "task" && "Add Action"}
                {tab === "habit" && "Create Practice"}
                {tab === "project" && "Start Project"}
                {tab === "goal" && "Define Goal"}
                {tab === "theme" && "New Theme"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector tabs as modern segmented control */}
            <div className="px-5 pt-4">
              <div className="p-0.5 bg-zinc-100 rounded-lg flex gap-0.5 text-xs">
                {[
                  { id: "task", label: "Action", icon: CheckSquare },
                  { id: "habit", label: "Practice", icon: Repeat },
                  { id: "project", label: "Project", icon: FolderKanban },
                  { id: "goal", label: "Goal", icon: Target },
                  { id: "theme", label: "Theme", icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id as typeof tab)}
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-[11px] transition-all ${
                        isActive
                          ? "bg-white text-[#235789] font-semibold shadow-2xs"
                          : "text-zinc-500 hover:text-zinc-800 font-medium"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#235789]" : "text-zinc-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              {error && (
                <div className="p-3 bg-red-50 text-[#EE6352] text-xs rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {tab === "theme" ? "Theme Name" : "Title"}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    tab === "task"
                      ? "e.g. Draft product audit"
                      : tab === "habit"
                      ? "e.g. Read for 20 minutes"
                      : tab === "project"
                      ? "e.g. EaseLife Launch"
                      : tab === "goal"
                      ? "e.g. Reach peak physical clarity"
                      : "e.g. Health & Vitality"
                  }
                  className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all bg-white"
                />
              </div>

              {tab === "task" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Project <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        if (e.target.value) setSelectedGoalId("");
                      }}
                      className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                    >
                      <option value="">No Project (Standalone Action)</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!selectedProjectId && goals.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">
                        Connect to Goal <span className="text-zinc-400 font-normal">(optional)</span>
                      </label>
                      <select
                        value={selectedGoalId}
                        onChange={(e) => setSelectedGoalId(e.target.value)}
                        className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                      >
                        <option value="">No Goal (Direct Action)</option>
                        {goals.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Due Date <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                    />
                  </div>
                </div>
              )}

              {tab === "habit" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={habitFrequency}
                      onChange={(e) => setHabitFrequency(e.target.value as typeof habitFrequency)}
                      className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                    >
                      <option value="daily">Every day</option>
                      <option value="specific_days">Weekdays (Mon - Fri)</option>
                      <option value="weekly">Once a week</option>
                    </select>
                  </div>

                  {goals.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">
                        Supports Goal <span className="text-zinc-400 font-normal">(optional)</span>
                      </label>
                      <select
                        value={selectedGoalId}
                        onChange={(e) => setSelectedGoalId(e.target.value)}
                        className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                      >
                        <option value="">No Goal (General Routine)</option>
                        {goals.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {tab === "project" && goals.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Connects to Goal <span className="text-zinc-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                  >
                    <option value="">No Goal (Independent Project)</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {tab === "goal" && effectiveThemes.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Life Theme <span className="text-zinc-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={selectedThemeId}
                    onChange={(e) => setSelectedThemeId(e.target.value)}
                    className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all"
                  >
                    <option value="">General / Independent</option>
                    {effectiveThemes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {tab === "theme" && (
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Theme Color
                  </label>
                  <div className="flex gap-2 items-center">
                    {["#235789", "#00A896", "#60D394", "#F4D35E", "#EE6352", "#18181B"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setThemeColor(c)}
                        className={`w-5 h-5 rounded-full transition-transform ${
                          themeColor === c ? "ring-2 ring-offset-2 ring-zinc-800 scale-110" : ""
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {tab === "theme" ? "Intention Statement (optional)" : "Note (optional)"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    tab === "theme"
                      ? "e.g. Cultivate physical vitality, mental clarity, and consistent energy..."
                      : "Add any context or next steps..."
                  }
                  rows={2}
                  className="w-full text-xs border border-black/[0.08] rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-[#235789] hover:bg-[#1b456e] rounded-lg disabled:opacity-50 transition-colors shadow-2xs"
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
