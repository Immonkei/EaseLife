"use client";

import { useState } from "react";
import {
  RefreshCw,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FolderKanban,
  Repeat,
  ArrowRight,
  ArrowLeft,
  Zap,
  Target,
  Sun,
  ShieldCheck,
} from "lucide-react";
import { WeeklyStats } from "@/lib/reflection/weekly-reflection-service";
import { actionSaveWeeklyReflection, actionSaveDailyReflection } from "@/actions/reflection";

interface ReviewClientProps {
  initialWeeklyStats: WeeklyStats;
  initialWeeklyReflection?: {
    wins?: string | null;
    blockers?: string | null;
    lessons?: string | null;
    changes_next_week?: string | null;
    alignment?: number;
  } | null;
  initialDailyReflection?: {
    energy?: number;
    focus?: number;
    what_happened?: string | null;
  } | null;
}

export function ReviewClient({
  initialWeeklyStats,
  initialWeeklyReflection,
  initialDailyReflection,
}: ReviewClientProps) {
  const [mode, setMode] = useState<"weekly" | "daily">("weekly");
  const [weeklyStep, setWeeklyStep] = useState<1 | 2 | 3 | 4>(1);

  // Weekly review state
  const [wins, setWins] = useState(initialWeeklyReflection?.wins || "");
  const [blockers, setBlockers] = useState(initialWeeklyReflection?.blockers || "");
  const [nextWeekPriorities, setNextWeekPriorities] = useState(initialWeeklyReflection?.changes_next_week || "");
  const [alignment, setAlignment] = useState(initialWeeklyReflection?.alignment || 4);
  const [weeklySaving, setWeeklySaving] = useState(false);
  const [weeklySaved, setWeeklySaved] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);

  // Daily review state
  const [dailyEnergy, setDailyEnergy] = useState(initialDailyReflection?.energy || 8);
  const [dailyFocus, setDailyFocus] = useState(initialDailyReflection?.focus || 8);
  const [dailyNote, setDailyNote] = useState(initialDailyReflection?.what_happened || "");
  const [dailySaving, setDailySaving] = useState(false);
  const [dailySaved, setDailySaved] = useState(false);
  const [dailyError, setDailyError] = useState<string | null>(null);

  const handleWeeklySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWeeklySaving(true);
    setWeeklyError(null);
    setWeeklySaved(false);

    const res = await actionSaveWeeklyReflection({
      week_start: initialWeeklyStats.weekStartDate,
      wins,
      blockers,
      changes_next_week: nextWeekPriorities,
      alignment,
    });

    if (res?.error) {
      setWeeklyError(res.error);
    } else {
      setWeeklySaved(true);
    }
    setWeeklySaving(false);
  };

  const handleDailySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDailySaving(true);
    setDailyError(null);
    setDailySaved(false);

    const todayStr = new Date().toISOString().split("T")[0];
    const res = await actionSaveDailyReflection({
      date: todayStr,
      energy: dailyEnergy,
      focus: dailyFocus,
      what_happened: dailyNote,
    });

    if (res?.error) {
      setDailyError(res.error);
    } else {
      setDailySaved(true);
    }
    setDailySaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-zinc-900" />
            <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Review & Calibration</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            A quiet mirror to look back, celebrate, and set up your next runway.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="p-1 bg-zinc-100 rounded-lg flex gap-1 text-xs self-start sm:self-auto border border-black/[0.04]">
          <button
            onClick={() => setMode("weekly")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === "weekly" ? "bg-white text-[#235789] font-semibold shadow-2xs" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Weekly Reset (10m)
          </button>
          <button
            onClick={() => setMode("daily")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === "daily" ? "bg-white text-[#235789] font-semibold shadow-2xs" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Evening Closure
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* WEEKLY RESET WIZARD */}
      {/* ============================================================ */}
      {mode === "weekly" && (
        <div className="space-y-6">
          {/* Step Progress Tracker */}
          <div className="flex items-center justify-between px-1">
            {[
              { num: 1, label: "The Mirror" },
              { num: 2, label: "Reflection" },
              { num: 3, label: "Project Triage" },
              { num: 4, label: "Next Week" },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setWeeklyStep(s.num as typeof weeklyStep)}
                className="flex items-center gap-2 group text-left"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    weeklyStep === s.num
                      ? "bg-[#235789] text-white shadow-2xs"
                      : weeklyStep > s.num
                      ? "bg-[#00A896] text-white"
                      : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                  }`}
                >
                  {weeklyStep > s.num ? "✓" : s.num}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    weeklyStep === s.num ? "text-[#235789] font-semibold" : "text-zinc-400"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {weeklySaved && (
            <div className="p-3.5 bg-teal-50 border border-teal-100 text-teal-900 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
              <span>Weekly calibration saved. You are grounded and ready for next week.</span>
            </div>
          )}

          {weeklyError && (
            <div className="p-3.5 bg-red-50 border border-red-200/80 text-[#EE6352] text-xs rounded-xl font-medium">
              {weeklyError}
            </div>
          )}

          {/* STEP 1: The Mirror (Automated Data) */}
          {weeklyStep === 1 && (
            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-700" />
                <h3 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">Step 1: The Mirror (Last 7 Days)</h3>
              </div>
              <p className="text-xs text-zinc-400">
                What actually moved in your system over the past 7 days.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-zinc-50 border border-black/[0.04] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Tasks Completed</span>
                  </div>
                  <span className="text-2xl font-bold text-zinc-900 block tabular-nums">
                    {initialWeeklyStats.tasksCompletedLast7Days}
                  </span>
                  <span className="text-[10px] text-zinc-400">Actions checked off</span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-black/[0.04] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Repeat className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Habit Completions</span>
                  </div>
                  <span className="text-2xl font-bold text-zinc-900 block tabular-nums">
                    {initialWeeklyStats.habitsCompletedLast7Days}
                  </span>
                  <span className="text-[10px] text-zinc-400">Daily practice logs</span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-black/[0.04] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                    <span>Active Projects</span>
                  </div>
                  <span className="text-2xl font-bold text-zinc-900 block tabular-nums">
                    {initialWeeklyStats.movingProjectsCount} <span className="text-xs font-normal text-zinc-400">moving</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {initialWeeklyStats.stalledProjectsCount} waiting
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setWeeklyStep(2)}
                  className="px-4 py-2 bg-[#235789] hover:bg-[#1b456e] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Reflection (Wins & Friction) */}
          {weeklyStep === 2 && (
            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">Step 2: Celebrate & Examine</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Acknowledge what moved forward, and name what drained your energy.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-700">
                    What went well this week? (Wins, breakthroughs, calm moments)
                  </label>
                  <textarea
                    rows={3}
                    value={wins}
                    onChange={(e) => setWins(e.target.value)}
                    placeholder="e.g. Completed the audit, sustained daily walks, felt peaceful on Friday..."
                    className="w-full text-xs border border-black/[0.08] rounded-lg p-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-700">
                    What created friction or drained energy?
                  </label>
                  <textarea
                    rows={3}
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="e.g. Scattered attention during afternoon, too many context switches..."
                    className="w-full text-xs border border-black/[0.08] rounded-lg p-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setWeeklyStep(1)}
                  className="px-3.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeeklyStep(3)}
                  className="px-4 py-2 bg-[#235789] hover:bg-[#1b456e] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Project Triage */}
          {weeklyStep === 3 && (
            <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#235789]" />
                <h3 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">Step 3: Runway Clearance</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Review your projects. Zero guilt if something needs to pause.
              </p>

              <div className="p-4 rounded-xl bg-zinc-50 border border-black/[0.04] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-800">Zero-Debt Clearance</span>
                  <span className="text-[#00A896] font-semibold text-[11px]">Automatic</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  EaseLife sweeps unfinished secondary runway actions back to the project backlog so your coming week opens with a fresh, clean slate.
                </p>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setWeeklyStep(2)}
                  className="px-3.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeeklyStep(4)}
                  className="px-4 py-2 bg-[#235789] hover:bg-[#1b456e] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Next Week (Priorities & Alignment) */}
          {weeklyStep === 4 && (
            <form onSubmit={handleWeeklySubmit} className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#00A896]" />
                <h3 className="font-semibold text-xs text-zinc-900 uppercase tracking-wider">Step 4: Next Week&apos;s Big Rocks</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Choose 1 to 3 main commitments for next week.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-700">
                    Next Week&apos;s 1–3 Focal Commitments
                  </label>
                  <textarea
                    rows={3}
                    value={nextWeekPriorities}
                    onChange={(e) => setNextWeekPriorities(e.target.value)}
                    placeholder="1. Launch beta&#10;2. Schedule family weekend outing&#10;3. Maintain morning hydration..."
                    className="w-full text-xs border border-black/[0.08] rounded-lg p-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all bg-white"
                  />
                </div>

                {/* Alignment Score (1-5) */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-zinc-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                      Alignment Feeling
                    </span>
                    <span className="font-semibold text-zinc-900 tabular-nums">
                      {alignment} / 5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={alignment}
                    onChange={(e) => setAlignment(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Scattered (1)</span>
                    <span>Steady (3)</span>
                    <span>Clear Purpose (5)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => setWeeklyStep(3)}
                  className="px-3.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={weeklySaving}
                  className="px-5 py-2 bg-[#00A896] hover:bg-[#028e7f] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{weeklySaving ? "Saving..." : "Complete Reset"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* DAILY EVENING CHECK-IN */}
      {/* ============================================================ */}
      {mode === "daily" && (
        <form onSubmit={handleDailySubmit} className="bg-white border border-black/[0.06] rounded-xl p-6 md:p-8 shadow-2xs space-y-6">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              Evening Closure
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Take 30 seconds to close today with clarity.
            </p>
          </div>

          {dailySaved && (
            <div className="p-3.5 bg-teal-50 border border-teal-100 text-teal-900 text-xs rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#00A896] shrink-0" />
              <span>Evening reflection recorded. Rest and recharge.</span>
            </div>
          )}

          {dailyError && (
            <div className="p-3 bg-red-50 border border-red-200/80 text-[#EE6352] text-xs rounded-lg font-medium">
              {dailyError}
            </div>
          )}

          {/* Energy Scale 1-10 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-zinc-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Physical & Mental Energy
              </span>
              <span className="font-semibold text-zinc-900 tabular-nums">
                {dailyEnergy} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dailyEnergy}
              onChange={(e) => setDailyEnergy(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>Drained (1)</span>
              <span>Balanced (5)</span>
              <span>Peak Vitality (10)</span>
            </div>
          </div>

          {/* Focus Scale 1-10 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-zinc-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#00A896]" />
                Focus & Execution Quality
              </span>
              <span className="font-semibold text-zinc-900 tabular-nums">
                {dailyFocus} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dailyFocus}
              onChange={(e) => setDailyFocus(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>Scattered (1)</span>
              <span>Steady (5)</span>
              <span>Deep Flow (10)</span>
            </div>
          </div>

          {/* Win of the day */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700">
              Win of the day / Note
            </label>
            <textarea
              rows={3}
              value={dailyNote}
              onChange={(e) => setDailyNote(e.target.value)}
              placeholder="What moved forward today? What made you smile?"
              className="w-full text-xs border border-black/[0.08] rounded-lg p-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 transition-all bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={dailySaving}
            className="px-5 py-2 bg-[#235789] hover:bg-[#1b456e] text-white text-xs font-medium rounded-lg transition-colors shadow-2xs disabled:opacity-50"
          >
            {dailySaving ? "Recording..." : "Save Evening Check-in"}
          </button>
        </form>
      )}
    </div>
  );
}
