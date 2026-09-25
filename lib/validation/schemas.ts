import { z } from "zod";

// Vision Schema
export const createVisionSchema = z.object({
  title: z.string().min(1, "Vision title is required").max(200),
  description: z.string().optional().nullable(),
  domain_id: z.string().uuid().optional().nullable(),
});

// Goal Schema
export const createGoalSchema = z.object({
  vision_id: z.string().uuid("Vision is required"),
  domain_id: z.string().uuid().optional().nullable(),
  parent_goal_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Goal title is required").max(200),
  description: z.string().optional().nullable(),
  status: z.enum(["NOT_STARTED", "ACTIVE", "COMPLETED", "ON_HOLD", "ABANDONED"]).default("ACTIVE"),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional().nullable(),
});

// Milestone Schema
export const createMilestoneSchema = z.object({
  goal_id: z.string().uuid("Goal is required"),
  title: z.string().min(1, "Milestone title is required").max(200),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional().nullable(),
  status: z.enum(["PENDING", "ACHIEVED", "MISSED"]).default("PENDING"),
  position: z.number().int().default(0),
});

// Project Schema
export const createProjectSchema = z.object({
  goal_id: z.string().uuid("Goal is required"),
  milestone_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Project title is required").max(200),
  description: z.string().optional().nullable(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]).default("PLANNED"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

// Task Schema (Enforces Task Ownership XOR Rule)
export const createTaskSchema = z.object({
  project_id: z.string().uuid().optional().nullable(),
  goal_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Task title is required").max(255),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  weight: z.number().int().min(1, "Weight must be at least 1").default(1),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
}).refine(
  (data) => (!!data.project_id && !data.goal_id) || (!data.project_id && !!data.goal_id),
  {
    message: "A task must belong to either a Project or a Goal, but never both.",
    path: ["project_id"],
  }
);

// Habit Schema
export const createHabitSchema = z.object({
  title: z.string().min(1, "Habit title is required").max(200),
  description: z.string().optional().nullable(),
  frequency: z.object({
    type: z.enum(["daily", "weekly", "specific_days"]),
    days: z.array(z.number().int().min(0).max(6)).optional(),
  }),
  goal_ids: z.array(z.string().uuid()).optional(),
});

// Focus Task Schema
export const setDailyFocusSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tasks: z.array(
    z.object({
      task_id: z.string().uuid(),
      position: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    })
  ).max(3),
});

// Daily Reflection Schema
export const createDailyReflectionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  energy: z.number().int().min(1).max(10),
  focus: z.number().int().min(1).max(10),
  what_happened: z.string().optional().nullable(),
});

// Weekly Reflection Schema
export const createWeeklyReflectionSchema = z.object({
  week_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  wins: z.string().optional().nullable(),
  blockers: z.string().optional().nullable(),
  lessons: z.string().optional().nullable(),
  changes_next_week: z.string().optional().nullable(),
  alignment: z.number().int().min(1).max(5),
});
