import { describe, it, expect } from "vitest";
import { calculateProjectProgress } from "@/lib/progress/project-progress";
import { calculatePace } from "@/lib/progress/pace-engine";
import { calculateHabitStreak } from "@/lib/habits/streak-service";
import { isHabitScheduledForDate } from "@/lib/habits/frequency-service";
import { createTaskSchema } from "@/lib/validation/schemas";

describe("Project Progress Engine (Section 18)", () => {
  it("calculates weighted completion correctly", () => {
    const tasks = [
      { weight: 3, status: "COMPLETED" as const },
      { weight: 5, status: "COMPLETED" as const },
      { weight: 4, status: "TODO" as const },
    ];
    // Completed: 8, Total: 12 => 66.7%
    const res = calculateProjectProgress(tasks);
    expect(res.percentage).toBe(66.7);
    expect(res.completedWeight).toBe(8);
    expect(res.totalWeight).toBe(12);
    expect(res.hasMeasurableTasks).toBe(true);
  });

  it("excludes cancelled tasks from total weight", () => {
    const tasks = [
      { weight: 2, status: "COMPLETED" as const },
      { weight: 2, status: "CANCELLED" as const },
      { weight: 2, status: "TODO" as const },
    ];
    // Completed: 2, Total eligible: 4 => 50%
    const res = calculateProjectProgress(tasks);
    expect(res.percentage).toBe(50);
    expect(res.totalWeight).toBe(4);
  });

  it("handles zero eligible tasks gracefully", () => {
    const res = calculateProjectProgress([]);
    expect(res.percentage).toBe(0);
    expect(res.hasMeasurableTasks).toBe(false);
  });
});

describe("Pace Engine (Section 19)", () => {
  it("marks ON_TRACK when actual meets or exceeds expected within -5%", () => {
    const res = calculatePace({
      startDate: "2026-09-01",
      targetDate: "2026-09-11",
      actualProgress: 50,
      referenceDate: new Date("2026-09-06T00:00:00Z"), // 50% time elapsed
    });
    expect(res.status).toBe("ON_TRACK");
    expect(res.delta).toBe(0);
  });

  it("marks AT_RISK when delta is between -20% and -5%", () => {
    const res = calculatePace({
      startDate: "2026-09-01",
      targetDate: "2026-09-11",
      actualProgress: 40,
      referenceDate: new Date("2026-09-06T00:00:00Z"), // 50% time elapsed, actual 40 => delta -10%
    });
    expect(res.status).toBe("AT_RISK");
    expect(res.delta).toBe(-10);
  });

  it("marks OFF_TRACK when delta is below -20%", () => {
    const res = calculatePace({
      startDate: "2026-09-01",
      targetDate: "2026-09-11",
      actualProgress: 20,
      referenceDate: new Date("2026-09-06T00:00:00Z"), // 50% expected, actual 20 => delta -30%
    });
    expect(res.status).toBe("OFF_TRACK");
    expect(res.delta).toBe(-30);
  });
});

describe("Habit Streak Engine (Section 13)", () => {
  it("derives current streak from atomic completion history", () => {
    const completions = ["2026-09-24", "2026-09-25", "2026-09-26"];
    const res = calculateHabitStreak(completions, "2026-09-26");
    expect(res.currentStreak).toBe(3);
    expect(res.completedToday).toBe(true);
  });

  it("preserves streak if completed yesterday and not yet completed today", () => {
    const completions = ["2026-09-24", "2026-09-25"];
    const res = calculateHabitStreak(completions, "2026-09-26");
    expect(res.currentStreak).toBe(2);
    expect(res.completedToday).toBe(false);
  });

  it("resets streak to 0 if missed yesterday but calculates consistency rate", () => {
    const completions = ["2026-09-20", "2026-09-21"];
    const res = calculateHabitStreak(completions, "2026-09-26");
    expect(res.currentStreak).toBe(0);
    expect(res.longestStreak).toBe(2);
    expect(typeof res.consistencyRate).toBe("number");
    expect(res.consistencyRate).toBeGreaterThanOrEqual(0);
  });
});

describe("Habit Frequency Engine (Section 14)", () => {
  it("evaluates specific days correctly", () => {
    // Sunday = 0, Monday = 1, Wednesday = 3, Friday = 5
    const freq = { type: "specific_days" as const, days: [1, 3, 5] };
    const wednesday = new Date("2026-09-23T12:00:00Z"); // Wed
    const tuesday = new Date("2026-09-22T12:00:00Z"); // Tue
    expect(isHabitScheduledForDate(freq, wednesday)).toBe(true);
    expect(isHabitScheduledForDate(freq, tuesday)).toBe(false);
  });
});

describe("Calm Purposeful Alignment Task Schema (Option C)", () => {
  const dummyUUID1 = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const dummyUUID2 = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

  it("accepts task with project_id and without goal_id", () => {
    const result = createTaskSchema.safeParse({
      title: "Task with project",
      project_id: dummyUUID1,
      goal_id: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts direct task with goal_id and without project_id", () => {
    const result = createTaskSchema.safeParse({
      title: "Direct goal task",
      project_id: null,
      goal_id: dummyUUID2,
    });
    expect(result.success).toBe(true);
  });

  it("accepts standalone task with neither project_id nor goal_id", () => {
    const result = createTaskSchema.safeParse({
      title: "Standalone daily action",
      project_id: null,
      goal_id: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts task with minimal input (just title)", () => {
    const result = createTaskSchema.safeParse({
      title: "Buy groceries",
    });
    expect(result.success).toBe(true);
  });
});

describe("Reflection Engine Schemas (Section 16)", () => {
  it("validates valid daily reflection with energy and focus 1-10", async () => {
    const { createDailyReflectionSchema } = await import("@/lib/validation/schemas");
    const result = createDailyReflectionSchema.safeParse({
      date: "2026-09-26",
      energy: 8,
      focus: 9,
      what_happened: "Completed architecture hardening",
    });
    expect(result.success).toBe(true);
  });

  it("rejects daily reflection with out-of-bounds energy (>10)", async () => {
    const { createDailyReflectionSchema } = await import("@/lib/validation/schemas");
    const result = createDailyReflectionSchema.safeParse({
      date: "2026-09-26",
      energy: 11,
      focus: 8,
    });
    expect(result.success).toBe(false);
  });
});
