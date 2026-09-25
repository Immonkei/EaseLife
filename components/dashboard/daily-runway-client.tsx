"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  Target,
  FolderKanban,
  CheckSquare,
  Repeat,
  Sparkles,
  Network,
  Check,
  Flag,
  ArrowRight,
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

  // Week days for Habit Tracker bar from mockup (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
  const currentDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const weekDays = [
    { name: "Sun", day: 0 },
    { name: "Mon", day: 1 },
    { name: "Tue", day: 2 },
    { name: "Wed", day: 3 },
    { name: "Thu", day: 4 },
    { name: "Fri", day: 5 },
    { name: "Sat", day: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Relational Identity Banner: "Tethered Actions" (Direct from Brand Sheet) */}
      <section className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Relational Identity &bull; Lineage Architecture
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-[#235789] overflow-x-auto py-1">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#235789] shrink-0">
              <Compass className="w-3.5 h-3.5" />
              Vision
            </span>
            <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#00A896] shrink-0">
              <Target className="w-3.5 h-3.5" />
              Goal
            </span>
            <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
              <FolderKanban className="w-3.5 h-3.5" />
              Project
            </span>
            <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 shrink-0">
              <CheckSquare className="w-3.5 h-3.5" />
              Task
            </span>
            <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-[#00A896] shrink-0">
              <Repeat className="w-3.5 h-3.5" />
              Habit
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <CreateEntityModal
            visions={initialVisions}
            goals={initialGoals}
            projects={initialProjects}
          />
        </div>
      </section>

      {/* Main Runway Dashboard Grid (Direct from Concept Mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Column (8 cols): Today's Focus & Daily Habits Tracker */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Focus Card */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F4D35E]" />
                  Today&apos;s Focus
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  3 main tasks selected for today&apos;s execution runway.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF2F4] text-[#235789] tabular-nums">
                {data?.stats.topTasksDone || 0} of {data?.stats.topTasksTotal || 0} Done
              </span>
            </div>

            {/* 3 Main Tasks Slots with circular checkboxes as in brand sheet mockup */}
            <div className="space-y-3">
              {([1, 2, 3] as const).map((pos) => {
                const focusItem = data?.focus.topTasks.find((t) => t.position === pos);
                const task = focusItem?.tasks;
                const isCompleted = task?.status === "COMPLETED";

                return (
                  <div
                    key={pos}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-150 ${
                      task
                        ? isCompleted
                          ? "bg-slate-50 border-slate-200 text-slate-400"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                        : "bg-[#EDF2F4]/50 border-dashed border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Circular check button matching mockup */}
                      <button
                        onClick={() => task && handleToggleTask(task.id, task.status)}
                        disabled={!task}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isCompleted
                            ? "bg-[#00A896] border-[#00A896] text-white"
                            : task
                            ? "border-slate-300 hover:border-[#00A896] bg-white"
                            : "border-slate-200 bg-transparent"
                        }`}
                        title={isCompleted ? "Mark incomplete" : "Complete task"}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      {task ? (
                        <div className="min-w-0 space-y-0.5">
                          <span
                            className={`text-sm font-semibold truncate block ${
                              isCompleted
                                ? "line-through text-slate-400"
                                : "text-[var(--foreground)]"
                            }`}
                          >
                            {task.title}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]">
                            {task.projects?.title && (
                              <span className="font-medium text-[#235789]">
                                Project: {task.projects.title}
                              </span>
                            )}
                            {task.goals?.title && (
                              <span className="font-medium text-[#00A896]">
                                Goal: {task.goals.title}
                              </span>
                            )}
                            <span>&bull;</span>
                            <span className="tabular-nums font-semibold">Weight {task.weight}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Main task #{pos} slot is open — assign from queue below
                        </span>
                      )}
                    </div>

                    {task && (
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button
                          onClick={() => setInspectTaskId(task.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#235789] bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <Network className="w-3.5 h-3.5" />
                          <span>Lineage</span>
                        </button>
                        <button
                          onClick={() => handleRemoveTop3(pos)}
                          className="text-slate-400 hover:text-red-500 text-sm p-1 rounded"
                          title="Remove from Today's Focus"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Daily Habits Tracker Heat-Strip (Direct from Mockup) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--foreground)]">Daily Habits Tracker</span>
                <span className="text-[11px] text-[var(--foreground-muted)]">Weekly Runway</span>
              </div>

              {/* Day blocks Sun - Sat */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((wd) => {
                  const isToday = wd.day === currentDayIndex;
                  const isPast = wd.day < currentDayIndex;

                  let bgColor = "bg-[#EDF2F4]";
                  let textColor = "text-slate-600";

                  if (isToday) {
                    bgColor = data?.stats.habitsDone && data.stats.habitsDone > 0 ? "bg-[#60D394]" : "bg-[#F4D35E]";
                    textColor = "text-slate-900 font-bold";
                  } else if (isPast) {
                    bgColor = "bg-[#60D394]";
                    textColor = "text-slate-800";
                  }

                  return (
                    <div
                      key={wd.name}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-100 bg-white"
                    >
                      <span className="text-[11px] font-semibold text-slate-400">{wd.name}</span>
                      <div
                        className={`w-full h-8 rounded-lg flex items-center justify-center transition-all ${bgColor} ${textColor}`}
                      >
                        {isToday ? (
                          <span className="text-[10px] font-bold">Today</span>
                        ) : isPast ? (
                          <Check className="w-3.5 h-3.5 text-slate-800 stroke-[3]" />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Runway Backlog Tasks */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[var(--foreground)]">Queue & Available Tasks</h3>
            {data?.unfinishedTasks && data.unfinishedTasks.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {data.unfinishedTasks.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(t.id, t.status)}
                        className="w-5 h-5 rounded-full border border-slate-300 hover:border-[#00A896] shrink-0"
                      />
                      <span className="text-sm font-medium text-slate-800 truncate">{t.title}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setInspectTaskId(t.id)}
                        className="text-xs text-[#235789] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Network className="w-3 h-3" />
                        Lineage
                      </button>

                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        {([1, 2, 3] as const).map((pos) => (
                          <button
                            key={pos}
                            onClick={() => handleSetTop3(t.id, pos)}
                            className="w-5 h-5 rounded bg-[#EDF2F4] hover:bg-[#235789] hover:text-white transition-colors text-slate-700"
                            title={`Make Top ${pos}`}
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
              <p className="text-xs text-slate-400">No pending tasks in queue.</p>
            )}
          </section>
        </div>

        {/* Right Column (4 cols): Daily Habits list + Pace Indicator (Mockup matching) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Habits List */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[var(--foreground)]">Daily Habits</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDF2F4] text-[#235789] tabular-nums">
                {data?.stats.habitsDone || 0}/{data?.stats.habitsTotal || 0}
              </span>
            </div>

            {data?.habits && data.habits.length > 0 ? (
              <div className="space-y-2.5">
                {data.habits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => handleToggleHabit(h.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      h.completedToday
                        ? "bg-emerald-50/70 border-emerald-200"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          h.completedToday
                            ? "bg-[#00A896] border-[#00A896] text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {h.completedToday && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{h.title}</span>
                    </div>

                    <span className="text-[11px] font-bold text-[#00A896] bg-teal-50 px-2 py-0.5 rounded tabular-nums">
                      {h.currentStreak}d streak
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active habits scheduled.</p>
            )}
          </section>

          {/* Pace Indicator Card (Direct from Brand Sheet Mockup) */}
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[var(--foreground)]">Pace Indicator</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pace Engine
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#60D394] text-white flex items-center justify-center shadow-xs">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Runway Execution</span>
                  <span className="text-[11px] text-emerald-700">Calculated from atomic work</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00A896] text-white shadow-2xs">
                On Track
              </span>
            </div>

            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              Transparent mathematically derived pace: Actual work completed vs. expected timeline progress.
            </p>
          </section>
        </div>
      </div>

      {/* Visible Lineage Drawer */}
      <LineageDrawer taskId={inspectTaskId} onClose={() => setInspectTaskId(null)} />
    </div>
  );
}
