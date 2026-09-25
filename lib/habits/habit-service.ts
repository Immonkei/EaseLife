import { createClient } from "@/lib/supabase/server";
import { calculateHabitStreak, HabitStreakResult } from "./streak-service";

export interface HabitWithStreak {
  id: string;
  title: string;
  description: string | null;
  frequency: unknown;
  status: string;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  completions: string[];
}

interface RawHabitRecord {
  id: string;
  title: string;
  description: string | null;
  frequency: unknown;
  status: string;
  habit_completions?: Array<{ date: string }> | null;
}

/**
 * Retrieves all active habits for the authenticated user, complete with dynamic streak computation.
 */
export async function getUserHabits(referenceDateStr?: string): Promise<HabitWithStreak[]> {
  const todayStr = referenceDateStr || new Date().toISOString().split("T")[0];
  const supabase = await createClient();

  const { data: rawHabits, error } = await supabase
    .from("habits")
    .select(`
      *,
      habit_completions(date)
    `)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: true });

  if (error) throw error;

  const habits = (rawHabits || []) as unknown as RawHabitRecord[];

  return habits.map((h) => {
    const rawCompletions = (h.habit_completions || []) as Array<{ date: string }>;
    const dates = rawCompletions.map((c) => c.date);
    const streak: HabitStreakResult = calculateHabitStreak(dates, todayStr);

    return {
      id: h.id,
      title: h.title,
      description: h.description,
      frequency: h.frequency,
      status: h.status,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      completedToday: streak.completedToday,
      completions: dates,
    };
  });
}

/**
 * Toggles habit completion atomically for a given date.
 */
export async function toggleHabitCompletion(habitId: string, dateStr?: string) {
  const targetDate = dateStr || new Date().toISOString().split("T")[0];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Check if completion exists
  const { data: existing } = await supabase
    .from("habit_completions")
    .select("id")
    .eq("user_id", user.id)
    .eq("habit_id", habitId)
    .eq("date", targetDate)
    .maybeSingle();

  if (existing) {
    // Delete completion
    const { error } = await supabase
      .from("habit_completions")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;
    return { completed: false };
  } else {
    // Insert completion
    const { error } = await supabase
      .from("habit_completions")
      .insert({
        user_id: user.id,
        habit_id: habitId,
        date: targetDate,
      });

    if (error) throw error;
    return { completed: true };
  }
}

/**
 * Creates a new recurring habit with frequency validation and optional goal bindings.
 */
export async function createHabit(input: {
  title: string;
  description?: string | null;
  frequency: { type: "daily" | "weekly" | "specific_days"; days?: number[] };
  goal_ids?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: habit, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      frequency: input.frequency,
      status: "ACTIVE",
    })
    .select()
    .single();

  if (error) throw error;

  // Bind to goals if specified
  if (input.goal_ids && input.goal_ids.length > 0) {
    const bindings = input.goal_ids.map((gId) => ({
      user_id: user.id,
      goal_id: gId,
      habit_id: habit.id,
    }));

    await supabase.from("goal_habits").insert(bindings);
  }

  return habit;
}
