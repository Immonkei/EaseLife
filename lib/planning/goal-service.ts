import { createClient } from "@/lib/supabase/server";

export async function getUserGoals(visionId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("goals")
    .select(`
      *,
      visions(id, title),
      life_domains(id, name, color),
      milestones(*),
      projects(*)
    `)
    .order("created_at", { ascending: false });

  if (visionId) {
    query = query.eq("vision_id", visionId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createGoal(input: {
  vision_id: string;
  domain_id?: string | null;
  parent_goal_id?: string | null;
  title: string;
  description?: string | null;
  target_date?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      vision_id: input.vision_id,
      domain_id: input.domain_id,
      parent_goal_id: input.parent_goal_id,
      title: input.title,
      description: input.description,
      target_date: input.target_date,
      status: "ACTIVE",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
