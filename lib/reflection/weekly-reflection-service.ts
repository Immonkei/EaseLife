import { createClient } from "@/lib/supabase/server";
import { subDays, startOfWeek } from "date-fns";

export interface WeeklyStats {
  weekStartDate: string;
  tasksCompletedLast7Days: number;
  habitsCompletedLast7Days: number;
  activeProjectsCount: number;
  movingProjectsCount: number;
  stalledProjectsCount: number;
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const sevenDaysAgo = subDays(now, 7).toISOString();

  if (!user) {
    return {
      weekStartDate: weekStartStr,
      tasksCompletedLast7Days: 0,
      habitsCompletedLast7Days: 0,
      activeProjectsCount: 0,
      movingProjectsCount: 0,
      stalledProjectsCount: 0,
    };
  }

  // 1. Tasks completed in last 7 days
  const { count: tasksCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "COMPLETED")
    .gte("completed_at", sevenDaysAgo);

  // 2. Habit logs in last 7 days
  const sevenDaysAgoDate = subDays(now, 7).toISOString().split("T")[0];
  const { count: habitsCount } = await supabase
    .from("habit_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("date", sevenDaysAgoDate);

  // 3. Projects moving vs stalled
  const { data: projects } = await supabase
    .from("projects")
    .select("id, status, tasks(id, status, completed_at)")
    .eq("user_id", user.id);

  let moving = 0;
  let stalled = 0;
  const rawProjects = (projects as Array<{ id: string; status: string; tasks?: Array<{ status: string; completed_at: string | null }> }> || []);
  const activeProjects = rawProjects.filter((p) => p.status !== "COMPLETED" && p.status !== "CANCELLED");

  for (const p of activeProjects) {
    const tasks = p.tasks || [];
    const recentlyCompleted = tasks.some(
      (t) => t.status === "COMPLETED" && t.completed_at && new Date(t.completed_at).getTime() >= new Date(sevenDaysAgo).getTime()
    );
    if (recentlyCompleted) {
      moving++;
    } else {
      stalled++;
    }
  }

  return {
    weekStartDate: weekStartStr,
    tasksCompletedLast7Days: tasksCount || 0,
    habitsCompletedLast7Days: habitsCount || 0,
    activeProjectsCount: activeProjects.length,
    movingProjectsCount: moving,
    stalledProjectsCount: stalled,
  };
}

export async function getWeeklyReflection(weekStartStr: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("weekly_reflections")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_start", weekStartStr)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function upsertWeeklyReflection(input: {
  week_start: string;
  wins?: string | null;
  blockers?: string | null;
  lessons?: string | null;
  changes_next_week?: string | null;
  alignment: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("weekly_reflections")
    .upsert(
      {
        user_id: user.id,
        week_start: input.week_start,
        wins: input.wins || null,
        blockers: input.blockers || null,
        lessons: input.lessons || null,
        changes_next_week: input.changes_next_week || null,
        alignment: input.alignment,
      },
      { onConflict: "user_id,week_start" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
