import { Check } from "lucide-react";

interface HabitHeatStripProps {
  habitsDone: number;
}

export function HabitHeatStrip({ habitsDone }: HabitHeatStripProps) {
  const currentDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const weekDays = [
    { name: "Sun", day: 0 },
    { name: "Mon", day: 1 },
    { name: "Tue", day: 2 },
    { name: "Wed", day: 3 },
    { name: "Thu", day: 4 },
    { name: "Fri", day: 5 },
    { name: "Sat", day: 6 },
  ];

  return (
    <div className="pt-4 border-t border-slate-100 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[var(--foreground)]">Daily Habits Tracker</span>
        <span className="text-[11px] text-[var(--foreground-muted)]">Weekly Runway</span>
      </div>

      {/* Day blocks Sun - Sat */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((wd) => {
          const isToday = wd.day === currentDayIndex;
          const isPast = wd.day < currentDayIndex;

          let bgColor = "bg-[#EDF2F4]";
          let textColor = "text-slate-600";

          if (isToday) {
            bgColor = habitsDone > 0 ? "bg-[#60D394]" : "bg-[#F4D35E]";
            textColor = "text-slate-900 font-bold";
          } else if (isPast) {
            bgColor = "bg-[#60D394]";
            textColor = "text-slate-800";
          }

          return (
            <div
              key={wd.name}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-100 bg-white"
            >
              <span className="text-[11px] font-semibold text-slate-400">{wd.name}</span>
              <div
                className={`w-full h-8 rounded-lg flex items-center justify-center transition-all ${bgColor} ${textColor}`}
              >
                {isToday ? (
                  <span className="text-[10px] font-bold">Today</span>
                ) : isPast ? (
                  <Check className="w-3.5 h-3.5 text-slate-800 stroke-[3]" />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
