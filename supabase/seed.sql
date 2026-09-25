-- ==============================================================================
-- EaseLife Demo Seed Data
-- Run in Supabase SQL Editor or via `supabase db seed` to populate demo data.
-- ==============================================================================

do $$
declare
  v_user_id uuid;
  v_domain_career_id uuid;
  v_domain_health_id uuid;
  v_domain_growth_id uuid;
  v_vision_id uuid;
  v_goal_career_id uuid;
  v_goal_health_id uuid;
  v_milestone_id uuid;
  v_project_id uuid;
  v_task_1 uuid;
  v_task_2 uuid;
  v_task_3 uuid;
  v_habit_1 uuid;
  v_habit_2 uuid;
begin
  -- Get first user or current auth user
  select coalesce(auth.uid(), id) into v_user_id from auth.users order by created_at asc limit 1;

  if v_user_id is null then
    raise notice 'No users found in auth.users. Please sign up or create a user before running this seed script.';
    return;
  end if;

  -- 1. Ensure Life Domains
  insert into public.life_domains (user_id, name, color, position)
  values
    (v_user_id, 'Career & Craft', '#235789', 1),
    (v_user_id, 'Health & Vitality', '#00A896', 2),
    (v_user_id, 'Personal Growth', '#60D394', 3),
    (v_user_id, 'Relationships', '#F4D35E', 4)
  on conflict do nothing;

  select id into v_domain_career_id from public.life_domains where user_id = v_user_id and name = 'Career & Craft' limit 1;
  select id into v_domain_health_id from public.life_domains where user_id = v_user_id and name = 'Health & Vitality' limit 1;
  select id into v_domain_growth_id from public.life_domains where user_id = v_user_id and name = 'Personal Growth' limit 1;

  -- 2. Visions
  insert into public.visions (user_id, domain_id, title, description)
  values (
    v_user_id,
    v_domain_career_id,
    'Build and scale high-impact life management technology',
    'Operate at the frontier of personal systems engineering and deliver software that creates deep agency.'
  )
  returning id into v_vision_id;

  -- 3. Goals
  insert into public.goals (user_id, vision_id, domain_id, title, description, status, target_date)
  values (
    v_user_id,
    v_vision_id,
    v_domain_career_id,
    'Launch EaseLife Production Architecture',
    'Achieve full end-to-end lineage across all operational entities with 99.9% uptime.',
    'ACTIVE',
    (current_date + interval '60 days')::date
  )
  returning id into v_goal_career_id;

  insert into public.goals (user_id, vision_id, domain_id, title, description, status, target_date)
  values (
    v_user_id,
    v_vision_id,
    v_domain_health_id,
    'Sustain Peak Mental & Physical Clarity',
    'Daily movement, morning hydration, and deliberate deep work blocks.',
    'ACTIVE',
    (current_date + interval '90 days')::date
  )
  returning id into v_goal_health_id;

  -- 4. Milestone
  insert into public.milestones (user_id, goal_id, title, target_date, status, position)
  values (
    v_user_id,
    v_goal_career_id,
    'Alpha MVP Deployed & Validated',
    (current_date + interval '14 days')::date,
    'PENDING',
    1
  )
  returning id into v_milestone_id;

  -- 5. Project
  insert into public.projects (user_id, goal_id, milestone_id, title, description, status, start_date, target_date)
  values (
    v_user_id,
    v_goal_career_id,
    v_milestone_id,
    'Core Runway & Lineage Engine System',
    'Build the daily runway dashboard, weekly habit tracker, and lineage drawer.',
    'IN_PROGRESS',
    current_date,
    (current_date + interval '14 days')::date
  )
  returning id into v_project_id;

  -- 6. Tasks (Linked to Project)
  insert into public.tasks (user_id, project_id, title, description, status, priority, weight, due_date)
  values (
    v_user_id,
    v_project_id,
    'Implement weekly runway habit tracker heat-strip',
    'Follow EaseLife brand sheet color palette (#60D394 for completed, #F4D35E for in-progress).',
    'COMPLETED',
    'HIGH',
    3,
    current_date
  )
  returning id into v_task_1;

  insert into public.tasks (user_id, project_id, title, description, status, priority, weight, due_date)
  values (
    v_user_id,
    v_project_id,
    'Design and wire Visible Lineage Drawer',
    'Ensure node-by-node path from task to north star vision is rendered cleanly.',
    'TODO',
    'URGENT',
    5,
    current_date
  )
  returning id into v_task_2;

  insert into public.tasks (user_id, project_id, title, description, status, priority, weight, due_date)
  values (
    v_user_id,
    v_project_id,
    'Conduct evening daily reflection calibration',
    'Log energy, focus scores, and calibrate friction points.',
    'TODO',
    'MEDIUM',
    2,
    current_date
  )
  returning id into v_task_3;

  -- 7. Habits
  insert into public.habits (user_id, title, description, frequency, status)
  values (
    v_user_id,
    'Morning Hydration & Sunlight',
    '500ml water and 10 minutes outdoor light exposure upon waking.',
    '{"type": "daily"}'::jsonb,
    'ACTIVE'
  )
  returning id into v_habit_1;

  insert into public.habits (user_id, title, description, frequency, status)
  values (
    v_user_id,
    '90-Minute Deep Work Sprint',
    'Zero notifications, single tab execution on Top 1 focus task.',
    '{"type": "daily"}'::jsonb,
    'ACTIVE'
  )
  returning id into v_habit_2;

  -- 8. Top 3 Daily Focus
  insert into public.daily_focus_tasks (user_id, date, position, task_id)
  values
    (v_user_id, current_date, 1, v_task_1),
    (v_user_id, current_date, 2, v_task_2),
    (v_user_id, current_date, 3, v_task_3)
  on conflict (user_id, date, position) do update set task_id = excluded.task_id;

  -- 9. Habit completion for habit 1 today
  insert into public.habit_completions (user_id, habit_id, date)
  values (v_user_id, v_habit_1, current_date)
  on conflict (user_id, habit_id, date) do nothing;

  raise notice 'EaseLife demo seed data populated successfully for user %!', v_user_id;
end;
$$;
