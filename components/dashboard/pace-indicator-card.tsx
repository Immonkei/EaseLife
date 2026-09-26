import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PaceIndicatorCardProps {
  status?: "On Track" | "At Risk" | "Off Track";
  tasksDone?: number;
  tasksTotal?: number;
  habitsDone?: number;
  habitsTotal?: number;
}

export function PaceIndicatorCard({
  status = "On Track",
  tasksDone = 0,
  tasksTotal = 0,
  habitsDone = 0,
  habitsTotal = 0,
}: PaceIndicatorCardProps) {
  const totalItems = tasksTotal + habitsTotal;
  const completedItems = tasksDone + habitsDone;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <section className="bg-white border border-black/[0.06] rounded-xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
        <h3 className="font-semibold text-xs text-zinc-900 tracking-tight">Daily Momentum</h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20">
          {status}
        </span>
      </div>

      {/* Progress Metric */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-normal">Daily Completion</span>
          <span className="font-semibold text-zinc-900 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#235789] to-[#00A896] transition-all duration-500"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
          <span>{tasksDone} of {tasksTotal} actions</span>
          <span>{habitsDone} of {habitsTotal} practices</span>
        </div>
      </div>

      {/* Helpful Daily Shortcuts */}
      <div className="pt-2 border-t border-black/[0.04] grid grid-cols-2 gap-2 text-xs">
        <Link
          href="/horizons"
          className="p-2 rounded-lg bg-zinc-50 hover:bg-[#235789]/5 text-zinc-700 hover:text-[#235789] font-medium flex items-center justify-between transition-colors group"
        >
          <span>Horizons</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#235789] transition-colors" />
        </Link>
        <Link
          href="/review"
          className="p-2 rounded-lg bg-zinc-50 hover:bg-[#235789]/5 text-zinc-700 hover:text-[#235789] font-medium flex items-center justify-between transition-colors group"
        >
          <span>Review</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#235789] transition-colors" />
        </Link>
      </div>
    </section>
  );
}
