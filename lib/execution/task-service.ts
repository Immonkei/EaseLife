import { createClient } from "@/lib/supabase/server";

export async function getUserTasks(options?: {
  status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  projectId?: string;
  goalId?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("tasks")
    .select(`
      *,
      projects(id, title),
      goals(id, title)
    `)
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.projectId) {
    query = query.eq("project_id", options.projectId);
  }
  if (options?.goalId) {
    query = query.eq("goal_id", options.goalId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createTask(input: {
  project_id?: string | null;
  goal_id?: string | null;
  title: string;
  description?: string | null;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  weight?: number;
  due_date?: string | null;
}) {
  // Enforce XOR rule at service layer
  const hasProject = !!input.project_id;
  const hasGoal = !!input.goal_id;

  if ((hasProject && hasGoal) || (!hasProject && !hasGoal)) {
    throw new Error("Task must be assigned to either a Project or a Goal, never both.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      project_id: input.project_id || null,
      goal_id: input.goal_id || null,
      title: input.title,
      description: input.description || null,
      priority: input.priority || "MEDIUM",
      weight: input.weight || 1,
      due_date: input.due_date || null,
      status: "TODO",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTaskStatus(
  taskId: string,
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
) {
  const supabase = await createClient();
  const completedAt = status === "COMPLETED" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: completedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
