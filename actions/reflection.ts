"use server";

import { revalidatePath } from "next/cache";
import { upsertDailyReflection } from "@/lib/reflection/daily-reflection-service";
import { createDailyReflectionSchema } from "@/lib/validation/schemas";
import { ActionResult, actionSuccess, actionError } from "@/types/actions";
import { DailyReflection } from "@/types/domain";

export async function actionSaveDailyReflection(rawData: unknown): Promise<ActionResult<DailyReflection>> {
  const parsed = createDailyReflectionSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid reflection input");
  }

  try {
    const reflection = await upsertDailyReflection(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/review/daily");
    return actionSuccess(reflection as unknown as DailyReflection);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save reflection";
    return actionError(message);
  }
}
