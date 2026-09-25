# EaseLife — Production Personal Operating System

EaseLife is a production-grade personal operating system built with **Next.js 16 (App Router + Turbopack)**, **Tailwind CSS v4**, and **Supabase (PostgreSQL with Row Level Security)**.

It grounds daily concrete execution in high-level purpose via **Visible Lineage Architecture** and mathematically derived pace indicators.

---

## 🏛️ Core Architectural Foundations

1. **Relational Identity & Full Visible Lineage**
   - Every daily action is grounded in an unbroken hierarchy:
     $$\text{Vision} \longrightarrow \text{Goal} \longrightarrow \text{Milestone} \longrightarrow \text{Project} \longrightarrow \text{Task / Habit}$$
   - Lineage is inspectable anywhere in the UI via the **Visible Lineage Drawer**.

2. **Derived Mathematical State (Zero Stored Redundancy)**
   - **Weighted Project Progress**: Progress is dynamically calculated from atomic task weights:
     $$\text{Progress} = \frac{\sum_{\text{completed}} w_i}{\sum_{\text{total}} w_i} \times 100$$
   - **Pace Engine**: Real-time pace delta comparing actual completion rate against expected timeline progress (`On Track`, `At Risk`, `Off Track`).
   - **Habits & Streaks Engine**: Calculated dynamically from immutable date-stamped completion logs with midday timezone normalization to avoid DST shifts.

3. **Strict Data Integrity (PostgreSQL + RLS)**
   - Task XOR Ownership: `(project_id IS NOT NULL AND goal_id IS NULL) OR (project_id IS NULL AND goal_id IS NOT NULL)`.
   - Granular Row Level Security on all 15 operational entities: users can strictly access only their own data.

4. **Brand Design System: "Pace & Focus"**
   - Derived directly from `EaseLife_brand_sheet.jpg`:
     - **North Blue** (`#235789`): Direction, visions, and operational framework.
     - **Momentum Teal** (`#00A896`): Active execution, primary buttons, and successful streaks.
     - **Growth Green** (`#60D394`): Progress indicators, milestones, and habit completion.
     - **Insight Amber** (`#F4D35E`): Daily reflections, highlights, and focus accents.
     - **Clarity Gray** (`#EDF2F4`): Neutral card surfaces and backgrounds.

---

## 📂 Project Directory Structure

```text
EaseLife/
├── actions/                  # Next.js Server Actions (standardized ActionResult<T>)
│   ├── auth.ts               # Sign in, Sign up, Sign out
│   ├── execution.ts          # Task updates, daily focus setting
│   ├── habits.ts             # Habit toggles, creations
│   ├── planning.ts           # Vision, Goal, Milestone, Project creation
│   ├── reflection.ts         # Daily reflections upsert
│   └── index.ts              # Barrel export
│
├── app/                      # Next.js App Router
│   ├── api/                  # RESTful API endpoints (today's dashboard, task lineage)
│   ├── calendar/             # Calendar & schedule runway
│   ├── dashboard/            # Daily Runway Dashboard
│   ├── goals/                # Goals & Visions management
│   ├── habits/               # Habit tracker & streak metrics
│   ├── login/ & signup/      # Supabase Cloud auth pages
│   ├── projects/             # Projects, milestones, and progress
│   ├── review/daily/         # Daily reflection loop (energy, focus, learning)
│   ├── settings/             # User settings
│   ├── tasks/                # Master task registry
│   ├── error.tsx             # Global error boundary
│   ├── loading.tsx           # Global loading skeleton
│   ├── not-found.tsx         # 404 handler
│   └── layout.tsx            # Root layout with Inter font and CSS variables
│
├── components/               # Modularized UI Components
│   ├── auth/                 # LoginForm, SignupForm
│   ├── brand/                # Official EaseLife SVG Logos & Icons
│   ├── dashboard/            # Modular Runway widgets:
│   │   ├── runway-ribbon.tsx       # Tethered Actions banner
│   │   ├── top3-focus-card.tsx     # Today's Top 3 focus tasks
│   │   ├── habit-heat-strip.tsx    # Sun-Sat weekly habit heat strip
│   │   ├── backlog-queue.tsx       # Task queue with slot assignments
│   │   ├── daily-habits-card.tsx   # Daily habits list & streaks
│   │   └── pace-indicator-card.tsx # Pace engine status card
│   ├── lineage/              # Visible Lineage Drawer with timeline spine
│   ├── planning/             # Unified entity creation modal
│   └── shared/               # Responsive NavShell and operational topbar
│
├── db/ & supabase/           # PostgreSQL Migrations & Seeds
│   ├── migrations/
│   │   └── 00001_initial_schema.sql  # 15 entities, triggers, and RLS policies
│   └── seed.sql                      # Demo data generator script
│
├── lib/                      # Core Domain Engines & Services
│   ├── execution/            # TaskService, FocusService
│   ├── habits/               # StreakService, FrequencyService, HabitService
│   ├── lineage/              # LineageEngine (Task -> Project -> Milestone -> Goal -> Vision)
│   ├── planning/             # VisionService, GoalService, MilestoneService, ProjectService
│   ├── progress/             # PaceEngine, ProjectProgress calculator
│   ├── reflection/           # DailyReflectionService
│   ├── supabase/             # Supabase Browser, Server, and Proxy clients
│   └── validation/           # Zod schemas with XOR validation
│
├── tests/                    # Automated Test Suite
│   └── unit/
│       └── engines.test.ts   # Vitest unit tests for all mathematical engines
│
├── types/                    # Domain & Action Type Definitions
│   ├── actions.ts            # ActionResult<T>, ActionSuccess<T>, ActionError
│   ├── domain.ts             # Strongly typed models (Vision, Goal, Task, Habit, etc.)
│   └── index.ts              # Barrel export
│
├── proxy.ts                  # Next.js 16 Proxy Convention (replaces middleware.ts)
└── vitest.config.ts          # Unit test configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Package Manager**: Strictly `npm`

### 2. Environment Setup
Copy the template and configure your Supabase credentials:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Migration & Seed
Run `supabase/migrations/00001_initial_schema.sql` in your Supabase SQL Editor.
To populate sample data with active tasks, habits, and north star visions, run `supabase/seed.sql`.

> **Note on Email Confirmation**: Supabase Cloud enables email confirmation by default. To log in immediately during testing, either click the email confirmation link or toggle off **Confirm email** under *Authentication $\to$ Providers $\to$ Email* in the Supabase Dashboard.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your Daily Runway.

### 5. Running Tests & Production Build
```bash
# Run unit test suite (Vitest)
npm test

# Run production build (Next.js 16 + Turbopack)
npm run build
```

---

## 🛡️ License
Private & Proprietary — EaseLife Personal Operating System.
