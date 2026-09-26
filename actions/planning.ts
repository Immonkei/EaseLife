"use server";

import { revalidatePath } from "next/cache";
import { createTheme } from "@/lib/planning/theme-service";
import { createVision } from "@/lib/planning/vision-service";
import { createGoal } from "@/lib/planning/goal-service";
import { createMilestone } from "@/lib/planning/milestone-service";
import { createProject } from "@/lib/planning/project-service";
import {
  createThemeSchema,
  createVisionSchema,
  createGoalSchema,
  createMilestoneSchema,
  createProjectSchema,
} from "@/lib/validation/schemas";
import { ActionResult, actionSuccess, actionError } from "@/types/actions";
import { LifeTheme, Vision, Goal, Milestone, Project } from "@/types/domain";

export async function actionCreateTheme(rawData: unknown): Promise<ActionResult<LifeTheme>> {
  const parsed = createThemeSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    const theme = await createTheme(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/horizons");
    revalidatePath("/goals");
    return actionSuccess(theme);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create theme";
    return actionError(message);
  }
}

export async function actionCreateVision(rawData: unknown): Promise<ActionResult<Vision>> {
  const parsed = createVisionSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    const vision = await createVision(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/horizons");
    revalidatePath("/goals");
    return actionSuccess(vision as unknown as Vision);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create vision";
    return actionError(message);
  }
}

export async function actionCreateGoal(rawData: unknown): Promise<ActionResult<Goal>> {
  const parsed = createGoalSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    const goal = await createGoal(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/horizons");
    revalidatePath("/goals");
    return actionSuccess(goal as unknown as Goal);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create goal";
    return actionError(message);
  }
}

export async function actionCreateMilestone(rawData: unknown): Promise<ActionResult<Milestone>> {
  const parsed = createMilestoneSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    const milestone = await createMilestone(parsed.data);
    revalidatePath("/projects");
    revalidatePath("/goals");
    revalidatePath("/horizons");
    return actionSuccess(milestone as unknown as Milestone);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create milestone";
    return actionError(message);
  }
}

export async function actionCreateProject(rawData: unknown): Promise<ActionResult<Project>> {
  const parsed = createProjectSchema.safeParse(rawData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message || "Invalid input");
  }

  try {
    const project = await createProject(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/horizons");
    revalidatePath("/projects");
    return actionSuccess(project as unknown as Project);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create project";
    return actionError(message);
  }
}
