"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  CheckSquare,
  Sparkles,
  Network,
  Flame,
  Check,
  Plus,
  ArrowRight,
  Target,
  FolderKanban,
  Flag,
} from "lucide-react";
import { LineageDrawer } from "@/components/lineage/lineage-drawer";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";
import { actionToggleTaskStatus, actionSetDailyFocus, actionRemoveDailyFocus } from "@/actions/execution";
import { actionToggleHabit } from "@/actions/habits";

interface RunwayProps {
  initialVisions: Array<{ id: string; title: string }>;
  initialGoals: Array<{ id: string; title: string }>;
  initialProjects: Array<{ id: string; title: string }>;
}

interface DashboardData {
  focus: {
    northStar: {
      id: string;
      title: string;
      life_domains?: { name: string; color: string } | null;
    } | null;
    topTasks: Array<{
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
    }>;
  };
  habits: Array<{
    id: string;
    title: string;
    completedToday: boolean;
    currentStreak: number;
    longestStreak: number;
  }>;
  unfinishedTasks: Array<{
    id: string;
    title: string;
    status: string;
    weight: number;
    projects?: { title: string } | null;
    goals?: { title: string } | null;
  }>;
  stats: {
    habitsDone: number;
    habitsTotal: number;
    topTasksDone: number;
    topTasksTotal: number;
  };
}

