import { getUserVisions } from "@/lib/planning/vision-service";
import { getUserGoals } from "@/lib/planning/goal-service";
import { Compass, Target, Plus } from "lucide-react";
import Link from "next/link";

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
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            Goals & Life Visions
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Where you are going and what meaningful outcomes you are pursuing.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          Add from Runway
        </Link>
      </div>

      {/* Visions List */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          Life Visions
        </h2>

        {visions && visions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visions.map((v) => (
              <div
                key={v.id}
                className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                    style={{ backgroundColor: v.life_domains?.color || "#235789" }}
                  >
                    {v.life_domains?.name || "General"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(v.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[var(--foreground)]">{v.title}</h3>
                {v.description && (
                  <p className="text-xs text-[var(--foreground-muted)]">{v.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
            <Compass className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-600">No Life Visions created yet.</p>
            <p className="text-xs text-slate-400">
              Create your first vision to anchor your daily work.
            </p>
          </div>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          Strategic Goals
        </h2>

        {goals && goals.length > 0 ? (
          <div className="space-y-3">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-4 bg-white border border-[var(--border)] rounded-xl shadow-xs flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {g.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Vision: {g.visions?.title || "None"}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--foreground)]">{g.title}</h4>
                </div>

                <div className="text-right text-xs text-slate-500">
                  {g.target_date ? `Target: ${g.target_date}` : "Ongoing"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
            <Target className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-600">No Goals defined yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
