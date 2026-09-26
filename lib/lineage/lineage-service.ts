import { createClient } from "@/lib/supabase/server";

export interface LineageResult {
  task: {
    id: string;
    title: string;
    status: string;
    priority: string;
    weight: number;
    section?: string | null;
    due_date: string | null;
  };
  project?: {
    id: string;
    title: string;
    status: string;
  } | null;
  milestone?: {
    id: string;
    title: string;
    status: string;
  } | null;
  goal?: {
    id: string;
    title: string;
    status: string;
  } | null;
  theme?: {
    id: string;
    name: string;
    color: string;
    vision_statement?: string | null;
  } | null;
  vision?: {
    id: string;
    title: string;
  } | null;
  domain?: {
    id: string;
    name: string;
    color: string;
  } | null;
  isStandalone?: boolean;
}

interface RawTaskRow {
  id: string;
  user_id: string;
  project_id: string | null;
  goal_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  weight: number;
  section: string | null;
  due_date: string | null;
}

interface RawProjectRow {
  id: string;
  title: string;
  status: string;
  goal_id: string | null;
  milestone_id: string | null;
}

/**
 * Resolves the "Why / Purpose Context" for a task:
 * Task -> Project (if any) -> Goal (if any) -> Life Theme / Vision (if any)
 * Option C: Unblocks standalone tasks and gracefully renders partial or direct connections.
 */
export async function getTaskLineage(taskId: string): Promise<LineageResult | null> {
  const supabase = await createClient();

  // 1. Fetch Task
  const { data: rawTask, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (taskError || !rawTask) {
    return null;
  }

  const task = rawTask as unknown as RawTaskRow;

  let goalId = task.goal_id;
  let projectData: LineageResult["project"] = null;
  let milestoneData: LineageResult["milestone"] = null;

  // 2. If Project Task, fetch Project
  if (task.project_id) {
    const { data: rawProject } = await supabase
      .from("projects")
      .select("id, title, status, goal_id, milestone_id")
      .eq("id", task.project_id)
      .single();

    if (rawProject) {
      const project = rawProject as unknown as RawProjectRow;
      projectData = {
        id: project.id,
        title: project.title,
        status: project.status,
      };
      if (project.goal_id) {
        goalId = project.goal_id;
      }
    }
  }

  // 3. If no Goal connected, return task context as standalone / project-only
  if (!goalId) {
    return {
      task: {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        weight: task.weight || 1,
        section: task.section,
        due_date: task.due_date,
      },
      project: projectData,
      goal: null,
      vision: null,
      domain: null,
      isStandalone: !projectData,
    };
  }

  // 4. Fetch Goal with theme/vision info
  const { data: rawGoal } = await supabase
    .from("goals")
    .select(`
      id,
      title,
      status,
      theme_id,
      vision_id,
      life_themes (
        id,
        name,
        color,
        vision_statement
      ),
      visions (
        id,
        title,
        domain_id,
        life_domains (
          id,
          name,
          color
        )
      )
    `)
    .eq("id", goalId)
    .single();

  if (!rawGoal) {
    return {
      task: {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        weight: task.weight || 1,
        section: task.section,
        due_date: task.due_date,
      },
      project: projectData,
      goal: null,
      vision: null,
      domain: null,
      isStandalone: false,
    };
  }

  const goal = rawGoal as unknown as {
    id: string;
    title: string;
    status: string;
    life_themes?: { id: string; name: string; color: string; vision_statement?: string | null } | null;
    visions?: {
      id: string;
      title: string;
      life_domains?: { id: string; name: string; color: string } | null;
    } | null;
  };

  const themeData = goal.life_themes
    ? {
        id: goal.life_themes.id,
        name: goal.life_themes.name,
        color: goal.life_themes.color,
        vision_statement: goal.life_themes.vision_statement,
      }
    : null;

  const domainData = themeData
    ? { id: themeData.id, name: themeData.name, color: themeData.color }
    : goal.visions?.life_domains
    ? {
        id: goal.visions.life_domains.id,
        name: goal.visions.life_domains.name,
        color: goal.visions.life_domains.color,
      }
    : null;

  const visionData = goal.visions
    ? { id: goal.visions.id, title: goal.visions.title }
    : themeData?.vision_statement
    ? { id: themeData.id, title: themeData.vision_statement }
    : null;

  return {
    task: {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      weight: task.weight || 1,
      section: task.section,
      due_date: task.due_date,
    },
    project: projectData,
    milestone: milestoneData,
    goal: {
      id: goal.id,
      title: goal.title,
      status: goal.status,
    },
    theme: themeData,
    vision: visionData,
    domain: domainData,
    isStandalone: false,
  };
}
