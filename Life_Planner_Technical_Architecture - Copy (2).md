# EaseLife — Final Project Architecture

## 1. Product Identity

**Product:** EaseLife

**Tagline:** Structure Your Vision. Ease Your Days.

**Positioning:**
EaseLife is an opinionated personal operating system that connects long-term life direction to daily execution.

Its defining principle is **visible lineage**:

```text
Life Vision
    ↓
Goal
    ↓
Milestone
    ↓
Project
    ↓
Task
    ↓
Today's Runway
    ↓
Reflection
    ↓
Calibration
```

The product should continuously answer:

> **"Why does this matter today?"**

EaseLife is not primarily a task manager, calendar, habit tracker, or journal. Those are components of the system.

The product is the **relationship between them**.

---

# 2. Core Product Principles

## 2.1 Context Over Clutter

The interface should expose enough hierarchy to explain importance without displaying the entire hierarchy at once.

A task should be understandable in seconds.

```text
Task
→ Project
→ Milestone
→ Goal
→ Vision
```

The full lineage is available on demand.

---

## 2.2 Finite Work vs Recurring Behavior

### Tasks / Projects

Represent finite work with a defined outcome.

Examples:

* Build authentication
* Write API tests
* Finish portfolio website

### Habits

Represent recurring behaviors.

Examples:

* Exercise
* Read
* Deep work
* Drink water

Habits are not projects that repeat forever.

---

## 2.3 Derived Data Over Redundant State

Do not store values that can reliably be calculated from atomic records.

Examples:

* Project progress
* Habit streaks
* Completion percentages
* Execution statistics

The source of truth should remain the underlying records.

---

## 2.4 Transparent Progress

EaseLife should never produce unexplained "productivity scores."

Instead:

```text
Actual Progress
vs.
Expected Progress
```

Example:

```text
Expected: 60%
Actual:   48%

Difference: -12%

Status: At Risk
```

Every status should be explainable mathematically.

---

## 2.5 Explicit User Agency

The user controls priorities.

For MVP:

```text
User selects Today's Top 3
```

EaseLife does not silently reorder the user's priorities.

Future intelligence may **recommend**, but recommendations should be visible and explainable.

---

## 2.6 Security at the Database Layer

Supabase PostgreSQL Row Level Security is mandatory.

The frontend is never considered an authorization boundary.

---

# 3. Technology Architecture

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Framework      | Next.js App Router              |
| Language       | TypeScript                      |
| UI             | React                           |
| Styling        | Tailwind CSS                    |
| Components     | shadcn/ui                       |
| Authentication | Supabase Auth                   |
| Database       | Supabase PostgreSQL             |
| Authorization  | PostgreSQL RLS                  |
| Validation     | Zod                             |
| Server Logic   | Server Actions + Route Handlers |
| Testing        | Vitest + Playwright             |
| Deployment     | Vercel                          |
| File Storage   | Supabase Storage — later        |
| Realtime       | Supabase Realtime — later       |
| AI             | Later phase                     |

### Important architectural decision

**Do not introduce an ORM initially.**

Supabase already provides:

* PostgreSQL
* migrations
* generated TypeScript types
* SQL functions
* RLS
* query APIs

Adding Drizzle or another ORM at MVP would introduce another abstraction without solving a current problem.

---

# 4. High-Level System Architecture

```text
                         EaseLife
                            │
             ┌──────────────┴──────────────┐
             │                             │
          Next.js                       Supabase
             │                             │
     ┌───────┴────────┐          ┌─────────┴──────────┐
     │                │          │                    │
  React UI        Server       Auth              PostgreSQL
     │             Actions        │                    │
     │                │           │                    │
     └────────┬───────┘           │                    │
              │                   │                    │
              ▼                   │                    │
       Domain Services            │                    │
              │                   │                    │
      ┌───────┼────────┐          │                    │
      │       │        │          │                    │
   Planning Execution Reflection  │                    │
      │       │        │          │                    │
      └───────┼────────┘          │                    │
              │                   │                    │
              └───────────────────┴────────────────────┘
                                  │
                                  ▼
                              RLS Layer
```

---

# 5. Domain Model

