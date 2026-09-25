import { Check } from "lucide-react";

interface HabitItem {
  id: string;
  title: string;
  completedToday: boolean;
  currentStreak: number;
  longestStreak: number;
}

interface DailyHabitsCardProps {
  habits: HabitItem[];
  stats: {
    habitsDone: number;
    habitsTotal: number;
  };
  onToggleHabit: (habitId: string) => void;
}

export function DailyHabitsCard({
  habits,
  stats,
  onToggleHabit,
}: DailyHabitsCardProps) {
  return (
    <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-[var(--foreground)]">Daily Habits</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDF2F4] text-[#235789] tabular-nums">
          {stats.habitsDone}/{stats.habitsTotal}
        </span>
      </div>

      {habits && habits.length > 0 ? (
        <div className="space-y-2.5">
          {habits.map((h) => (
            <div
              key={h.id}
              onClick={() => onToggleHabit(h.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                h.completedToday
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    h.completedToday
                      ? "bg-[#00A896] border-[#00A896] text-white"
                      : "border-slate-300"
                  }`}
                >
                  {h.completedToday && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="text-xs font-semibold text-slate-800">{h.title}</span>
              </div>

              <span className="text-[11px] font-bold text-[#00A896] bg-teal-50 px-2 py-0.5 rounded tabular-nums">
                {h.currentStreak}d streak
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No active habits scheduled.</p>
      )}
    </section>
  );
}
