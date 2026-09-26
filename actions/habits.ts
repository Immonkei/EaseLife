"use server";

import { revalidatePath } from "next/cache";
import { toggleHabitCompletion, createHabit } from "@/lib/habits/habit-service";
import { createHabitSchema } from "@/lib/validation/schemas";
import { ActionResult, actionSuccess, actionError } from "@/types/actions";
import { Habit } from "@/types/domain";

export async function actionToggleHabit(habitId: string, dateStr?: string): Promise<ActionResult<{ completed: boolean }>> {
  try {
    const res = await toggleHabitCompletion(habitId, dateStr);
    revalidatePath("/dashboard");
    revalidatePath("/habits");
    revalidatePath("/horizons");
    return actionSuccess(res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle habit";
    return actionError(message);
  }
}

export async function actionCreateHabit(rawData: unknown): Promise<ActionResult<Habit>> {
  const parsed = createHabitSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid habit configuration");
  }

  try {
    const habit = await createHabit(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/habits");
    revalidatePath("/horizons");
    return actionSuccess(habit as unknown as Habit);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create habit";
    return actionError(message);
  }
}
