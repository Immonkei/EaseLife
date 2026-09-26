import { z } from "zod";

// Life Theme Schema
export const createThemeSchema = z.object({
  name: z.string().min(1, "Theme name is required").max(100),
  vision_statement: z.string().optional().nullable(),
  color: z.string().default("#235789"),
  icon: z.string().optional().nullable(),
});

// Vision Schema (legacy / backwards compatibility)
export const createVisionSchema = z.object({
  title: z.string().min(1, "Vision title is required").max(200),
  description: z.string().optional().nullable(),
  domain_id: z.string().uuid().optional().nullable(),
});

// Goal Schema (Option C: theme_id and vision_id are both optional!)
export const createGoalSchema = z.object({
  theme_id: z.string().uuid().optional().nullable(),
  vision_id: z.string().uuid().optional().nullable(),
  domain_id: z.string().uuid().optional().nullable(),
  parent_goal_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Goal title is required").max(200),
  description: z.string().optional().nullable(),
  status: z.enum(["NOT_STARTED", "ACTIVE", "COMPLETED", "ON_HOLD", "ABANDONED"]).default("ACTIVE"),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional().nullable(),
  metric_target: z.number().optional().nullable(),
  metric_current: z.number().optional().nullable(),
  metric_unit: z.string().optional().nullable(),
});

// Milestone Schema (legacy)
export const createMilestoneSchema = z.object({
  goal_id: z.string().uuid("Goal is required"),
  title: z.string().min(1, "Milestone title is required").max(200),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional().nullable(),
  status: z.enum(["PENDING", "ACHIEVED", "MISSED"]).default("PENDING"),
  position: z.number().int().default(0),
});

// Project Schema (Option C: goal_id is optional!)
export const createProjectSchema = z.object({
  goal_id: z.string().uuid().optional().nullable(),
  milestone_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Project title is required").max(200),
  description: z.string().optional().nullable(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]).default("PLANNED"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

// Task Schema (Option C: No XOR constraint! Tasks can belong to project, goal, or stand alone)
export const createTaskSchema = z.object({
  project_id: z.string().uuid().optional().nullable(),
  goal_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, "Task title is required").max(255),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  weight: z.number().int().min(1, "Weight must be at least 1").default(1),
  section: z.string().optional().nullable(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

// Habit Schema (Option C: direct optional goal_id)
export const createHabitSchema = z.object({
  title: z.string().min(1, "Habit title is required").max(200),
  description: z.string().optional().nullable(),
  goal_id: z.string().uuid().optional().nullable(),
  frequency: z.object({
    type: z.enum(["daily", "weekly", "specific_days"]),
    days: z.array(z.number().int().min(0).max(6)).optional(),
    targetPerWeek: z.number().int().min(1).max(7).optional(),
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
