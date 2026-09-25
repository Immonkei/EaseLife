import { getUserProjects } from "@/lib/planning/project-service";
import { getUserGoals } from "@/lib/planning/goal-service";
import { FolderKanban, Flag, Target } from "lucide-react";
import { ProgressResult } from "@/lib/progress/project-progress";
import { PaceCalculationResult } from "@/lib/progress/pace-engine";
import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface ProjectItem {
  id: string;
  title: string;
  start_date: string | null;
  target_date: string | null;
  status: string;
  goals?: { id: string; title: string } | null;
  milestones?: { id: string; title: string } | null;
  progress: ProgressResult;
  pace: PaceCalculationResult;
}

export default async function ProjectsPage() {
  let projects: ProjectItem[] = [];
  let goals: Array<{ id: string; title: string }> = [];
  try {
    const p = await getUserProjects();
    const g = await getUserGoals();
    if (p) projects = p as unknown as ProjectItem[];
    if (g) goals = g;
  } catch {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#235789]" />
            Projects
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your active projects, milestones, and completion pace.
          </p>
        </div>

        <CreateEntityModal goals={goals} defaultTab="project" buttonLabel="+ New Project" />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => {
            const isAtRisk = p.pace.status === "AT_RISK";
            const isOffTrack = p.pace.status === "OFF_TRACK";

            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                      <Target className="w-3 h-3 text-[#00A896] shrink-0" />
                      Goal: {p.goals?.title || "Direct"}
                    </span>
                    <h3 className="font-semibold text-base text-slate-900 truncate">
                      {p.title}
                    </h3>
                  </div>

                  {/* Pace Badge */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                      isOffTrack
                        ? "bg-red-50 text-[#EE6352] border-red-100"
                        : isAtRisk
                        ? "bg-amber-50 text-amber-800 border-amber-100"
                        : "bg-emerald-50 text-[#00A896] border-emerald-100"
                    }`}
                  >
                    {p.pace.statusLabel}
                  </span>
                </div>

                {p.milestones && (
                  <div className="text-xs text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <Flag className="w-3 h-3 text-[#F4D35E] shrink-0" />
                    <span className="truncate">Milestone: {p.milestones.title}</span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>
                      {p.progress.hasMeasurableTasks
                        ? `${p.progress.percentage}% completed`
                        : "No measurable tasks yet"}
                    </span>
                    <span className="text-slate-400 tabular-nums">
                      {p.progress.completedWeight}/{p.progress.totalWeight} weight
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#235789] rounded-full transition-all duration-300"
                      style={{ width: `${p.progress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Dates & Timeline */}
                <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 tabular-nums">
                  <span>Start: {p.start_date || "Open"}</span>
                  <span>Target: {p.target_date || "Open"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3">
          <FolderKanban className="w-8 h-8 text-slate-300 mx-auto" />
          <div>
            <p className="text-xs font-semibold text-slate-700">No active projects yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Projects group tasks together toward larger milestones.
            </p>
          </div>
          <CreateEntityModal goals={goals} defaultTab="project" buttonLabel="Create your first project" />
        </div>
      )}
    </div>
  );
}