```text
auth.users
    │
    ▼
profiles
    │
    ├── life_domains
    │
    ├── visions
    │      │
    │      └── goals
    │             │
    │             ├── key_results
    │             │
    │             ├── milestones
    │             │      │
    │             │      └── projects
    │             │             │
    │             │             └── tasks
    │             │
    │             └── goal_habits
    │                    │
    │                    └── habits
    │                           │
    │                           └── habit_completions
    │
    ├── daily_focus_tasks
    │
    ├── time_blocks
    │
    ├── daily_reflections
    │
    └── weekly_reflections
```

---

# 6. Core Entity Definitions

## Vision

A long-term direction.

Example:

```text
Become a highly capable software architect.
```

A Vision answers:

> Where am I ultimately trying to go?

---

## Goal

A measurable outcome supporting a Vision.

Example:

```text
Master backend engineering.
```

A Goal answers:

> What meaningful outcome am I pursuing?

---

## Milestone

A significant checkpoint inside a Goal.

Example:

```text
Production-grade API architecture completed.
```

A Milestone answers:

> What meaningful checkpoint proves progress?

---

## Project

A finite body of work that moves a Milestone or Goal forward.

Example:

```text
Build EaseLife API.
```

A Project answers:

> What body of work will produce the milestone?

---

## Task

A concrete executable action.

Example:

```text
Implement Supabase RLS policies.
```

A Task answers:

> What can I actually do?

---

## Habit

An ongoing recurring behavior that contributes directly to one or more Goals.

Example:

```text
90 minutes of deep technical study.
```

A Habit answers:

> What behavior must I repeatedly perform?

---

## Time Block

A scheduled period on the calendar.

A Time Block is **not** the task itself.

```text
Task:
Implement RLS policies

Time Block:
Tuesday 14:00–15:30
Deep Work
```

This separation is intentional.

---

# 7. Final Relational Structure

## User Layer

```text
auth.users
    ↓
profiles
    ↓
life_domains
```

---

## Direction Layer

```text
visions
    ↓
goals
    ↓
key_results
```

---

## Planning Layer

```text
goals
    ↓
milestones
    ↓
projects
    ↓
tasks
```

---

## Habit Layer

```text
goals
    ↓
goal_habits
    ↓
habits
    ↓
habit_completions
```

---

## Execution Layer

```text
daily_focus_tasks
    ↓
tasks

time_blocks
    ↓
tasks (optional)
```

---

## Reflection Layer

```text
daily_reflections

weekly_reflections
```

---

# 8. Ownership Model

Every user-owned table should contain:

```text
user_id uuid NOT NULL
```

This includes:

* life_domains
* visions
* goals
* key_results
* milestones
* projects
* tasks
* habits
* time_blocks
* daily_focus_tasks
* daily_reflections
* weekly_reflections

This makes RLS straightforward and efficient.

Ownership must also be consistent across relationships.

For example:

```text
User A
  └── Project A
        └── Task A
```

User B must never be able to create:

```text
User B
  └── Task B
        └── Project A
```

even if the UUID of Project A is known.

---

# 9. Final Task Ownership Rule

A task can belong to:

```text
Project
```

or:

```text
Goal
```

but never both.

The intended rule is:

```text
project_id IS NOT NULL
XOR
goal_id IS NOT NULL
```

This permits:

### Project task

```text
Goal
 ↓
Milestone
 ↓
Project
 ↓
Task
```

### Direct Goal task

```text
Goal
 ↓
Task
```

This is useful for actions that support a Goal but do not warrant a project.

An Inbox can be added later as an explicit entity if needed.

---

# 10. Project Lineage Rule

A Project can optionally belong to a Milestone.

Therefore:

```text
Project
   ↓
Milestone
   ↓
Goal
```

If a Project has no Milestone, it must still have a Goal.

Therefore:

```text
Project
   ↓
Goal
```

is valid.

But contradictory relationships are forbidden.

For example:

```text
Project
 ├── milestone → Milestone A → Goal A
 └── goal      → Goal B
```

is invalid.

The database/domain layer must enforce consistency.

---

# 11. Goal Hierarchy

Goals support optional parent goals.

```text
Vision
   ↓
Goal A
   ↓
Goal B
   ↓
Goal C
```

Rules:

* A Goal belongs to exactly one Vision.
* A Goal belongs to exactly one Domain.
* A Goal may have one parent Goal.
* Parent and child Goals must belong to the same user.
* Circular goal relationships are forbidden.

Example:

```text
Career
  ↓
Become a Principal Engineer
  ↓
Master Backend Engineering
  ↓
Master Distributed Systems
```

---

# 12. Today's Top 3 Architecture

