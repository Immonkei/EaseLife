import { differenceInCalendarDays, subDays } from "date-fns";

export interface HabitStreakResult {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
}

function parseYMD(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Midday prevents UTC/DST date-skipping shifts
}

/**
 * Calculates habit streaks derived purely from completion history dates.
 * Architecture Section 13: Stored streak counters are forbidden as source of truth.
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

  return {
    currentStreak,
    longestStreak,
    completedToday,
  };
}
