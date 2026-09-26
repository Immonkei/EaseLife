import { differenceInCalendarDays, subDays } from "date-fns";

export interface HabitStreakResult {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  consistencyRate: number;      // e.g. 85 (%) in the last 14 days
  completedLast7Days: number;   // e.g. 5
}

function parseYMD(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Midday prevents UTC/DST date-skipping shifts
}

/**
 * Calculates habit consistency and streaks derived purely from completion history dates.
 * Option C: Prioritizes rolling consistency (e.g. 5/7 days, 85%) over guilt-inducing binary streaks.
 */
export function calculateHabitStreak(
  completionDates: string[], // Format: 'YYYY-MM-DD'
  todayStr: string = new Date().toISOString().split("T")[0]
): HabitStreakResult {
  if (!completionDates || completionDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      completedToday: false,
      consistencyRate: 0,
      completedLast7Days: 0,
    };
  }

  // Remove duplicates and sort descending (latest first)
  const uniqueDates = Array.from(new Set(completionDates)).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const completedToday = uniqueDates.includes(todayStr);

  const todayMidday = parseYMD(todayStr);
  const yesterdayMidday = subDays(todayMidday, 1);
  const yesterdayStr = `${yesterdayMidday.getFullYear()}-${String(
    yesterdayMidday.getMonth() + 1
  ).padStart(2, "0")}-${String(yesterdayMidday.getDate()).padStart(2, "0")}`;

  // Check if streak is alive (completed today or completed yesterday)
  let currentStreak = 0;

  if (!completedToday && !uniqueDates.includes(yesterdayStr)) {
    currentStreak = 0;
  } else {
    let checkDate = completedToday ? todayMidday : yesterdayMidday;

    for (const dateStr of uniqueDates) {
      const date = parseYMD(dateStr);
      const diff = differenceInCalendarDays(checkDate, date);

      if (diff === 0) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else if (diff > 0) {
        // Gap found
        break;
      }
    }
  }

  // Calculate longest historical streak
  const ascendingDates = [...uniqueDates].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of ascendingDates) {
    const date = parseYMD(dateStr);
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diff = differenceInCalendarDays(date, prevDate);
      if (diff === 1) {
        runningStreak++;
      } else if (diff > 1) {
        runningStreak = 1;
      }
    }
    prevDate = date;
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
  }

  // Calculate rolling 14-day consistency rate
  let completedLast14Days = 0;
  let completedLast7Days = 0;

  for (let i = 0; i < 14; i++) {
    const checkD = subDays(todayMidday, i);
    const dStr = `${checkD.getFullYear()}-${String(checkD.getMonth() + 1).padStart(2, "0")}-${String(checkD.getDate()).padStart(2, "0")}`;
    if (uniqueDates.includes(dStr)) {
      completedLast14Days++;
      if (i < 7) {
        completedLast7Days++;
      }
    }
  }

  const consistencyRate = Math.round((completedLast14Days / 14) * 100);

  return {
    currentStreak,
    longestStreak,
    completedToday,
    consistencyRate,
    completedLast7Days,
  };
}
