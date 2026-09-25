"use client";

import { useState, useEffect } from "react";
import { LineageDrawer } from "@/components/lineage/lineage-drawer";
import { RunwayRibbon } from "./runway-ribbon";
import { Top3FocusCard } from "./top3-focus-card";
import { HabitHeatStrip } from "./habit-heat-strip";
import { BacklogQueue } from "./backlog-queue";
import { DailyHabitsCard } from "./daily-habits-card";
import { PaceIndicatorCard } from "./pace-indicator-card";
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
  const [, setLoading] = useState(true);
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

  return (
    <div className="space-y-6">
      {/* Relational Identity Banner: "Tethered Actions" */}
      <RunwayRibbon
        visions={initialVisions}
        goals={initialGoals}
        projects={initialProjects}
      />

      {/* Main Runway Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Column (8 cols): Today's Focus & Daily Habits Tracker */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
            <Top3FocusCard
              topTasks={data?.focus.topTasks || []}
              stats={data?.stats || { topTasksDone: 0, topTasksTotal: 0 }}
              onToggleTask={handleToggleTask}
              onRemoveTop3={handleRemoveTop3}
              onInspectLineage={(taskId) => setInspectTaskId(taskId)}
            />

            <HabitHeatStrip habitsDone={data?.stats.habitsDone || 0} />
          </section>

          {/* Runway Backlog Tasks */}
          <BacklogQueue
            tasks={data?.unfinishedTasks || []}
            onToggleTask={handleToggleTask}
            onSetTop3={handleSetTop3}
            onInspectLineage={(taskId) => setInspectTaskId(taskId)}
          />
        </div>

        {/* Right Column (4 cols): Daily Habits list + Pace Indicator */}
        <div className="lg:col-span-4 space-y-6">
          <DailyHabitsCard
            habits={data?.habits || []}
            stats={data?.stats || { habitsDone: 0, habitsTotal: 0 }}
            onToggleHabit={handleToggleHabit}
          />

          <PaceIndicatorCard status="On Track" />
        </div>
      </div>

      {/* Visible Lineage Drawer */}
      <LineageDrawer taskId={inspectTaskId} onClose={() => setInspectTaskId(null)} />
    </div>
  );
}