Do **not** store:

```text
tasks.is_top_three
```

because Top 3 is date-specific.

Instead:

```text
daily_focus_tasks
```

with:

```text
id
user_id
date
task_id
position
created_at
```

Constraints:

```text
unique(user_id, date, task_id)

position ∈ {1,2,3}

unique(user_id, date, position)
```

Therefore:

```text
Monday
  1. Write API schema
  2. Implement authentication
  3. Review architecture

Tuesday
  1. Write tests
  2. Fix RLS
  3. Review PR
```

The same task can be Top 3 on different days.

---

# 13. Habit Architecture

The source of truth is:

```text
habit_completions
```

not stored streak counters.

Example:

```text
Habit
  ↓
Completion 2026-09-21
Completion 2026-09-22
Completion 2026-09-23
```

Current streak is calculated from completion history.

If performance later requires caching:

```text
streak_current
streak_longest
```

may be introduced as rebuildable derived data.

They must never become the authoritative source.

---

# 14. Habit Frequency

Use structured JSONB for MVP:

```json
{
  "type": "weekly",
  "days": [1, 3, 5]
}
```

Supported initial types:

```text
daily
weekly
specific_days
```

The domain service validates the frequency.

Do not allow arbitrary malformed JSON to become application behavior.

---

# 15. Scheduling Architecture

Scheduling is independent from task identity.

```text
Task
  │
  └──── optional ──── Time Block
```

Time Blocks may also exist independently.

Examples:

```text
Task:
Write architecture document

Time Block:
09:00–10:30
```

or:

```text
Meeting:
14:00–15:00
```

without a Task.

Supported block types:

```text
TASK
DEEP_WORK
MEETING
PERSONAL
BREAK
OTHER
```

---

# 16. Reflection Architecture

## Daily Reflection

Designed for approximately three minutes.

```text
Energy: 1–10
Focus: 1–10
What happened?
```

---

## Weekly Reflection

Designed for approximately ten minutes.

```text
Wins
Blockers
Lessons
What changes next week?
Alignment: 1–5
```

The purpose is not journaling for its own sake.

The purpose is:

```text
Execution
    ↓
Reflection
    ↓
Learning
    ↓
Calibration
    ↓
Better Planning
```

---

# 17. Lineage Engine

The Lineage Service is one of EaseLife's most important domain services.

## Task lineage

```text
Task
 ↓
Project
 ↓
Milestone
 ↓
Goal
 ↓
Vision
```

Possible shortened lineage:

```text
Task
 ↓
Project
 ↓
Goal
 ↓
Vision
```

when no milestone exists.

---

## Habit lineage

```text
Habit
 ↓
Goal
 ↓
Vision
```

A habit may support multiple goals.

---

## API

```text
GET /api/tasks/:taskId/lineage
```

Example:

```json
{
  "task": {
    "id": "t-101",
    "title": "Implement RLS policies"
  },
  "project": {
    "id": "p-201",
    "title": "EaseLife Platform"
  },
  "milestone": {
    "id": "m-301",
    "title": "Production Data Layer"
  },
  "goal": {
    "id": "g-401",
    "title": "Backend Engineering Mastery"
  },
  "vision": {
    "id": "v-501",
    "title": "Become a Principal Systems Architect"
  },
  "domain": {
    "name": "Career",
    "color": "#235789"
  }
}
```

The frontend should **not reconstruct this hierarchy manually**.

---

# 18. Progress Engine

## Project Progress

```text
Completed Task Weight
────────────────────── × 100
Total Non-Cancelled Task Weight
```

Example:

```text
Completed weight = 8
Total weight     = 12

Progress = 66.7%
```

If there are zero eligible tasks:

```text
Progress = 0%
```

The UI should distinguish:

```text
0% because nothing is complete
```

from:

```text
No measurable tasks yet
```

where useful.

---

# 19. Pace Engine

Expected progress:

```text
Expected =
(Current Date - Start Date)
/
(Target Date - Start Date)
× 100
```

Actual:

```text
Actual = completed weighted work / total weighted work × 100
```

Difference:

```text
Delta = Actual - Expected
```

Initial transparent thresholds:

```text
Delta >= -5%       → On Track
-20% <= Delta < -5% → At Risk
Delta < -20%       → Off Track
```

These thresholds are product configuration, not hidden intelligence.

Special cases must be handled:

