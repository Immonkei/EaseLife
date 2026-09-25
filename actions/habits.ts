"use server";

import { revalidatePath } from "next/cache";
import { toggleHabitCompletion, createHabit } from "@/lib/habits/habit-service";
import { createHabitSchema } from "@/lib/validation/schemas";

export async function actionToggleHabit(habitId: string, dateStr?: string) {
  try {
    const res = await toggleHabitCompletion(habitId, dateStr);
    revalidatePath("/dashboard");
    revalidatePath("/habits");
    return { data: res };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle habit";
    return { error: message };
  }
}

export async function actionCreateHabit(rawData: unknown) {
  const parsed = createHabitSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid habit configuration" };
  }

  try {
    const habit = await createHabit(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/habits");
    return { data: habit };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create habit";
    return { error: message };
  }
}
