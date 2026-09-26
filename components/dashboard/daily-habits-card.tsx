"use client";

import { Check } from "lucide-react";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface HabitItem {
  id: string;
  title: string;
  completedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  consistencyRate?: number;
}

interface DailyHabitsCardProps {
  habits: HabitItem[];
  stats: {
    habitsDone: number;
    habitsTotal: number;
  };
  onToggleHabit: (habitId: string) => void;
  onHabitCreated?: () => void;
}

export function DailyHabitsCard({
  habits,
  stats,
  onToggleHabit,
  onHabitCreated,
}: DailyHabitsCardProps) {
  return (
    <section className="bg-white border border-black/[0.06] rounded-xl p-5 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
        <div>
          <h3 className="font-semibold text-xs text-zinc-900 tracking-tight">Daily Practices</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {stats.habitsDone} of {stats.habitsTotal} completed today
          </p>
        </div>
        <CreateEntityModal defaultTab="habit" buttonLabel="Practice" onSuccess={onHabitCreated} />
      </div>

      {habits && habits.length > 0 ? (
        <div className="space-y-1.5">
          {habits.map((h) => (
            <div
              key={h.id}
              onClick={() => onToggleHabit(h.id)}
              className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                h.completedToday
                  ? "bg-zinc-50/60 border-black/[0.04] text-zinc-400"
                  : "bg-white border-black/[0.06] hover:border-black/[0.12]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    h.completedToday
                      ? "bg-[#00A896] border-[#00A896] text-white"
                      : "border-zinc-300 bg-white"
                  }`}
                >
                  {h.completedToday && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <span
                  className={`text-xs font-medium truncate ${
                    h.completedToday ? "line-through text-zinc-400" : "text-zinc-800"
                  }`}
                >
                  {h.title}
                </span>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded tabular-nums shrink-0 ${
                  h.completedToday
                    ? "bg-[#00A896]/15 text-[#00A896]"
                    : h.consistencyRate !== undefined && h.consistencyRate > 0
                    ? "bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {h.consistencyRate !== undefined && h.consistencyRate > 0
                  ? `${h.consistencyRate}%`
                  : `${h.currentStreak}d`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-zinc-400 space-y-2">
          <p>No daily practices configured yet.</p>
          <CreateEntityModal defaultTab="habit" buttonLabel="Add practice" onSuccess={onHabitCreated} />
        </div>
      )}
    </section>
  );
}
