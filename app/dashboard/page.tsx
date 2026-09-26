import { getUserThemes } from "@/lib/planning/theme-service";
import { getUserVisions } from "@/lib/planning/vision-service";
import { getUserGoals } from "@/lib/planning/goal-service";
import { getUserProjects } from "@/lib/planning/project-service";
import { DailyRunwayClient } from "@/components/dashboard/daily-runway-client";

export default async function DashboardPage() {
  let themes: Array<{ id: string; name: string; color: string }> = [];
  let visions: Array<{ id: string; title: string }> = [];
  let goals: Array<{ id: string; title: string }> = [];
  let projects: Array<{ id: string; title: string }> = [];

  try {
    const t = await getUserThemes();
    const v = await getUserVisions();
    const g = await getUserGoals();
    const p = await getUserProjects();
    if (t) themes = t;
    if (v) visions = v;
    if (g) goals = g;
    if (p) projects = p;
  } catch {
    // Graceful fallback if Supabase not configured yet
  }

  return (
    <DailyRunwayClient
      initialThemes={themes}
      initialVisions={visions}
      initialGoals={goals}
      initialProjects={projects}
    />
  );
}
