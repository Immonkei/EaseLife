import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateHabitStreak } from "@/lib/habits/streak-service";
import { isHabitScheduledForDate } from "@/lib/habits/frequency-service";

interface RawHabit {
  id: string;
  title: string;
  frequency: unknown;
  status: string;
  habit_completions?: Array<{ date: string }> | null;
}

interface RawFocusTask {
  id: string;
  position: 1 | 2 | 3;
  date: string;
  task_id: string;
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    weight: number;
    due_date: string | null;
    projects?: { id: string; title: string } | null;
    goals?: { id: string; title: string } | null;
  } | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const todayStr = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch Today's Top 3 Focus Tasks
  const { data: rawFocus } = await supabase
    .from("daily_focus_tasks")
    .select(`
      id,
      position,
      date,
      task_id,
      tasks (
        id,
        title,
        status,
        priority,
        weight,
        due_date,
        project_id,
        goal_id,
        projects(id, title),
        goals(id, title)
      )
    `)
    .eq("date", todayStr)
    .order("position", { ascending: true });

  const topFocus = (rawFocus || []) as unknown as RawFocusTask[];

  // 2. Fetch Active Habits with completions
  const { data: rawHabits } = await supabase
    .from("habits")
    .select(`
      id,
      title,
      frequency,
      status,
      habit_completions(date)
    `)
    .eq("status", "ACTIVE");

  const habits = (rawHabits || []) as unknown as RawHabit[];

  const habitSummary = habits
    .filter((h) => isHabitScheduledForDate(h.frequency, new Date(todayStr)))
    .map((h) => {
      const dates = (h.habit_completions || []).map((c) => c.date);
      const streak = calculateHabitStreak(dates, todayStr);
      return {
        id: h.id,
        title: h.title,
        completedToday: streak.completedToday,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      };
    });

  // 3. Fetch Time Blocks for Today
  const startOfDay = `${todayStr}T00:00:00.000Z`;
  const endOfDay = `${todayStr}T23:59:59.999Z`;

  const { data: timeline } = await supabase
    .from("time_blocks")
    .select(`
      id,
      title,
      type,
      start_at,
      end_at,
      task_id,
      tasks(id, title, status)
    `)
    .gte("start_at", startOfDay)
    .lte("start_at", endOfDay)
    .order("start_at", { ascending: true });

  // 4. Fetch Active Visions/Goals (North Star context)
  const { data: rawVisions } = await supabase
    .from("visions")
    .select("id, title, life_domains(name, color)")
    .limit(3);

  const visions = rawVisions as Array<{
    id: string;
    title: string;
    life_domains?: { name: string; color: string } | null;
  }> | null;

  // 5. Fetch Quick Tasks (TODO tasks due today or without project)
  const { data: pendingTasks } = await supabase
    .from("tasks")
    .select("id, title, priority, weight, status, due_date, projects(id, title), goals(id, title)")
    .neq("status", "COMPLETED")
    .neq("status", "CANCELLED")
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(10);

  return NextResponse.json({
    date: todayStr,
    focus: {
      northStar: visions && visions.length > 0 ? visions[0] : null,
      topTasks: topFocus,
    },
    habits: habitSummary,
    timeline: timeline || [],
    stats: {
      habitsDone: habitSummary.filter((h) => h.completedToday).length,
      habitsTotal: habitSummary.length,
      topTasksDone: topFocus.filter(
        (f) => f.tasks?.status === "COMPLETED"
      ).length,
      topTasksTotal: topFocus.length,
    },
    unfinishedTasks: pendingTasks || [],
  });
}
