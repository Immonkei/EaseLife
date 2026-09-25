import { createClient } from "@/lib/supabase/server";

export async function createMilestone(input: {
  goal_id: string;
  title: string;
  target_date?: string | null;
  position?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("milestones")
    .insert({
      user_id: user.id,
      goal_id: input.goal_id,
      title: input.title,
      target_date: input.target_date,
      position: input.position || 0,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMilestonesForGoal(goalId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("*, projects(*)")
    .eq("goal_id", goalId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}
