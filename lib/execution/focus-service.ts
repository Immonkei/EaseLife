import { createClient } from "@/lib/supabase/server";

export async function getDailyFocus(dateStr: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_focus_tasks")
    .select(`
      id,
      date,
      position,
      task_id,
      tasks (
        id,
        title,
        status,
        priority,
        weight,
        due_date,
        project_id,
        goal_id,
        projects(id, title),
        goals(id, title)
      )
    `)
    .eq("date", dateStr)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function setDailyFocusTask(
  dateStr: string,
  taskId: string,
  position: 1 | 2 | 3
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Remove any existing task at this position for this date
  await supabase
    .from("daily_focus_tasks")
    .delete()
    .eq("user_id", user.id)
    .eq("date", dateStr)
    .eq("position", position);

  // Also remove if this task was in another position for this date
  await supabase
    .from("daily_focus_tasks")
    .delete()
    .eq("user_id", user.id)
    .eq("date", dateStr)
    .eq("task_id", taskId);

  const { data, error } = await supabase
    .from("daily_focus_tasks")
    .insert({
      user_id: user.id,
      date: dateStr,
      task_id: taskId,
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeDailyFocusTask(dateStr: string, position: 1 | 2 | 3) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("daily_focus_tasks")
    .delete()
    .eq("user_id", user.id)
    .eq("date", dateStr)
    .eq("position", position);

  if (error) throw error;
  return true;
}
