"use server";

import { revalidatePath } from "next/cache";
import { createTask, updateTaskStatus } from "@/lib/execution/task-service";
import { setDailyFocusTask, removeDailyFocusTask } from "@/lib/execution/focus-service";
import { createTaskSchema } from "@/lib/validation/schemas";

export async function actionCreateTask(rawData: unknown) {
  const parsed = createTaskSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  try {
    const task = await createTask(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/projects");
    return { data: task };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create task";
    return { error: message };
  }
}

export async function actionToggleTaskStatus(taskId: string, currentStatus: string) {
  const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";

  try {
    const task = await updateTaskStatus(taskId, nextStatus);
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/projects");
    return { data: task };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle task";
    return { error: message };
  }
}

export async function actionSetDailyFocus(dateStr: string, taskId: string, position: 1 | 2 | 3) {
  try {
    const focus = await setDailyFocusTask(dateStr, taskId, position);
    revalidatePath("/dashboard");
    return { data: focus };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to set focus";
    return { error: message };
  }
}

export async function actionRemoveDailyFocus(dateStr: string, position: 1 | 2 | 3) {
  try {
    await removeDailyFocusTask(dateStr, position);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove focus";
    return { error: message };
  }
}
