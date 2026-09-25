-- ==============================================================================
-- EaseLife: Initial Database Migration
-- Architecture Compliant: Sections 5-16, 25-28
-- ==============================================================================

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Life Domains
create table if not exists public.life_domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  icon text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Visions
create table if not exists public.visions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain_id uuid references public.life_domains(id) on delete set null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vision_id uuid not null references public.visions(id) on delete cascade,
  domain_id uuid references public.life_domains(id) on delete set null,
  parent_goal_id uuid references public.goals(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'ACTIVE' check (status in ('NOT_STARTED', 'ACTIVE', 'COMPLETED', 'ON_HOLD', 'ABANDONED')),
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_parent_goal check (parent_goal_id != id)
);

-- 5. Key Results
create table if not exists public.key_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null,
  target_value numeric not null default 100,
  current_value numeric not null default 0,
  metric_unit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Milestones
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  title text not null,
  target_date date,
  status text not null default 'PENDING' check (status in ('PENDING', 'ACHIEVED', 'MISSED')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'PLANNED' check (status in ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED')),
  start_date date,
  target_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Tasks (Task Ownership XOR Rule: project_id IS NOT NULL XOR goal_id IS NOT NULL)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'TODO' check (status in ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  priority text not null default 'MEDIUM' check (priority in ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  weight integer not null default 1 check (weight >= 1),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint task_ownership_xor check (
    (project_id is not null and goal_id is null) or
    (project_id is null and goal_id is not null)
  )
);

-- 9. Habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  frequency jsonb not null default '{"type": "daily"}'::jsonb,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'PAUSED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. Goal Habits (Many-to-Many linking Goals and Habits)
create table if not exists public.goal_habits (
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (goal_id, habit_id)
);

-- 11. Habit Completions
create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null,
  completed_at timestamptz not null default now(),
  constraint unique_user_habit_date unique (user_id, habit_id, date)
);

-- 12. Daily Focus Tasks (Today's Top 3)
create table if not exists public.daily_focus_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  task_id uuid not null references public.tasks(id) on delete cascade,
  position integer not null check (position in (1, 2, 3)),
  created_at timestamptz not null default now(),
  constraint unique_user_date_task unique (user_id, date, task_id),
  constraint unique_user_date_position unique (user_id, date, position)
);

-- 13. Time Blocks
create table if not exists public.time_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  type text not null default 'TASK' check (type in ('TASK', 'DEEP_WORK', 'MEETING', 'PERSONAL', 'BREAK', 'OTHER')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint check_time_block_order check (end_at > start_at)
);

-- 14. Daily Reflections
create table if not exists public.daily_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  energy integer not null check (energy between 1 and 10),
  focus integer not null check (focus between 1 and 10),
  what_happened text,
  created_at timestamptz not null default now(),
  constraint unique_user_daily_reflection unique (user_id, date)
);

-- 15. Weekly Reflections
create table if not exists public.weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  wins text,
  blockers text,
  lessons text,
  changes_next_week text,
  alignment integer not null check (alignment between 1 and 5),
  created_at timestamptz not null default now(),
  constraint unique_user_weekly_reflection unique (user_id, week_start)
);

-- ==============================================================================
-- Performance Indexes (Architecture Section 27)
-- ==============================================================================
create index if not exists idx_tasks_user_due on public.tasks(user_id, due_date);
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_user_status on public.tasks(user_id, status);
create index if not exists idx_focus_user_date on public.daily_focus_tasks(user_id, date);
create index if not exists idx_projects_goal on public.projects(goal_id);
create index if not exists idx_projects_milestone on public.projects(milestone_id);
create index if not exists idx_milestones_goal on public.milestones(goal_id);
create index if not exists idx_goals_vision on public.goals(vision_id);
create index if not exists idx_goals_user_status on public.goals(user_id, status);
create index if not exists idx_habits_user_status on public.habits(user_id, status);
create index if not exists idx_habit_completions_date on public.habit_completions(habit_id, date);
create index if not exists idx_time_blocks_range on public.time_blocks(user_id, start_at, end_at);
create index if not exists idx_daily_reflections_date on public.daily_reflections(user_id, date);
create index if not exists idx_weekly_reflections_week on public.weekly_reflections(user_id, week_start);

-- ==============================================================================
-- Row Level Security (RLS) Policies (Architecture Section 26)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.life_domains enable row level security;
alter table public.visions enable row level security;
alter table public.goals enable row level security;
alter table public.key_results enable row level security;
alter table public.milestones enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.goal_habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.daily_focus_tasks enable row level security;
alter table public.time_blocks enable row level security;
alter table public.daily_reflections enable row level security;
alter table public.weekly_reflections enable row level security;

-- Profiles Policy
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Standard ownership policies for all user-owned tables
create policy "Users own life_domains" on public.life_domains
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own visions" on public.visions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own goals" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own key_results" on public.key_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own milestones" on public.milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own projects" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own goal_habits" on public.goal_habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own habit_completions" on public.habit_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own daily_focus_tasks" on public.daily_focus_tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own time_blocks" on public.time_blocks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own daily_reflections" on public.daily_reflections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own weekly_reflections" on public.weekly_reflections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==============================================================================
-- Automatic Profile Trigger on Auth Signup
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  
  -- Insert default life domains for fresh users
  insert into public.life_domains (user_id, name, color, position) values
    (new.id, 'Career & Craft', '#235789', 1),
    (new.id, 'Health & Vitality', '#00A896', 2),
    (new.id, 'Personal Growth', '#60D394', 3),
    (new.id, 'Relationships', '#F4D35E', 4);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
