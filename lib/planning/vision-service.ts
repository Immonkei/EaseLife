import { createClient } from "@/lib/supabase/server";

export async function getUserVisions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visions")
    .select("*, life_domains(id, name, color)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createVision(input: {
  title: string;
  description?: string | null;
  domain_id?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("visions")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      domain_id: input.domain_id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
