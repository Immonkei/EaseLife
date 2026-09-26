import { getWeeklyStats, getWeeklyReflection } from "@/lib/reflection/weekly-reflection-service";
import { getDailyReflection } from "@/lib/reflection/daily-reflection-service";
import { ReviewClient } from "./review-client";

export default async function ReviewPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  let weeklyStats = {
    weekStartDate: todayStr,
    tasksCompletedLast7Days: 0,
    habitsCompletedLast7Days: 0,
    activeProjectsCount: 0,
    movingProjectsCount: 0,
    stalledProjectsCount: 0,
  };
  let weeklyReflection = null;
  let dailyReflection = null;

  try {
    const stats = await getWeeklyStats();
    weeklyStats = stats;
    weeklyReflection = await getWeeklyReflection(stats.weekStartDate);
    dailyReflection = await getDailyReflection(todayStr);
  } catch {
    // Graceful fallback
  }

  return (
    <ReviewClient
      initialWeeklyStats={weeklyStats}
      initialWeeklyReflection={weeklyReflection}
      initialDailyReflection={dailyReflection}
    />
  );
}
