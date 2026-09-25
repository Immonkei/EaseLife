import { getDay } from "date-fns";

export interface HabitFrequency {
  type: "daily" | "weekly" | "specific_days";
  days?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  targetPerWeek?: number;
}

/**
 * Checks if a habit is scheduled for a given date based on frequency configuration.
 * Architecture Section 14.
 */
export function isHabitScheduledForDate(
  frequencyJson: unknown,
  date: Date = new Date()
): boolean {
  if (!frequencyJson || typeof frequencyJson !== "object") {
    return true; // Default fallback to daily
  }

  const freq = frequencyJson as HabitFrequency;

  if (freq.type === "daily") {
    return true;
  }

  if (freq.type === "specific_days" && Array.isArray(freq.days)) {
    const dayOfWeek = getDay(date);
    return freq.days.includes(dayOfWeek);
  }

  if (freq.type === "weekly") {
    return true; // Eligible any day during the week
  }

  return true;
}
