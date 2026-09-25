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

  // 0. Auto-bootstrap starter workspace if user has zero tasks & habits
  const { count: taskCount } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true });

  if (taskCount === 0) {
    try {
      // 1. Ensure Life Domains
      let { data: domains } = await supabase
        .from("life_domains")
        .select("id, name")
        .order("position", { ascending: true });

      if (!domains || domains.length === 0) {
        const { data: createdDomains } = await supabase
          .from("life_domains")
          .insert([
            { user_id: user.id, name: "Career & Craft", color: "#235789", position: 1 },
            { user_id: user.id, name: "Health & Vitality", color: "#00A896", position: 2 },
            { user_id: user.id, name: "Personal Growth", color: "#60D394", position: 3 },
            { user_id: user.id, name: "Relationships", color: "#F4D35E", position: 4 },
          ])
          .select("id, name");
        domains = createdDomains;
      }

      const domainCareerId = domains?.find((d) => d.name === "Career & Craft")?.id || domains?.[0]?.id;

      // 2. Starter Vision
      const { data: vision } = await supabase
        .from("visions")
        .insert({
          user_id: user.id,
          domain_id: domainCareerId,
          title: "Build High-Impact Systems & Creative Freedom",
          description: "Operate at the frontier of personal systems engineering and life craft.",
        })
        .select("id")
        .single();

      if (vision?.id) {
        // 3. Starter Goal
        const { data: goal } = await supabase
          .from("goals")
          .insert({
            user_id: user.id,
            vision_id: vision.id,
            domain_id: domainCareerId,
            title: "Launch EaseLife Personal Operating System",
            status: "ACTIVE",
            target_date: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
          })
          .select("id")
          .single();

        if (goal?.id) {
          // 4. Starter Project
          const { data: project } = await supabase
            .from("projects")
            .insert({
              user_id: user.id,
              goal_id: goal.id,
              title: "Core Runway & Lineage Engine",
              status: "IN_PROGRESS",
              start_date: todayStr,
            })
            .select("id")
            .single();

          // 5. Starter Tasks
          const { data: createdTasks } = await supabase
            .from("tasks")
            .insert([
              {
                user_id: user.id,
                project_id: project?.id,
                title: "Review today's Top 3 priorities on the runway",
                priority: "HIGH",
                weight: 3,
                status: "COMPLETED",
                due_date: todayStr,
              },
              {
                user_id: user.id,
                project_id: project?.id,
                title: "Verify Visible Lineage to Life Vision",
                priority: "URGENT",
                weight: 5,
                status: "TODO",
                due_date: todayStr,
              },
              {
                user_id: user.id,
                project_id: project?.id,
                title: "Complete evening 3-minute reflection calibration",
                priority: "MEDIUM",
                weight: 2,
                status: "TODO",
                due_date: todayStr,
              },
            ])
            .select("id");

          // 6. Assign Today's Top 3 Focus
          if (createdTasks && createdTasks.length >= 3) {
            await supabase.from("daily_focus_tasks").insert([
              { user_id: user.id, date: todayStr, position: 1, task_id: createdTasks[0].id },
              { user_id: user.id, date: todayStr, position: 2, task_id: createdTasks[1].id },
              { user_id: user.id, date: todayStr, position: 3, task_id: createdTasks[2].id },
            ]);
          }
        }
      }

      // 7. Starter Habits
      const { data: createdHabits } = await supabase
        .from("habits")
        .insert([
          {
            user_id: user.id,
            title: "Morning Hydration & Sunlight",
            frequency: { type: "daily" },
            status: "ACTIVE",
          },
          {
            user_id: user.id,
            title: "90-Minute Deep Work Sprint",
            frequency: { type: "daily" },
            status: "ACTIVE",
          },
        ])
        .select("id");

      if (createdHabits?.[0]?.id) {
        await supabase.from("habit_completions").insert({
          user_id: user.id,
          habit_id: createdHabits[0].id,
          date: todayStr,
        });
      }
    } catch {
      // Non-blocking fallback if RLS or connection is limited
    }
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
