import { createClient } from "@/lib/supabase/server";

export async function getUserGoals(themeIdOrVisionId?: string) {
  const supabase = await createClient();

  // Select goals with related projects and theme/vision info
  let query = supabase
    .from("goals")
    .select(`
      *,
      life_themes(id, name, color, icon),
      visions(id, title),
      projects(*)
    `)
    .order("created_at", { ascending: false });

  if (themeIdOrVisionId) {
    query = query.or(`theme_id.eq.${themeIdOrVisionId},vision_id.eq.${themeIdOrVisionId}`);
  }

  const { data, error } = await query;
  if (error) {
    // Graceful fallback if life_themes relation not yet applied
    const fallback = await supabase
      .from("goals")
      .select(`
        *,
        visions(id, title),
        life_domains(id, name, color),
        projects(*)
      `)
      .order("created_at", { ascending: false });
    return fallback.data || [];
  }
  return data;
}

export async function createGoal(input: {
  theme_id?: string | null;
  vision_id?: string | null;
  domain_id?: string | null;
  parent_goal_id?: string | null;
  title: string;
  description?: string | null;
  target_date?: string | null;
  metric_target?: number | null;
  metric_current?: number | null;
  metric_unit?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      theme_id: input.theme_id || null,
      vision_id: input.vision_id || null,
      domain_id: input.domain_id || null,
      parent_goal_id: input.parent_goal_id || null,
      title: input.title,
      description: input.description || null,
      target_date: input.target_date || null,
      metric_target: input.metric_target || null,
      metric_current: input.metric_current || 0,
      metric_unit: input.metric_unit || null,
      status: "ACTIVE",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
