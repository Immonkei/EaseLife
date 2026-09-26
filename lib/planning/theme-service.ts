import { createClient } from "@/lib/supabase/server";
import { LifeTheme } from "@/types/domain";

export async function getUserThemes(): Promise<LifeTheme[]> {
  const supabase = await createClient();

  // Try fetching from life_themes table
  const { data, error } = await supabase
    .from("life_themes")
    .select("*")
    .order("position", { ascending: true });

  if (!error && data && data.length > 0) {
    return data as LifeTheme[];
  }

  // Graceful fallback to life_domains if life_themes not yet migrated or empty
  const { data: domainData } = await supabase
    .from("life_domains")
    .select("*")
    .order("position", { ascending: true });

  if (domainData && domainData.length > 0) {
    return domainData.map((d) => ({
      id: d.id,
      name: d.name,
      color: d.color,
      icon: d.icon,
      position: d.position,
      vision_statement: null,
      created_at: d.created_at,
    }));
  }

  return [];
}

export async function createTheme(input: {
  name: string;
  vision_statement?: string | null;
  color?: string;
  icon?: string | null;
  position?: number;
}): Promise<LifeTheme> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("life_themes")
    .insert({
      user_id: user.id,
      name: input.name,
      vision_statement: input.vision_statement || null,
      color: input.color || "#235789",
      icon: input.icon || null,
      position: input.position || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as LifeTheme;
}

export async function updateTheme(
  themeId: string,
  input: {
    name?: string;
    vision_statement?: string | null;
    color?: string;
    icon?: string | null;
    position?: number;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("life_themes")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", themeId)
    .select()
    .single();

  if (error) throw error;
  return data as LifeTheme;
}
