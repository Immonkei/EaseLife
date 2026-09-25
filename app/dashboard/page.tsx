import { getUserVisions } from "@/lib/planning/vision-service";
import { getUserGoals } from "@/lib/planning/goal-service";
import { getUserProjects } from "@/lib/planning/project-service";
import { DailyRunwayClient } from "@/components/dashboard/daily-runway-client";

export default async function DashboardPage() {
  let visions: Array<{ id: string; title: string }> = [];
  let goals: Array<{ id: string; title: string }> = [];
  let projects: Array<{ id: string; title: string }> = [];

  try {
    const v = await getUserVisions();
    const g = await getUserGoals();
    const p = await getUserProjects();
    if (v) visions = v;
    if (g) goals = g;
    if (p) projects = p;
  } catch {
    // Graceful fallback if Supabase not configured yet
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <DailyRunwayClient
        initialVisions={visions}
        initialGoals={goals}
        initialProjects={projects}
      />
    </div>
  );
}
