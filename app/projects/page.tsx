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
  progress?: ProgressResult;
  pace?: PaceCalculationResult;
  humanStatus?: string;
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
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div>
          <h1 className="text-base font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-[#235789]" />
            Projects
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Active projects, milestones, and completion pace.
          </p>
        </div>

        <CreateEntityModal goals={goals} defaultTab="project" buttonLabel="New Project" />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => {
            const isAtRisk = p.pace?.status === "AT_RISK";
            const isOffTrack = p.pace?.status === "OFF_TRACK";
            const paceLabel = p.pace?.statusLabel || p.humanStatus || "Moving";
            const progressPct = p.progress?.percentage ?? 0;
            const hasMeasurable = p.progress?.hasMeasurableTasks ?? false;
            const completedWt = p.progress?.completedWeight ?? 0;
            const totalWt = p.progress?.totalWeight ?? 0;

            return (
              <div
                key={p.id}
                className="bg-white border border-black/[0.06] rounded-xl p-4 space-y-3.5 hover:border-black/[0.12] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1.5 truncate">
                      <Target className="w-3 h-3 text-[#00A896] shrink-0" />
                      <span className="text-[#00A896] font-medium">Goal: {p.goals?.title || "Direct"}</span>
                    </span>
                    <h3 className="font-medium text-xs sm:text-sm text-zinc-900 truncate">
                      {p.title}
                    </h3>
                  </div>

                  {/* Pace Badge */}
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                      isOffTrack
                        ? "bg-red-50 text-red-700"
                        : isAtRisk
                        ? "bg-amber-50 text-amber-800"
                        : "bg-[#00A896]/10 text-[#00A896] font-semibold border border-[#00A896]/20"
                    }`}
                  >
                    {paceLabel}
                  </span>
                </div>

                {p.milestones && (
                  <div className="text-xs text-zinc-600 bg-zinc-50 border border-black/[0.04] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <Flag className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">Milestone: {p.milestones.title}</span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>
                      {hasMeasurable
                        ? `${progressPct}% completed`
                        : "No measurable tasks yet"}
                    </span>
                    <span className="text-zinc-400 tabular-nums text-[11px]">
                      {completedWt}/{totalWt} weight
                    </span>
                  </div>
                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#235789] to-[#00A896] rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Dates & Timeline */}
                <div className="flex justify-between text-[11px] text-zinc-400 pt-2 border-t border-black/[0.04] tabular-nums">
                  <span>Start: {p.start_date || "Open"}</span>
                  <span>Target: {p.target_date || "Open"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white border border-dashed border-zinc-200 rounded-xl text-center space-y-3">
          <FolderKanban className="w-7 h-7 text-zinc-300 mx-auto" />
          <div>
            <p className="text-xs font-medium text-zinc-700">No active projects yet.</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Projects group tasks together toward larger milestones.
            </p>
          </div>
          <CreateEntityModal goals={goals} defaultTab="project" buttonLabel="Create your first project" />
        </div>
      )}
    </div>
  );
}
