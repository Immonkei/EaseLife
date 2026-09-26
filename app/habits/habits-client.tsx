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
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div>
          <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
            Practices
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Daily routines that sustain your long-term focus.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#235789] text-white text-xs font-medium hover:bg-[#1b456e] transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Practice</span>
        </button>
      </div>

      {/* Creation form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="p-5 bg-white border border-black/[0.06] rounded-xl space-y-4">
          <h3 className="font-medium text-xs text-zinc-900">
            Create a New Practice
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Practice Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 20 pages"
                className="w-full text-xs sm:text-sm border border-black/[0.08] rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#235789]/30 focus:border-[#235789] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Frequency</label>
              <select
                value={freqType}
                onChange={(e) => setFreqType(e.target.value as "daily" | "weekly" | "specific_days")}
                className="w-full text-xs sm:text-sm border border-black/[0.08] rounded-lg px-3 py-2 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#235789]/30 focus:border-[#235789] transition-all"
              >
                <option value="daily">Every day</option>
                <option value="specific_days">Weekdays (Mon - Fri)</option>
                <option value="weekly">Once a week</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.04]">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-medium text-white bg-[#235789] hover:bg-[#1b456e] rounded-lg transition-colors shadow-2xs"
            >
              {loading ? "Creating..." : "Save Practice"}
            </button>
          </div>
        </form>
      )}

      {/* Habits Grid */}
      {habits && habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white border border-black/[0.06] rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-black/[0.12] transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-normal text-xs sm:text-sm text-zinc-900 leading-snug">
                    {habit.title}
                  </h3>
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      habit.completedToday
                        ? "bg-[#00A896] border-[#00A896] text-white"
                        : "border-zinc-300 hover:border-[#00A896] bg-white"
                    }`}
                    title={habit.completedToday ? "Completed today" : "Mark done today"}
                  >
                    {habit.completedToday && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-[#00A896] bg-[#00A896]/10 border border-[#00A896]/20 px-1.5 py-0.5 rounded text-[11px] tabular-nums">
                    <Flame className="w-3 h-3 text-[#00A896] fill-[#00A896]" />
                    {habit.currentStreak}d streak
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400 tabular-nums text-[11px]">
                    <Trophy className="w-3 h-3 text-zinc-300" />
                    Best: {habit.longestStreak}d
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-zinc-400">
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
        <div className="text-center py-16 bg-white border border-dashed border-zinc-200 rounded-xl space-y-1.5">
          <Repeat className="w-7 h-7 text-zinc-300 mx-auto" />
          <h3 className="font-medium text-xs text-zinc-700">No recurring practices configured</h3>
          <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
            Practices represent repeatable daily behaviors that sustain your strategic goals.
          </p>
        </div>
      )}
    </div>
  );
}
