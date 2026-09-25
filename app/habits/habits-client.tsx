"use client";

import { useState } from "react";
import { Repeat, Flame, Plus, Check, Trophy } from "lucide-react";
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
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Repeat className="w-5 h-5 text-[#00A896]" />
            Habits
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Build consistency one day at a time with simple daily routines.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#235789] text-white text-xs font-semibold hover:bg-[#1b456e] transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Creation form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-2xs space-y-4">
          <h3 className="font-semibold text-xs text-slate-800">
            Create a New Habit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Habit Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 20 pages"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">How often?</label>
              <select
                value={freqType}
                onChange={(e) => setFreqType(e.target.value as "daily" | "weekly" | "specific_days")}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#235789]/20 focus:border-[#235789] transition-all"
              >
                <option value="daily">Every day</option>
                <option value="specific_days">Weekdays (Mon - Fri)</option>
                <option value="weekly">Once a week</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#235789] hover:bg-[#1b456e] rounded-lg transition-colors shadow-2xs"
            >
              {loading ? "Creating..." : "Save Habit"}
            </button>
          </div>
        </form>
      )}

      {/* Habits Grid */}
      {habits && habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                    {habit.title}
                  </h3>
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      habit.completedToday
                        ? "bg-[#00A896] border-[#00A896] text-white"
                        : "border-slate-300 hover:border-[#00A896] bg-white"
                    }`}
                    title={habit.completedToday ? "Completed today" : "Mark done today"}
                  >
                    {habit.completedToday && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <span className="flex items-center gap-1 font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 tabular-nums text-[11px]">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {habit.currentStreak}d streak
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 tabular-nums text-[11px]">
                    <Trophy className="w-3 h-3 text-slate-300" />
                    Best: {habit.longestStreak}d
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="capitalize">
                  {(habit.frequency as { type?: string })?.type || "daily"}
                </span>
                <span className="tabular-nums">
                  {habit.completions?.length || 0} logged
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl space-y-2">
          <Repeat className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-medium text-sm text-slate-700">No recurring habits configured</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Habits represent repeatable daily behaviors that sustain your strategic goals.
          </p>
        </div>
      )}
    </div>
  );
}