export function DailyRunwayClient({
  initialVisions,
  initialGoals,
  initialProjects,
}: RunwayProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inspectTaskId, setInspectTaskId] = useState<string | null>(null);

  const fetchDashboard = () => {
    fetch("/api/dashboard/today")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch dashboard");
        return res.json();
      })
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    // Optimistic local update
    setData((prev) => {
      if (!prev) return prev;
      const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";
      return {
        ...prev,
        focus: {
          ...prev.focus,
          topTasks: prev.focus.topTasks.map((t) =>
            t.task_id === taskId
              ? { ...t, tasks: { ...t.tasks, status: nextStatus } }
              : t
          ),
        },
        unfinishedTasks: prev.unfinishedTasks.map((t) =>
          t.id === taskId ? { ...t, status: nextStatus } : t
        ),
      };
    });

    await actionToggleTaskStatus(taskId, currentStatus);
    fetchDashboard();
  };

  const handleToggleHabit = async (habitId: string) => {
    // Optimistic toggle
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        habits: prev.habits.map((h) => {
          if (h.id === habitId) {
            const nextCompleted = !h.completedToday;
            return {
              ...h,
              completedToday: nextCompleted,
              currentStreak: nextCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
            };
          }
          return h;
        }),
      };
    });

    await actionToggleHabit(habitId);
    fetchDashboard();
  };

  const handleSetTop3 = async (taskId: string, position: 1 | 2 | 3) => {
    const today = new Date().toISOString().split("T")[0];
    await actionSetDailyFocus(today, taskId, position);
    fetchDashboard();
  };

  const handleRemoveTop3 = async (position: 1 | 2 | 3) => {
    const today = new Date().toISOString().split("T")[0];
    await actionRemoveDailyFocus(today, position);
    fetchDashboard();
  };

  return (
    <div className="space-y-8">
      {/* 1. North Star / Direction Anchor */}
      <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-[var(--primary)] shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Long-Term Direction
                </span>
                {data?.focus.northStar?.life_domains && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-2xs"
                    style={{
                      backgroundColor:
                        data.focus.northStar.life_domains.color || "#235789",
                    }}
                  >
                    {data.focus.northStar.life_domains.name}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                {data?.focus.northStar?.title || "Define your foundational Life Vision"}
              </h2>
              <p className="text-xs text-[var(--foreground-muted)] max-w-xl">
                Every task on your runway exists to advance this long-term vision. Visible lineage makes that connection transparent.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <CreateEntityModal
              visions={initialVisions}
              goals={initialGoals}
              projects={initialProjects}
            />
          </div>
        </div>
      </section>

      {/* 2. Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Today's Top 3 & Queue */}
        <div className="lg:col-span-8 space-y-8">
          {/* Today's Top 3 Runway */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Today&apos;s Top 3 Priorities
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                  The three non-negotiables that move your direction forward today.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 tabular-nums">
                {data?.stats.topTasksDone || 0} of {data?.stats.topTasksTotal || 0} Done
              </span>
            </div>

            {/* Position 1, 2, 3 Runway Slots */}
            <div className="space-y-3">
              {([1, 2, 3] as const).map((pos) => {
                const focusItem = data?.focus.topTasks.find((t) => t.position === pos);
                const task = focusItem?.tasks;
                const isCompleted = task?.status === "COMPLETED";

                return (
                  <div
                    key={pos}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                      task
                        ? isCompleted
                          ? "bg-slate-50/80 border-slate-200 text-slate-400"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                        : "bg-slate-50/50 border-dashed border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 tabular-nums ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : task
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {pos}
                      </span>

                      {task ? (
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => handleToggleTask(task.id, task.status)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isCompleted
                                  ? "bg-[var(--growth)] border-[var(--growth)] text-white"
                                  : "border-slate-300 hover:border-[var(--primary)] hover:bg-slate-50"
                              }`}
                              title={isCompleted ? "Mark incomplete" : "Mark completed"}
                            >
                              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                            <span
                              className={`text-sm font-semibold truncate ${
                                isCompleted
                                  ? "line-through text-slate-400"
                                  : "text-[var(--foreground)]"
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-muted)] pl-7 pt-1">
                            {task.projects?.title && (
                              <span className="flex items-center gap-1 font-medium text-indigo-700">
                                <FolderKanban className="w-3 h-3" />
                                {task.projects.title}
                              </span>
                            )}
                            {task.goals?.title && (
                              <span className="flex items-center gap-1 font-medium text-emerald-700">
                                <Target className="w-3 h-3" />
                                {task.goals.title}
                              </span>
                            )}
                            <span>&bull;</span>
                            <span className="font-semibold tabular-nums">Weight {task.weight}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          Slot {pos} is open — select a task below to prioritize today.
                        </div>
                      )}
                    </div>

                    {task && (
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button
                          onClick={() => setInspectTaskId(task.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[var(--primary)] bg-blue-50 hover:bg-blue-100 transition-colors"
                          title="Inspect Lineage"
                        >
                          <Network className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Lineage</span>
                        </button>
                        <button
                          onClick={() => handleRemoveTop3(pos)}
                          className="text-slate-400 hover:text-red-500 text-sm p-1 rounded hover:bg-slate-100"
                          title="Remove from Top 3"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Queue & Backlog */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)]">Runway Task Queue</h3>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Actionable work ready to be scheduled or completed.
                </p>
              </div>
            </div>

            {data?.unfinishedTasks && data.unfinishedTasks.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.unfinishedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="py-3 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(t.id, t.status)}
                        className="w-4 h-4 rounded border border-slate-300 hover:border-[var(--primary)] hover:bg-slate-100 transition-colors shrink-0"
                        title="Mark complete"
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-[var(--foreground)] block truncate">
                          {t.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--foreground-muted)]">
                          {t.projects?.title ? (
                            <span>Project: {t.projects.title}</span>
                          ) : t.goals?.title ? (
                            <span>Goal: {t.goals.title}</span>
                          ) : (
                            <span>Direct</span>
                          )}
                          <span>&bull;</span>
                          <span className="tabular-nums">Weight {t.weight}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setInspectTaskId(t.id)}
                        className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Network className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Lineage</span>
                      </button>

                      {/* Set as Top 1, 2, or 3 buttons */}
                      <div className="flex items-center gap-1">
                        {([1, 2, 3] as const).map((pos) => (
                          <button
                            key={pos}
                            onClick={() => handleSetTop3(t.id, pos)}
                            className="w-5 h-5 rounded bg-slate-100 hover:bg-[var(--primary)] hover:text-white text-[10px] font-bold text-slate-600 transition-colors tabular-nums"
                            title={`Assign to Today's #${pos}`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No pending tasks in queue.</p>
                <p className="text-[11px] text-slate-400">
                  Use the quick create button above to define your next concrete action.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column (4 cols): Recurring Habits & Metrics */}
        <div className="lg:col-span-4 space-y-8">
          {/* Recurring Habits Section */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[var(--foreground)]">Daily Habits</h3>
                <p className="text-[11px] text-[var(--foreground-muted)]">
                  Recurring behaviors supporting goals.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
                {data?.stats.habitsDone || 0}/{data?.stats.habitsTotal || 0}
              </span>
            </div>

            {data?.habits && data.habits.length > 0 ? (
              <div className="space-y-2.5">
                {data.habits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => handleToggleHabit(h.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-150 ${
                      h.completedToday
                        ? "bg-emerald-50/70 border-emerald-200"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          h.completedToday
                            ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {h.completedToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          h.completedToday ? "text-emerald-950 font-bold" : "text-[var(--foreground)]"
                        }`}
                      >
                        {h.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full tabular-nums">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{h.currentStreak}d</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 space-y-1">
                <p className="text-xs text-slate-500">No habits scheduled for today.</p>
                <p className="text-[11px] text-slate-400">
                  Habits turn high-level vision into sustainable automatic momentum.
                </p>
              </div>
            )}
          </section>

          {/* Quick Calibration / Reflection Callout */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Evening Calibration
            </h4>
            <p className="text-sm font-semibold text-slate-100">
              Ready to close today&apos;s loop?
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Execution without reflection is aimless. Spend 3 minutes logging your energy, focus, and learnings.
            </p>
            <a
              href="/review/daily"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-1"
            >
              <span>Begin 3-min Reflection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </section>
        </div>
      </div>

      {/* 3. Visible Lineage Flyout Drawer */}
      <LineageDrawer taskId={inspectTaskId} onClose={() => setInspectTaskId(null)} />
    </div>
  );
}
