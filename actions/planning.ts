"use server";

import { revalidatePath } from "next/cache";
import { createVision } from "@/lib/planning/vision-service";
import { createGoal } from "@/lib/planning/goal-service";
import { createMilestone } from "@/lib/planning/milestone-service";
import { createProject } from "@/lib/planning/project-service";
import {
  createVisionSchema,
  createGoalSchema,
  createMilestoneSchema,
  createProjectSchema,
} from "@/lib/validation/schemas";

export async function actionCreateVision(rawData: unknown) {
  const parsed = createVisionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  try {
    const vision = await createVision(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/goals");
    return { data: vision };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create vision";
    return { error: message };
  }
}

export async function actionCreateGoal(rawData: unknown) {
  const parsed = createGoalSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  try {
    const goal = await createGoal(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/goals");
    return { data: goal };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create goal";
    return { error: message };
  }
}

export async function actionCreateMilestone(rawData: unknown) {
  const parsed = createMilestoneSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  try {
    const milestone = await createMilestone(parsed.data);
    revalidatePath("/projects");
    revalidatePath("/goals");
    return { data: milestone };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create milestone";
    return { error: message };
  }
}

export async function actionCreateProject(rawData: unknown) {
  const parsed = createProjectSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  try {
    const project = await createProject(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/projects");
    return { data: project };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create project";
    return { error: message };
  }
}