* Before start date
* Target date equals start date
* Target date has passed
* Project completed
* No measurable tasks

---

# 20. Dashboard Architecture

The dashboard is the **Daily Runway**.

```text
┌───────────────────────────────────────────────────────────────┐
│ EaseLife       North Star / Current Focus                     │
├──────────────┬───────────────────────────────┬────────────────┤
│              │                               │                │
│ Navigation   │ Today's Top 3                 │ Lineage        │
│              │                               │                │
│ Runway       │ 1. Task                       │ Task           │
│ Goals        │ 2. Task                       │ ↓              │
│ Projects     │ 3. Task                       │ Project        │
│ Habits       │                               │ ↓              │
│ Calendar     │ Daily Habits                  │ Milestone      │
│ Review       │                               │ ↓              │
│              │ Time Blocks                   │ Goal           │
│              │                               │ ↓              │
│              │                               │ Vision         │
└──────────────┴───────────────────────────────┴────────────────┘
```

---

# 21. Dashboard API

Prefer one view-oriented request:

```text
GET /api/dashboard/today
```

Response:

```json
{
  "focus": {},
  "topTasks": [],
  "habits": [],
  "timeline": [],
  "stats": {},
  "unfinishedTasks": []
}
```

This prevents the dashboard from becoming a waterfall of independent requests.

The server assembles the dashboard from domain services.

---

# 22. Application Architecture

Use this flow:

```text
React Component
      ↓
Server Action / Route Handler
      ↓
Zod Validation
      ↓
Authentication
      ↓
Domain Service
      ↓
Supabase
      ↓
PostgreSQL + RLS
```

Never:

```text
React Component
      ↓
Business Logic
      ↓
Database
```

Business rules belong in domain services.

---

# 23. Domain Services

Recommended structure:

```text
lib/
├── planning/
│   ├── vision-service.ts
│   ├── goal-service.ts
│   ├── milestone-service.ts
│   └── project-service.ts
│
├── execution/
│   ├── task-service.ts
│   └── focus-service.ts
│
├── habits/
│   ├── habit-service.ts
│   ├── frequency-service.ts
│   └── streak-service.ts
│
├── scheduling/
│   └── time-block-service.ts
│
├── reflection/
│   ├── daily-reflection-service.ts
│   └── weekly-reflection-service.ts
│
├── lineage/
│   └── lineage-service.ts
│
├── progress/
│   ├── project-progress.ts
│   └── pace-engine.ts
│
└── validation/
    └── schemas.ts
```

---

# 24. Next.js Project Structure

```text
easelifе/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   │
│   ├── dashboard/
│   ├── goals/
│   │   ├── page.tsx
│   │   └── [goalId]/
│   │
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [projectId]/
│   │
│   ├── tasks/
│   ├── habits/
│   ├── calendar/
│   │
│   ├── review/
│   │   ├── daily/
│   │   └── weekly/
│   │
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── goals/
│   ├── projects/
│   ├── tasks/
│   ├── habits/
│   ├── calendar/
│   └── review/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   │
│   ├── planning/
│   ├── execution/
│   ├── habits/
│   ├── scheduling/
│   ├── reflection/
│   ├── lineage/
│   ├── progress/
│   ├── validation/
│   └── utils/
│
├── actions/
│   ├── visions.ts
│   ├── goals.ts
│   ├── milestones.ts
│   ├── projects.ts
│   ├── tasks.ts
│   ├── habits.ts
│   ├── focus.ts
│   └── reflections.ts
│
├── db/
│   ├── migrations/
│   └── seed.sql
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# 25. Supabase Architecture

```text
Supabase
│
├── Auth
│   ├── Email / Password
│   └── Google OAuth
│
├── PostgreSQL
│   ├── Tables
│   ├── Constraints
│   ├── Indexes
│   ├── Functions
│   └── RLS
│
├── Storage
│   └── Future attachments
│
└── Realtime
    └── Future live dashboard updates
```

Authentication belongs entirely to Supabase Auth.

Do not store passwords in the application database.

---

# 26. RLS Strategy

Every user-owned table:

```sql
alter table ... enable row level security;
```

Policies must cover:

```text
SELECT
INSERT
UPDATE
DELETE
```

Ownership:

```sql
auth.uid() = user_id
```

But relationship integrity must also be protected.

Example:

```text
Task.user_id
must equal
Project.user_id
```

when a project is assigned.

The database should reject inconsistent ownership rather than trusting the client.

---

# 27. Indexing Strategy

Initial indexes:

```sql
tasks(user_id, due_date)

