"use server";

import { revalidatePath } from "next/cache";
import { upsertDailyReflection } from "@/lib/reflection/daily-reflection-service";
import { createDailyReflectionSchema } from "@/lib/validation/schemas";

export async function actionSaveDailyReflection(rawData: unknown) {
  const parsed = createDailyReflectionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid reflection input" };
  }

  try {
    const reflection = await upsertDailyReflection(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/review/daily");
    return { data: reflection };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save reflection";
    return { error: message };
  }
}
