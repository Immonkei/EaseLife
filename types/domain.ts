/**
 * EaseLife Core Domain Types
 * Option C: Calm Purposeful Alignment (Long-term -> Daily Connection)
 */

export interface LifeTheme {
  id: string;
  name: string;
  vision_statement?: string | null;
  color: string;
  icon?: string | null;
  position?: number;
  created_at?: string;
}

// Backwards-compatible alias for existing imports
export type LifeDomain = LifeTheme;

export interface Vision {
  id: string;
  title: string;
  description?: string | null;
  domain_id?: string | null;
  created_at: string;
  life_domains?: LifeDomain | null;
}

export type GoalStatus = 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ABANDONED';

export interface Goal {
  id: string;
  theme_id?: string | null;
  vision_id?: string | null; // Optional/legacy
  domain_id?: string | null; // Optional/legacy
  parent_goal_id?: string | null;
  title: string;
  description?: string | null;
  status: GoalStatus;
  target_date?: string | null;
  metric_target?: number | null;
  metric_current?: number | null;
  metric_unit?: string | null;
  created_at: string;
  life_themes?: LifeTheme | null;
  visions?: { id: string; title: string } | null;
  life_domains?: { id: string; name: string; color: string } | null;
}

export type MilestoneStatus = 'PENDING' | 'ACHIEVED' | 'MISSED';

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  target_date?: string | null;
  status: MilestoneStatus;
  position: number;
}

export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export interface Project {
  id: string;
  goal_id?: string | null; // Optional: projects can stand alone!
  milestone_id?: string | null;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  start_date?: string | null;
  target_date?: string | null;
  completed_at?: string | null;
  goals?: { id: string; title: string; theme_id?: string | null } | null;
  milestones?: { id: string; title: string } | null;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  project_id?: string | null; // Optional: tasks can stand alone!
  goal_id?: string | null;    // Optional: tasks can stand alone!
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  weight?: number;
  section?: string | null;    // Project phase / section
  due_date?: string | null;
  is_focus?: boolean;
  focus_date?: string | null;
  focus_position?: 1 | 2 | 3 | null;
  completed_at?: string | null;
  projects?: { id: string; title: string } | null;
  goals?: { id: string; title: string } | null;
}

export type HabitStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'specific_days';
  days?: number[];
  targetPerWeek?: number;
}

export interface Habit {
  id: string;
  goal_id?: string | null;    // Optional direct link to Goal
  title: string;
  description?: string | null;
  frequency: HabitFrequency;
  status: HabitStatus;
  currentStreak?: number;
  longestStreak?: number;
  consistencyRate?: number;   // 0-100% rolling consistency
  completedToday?: boolean;
  goals?: { id: string; title: string } | null;
}

export interface DailyFocusTask {
  id: string;
  date: string;
  position: 1 | 2 | 3;
  task_id: string;
  tasks?: Task | null;
}

export type TimeBlockType = 'TASK' | 'DEEP_WORK' | 'MEETING' | 'PERSONAL' | 'BREAK' | 'OTHER';

export interface TimeBlock {
  id: string;
  title: string;
  type: TimeBlockType;
  start_at: string;
  end_at: string;
  task_id?: string | null;
}

export interface DailyReflection {
  id: string;
  date: string;
  energy: number;
  focus: number;
  what_happened?: string | null;
}

export interface WeeklyReflection {
  id: string;
  week_start: string;
  wins?: string | null;
  blockers?: string | null;
  lessons?: string | null;
  changes_next_week?: string | null;
  alignment: number;
}
