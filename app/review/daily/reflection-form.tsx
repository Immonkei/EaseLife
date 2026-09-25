"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Zap, Target } from "lucide-react";
import { actionSaveDailyReflection } from "@/actions/reflection";

export function ReflectionForm({
  initialReflection,
}: {
  initialReflection?: {
    energy?: number;
    focus?: number;
    what_happened?: string | null;
  } | null;
}) {
  const [energy, setEnergy] = useState(initialReflection?.energy || 7);
  const [focus, setFocus] = useState(initialReflection?.focus || 8);
  const [whatHappened, setWhatHappened] = useState(
    initialReflection?.what_happened || ""
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const res = await actionSaveDailyReflection({
      date: todayStr,
      energy: Number(energy),
      focus: Number(focus),
      what_happened: whatHappened,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Daily reflection recorded successfully. Learning loop calibrated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-[var(--danger)] text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Energy Scale 1-10 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Physical & Mental Energy
            </span>
            <span className="font-bold text-[var(--primary)] text-sm tabular-nums">
              {energy} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Drained (1)</span>
            <span>Balanced (5)</span>
            <span>Peak Vitality (10)</span>
          </div>
        </div>

        {/* Focus Scale 1-10 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              Focus & Execution Quality
            </span>
            <span className="font-bold text-[var(--primary)] text-sm tabular-nums">
              {focus} / 10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Scattered (1)</span>
            <span>Steady (5)</span>
            <span>Deep Flow (10)</span>
          </div>
        </div>

        {/* What happened? */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-800">
            What happened today? (Wins, frictions, and adjustments)
          </label>
          <textarea
            rows={4}
            value={whatHappened}
            onChange={(e) => setWhatHappened(e.target.value)}
            placeholder="Capture what moved forward, what stalled, and what you learned..."
            className="w-full text-sm border border-[var(--border)] rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
        >
          {loading ? "Recording..." : "Save Today's Reflection"}
        </button>
      </form>
    </div>
  );
}
