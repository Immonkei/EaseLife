import { Flag } from "lucide-react";

interface PaceIndicatorCardProps {
  status?: "On Track" | "At Risk" | "Off Track";
}

export function PaceIndicatorCard({ status = "On Track" }: PaceIndicatorCardProps) {
  const statusStyles = {
    "On Track": {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-[#00A896]",
      label: "On Track",
      iconBg: "bg-emerald-50 text-[#00A896]",
    },
    "At Risk": {
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      dot: "bg-[#F4D35E]",
      label: "At Risk",
      iconBg: "bg-amber-50 text-amber-700",
    },
    "Off Track": {
      badge: "bg-red-50 text-red-800 border-red-200",
      dot: "bg-[#EE6352]",
      label: "Off Track",
      iconBg: "bg-red-50 text-[#EE6352]",
    },
  }[status];

  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-sm text-slate-900">Pace Engine</h3>
        <span className="text-[11px] text-slate-400">Runway Velocity</span>
      </div>

      <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusStyles.iconBg}`}>
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              Execution Momentum
            </span>
            <span className="text-[11px] text-slate-400">
              Weighted actual vs. expected
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${statusStyles.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
          {statusStyles.label}
        </span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Pace delta is derived from completed task weights against calendar targets without stored state.
      </p>
    </section>
  );
}
