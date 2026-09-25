import { Check, Flame } from "lucide-react";

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
  const bulletColors = ["bg-[#60D394]", "bg-[#00A896]", "bg-[#F4D35E]", "bg-[#235789]"];

  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-sm text-slate-900">Daily Habits</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 tabular-nums">
          {stats.habitsDone} / {stats.habitsTotal}
        </span>
      </div>

      {habits && habits.length > 0 ? (
        <div className="space-y-2">
          {habits.map((h, idx) => (
            <div
              key={h.id}
              onClick={() => onToggleHabit(h.id)}
              className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                h.completedToday
                  ? "bg-teal-50/60 border-teal-200/80"
                  : "bg-white border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    h.completedToday
                      ? "bg-[#00A896] border-[#00A896] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {h.completedToday && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-xs shrink-0 ${
                      bulletColors[idx % bulletColors.length]
                    }`}
                  />
                  <span className="text-xs font-medium text-slate-800 truncate">
                    {h.title}
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 tabular-nums shrink-0 ${
                  h.currentStreak > 0
                    ? "bg-amber-50 text-amber-800 border border-amber-100"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {h.currentStreak > 0 && (
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                )}
                {h.currentStreak}d
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No habits scheduled for today.
        </div>
      )}
    </section>
  );
}
