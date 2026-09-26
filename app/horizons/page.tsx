import { getUserThemes } from "@/lib/planning/theme-service";
import { getUserGoals } from "@/lib/planning/goal-service";
import { getUserProjects } from "@/lib/planning/project-service";
import { getUserHabits } from "@/lib/habits/habit-service";
import { HorizonsClient } from "./horizons-client";
import { LifeTheme, Goal } from "@/types/domain";

export default async function HorizonsPage() {
  let themes: LifeTheme[] = [];
  let goals: Goal[] = [];
  let projects: Awaited<ReturnType<typeof getUserProjects>> = [];
  let habits: Awaited<ReturnType<typeof getUserHabits>> = [];

  try {
    const [t, g, p, h] = await Promise.all([
      getUserThemes(),
      getUserGoals(),
      getUserProjects(),
      getUserHabits(),
    ]);

    if (t) themes = t;
    if (g) goals = g as unknown as Goal[];
    if (p) projects = p;
    if (h) habits = h;
  } catch {
    // Graceful fallback if database tables not fully initialized yet
  }

  return (
    <HorizonsClient
      initialThemes={themes}
      initialGoals={goals}
      initialProjects={projects}
      initialHabits={habits}
    />
  );
}
