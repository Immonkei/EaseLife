"use client";

import { useState } from "react";
import {
  Compass,
  Target,
  FolderKanban,
  Repeat,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { LifeTheme, Goal, Project, Habit } from "@/types/domain";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface HorizonsClientProps {
  initialThemes: LifeTheme[];
  initialGoals: Goal[];
  initialProjects: (Project & { progress?: { percentage: number }; humanStatus?: string; completedTasksCount?: number; totalTasksCount?: number })[];
  initialHabits: (Habit & { currentStreak?: number; consistencyRate?: number })[];
}

export function HorizonsClient({
  initialThemes,
  initialGoals,
  initialProjects,
  initialHabits,
}: HorizonsClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "themes" | "goals" | "projects" | "habits">("all");
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  // Filter items by theme if a theme card is clicked
  const filteredGoals = selectedThemeId
    ? initialGoals.filter((g) => g.theme_id === selectedThemeId || g.domain_id === selectedThemeId)
    : initialGoals;

  const standaloneGoals = initialGoals.filter((g) => !g.theme_id && !g.domain_id && !g.vision_id);
  const standaloneProjects = initialProjects.filter((p) => !p.goal_id);
  const standaloneHabits = initialHabits.filter((h) => !h.goal_id);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-zinc-900" />
            <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Horizons</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Where you are heading — connect broad life themes to target outcomes, projects, and daily practices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CreateEntityModal
            themes={initialThemes}
            goals={initialGoals}
            projects={initialProjects}
            defaultTab="goal"
            buttonLabel="New Item"
          />
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-100 rounded-lg max-w-fit text-xs">
        {[
          { id: "all", label: "Full Horizon", count: initialThemes.length + initialGoals.length + initialProjects.length + initialHabits.length },
          { id: "themes", label: "Themes", count: initialThemes.length },
          { id: "goals", label: "Goals", count: initialGoals.length },
          { id: "projects", label: "Projects", count: initialProjects.length },
          { id: "habits", label: "Practices", count: initialHabits.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-white text-[#235789] font-semibold shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${isActive ? "bg-[#235789]/10 text-[#235789] font-semibold" : "bg-zinc-200/60 text-zinc-500"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. Life Themes Section */}
      {(activeTab === "all" || activeTab === "themes") && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-700" />
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Life Themes</h2>
            </div>
            {selectedThemeId && (
              <button
                onClick={() => setSelectedThemeId(null)}
                className="text-xs text-zinc-500 hover:text-zinc-900 font-medium underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {initialThemes.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              const themeGoals = initialGoals.filter((g) => g.theme_id === theme.id || g.domain_id === theme.id);

              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedThemeId(isSelected ? null : theme.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative overflow-hidden ${
                    isSelected
                      ? "border-[#235789] ring-1 ring-[#235789] shadow-xs"
                      : "border-black/[0.06] hover:border-black/[0.12] shadow-2xs"
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: theme.color || "#235789" }}
                  />

                  <div className="flex items-center justify-between mt-1 mb-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: theme.color || "#235789" }}
                    />
                    <span className="text-[11px] font-medium text-zinc-400 tabular-nums">
                      {themeGoals.length} {themeGoals.length === 1 ? "Goal" : "Goals"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs text-zinc-900">{theme.name}</h3>

                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {theme.vision_statement || "Guiding intention for this sphere of life."}
                  </p>

                  <div className="mt-3 pt-2 border-t border-black/[0.04] flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{isSelected ? "Filtered" : "Filter goals"}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. Active Goals Section */}
      {(activeTab === "all" || activeTab === "goals") && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                Outcomes & Goals
                {selectedThemeId && <span className="font-normal text-zinc-400 ml-1.5 lowercase">(filtered)</span>}
              </h2>
            </div>
            <CreateEntityModal
              themes={initialThemes}
              goals={initialGoals}
              projects={initialProjects}
              defaultTab="goal"
              buttonLabel="Goal"
            />
          </div>

          {filteredGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredGoals.map((goal) => {
                const goalTheme = initialThemes.find((t) => t.id === goal.theme_id || t.id === goal.domain_id);
                const linkedProjects = initialProjects.filter((p) => p.goal_id === goal.id);
                const linkedHabits = initialHabits.filter((h) => h.goal_id === goal.id);

                return (
                  <div
                    key={goal.id}
                    className="p-4 bg-white border border-black/[0.06] hover:border-black/[0.12] rounded-xl shadow-2xs transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {goalTheme ? (
                          <span
                            className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium text-white"
                            style={{ backgroundColor: goalTheme.color || "#235789" }}
                          >
                            {goalTheme.name}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                            Independent
                          </span>
                        )}
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-teal-50 text-[#00A896]">
                          {goal.status}
                        </span>
                      </div>

                      {goal.target_date && (
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1 tabular-nums">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          {goal.target_date}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-xs text-zinc-900">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{goal.description}</p>
                      )}
                    </div>

                    {/* Linked Projects & Habits summary */}
                    <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-zinc-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FolderKanban className="w-3 h-3 text-zinc-400" />
                          <strong className="text-zinc-700 font-medium">{linkedProjects.length}</strong> projects
                        </span>
                        <span className="flex items-center gap-1">
                          <Repeat className="w-3 h-3 text-zinc-400" />
                          <strong className="text-zinc-700 font-medium">{linkedHabits.length}</strong> practices
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-white border border-dashed border-black/[0.08] rounded-xl text-center space-y-2">
              <Target className="w-5 h-5 text-zinc-300 mx-auto" />
              <p className="text-xs font-normal text-zinc-500">No goals found for this selection.</p>
              <CreateEntityModal themes={initialThemes} defaultTab="goal" buttonLabel="Define goal" />
            </div>
          )}
        </section>
      )}

      {/* 3. Finite Projects Section */}
      {(activeTab === "all" || activeTab === "projects") && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Projects (Finite Missions)</h2>
            </div>
            <CreateEntityModal
              goals={initialGoals}
              defaultTab="project"
              buttonLabel="Project"
            />
          </div>

          {initialProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {initialProjects.map((project) => {
                const parentGoal = initialGoals.find((g) => g.id === project.goal_id);
                const progressPct = project.progress?.percentage || 0;

                return (
                  <div
                    key={project.id}
                    className="p-4 bg-white border border-black/[0.06] hover:border-black/[0.12] rounded-xl shadow-2xs transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700">
                        {project.humanStatus || "Moving"}
                      </span>
                      {parentGoal && (
                        <span className="text-[10px] text-zinc-400 truncate max-w-[120px]" title={parentGoal.title}>
                          ↳ {parentGoal.title}
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-zinc-900">{project.title}</h4>

                    {project.description && (
                      <p className="text-[11px] text-zinc-500 line-clamp-2">{project.description}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>Progress</span>
                        <span className="font-medium text-zinc-700 tabular-nums">
                          {project.completedTasksCount || 0} / {project.totalTasksCount || 0} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#235789] to-[#00A896] transition-all duration-300"
                          style={{ width: `${Math.min(100, progressPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-white border border-dashed border-black/[0.08] rounded-xl text-center space-y-2">
              <FolderKanban className="w-5 h-5 text-zinc-300 mx-auto" />
              <p className="text-xs text-zinc-400">No active projects right now.</p>
              <CreateEntityModal goals={initialGoals} defaultTab="project" buttonLabel="Start a project" />
            </div>
          )}
        </section>
      )}

      {/* 4. Recurring Practices Section */}
      {(activeTab === "all" || activeTab === "habits") && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Daily Practices</h2>
            </div>
            <CreateEntityModal
              goals={initialGoals}
              defaultTab="habit"
              buttonLabel="Practice"
            />
          </div>

          {initialHabits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {initialHabits.map((habit) => {
                const parentGoal = initialGoals.find((g) => g.id === habit.goal_id);

                return (
                  <div
                    key={habit.id}
                    className="p-3.5 bg-white border border-black/[0.06] rounded-xl shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-teal-50 text-[#00A896]">
                        {habit.status}
                      </span>
                      {habit.consistencyRate !== undefined && habit.consistencyRate > 0 && (
                        <span className="text-[10px] font-medium text-[#00A896] flex items-center gap-1 tabular-nums">
                          <TrendingUp className="w-3 h-3 text-[#00A896]" />
                          {habit.consistencyRate}% consistency
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-zinc-900">{habit.title}</h4>

                    {parentGoal && (
                      <p className="text-[10px] text-zinc-400 truncate">
                        Supports: <span className="text-zinc-600 font-medium">{parentGoal.title}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-white border border-dashed border-black/[0.08] rounded-xl text-center space-y-2">
              <Repeat className="w-5 h-5 text-zinc-300 mx-auto" />
              <p className="text-xs text-zinc-400">No practices configured yet.</p>
              <CreateEntityModal goals={initialGoals} defaultTab="habit" buttonLabel="Add practice" />
            </div>
          )}
        </section>
      )}

      {/* 5. Independent Work Section */}
      {activeTab === "all" && (standaloneProjects.length > 0 || standaloneGoals.length > 0 || standaloneHabits.length > 0) && (
        <section className="bg-white border border-black/[0.06] rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h3 className="font-semibold text-xs text-zinc-800 tracking-tight">Independent Work</h3>
          </div>
          <p className="text-[11px] text-zinc-400">
            Items not bound to a specific theme or goal. They exist freely and can be organized anytime.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 bg-zinc-50/70 rounded-lg border border-black/[0.04] text-xs">
              <span className="font-semibold text-zinc-900 block mb-0.5 tabular-nums">{standaloneGoals.length}</span>
              <span className="text-[11px] text-zinc-400">Independent Goals</span>
            </div>
            <div className="p-3 bg-zinc-50/70 rounded-lg border border-black/[0.04] text-xs">
              <span className="font-semibold text-zinc-900 block mb-0.5 tabular-nums">{standaloneProjects.length}</span>
              <span className="text-[11px] text-zinc-400">Independent Projects</span>
            </div>
            <div className="p-3 bg-zinc-50/70 rounded-lg border border-black/[0.04] text-xs">
              <span className="font-semibold text-zinc-900 block mb-0.5 tabular-nums">{standaloneHabits.length}</span>
              <span className="text-[11px] text-zinc-400">Independent Practices</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
