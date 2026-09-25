import { getUserProjects } from "@/lib/planning/project-service";
import { FolderKanban, Flag, Target } from "lucide-react";
import { ProgressResult } from "@/lib/progress/project-progress";
import { PaceCalculationResult } from "@/lib/progress/pace-engine";

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
  try {
    const p = await getUserProjects();
    if (p) projects = p as unknown as ProjectItem[];
  } catch {}

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Projects & Pace Engine
        </h1>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          Finite bodies of work with mathematical progress and pace tracking.
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => {
            const isAtRisk = p.pace.status === "AT_RISK";
            const isOffTrack = p.pace.status === "OFF_TRACK";

            return (
              <div
                key={p.id}
                className="bg-white border border-[var(--border)] rounded-xl p-5 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Target className="w-3 h-3" />
                      Goal: {p.goals?.title || "Direct"}
                    </span>
                    <h3 className="font-bold text-base text-[var(--foreground)]">{p.title}</h3>
                  </div>

                  {/* Pace Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isOffTrack
                        ? "bg-red-50 text-[var(--danger)]"
                        : isAtRisk
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-[var(--accent)]"
                    }`}
                  >
                    {p.pace.statusLabel}
                  </span>
                </div>

                {p.milestones && (
                  <div className="text-xs text-amber-700 bg-amber-50/70 border border-amber-100 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5" />
                    Milestone: {p.milestones.title}
                  </div>
                )}

                {/* Progress Bar (Section 18) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>
                      {p.progress.hasMeasurableTasks
                        ? `${p.progress.percentage}% completed`
                        : "No measurable tasks yet"}
                    </span>
                    <span>
                      {p.progress.completedWeight}/{p.progress.totalWeight} weight
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                      style={{ width: `${p.progress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Dates & Timeline */}
                <div className="flex justify-between text-[11px] text-[var(--foreground-muted)] pt-1 border-t border-slate-100">
                  <span>Start: {p.start_date || "Not set"}</span>
                  <span>Target: {p.target_date || "Not set"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
          <FolderKanban className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-medium text-slate-600">No Projects yet.</p>
          <p className="text-xs text-slate-400">
            Create a project from the Daily Runway to start tracking progress and pace.
          </p>
        </div>
      )}
    </div>
  );
}
