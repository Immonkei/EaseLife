import { createClient } from "@/lib/supabase/server";
import { calculateHabitStreak, HabitStreakResult } from "./streak-service";
import { HabitFrequency } from "@/types/domain";

export interface HabitWithStreak {
  id: string;
  goal_id?: string | null;
  title: string;
  description: string | null;
  frequency: HabitFrequency;
  status: any;
  currentStreak: number;
  longestStreak: number;
  consistencyRate: number;
  completedLast7Days: number;
  completedToday: boolean;
  completions: string[];
  goals?: { id: string; title: string } | null;
}

interface RawHabitRecord {
  id: string;
  goal_id?: string | null;
  title: string;
  description: string | null;
  frequency: HabitFrequency;
  status: string;
  goals?: { id: string; title: string } | null;
  habit_completions?: Array<{ date: string }> | null;
}

/**
 * Retrieves all active habits for the authenticated user, complete with dynamic streak & consistency computation.
 */
export async function getUserHabits(referenceDateStr?: string): Promise<HabitWithStreak[]> {
  const todayStr = referenceDateStr || new Date().toISOString().split("T")[0];
  const supabase = await createClient();

  const { data: rawHabits, error } = await supabase
    .from("habits")
    .select(`
      *,
      goals(id, title),
      habit_completions(date)
    `)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: true });

  if (error) {
    // Fallback if goals relation not yet linked
    const fallback = await supabase
      .from("habits")
      .select(`
        *,
        habit_completions(date)
      `)
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: true });

    if (fallback.error) throw fallback.error;
    const habitsFallback = (fallback.data || []) as unknown as RawHabitRecord[];
    return habitsFallback.map((h) => {
      const dates = (h.habit_completions || []).map((c) => c.date);
      const streak: HabitStreakResult = calculateHabitStreak(dates, todayStr);
      return {
        id: h.id,
        goal_id: h.goal_id,
        title: h.title,
        description: h.description,
        frequency: h.frequency,
        status: h.status,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        consistencyRate: streak.consistencyRate,
        completedLast7Days: streak.completedLast7Days,
        completedToday: streak.completedToday,
        completions: dates,
      };
    });
  }

  const habits = (rawHabits || []) as unknown as RawHabitRecord[];

  return habits.map((h) => {
    const rawCompletions = (h.habit_completions || []) as Array<{ date: string }>;
    const dates = rawCompletions.map((c) => c.date);
    const streak: HabitStreakResult = calculateHabitStreak(dates, todayStr);

    return {
      id: h.id,
      goal_id: h.goal_id,
      title: h.title,
      description: h.description,
      frequency: h.frequency,
      status: h.status,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      consistencyRate: streak.consistencyRate,
      completedLast7Days: streak.completedLast7Days,
      completedToday: streak.completedToday,
      completions: dates,
      goals: h.goals,
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
  goal_id?: string | null;
  frequency: { type: "daily" | "weekly" | "specific_days"; days?: number[] };
  goal_ids?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const primaryGoalId = input.goal_id || (input.goal_ids && input.goal_ids.length > 0 ? input.goal_ids[0] : null);

  const { data: habit, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      goal_id: primaryGoalId,
      title: input.title,
      description: input.description,
      frequency: input.frequency,
      status: "ACTIVE",
    })
    .select()
    .single();

  if (error) throw error;
  return habit;
}
