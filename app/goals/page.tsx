import { getUserVisions } from "@/lib/planning/vision-service";
import { getUserGoals } from "@/lib/planning/goal-service";
import { Compass, Target } from "lucide-react";
import { RunwayRibbon } from "@/components/dashboard/runway-ribbon";

import { CreateEntityModal } from "@/components/planning/create-entity-modal";

interface VisionItem {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  life_domains?: { id: string; name: string; color: string } | null;
}

interface GoalItem {
  id: string;
  title: string;
  status: string;
  target_date: string | null;
  visions?: { id: string; title: string } | null;
}

export default async function GoalsPage() {
  let visions: VisionItem[] = [];
  let goals: GoalItem[] = [];

  try {
    const v = await getUserVisions();
    const g = await getUserGoals();
    if (v) visions = v as unknown as VisionItem[];
    if (g) goals = g as unknown as GoalItem[];
  } catch {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Goals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Set meaningful goals and long-term visions to guide your daily focus.
          </p>
        </div>

        <CreateEntityModal
          visions={visions}
          goals={goals}
          defaultTab="goal"
          buttonLabel="+ New Goal"
        />
      </div>

      {/* Relational Identity Lineage Ribbon */}
      <RunwayRibbon visions={visions} goals={goals} projects={[]} />

      {/* Visions List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#235789]" />
          <h2 className="text-sm font-semibold text-slate-900">Life Visions</h2>
        </div>

        {visions && visions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visions.map((v) => (
              <div
                key={v.id}
                className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-100"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: v.life_domains?.color || "#235789" }}
                    />
                    {v.life_domains?.name || "General"}
                  </span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {new Date(v.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900">{v.title}</h3>
                {v.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
            <Compass className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="text-xs font-medium text-slate-600">No Life Visions defined yet.</p>
            <p className="text-[11px] text-slate-400">
              Create a vision from the Daily Runway to anchor your operational work.
            </p>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00A896]" />
          <h2 className="text-sm font-semibold text-slate-900">Strategic Goals</h2>
        </div>

        {goals && goals.length > 0 ? (
          <div className="space-y-2.5">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center justify-between hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium px-2 py-0.5 rounded bg-emerald-50 text-[#00A896] border border-emerald-100 text-[10px]">
                      {g.status}
                    </span>
                    <span className="text-slate-400">
                      Vision: {g.visions?.title || "Direct"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">{g.title}</h4>
                </div>

                <div className="text-right text-xs text-slate-400 tabular-nums">
                  {g.target_date ? `Target: ${g.target_date}` : "Ongoing"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
            <Target className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="text-xs font-medium text-slate-600">No Strategic Goals created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
