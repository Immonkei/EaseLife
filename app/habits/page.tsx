import { getUserHabits, HabitWithStreak } from "@/lib/habits/habit-service";
import { HabitsClient } from "./habits-client";

export default async function HabitsPage() {
  let habits: HabitWithStreak[] = [];
  try {
    const h = await getUserHabits();
    if (h) habits = h;
  } catch {}

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <HabitsClient initialHabits={habits} />
    </div>
  );
}
