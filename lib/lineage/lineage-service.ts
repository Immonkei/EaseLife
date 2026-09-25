import { createClient } from "@/lib/supabase/server";

export interface LineageResult {
  task: {
    id: string;
    title: string;
    status: string;
    priority: string;
    weight: number;
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
  goal: {
    id: string;
    title: string;
    status: string;
  };
  vision: {
    id: string;
    title: string;
  };
  domain?: {
    id: string;
    name: string;
    color: string;
  } | null;
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
  due_date: string | null;
}

interface RawProjectRow {
  id: string;
  title: string;
  status: string;
  goal_id: string;
  milestone_id: string | null;
}

interface RawMilestoneRow {
  id: string;
  title: string;
  status: string;
}

/**
 * Resolves the full vertical lineage for a task:
 * Task -> Project (optional) -> Milestone (optional) -> Goal -> Vision -> Domain
 * Following Architecture Section 17.
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

  // 2. If Project Task, fetch Project and optional Milestone
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
      goalId = project.goal_id;

      if (project.milestone_id) {
        const { data: rawMilestone } = await supabase
          .from("milestones")
          .select("id, title, status")
          .eq("id", project.milestone_id)
          .single();

        if (rawMilestone) {
          const milestone = rawMilestone as unknown as RawMilestoneRow;
          milestoneData = {
            id: milestone.id,
            title: milestone.title,
            status: milestone.status,
          };
        }
      }
    }
  }

  if (!goalId) {
    return null;
  }

  // 3. Fetch Goal, Vision, and Domain
  const { data: rawGoal } = await supabase
    .from("goals")
    .select(`
      id,
      title,
      status,
      domain_id,
      vision_id,
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
    return null;
  }

  const goal = rawGoal as unknown as {
    id: string;
    title: string;
    status: string;
    visions: {
      id: string;
      title: string;
      life_domains?: { id: string; name: string; color: string } | null;
    } | null;
  };

  if (!goal.visions) {
    return null;
  }

  return {
    task: {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      weight: task.weight,
      due_date: task.due_date,
    },
    project: projectData,
    milestone: milestoneData,
    goal: {
      id: goal.id,
      title: goal.title,
      status: goal.status,
    },
    vision: {
      id: goal.visions.id,
      title: goal.visions.title,
    },
    domain: goal.visions.life_domains
      ? {
          id: goal.visions.life_domains.id,
          name: goal.visions.life_domains.name,
          color: goal.visions.life_domains.color,
        }
      : null,
  };
}
