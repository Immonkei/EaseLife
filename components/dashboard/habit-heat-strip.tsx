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
    <div className="pt-4 border-t border-slate-100 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800">Habits This Week</span>
        <span className="text-[11px] text-slate-400">Current Week</span>
      </div>

      {/* Day blocks Sun - Sat */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((wd) => {
          const isToday = wd.day === currentDayIndex;
          const isPast = wd.day < currentDayIndex;

          let cellClass = "bg-slate-50 border border-slate-100 text-slate-400";

          if (isToday) {
            cellClass =
              habitsDone > 0
                ? "bg-[#60D394] text-white font-semibold shadow-2xs"
                : "bg-amber-50 border border-amber-200/80 text-amber-800 font-semibold";
          } else if (isPast) {
            cellClass = "bg-emerald-50/70 border border-emerald-100 text-[#00A896]";
          }

          return (
            <div
              key={wd.name}
              className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-slate-100 bg-white"
            >
              <span className="text-[10px] font-medium text-slate-400">{wd.name}</span>
              <div
                className={`w-full h-7 rounded-md flex items-center justify-center text-xs transition-colors ${cellClass}`}
              >
                {isToday ? (
                  <span className="text-[10px]">Today</span>
                ) : isPast ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