tasks(project_id)

tasks(user_id, status)

daily_focus_tasks(user_id, date)

projects(goal_id)

projects(milestone_id)

milestones(goal_id)

goals(vision_id)

goals(user_id, status)

habits(user_id, status)

habit_completions(habit_id, date)

time_blocks(user_id, start_at, end_at)

daily_reflections(user_id, date)

weekly_reflections(user_id, week_start)
```

Only add additional indexes when query patterns justify them.

---

# 28. Date & Time Rules

Use `date` for:

```text
Goal target date
Milestone target date
Task due date
Habit completion date
Reflection date
Week start
```

Use `timestamptz` for:

```text
created_at
updated_at
completed_at
time_block.start_at
time_block.end_at
```

Store the user's IANA timezone:

```text
Asia/Phnom_Penh
America/New_York
Europe/London
```

Daily calculations must respect the user's timezone.

---

# 29. Design System

## Brand

```text
EaseLife
```

### Logo concept

Lowercase:

```text
e
```

combined with:

```text
upward trajectory
+
sprout
```

Meaning:

```text
Momentum + Sustainable Growth
```

---

## Color Tokens

```css
:root {
  --primary: #235789;
  --primary-foreground: #FFFFFF;

  --accent: #00A896;
  --accent-foreground: #FFFFFF;

  --growth: #60D394;
  --insight: #F4D35E;
  --danger: #EE6352;

  --background: #FFFFFF;
  --surface: #EDF2F4;
  --surface-muted: #F8FAFC;

  --foreground: #0F172A;
  --foreground-muted: #64748B;
}
```

---

# 30. Typography

Preferred:

```text
Headings:
Plus Jakarta Sans / Geist

Body:
Inter / Geist Sans

Timers / Numerical Data:
JetBrains Mono / Geist Mono
```

The visual system should feel:

```text
Calm
Precise
Grounded
Technical
Uncluttered
```

Avoid excessive gradients, animations, badges, gamification, and visual noise.

---

# 31. Entity Iconography

```text
Vision       → Sprout / Compass
Goal         → Target
Milestone    → Flag
Project      → Folder Kanban
Task         → Checkbox
Habit        → Repeat
Time Block   → Clock
Reflection   → Notebook / Message
```

Icons should remain consistent throughout the application.

---

# 32. MVP Screens

```text
/auth
    /login
    /signup
    /forgot-password

/dashboard

/goals
/goals/[goalId]

/projects
/projects/[projectId]

/tasks

/habits

/calendar

/review/daily
/review/weekly

/settings
```

---

# 33. MVP Scope

## Phase 1 — Direction

Build:

* Profile
* Life domains
* Visions
* Goals
* Key results

---

## Phase 2 — Planning

Build:

* Milestones
* Projects
* Project hierarchy
* Goal hierarchy
* CRUD
* Progress calculations

---

## Phase 3 — Execution

Build:

* Tasks
* Task state transitions
* Task priorities
* Task weights
* Due dates
* Time blocks
* Lineage

---

## Phase 4 — Habits

Build:

* Habit creation
* Frequency rules
* Completion logs
* Streak calculation
* Goal ↔ Habit relationships

---

## Phase 5 — Daily Runway

Build:

* North Star
* Today's Top 3
* Habit bar
* Timeline
* Task completion
* Lineage drawer

---

## Phase 6 — Reflection

Build:

* Daily reflection
* Weekly reflection
* Execution statistics
* Calibration workflow

---

## Phase 7 — Hardening

Build:

* RLS verification
* Authorization tests
* Input validation
* Error handling
* Performance optimization
* Responsive UI
* Accessibility
* E2E tests
* Production deployment

---

# 34. First Vertical Slice

Do not build every screen independently.

Build this complete journey first:

```text
Sign Up
   ↓
Create Vision
   ↓
Create Goal
   ↓
Create Milestone
   ↓
Create Project
   ↓
Create Task
   ↓
Open Dashboard
   ↓
See Task
   ↓
Open Lineage
   ↓
Vision
   ↓
Goal
   ↓
Milestone
   ↓
Project
   ↓
Task
   ↓
Complete Task
   ↓
