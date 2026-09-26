import { Sparkles, Target, FolderKanban, CheckSquare, Repeat, ChevronRight } from "lucide-react";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface RunwayRibbonProps {
  themes?: Array<{ id: string; name: string; color?: string }>;
  visions?: Array<{ id: string; title: string }>;
  goals: Array<{ id: string; title: string }>;
  projects: Array<{ id: string; title: string }>;
}

export function RunwayRibbon({ themes = [], visions = [], goals, projects }: RunwayRibbonProps) {
  const levels = [
    { label: "Horizon", icon: Sparkles, color: "text-[#235789]" },
    { label: "Target Outcome", icon: Target, color: "text-[#00A896]" },
    { label: "Project", icon: FolderKanban, color: "text-[#235789]" },
    { label: "Daily Action", icon: CheckSquare, color: "text-zinc-800" },
    { label: "Practice", icon: Repeat, color: "text-[#00A896]" },
  ];

  return (
    <section className="bg-white border border-black/[0.06] rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs text-zinc-600">
        {levels.map((lvl, idx) => {
          const Icon = lvl.icon;
          return (
            <div key={lvl.label} className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-medium text-xs">
                <Icon className={`w-3.5 h-3.5 ${lvl.color}`} />
                <span>{lvl.label}</span>
              </span>
              {idx < levels.length - 1 && (
                <ChevronRight className="w-3 h-3 text-zinc-300 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <CreateEntityModal
          themes={themes}
          visions={visions}
          goals={goals}
          projects={projects}
        />
      </div>
    </section>
  );
}
