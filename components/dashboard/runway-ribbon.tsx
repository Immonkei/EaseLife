import { Compass, Target, FolderKanban, CheckSquare, Repeat, ChevronRight } from "lucide-react";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface RunwayRibbonProps {
  visions: Array<{ id: string; title: string }>;
  goals: Array<{ id: string; title: string }>;
  projects: Array<{ id: string; title: string }>;
}

export function RunwayRibbon({ visions, goals, projects }: RunwayRibbonProps) {
  const levels = [
    { label: "Vision", icon: Compass, color: "text-[#235789]" },
    { label: "Goal", icon: Target, color: "text-[#00A896]" },
    { label: "Project", icon: FolderKanban, color: "text-blue-600" },
    { label: "Task", icon: CheckSquare, color: "text-slate-800" },
    { label: "Habit", icon: Repeat, color: "text-[#00A896]" },
  ];

  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs text-slate-600">
        {levels.map((lvl, idx) => {
          const Icon = lvl.icon;
          return (
            <div key={lvl.label} className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 font-medium text-slate-700">
                <Icon className={`w-3.5 h-3.5 ${lvl.color}`} />
                <span>{lvl.label}</span>
              </span>
              {idx < levels.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <CreateEntityModal
          visions={visions}
          goals={goals}
          projects={projects}
        />
      </div>
    </section>
  );
}
