import { createClient } from "@/lib/supabase/server";

export async function getDailyReflection(dateStr: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("daily_reflections")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", dateStr)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertDailyReflection(input: {
  date: string;
  energy: number;
  focus: number;
  what_happened?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("daily_reflections")
    .upsert(
      {
        user_id: user.id,
        date: input.date,
        energy: input.energy,
        focus: input.focus,
        what_happened: input.what_happened || null,
      },
      { onConflict: "user_id,date" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
