export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      life_domains: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          icon?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      visions: {
        Row: {
          id: string;
          user_id: string;
          domain_id: string | null;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain_id?: string | null;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain_id?: string | null;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          vision_id: string;
          domain_id: string | null;
          parent_goal_id: string | null;
          title: string;
          description: string | null;
          status: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ABANDONED';
          target_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vision_id: string;
          domain_id?: string | null;
          parent_goal_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ABANDONED';
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vision_id?: string;
          domain_id?: string | null;
          parent_goal_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ABANDONED';
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      key_results: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string;
          title: string;
          target_value: number;
          current_value: number;
          metric_unit: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id: string;
          title: string;
          target_value?: number;
          current_value?: number;
          metric_unit?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string;
          title?: string;
          target_value?: number;
          current_value?: number;
          metric_unit?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      milestones: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string;
          title: string;
          target_date: string | null;
          status: 'PENDING' | 'ACHIEVED' | 'MISSED';
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id: string;
          title: string;
          target_date?: string | null;
          status?: 'PENDING' | 'ACHIEVED' | 'MISSED';
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string;
          title?: string;
          target_date?: string | null;
          status?: 'PENDING' | 'ACHIEVED' | 'MISSED';
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string;
          milestone_id: string | null;
          title: string;
          description: string | null;
          status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
          start_date: string | null;
          target_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id: string;
          milestone_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
          start_date?: string | null;
          target_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string;
          milestone_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
          start_date?: string | null;
          target_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          goal_id: string | null;
          title: string;
          description: string | null;
          status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          weight: number;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          goal_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          weight?: number;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          goal_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          weight?: number;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          frequency: Json;
          status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          frequency?: Json;
          status?: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          frequency?: Json;
          status?: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      goal_habits: {
        Row: {
          user_id: string;
          goal_id: string;
          habit_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          goal_id: string;
          habit_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          goal_id?: string;
          habit_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      habit_completions: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          date: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_id: string;
          date: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_id?: string;
          date?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      daily_focus_tasks: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          task_id: string;
          position: 1 | 2 | 3;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          task_id: string;
          position: 1 | 2 | 3;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          task_id?: string;
          position?: 1 | 2 | 3;
          created_at?: string;
        };
        Relationships: [];
      };
      time_blocks: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          title: string;
          type: 'TASK' | 'DEEP_WORK' | 'MEETING' | 'PERSONAL' | 'BREAK' | 'OTHER';
          start_at: string;
          end_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          title: string;
          type?: 'TASK' | 'DEEP_WORK' | 'MEETING' | 'PERSONAL' | 'BREAK' | 'OTHER';
          start_at: string;
          end_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          title?: string;
          type?: 'TASK' | 'DEEP_WORK' | 'MEETING' | 'PERSONAL' | 'BREAK' | 'OTHER';
          start_at?: string;
          end_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      daily_reflections: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          energy: number;
          focus: number;
          what_happened: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          energy: number;
          focus: number;
          what_happened?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          energy?: number;
          focus?: number;
          what_happened?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      weekly_reflections: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          wins: string | null;
          blockers: string | null;
          lessons: string | null;
          changes_next_week: string | null;
          alignment: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          wins?: string | null;
          blockers?: string | null;
          lessons?: string | null;
          changes_next_week?: string | null;
          alignment: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          wins?: string | null;
          blockers?: string | null;
          lessons?: string | null;
          changes_next_week?: string | null;
          alignment?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
