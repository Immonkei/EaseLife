import { Check } from "lucide-react";

interface HabitHeatStripProps {
  habitsDone: number;
}

export function HabitHeatStrip({ habitsDone }: HabitHeatStripProps) {
  const currentDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const weekDays = [
    { name: "M", day: 1 },
    { name: "T", day: 2 },
    { name: "W", day: 3 },
    { name: "T", day: 4 },
    { name: "F", day: 5 },
    { name: "S", day: 6 },
    { name: "S", day: 0 },
  ];

  return (
    <div className="pt-3.5 border-t border-black/[0.05] space-y-2">
      <div className="flex items-center justify-between text-[11px] text-zinc-400">
        <span className="font-medium text-zinc-600">Weekly Cadence</span>
        <span>Current Week</span>
      </div>

      {/* Clean 7-day pill strip */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((wd) => {
          const isToday = wd.day === currentDayIndex;
          const isPast =
            wd.day !== 0 && currentDayIndex !== 0
              ? wd.day < currentDayIndex
              : currentDayIndex === 0 && wd.day !== 0;

          return (
            <div
              key={wd.name + wd.day}
              className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded-md text-center transition-colors ${
                isToday
                  ? "bg-[#00A896]/10 text-[#00A896] font-semibold border border-[#00A896]/25"
                  : "bg-zinc-50/50 text-zinc-400"
              }`}
            >
              <span className="text-[10px] uppercase">{wd.name}</span>
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                  isToday
                    ? habitsDone > 0
                      ? "bg-[#00A896] text-white"
                      : "bg-[#00A896]/20 text-[#00A896]"
                    : isPast
                    ? "bg-[#00A896]/15 text-[#00A896]"
                    : "bg-transparent text-zinc-300"
                }`}
              >
                {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : isToday && habitsDone > 0 ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
