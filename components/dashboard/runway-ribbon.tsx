import { Compass, Target, FolderKanban, CheckSquare, Repeat, ArrowRight } from "lucide-react";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface RunwayRibbonProps {
  visions: Array<{ id: string; title: string }>;
  goals: Array<{ id: string; title: string }>;
  projects: Array<{ id: string; title: string }>;
}

export function RunwayRibbon({ visions, goals, projects }: RunwayRibbonProps) {
  return (
    <section className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Relational Identity &bull; Lineage Architecture
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs font-bold text-[#235789] overflow-x-auto py-1">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#235789] shrink-0">
            <Compass className="w-3.5 h-3.5" />
            Vision
          </span>
          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#00A896] shrink-0">
            <Target className="w-3.5 h-3.5" />
            Goal
          </span>
          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
            <FolderKanban className="w-3.5 h-3.5" />
            Project
          </span>
          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 shrink-0">
            <CheckSquare className="w-3.5 h-3.5" />
            Task
          </span>
          <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-[#00A896] shrink-0">
            <Repeat className="w-3.5 h-3.5" />
            Habit
          </span>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-3">
        <CreateEntityModal
          visions={visions}
          goals={goals}
          projects={projects}
        />
      </div>
    </section>
  );
}
