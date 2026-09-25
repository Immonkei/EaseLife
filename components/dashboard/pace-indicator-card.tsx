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
    <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-sm text-slate-900">Today&apos;s Momentum</h3>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#00A896] border border-emerald-200/60 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]" />
          {status}
        </span>
      </div>

      {/* Progress Metric */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Daily Completion</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#00A896] transition-all duration-300"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>{tasksDone} of {tasksTotal} tasks</span>
          <span>{habitsDone} of {habitsTotal} habits</span>
        </div>
      </div>

      {/* Helpful Daily Shortcuts */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <Link
          href="/calendar"
          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between transition-colors group"
        >
          <span>Schedule</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </Link>
        <Link
          href="/review/daily"
          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-between transition-colors group"
        >
          <span>Review</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </Link>
      </div>
    </section>
  );
}
