import { createClient } from "@/lib/supabase/server";
import { calculateProjectProgress } from "@/lib/progress/project-progress";
import { calculatePace } from "@/lib/progress/pace-engine";

interface RawProject {
  id: string;
  user_id: string;
  goal_id: string | null;
  milestone_id: string | null;
  title: string;
  description: string | null;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  start_date: string | null;
  target_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  goals?: { id: string; title: string } | null;
  tasks?: Array<{ id: string; status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'; weight: number }> | null;
}

export async function getUserProjects() {
  const supabase = await createClient();
  const { data: rawProjects, error } = await supabase
    .from("projects")
    .select(`
      *,
      goals(id, title),
      tasks(id, status, weight)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const projects = (rawProjects || []) as unknown as RawProject[];

  return projects.map((p) => {
    const tasks = (p.tasks || []) as { weight: number; status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }[];
    const progress = calculateProjectProgress(tasks);
    const pace = calculatePace({
      startDate: p.start_date,
      targetDate: p.target_date,
      actualProgress: progress.percentage,
      isCompleted: p.status === "COMPLETED",
    });

    // Simple human-friendly progress status (Moving, Stalled, Completed, Not Started)
    const completedTasksCount = tasks.filter((t) => t.status === "COMPLETED").length;
    const totalTasksCount = tasks.filter((t) => t.status !== "CANCELLED").length;

    let humanStatus = "Not Started";
    if (p.status === "COMPLETED" || (totalTasksCount > 0 && completedTasksCount === totalTasksCount)) {
      humanStatus = "Completed";
    } else if (completedTasksCount > 0) {
      humanStatus = "Moving";
    } else if (totalTasksCount > 0) {
      humanStatus = "Ready to start";
    }

    return {
      ...p,
      progress,
      pace,
      humanStatus,
      completedTasksCount,
      totalTasksCount,
    };
  });
}

export async function createProject(input: {
  goal_id?: string | null;
  milestone_id?: string | null;
  title: string;
  description?: string | null;
  start_date?: string | null;
  target_date?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      goal_id: input.goal_id || null,
      milestone_id: input.milestone_id || null,
      title: input.title,
      description: input.description || null,
      start_date: input.start_date || null,
      target_date: input.target_date || null,
      status: "PLANNED",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
