-- ==============================================================================
-- EaseLife: Calm Purposeful Alignment Schema Migration (Option C)
-- Simplifies the architecture from 15 tables to a lean 9-entity relational model:
-- 1. Merges life_domains + visions into life_themes
-- 2. Makes goals.theme_id optional (unblocks goal creation without visions)
-- 3. Makes projects.goal_id optional (unblocks standalone projects)
-- 4. Removes task_ownership_xor constraint (unblocks standalone tasks)
-- 5. Adds section, is_focus, focus_date, focus_position to tasks
-- 6. Adds direct optional goal_id to habits (replaces goal_habits join table)
-- 7. Drops unused key_results, milestones, goal_habits, time_blocks
-- ==============================================================================

-- 1. Create life_themes (unifying domains and vision statements)
create table if not exists public.life_themes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  vision_statement text,
  color text not null default '#235789',
  icon text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS for life_themes
alter table public.life_themes enable row level security;
create policy "Users own life_themes" on public.life_themes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_life_themes_user on public.life_themes(user_id, position);

-- Migrate existing life_domains + visions into life_themes if tables exist
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'life_domains') then
    insert into public.life_themes (id, user_id, name, vision_statement, color, icon, position, created_at)
    select 
      d.id, 
      d.user_id, 
      d.name, 
      (select description from public.visions where domain_id = d.id order by created_at desc limit 1),
      d.color, 
      d.icon, 
      d.position, 
      d.created_at
    from public.life_domains d
    on conflict (id) do nothing;
  end if;
end $$;

-- 2. Update Goals: Add theme_id, optional metrics, make vision_id nullable
alter table public.goals add column if not exists theme_id uuid references public.life_themes(id) on delete set null;
alter table public.goals add column if not exists metric_target numeric;
alter table public.goals add column if not exists metric_current numeric default 0;
alter table public.goals add column if not exists metric_unit text;

-- If domain_id was set, populate theme_id
do $$
begin
  if exists (select from information_schema.columns where table_schema = 'public' and table_name = 'goals' and column_name = 'domain_id') then
    update public.goals set theme_id = domain_id where theme_id is null and domain_id is not null;
  end if;
  if exists (select from information_schema.columns where table_schema = 'public' and table_name = 'goals' and column_name = 'vision_id') then
    alter table public.goals alter column vision_id drop not null;
  end if;
end $$;

create index if not exists idx_goals_theme on public.goals(theme_id);

-- 3. Update Projects: Make goal_id optional
do $$
begin
  if exists (select from information_schema.columns where table_schema = 'public' and table_name = 'projects' and column_name = 'goal_id') then
    alter table public.projects alter column goal_id drop not null;
  end if;
end $$;

-- 4. Update Tasks: Remove XOR constraint, add focus & section columns
alter table public.tasks drop constraint if exists task_ownership_xor;
alter table public.tasks add column if not exists section text;
alter table public.tasks add column if not exists is_focus boolean not null default false;
alter table public.tasks add column if not exists focus_date date;
alter table public.tasks add column if not exists focus_position integer check (focus_position in (1, 2, 3));

create index if not exists idx_tasks_focus on public.tasks(user_id, focus_date, focus_position) where is_focus = true;

-- 5. Update Habits: Add direct optional goal_id
alter table public.habits add column if not exists goal_id uuid references public.goals(id) on delete set null;

-- Migrate goal_habits if existing
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'goal_habits') then
    update public.habits h
    set goal_id = gh.goal_id
    from public.goal_habits gh
    where h.id = gh.habit_id and h.goal_id is null;
  end if;
end $$;

create index if not exists idx_habits_goal on public.habits(goal_id);

-- 6. Clean up obsolete enterprise tables
drop table if exists public.key_results cascade;
drop table if exists public.milestones cascade;
drop table if exists public.goal_habits cascade;
drop table if exists public.time_blocks cascade;

-- 7. Update handle_new_user trigger to seed default life_themes
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  
  -- Insert default life themes for fresh users
  insert into public.life_themes (user_id, name, vision_statement, color, position) values
    (new.id, 'Career & Craft', 'Build meaningful work and master high-value craft.', '#235789', 1),
    (new.id, 'Health & Vitality', 'Sustain physical vitality, mental clarity, and deep energy.', '#00A896', 2),
    (new.id, 'Personal Growth', 'Cultivate continuous learning, wisdom, and resilience.', '#60D394', 3),
    (new.id, 'Relationships', 'Nurture deep presence, connection, and family bonds.', '#F4D35E', 4);

  return new;
end;
$$ language plpgsql security definer;
