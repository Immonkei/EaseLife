/**
 * EaseLife Core Domain Types
 * Clean decoupled view & entity interfaces.
 */

export interface LifeDomain {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  position?: number;
}

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
  vision_id: string;
  domain_id?: string | null;
  parent_goal_id?: string | null;
  title: string;
  description?: string | null;
  status: GoalStatus;
  target_date?: string | null;
  created_at: string;
  visions?: Vision | null;
  life_domains?: LifeDomain | null;
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
  goal_id: string;
  milestone_id?: string | null;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  start_date?: string | null;
  target_date?: string | null;
  completed_at?: string | null;
  goals?: { id: string; title: string } | null;
  milestones?: { id: string; title: string } | null;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  project_id?: string | null;
  goal_id?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  weight: number;
  due_date?: string | null;
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
  title: string;
  description?: string | null;
  frequency: HabitFrequency;
  status: HabitStatus;
  currentStreak?: number;
  longestStreak?: number;
  completedToday?: boolean;
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
