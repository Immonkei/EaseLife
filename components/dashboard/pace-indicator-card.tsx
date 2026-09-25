import { Flag } from "lucide-react";

interface PaceIndicatorCardProps {
  status?: "On Track" | "At Risk" | "Off Track";
}

export function PaceIndicatorCard({ status = "On Track" }: PaceIndicatorCardProps) {
  const statusColors = {
    "On Track": {
      bg: "bg-emerald-50/70",
      border: "border-emerald-200",
      iconBg: "bg-[#60D394]",
      textColor: "text-emerald-950",
      subtextColor: "text-emerald-700",
      badgeBg: "bg-[#00A896]",
    },
    "At Risk": {
      bg: "bg-amber-50/70",
      border: "border-amber-200",
      iconBg: "bg-[#F4D35E]",
      textColor: "text-amber-950",
      subtextColor: "text-amber-700",
      badgeBg: "bg-amber-500",
    },
    "Off Track": {
      bg: "bg-red-50/70",
      border: "border-red-200",
      iconBg: "bg-red-500",
      textColor: "text-red-950",
      subtextColor: "text-red-700",
      badgeBg: "bg-red-600",
    },
  }[status];

  return (
    <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-[var(--foreground)]">Pace Indicator</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Pace Engine
        </span>
      </div>

      <div className={`p-4 rounded-xl ${statusColors.bg} border ${statusColors.border} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${statusColors.iconBg} text-white flex items-center justify-center shadow-xs`}>
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <span className={`text-xs font-bold ${statusColors.textColor} block`}>Runway Execution</span>
            <span className={`text-[11px] ${statusColors.subtextColor}`}>Calculated from atomic work</span>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors.badgeBg} text-white shadow-2xs`}>
          {status}
        </span>
      </div>

      <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
        Transparent mathematically derived pace: Actual work completed vs. expected timeline progress.
      </p>
    </section>
  );
}
