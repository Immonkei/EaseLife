"use client";

import { useState } from "react";
import { Repeat, Flame, Plus, Check, Calendar, Trophy } from "lucide-react";
import { actionToggleHabit, actionCreateHabit } from "@/actions/habits";
import { HabitWithStreak } from "@/lib/habits/habit-service";

export function HabitsClient({ initialHabits }: { initialHabits: HabitWithStreak[] }) {
  const [habits, setHabits] = useState(initialHabits);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [freqType, setFreqType] = useState<"daily" | "weekly" | "specific_days">("daily");
  const [loading, setLoading] = useState(false);

  const handleToggle = async (habitId: string) => {
    // Optimistic toggle
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const nextCompleted = !h.completedToday;
          return {
            ...h,
            completedToday: nextCompleted,
            currentStreak: nextCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
          };
        }
        return h;
      })
    );

    await actionToggleHabit(habitId);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await actionCreateHabit({
      title,
      frequency: { type: freqType },
    });

    if (res.data) {
      setTitle("");
      setShowCreate(false);
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
            <Repeat className="w-5 h-5 text-[var(--accent)]" />
            Recurring Behavior Tracker
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
            Habits are atomic behaviors repeated consistently to support long-term goals.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Creation form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="p-5 bg-white border border-[var(--border)] rounded-2xl shadow-xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Define Habit Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 60 minutes deep study"
                className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency Rule</label>
              <select
                value={freqType}
                onChange={(e) => setFreqType(e.target.value as any)}
                className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-white"
              >
                <option value="daily">Daily (7 days / week)</option>
                <option value="weekly">Weekly Checkpoint</option>
                <option value="specific_days">Specific Days (Weekdays)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[var(--primary)] rounded-lg hover:opacity-90"
            >
              {loading ? "Creating..." : "Save Habit"}
            </button>
          </div>
        </form>
      )}

      {/* Habits Grid */}
      {habits && habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-base text-[var(--foreground)] leading-snug">
                    {habit.title}
                  </h3>
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                      habit.completedToday
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-2xs"
                        : "border-slate-300 hover:border-[var(--primary)] hover:bg-slate-50"
                    }`}
                    title={habit.completedToday ? "Completed today" : "Mark done today"}
                  >
                    {habit.completedToday && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)]">
                  <span className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md tabular-nums">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {habit.currentStreak} day streak
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 tabular-nums">
                    <Trophy className="w-3.5 h-3.5" />
                    Best: {habit.longestStreak}d
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
                <span className="capitalize">
                  Rule: {(habit.frequency as any)?.type || "daily"}
                </span>
                <span className="tabular-nums">
                  Total logs: {habit.completions?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl space-y-3">
          <Repeat className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700">No recurring habits configured</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Habits are not endless tasks. They represent repeatable daily behaviors that sustain your strategic goals.
          </p>
        </div>
      )}
    </div>
  );
}
