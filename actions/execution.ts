"use server";

import { revalidatePath } from "next/cache";
import { createTask, updateTaskStatus } from "@/lib/execution/task-service";
import { setDailyFocusTask, removeDailyFocusTask } from "@/lib/execution/focus-service";
import { createTaskSchema } from "@/lib/validation/schemas";
import { ActionResult, actionSuccess, actionError } from "@/types/actions";
import { Task, DailyFocusTask } from "@/types/domain";

export async function actionCreateTask(rawData: unknown): Promise<ActionResult<Task>> {
  const parsed = createTaskSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    const task = await createTask(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/projects");
    return actionSuccess(task as unknown as Task);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create task";
    return actionError(message);
  }
}

export async function actionToggleTaskStatus(taskId: string, currentStatus: string): Promise<ActionResult<Task>> {
  const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";

  try {
    const task = await updateTaskStatus(taskId, nextStatus);
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/projects");
    return actionSuccess(task as unknown as Task);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle task";
    return actionError(message);
  }
}

export async function actionSetDailyFocus(
  dateStr: string,
  taskId: string,
  position: 1 | 2 | 3
): Promise<ActionResult<DailyFocusTask>> {
  try {
    const focus = await setDailyFocusTask(dateStr, taskId, position);
    revalidatePath("/dashboard");
    return actionSuccess(focus as unknown as DailyFocusTask);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to set focus";
    return actionError(message);
  }
}

export async function actionRemoveDailyFocus(
  dateStr: string,
  position: 1 | 2 | 3
): Promise<ActionResult<void>> {
  try {
    await removeDailyFocusTask(dateStr, position);
    revalidatePath("/dashboard");
    return actionSuccess(undefined);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove focus";
    return actionError(message);
  }
}