Progress Updates
```

If this flow feels excellent, the core product architecture is working.

---

# 35. Testing Strategy

## Unit Tests

Test:

```text
Project progress
Task weight calculations
Pace calculations
Habit frequency
Habit streaks
Task state transitions
Goal hierarchy
Date calculations
Weekly boundaries
Lineage construction
```

---

## Integration Tests

Test:

```text
Authentication
CRUD
Server actions
Database constraints
RLS
Ownership validation
Cross-user access
```

---

## E2E Test

Primary scenario:

```text
Create account
    ↓
Create Vision
    ↓
Create Goal
    ↓
Create Milestone
    ↓
Create Project
    ↓
Create Task
    ↓
Add Task to Today's Top 3
    ↓
Open Dashboard
    ↓
Complete Task
    ↓
Verify progress
    ↓
Open Lineage
    ↓
Verify complete hierarchy
```

Critical security scenario:

```text
User A
  ↓
Attempts to access User B's task
  ↓
Database rejects request
```

---

# 36. Explicitly Postpone

Do not include these in the first MVP:

```text
AI Life Coach
Social features
Gamification
Full finance management
Full calendar replacement
Team collaboration
Wearable integrations
Advanced mood tracking
Large analytics dashboards
Automatic life optimization
Complex customization
```

These features can obscure whether the core product actually works.

---

# 37. Future AI Architecture

AI should come **after** the structured system is reliable.

Potential future request:

```text
"Plan my next week."
```

The AI could reason over:

```text
Vision
Goals
Milestones
Projects
Tasks
Deadlines
Time availability
Historical execution
Energy
Focus
Reflection data
```

It should return:

```text
Recommendations
+
Reasoning
+
Tradeoffs
```

not silently modify the user's life plan.

The user remains the final decision-maker.

---

# 38. Future Realtime Architecture

Supabase Realtime can later provide:

```text
Task completed
      ↓
Project progress updates
      ↓
Dashboard updates
      ↓
Lineage context refreshes
```

Realtime is not required for the first MVP.

---

# 39. Future Storage Architecture

Supabase Storage can later support:

```text
Avatars
Project documents
Attachments
Reflection images
Reference files
```

Do not build attachment management until the core planning loop is stable.

---

# 40. Core Domain Loop

The entire product ultimately revolves around:

```text
                 ┌───────────────┐
                 │    Direction  │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │     Goals     │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │  Milestones   │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │    Projects   │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │     Tasks     │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │  Daily Runway │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │   Reflection  │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │  Calibration  │
                 └───────┬───────┘
                         │
                         └──────────→ Better Direction
```

---

# 41. Final Architectural Principles

Before implementation begins, these principles are considered locked:

1. **Lineage is the defining product capability.**
2. **Tasks are executable actions; projects are finite bodies of work.**
3. **Habits are recurring behaviors and connect directly to Goals.**
4. **Scheduling is separate from task identity.**
5. **Today's Top 3 is date-scoped.**
6. **Progress is derived from atomic work.**
7. **Habit streaks are derived from completion history.**
8. **Users explicitly control their priorities.**
9. **Supabase PostgreSQL is the source of truth.**
10. **RLS is mandatory for every user-owned table.**
11. **Ownership consistency is enforced at the database/domain layer.**
12. **Business logic does not live inside React components.**
13. **The dashboard is a view-oriented composition, not a collection of unrelated API calls.**
14. **The architecture stays simple until real product requirements justify complexity.**
15. **AI comes after the underlying planning data and workflows are trustworthy.**

---

# 42. Definition of Architectural Readiness

EaseLife is ready to move from architecture into implementation when the following are accepted:

```text
✓ Domain model
✓ Ownership model
✓ Task/Project/Goal relationships
✓ Habit architecture
✓ Scheduling architecture
✓ Daily Top 3 architecture
✓ Lineage architecture
✓ Progress engine
✓ Pace engine
✓ RLS strategy
✓ Next.js structure
✓ Supabase strategy
✓ Testing strategy
✓ MVP boundaries
✓ Vertical slice
✓ Brand/design tokens
```

**Implementation should begin with the database migration + Supabase Auth + RLS foundation, followed immediately by the first vertical slice.**

The goal is not to build a large productivity application.

The goal is to prove one powerful loop:

```text
"I know where I'm going."
        ↓
"I know what matters."
        ↓
"I know what to do today."
        ↓
"I understand why it matters."
        ↓
"I can see whether I'm actually moving."
        ↓
"I can adjust intelligently."
```

That is the core of EaseLife.
