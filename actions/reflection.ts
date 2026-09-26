"use server";

import { revalidatePath } from "next/cache";
import { upsertDailyReflection } from "@/lib/reflection/daily-reflection-service";
import { upsertWeeklyReflection } from "@/lib/reflection/weekly-reflection-service";
import { createDailyReflectionSchema, createWeeklyReflectionSchema } from "@/lib/validation/schemas";
import { ActionResult, actionSuccess, actionError } from "@/types/actions";
import { DailyReflection, WeeklyReflection } from "@/types/domain";

export async function actionSaveDailyReflection(rawData: unknown): Promise<ActionResult<DailyReflection>> {
  const parsed = createDailyReflectionSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid reflection input");
  }

  try {
    const reflection = await upsertDailyReflection(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/review");
    revalidatePath("/review/daily");
    return actionSuccess(reflection as unknown as DailyReflection);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save reflection";
    return actionError(message);
  }
}

export async function actionSaveWeeklyReflection(rawData: unknown): Promise<ActionResult<WeeklyReflection>> {
  const parsed = createWeeklyReflectionSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid weekly reflection input");
  }

  try {
    const reflection = await upsertWeeklyReflection(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/review");
    return actionSuccess(reflection as unknown as WeeklyReflection);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save weekly review";
    return actionError(message);
  }
}
