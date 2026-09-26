import { getUserThemes } from "@/lib/planning/theme-service";
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
  let themes: Array<{ id: string; name: string; color: string }> = [];
  let visions: VisionItem[] = [];
  let goals: GoalItem[] = [];

  try {
    const [t, v, g] = await Promise.all([
      getUserThemes(),
      getUserVisions(),
      getUserGoals(),
    ]);
    if (t) themes = t;
    if (v) visions = v as unknown as VisionItem[];
    if (g) goals = g as unknown as GoalItem[];
  } catch {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div>
          <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
            Goals
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Set meaningful goals and long-term visions to guide your daily focus.
          </p>
        </div>

        <CreateEntityModal
          themes={themes}
          visions={visions}
          goals={goals}
          defaultTab="goal"
          buttonLabel="New Goal"
        />
      </div>

      {/* Relational Identity Lineage Ribbon */}
      <RunwayRibbon themes={themes} visions={visions} goals={goals} projects={[]} />

      {/* Visions List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#235789]" />
          <h2 className="text-xs font-semibold text-zinc-700 tracking-wide uppercase">Life Visions</h2>
        </div>

        {visions && visions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {visions.map((v) => (
              <div
                key={v.id}
                className="p-4 bg-white border border-black/[0.06] rounded-xl space-y-2 hover:border-black/[0.12] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700 bg-zinc-100"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: v.life_domains?.color || "#235789" }}
                    />
                    {v.life_domains?.name || "General"}
                  </span>
                  <span className="text-[11px] text-zinc-400 tabular-nums">
                    {new Date(v.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="font-medium text-xs sm:text-sm text-zinc-900">{v.title}</h3>
                {v.description && (
                  <p className="text-xs text-zinc-500 leading-relaxed">{v.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-dashed border-zinc-200 rounded-xl text-center space-y-1.5">
            <Compass className="w-5 h-5 text-zinc-300 mx-auto" />
            <p className="text-xs font-medium text-zinc-600">No Life Visions defined yet.</p>
            <p className="text-[11px] text-zinc-400">
              Create a vision from the Daily Runway to anchor your operational work.
            </p>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00A896]" />
          <h2 className="text-xs font-semibold text-zinc-700 tracking-wide uppercase">Strategic Goals</h2>
        </div>

        {goals && goals.length > 0 ? (
          <div className="space-y-2">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-3.5 bg-white border border-black/[0.06] rounded-xl flex items-center justify-between hover:border-black/[0.12] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold px-1.5 py-0.5 rounded bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20 text-[10px]">
                      {g.status}
                    </span>
                    <span className="text-[#235789] text-[11px] font-medium">
                      Vision: {g.visions?.title || "Direct"}
                    </span>
                  </div>
                  <h4 className="font-medium text-xs sm:text-sm text-zinc-900">{g.title}</h4>
                </div>

                <div className="text-right text-xs text-zinc-400 tabular-nums">
                  {g.target_date ? `Target: ${g.target_date}` : "Ongoing"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-dashed border-zinc-200 rounded-xl text-center space-y-1.5">
            <Target className="w-5 h-5 text-zinc-300 mx-auto" />
            <p className="text-xs font-medium text-zinc-600">No Strategic Goals created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
