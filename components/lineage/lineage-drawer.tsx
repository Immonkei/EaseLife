"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  Target,
  Flag,
  FolderKanban,
  CheckSquare,
  X,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { LineageResult } from "@/lib/lineage/lineage-service";

interface LineageDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

export function LineageDrawer({ taskId, onClose }: LineageDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [lineage, setLineage] = useState<LineageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setLineage(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/tasks/${taskId}/lineage`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not resolve lineage");
        return res.json();
      })
      .then((data) => setLineage(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [taskId, onClose]);

  if (!taskId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-[var(--border)] shadow-2xl z-50 flex flex-col transform transition-transform duration-250 ease-out">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-white">
          <div>
            <h3 className="font-bold text-sm text-[var(--foreground)] tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--primary)]" />
              Visible Lineage Architecture
            </h3>
            <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
              Continuous answer: &quot;Why does this matter today?&quot;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close lineage drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-xs text-[var(--foreground-muted)] space-y-2">
              <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              <span>Tracing lineage to Life Vision...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-[var(--danger)] text-xs rounded-xl">
              {error}
            </div>
          )}

          {lineage && (
            <div className="relative pl-6 space-y-6">
              {/* Vertical Spine Line */}
              <div className="absolute left-[19px] top-4 bottom-6 w-0.5 bg-slate-200 -z-0" />

              {/* 1. Life Vision */}
              <div className="relative z-10">
                <div className="absolute -left-[30px] top-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Compass className="w-3 h-3" />
                </div>
                <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <span className="uppercase tracking-wider">Life Vision</span>
                    {lineage.domain && (
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-2xs"
                        style={{ backgroundColor: lineage.domain.color || "#235789" }}
                      >
                        {lineage.domain.name}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-blue-950">{lineage.vision.title}</h4>
                </div>
              </div>

              {/* 2. Strategic Goal */}
              <div className="relative z-10">
                <div className="absolute -left-[30px] top-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Target className="w-3 h-3" />
                </div>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                    <span className="uppercase tracking-wider">Strategic Goal</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {lineage.goal.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-emerald-950">{lineage.goal.title}</h4>
                </div>
              </div>

              {/* 3. Milestone Checkpoint (if exists) */}
              {lineage.milestone && (
                <div className="relative z-10">
                  <div className="absolute -left-[30px] top-3 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Flag className="w-3 h-3" />
                  </div>
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span className="uppercase tracking-wider">Milestone Checkpoint</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {lineage.milestone.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-amber-950">{lineage.milestone.title}</h4>
                  </div>
                </div>
              )}

              {/* 4. Finite Project (if exists) */}
              {lineage.project && (
                <div className="relative z-10">
                  <div className="absolute -left-[30px] top-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <FolderKanban className="w-3 h-3" />
                  </div>
                  <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                      <span className="uppercase tracking-wider">Finite Project</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {lineage.project.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-indigo-950">{lineage.project.title}</h4>
                  </div>
                </div>
              )}

              {/* 5. Concrete Executable Task */}
              <div className="relative z-10">
                <div className="absolute -left-[30px] top-3 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <CheckSquare className="w-3 h-3" />
                </div>
                <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="uppercase tracking-wider">Today&apos;s Concrete Action</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 tabular-nums">
                      Weight: {lineage.task.weight}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-950">{lineage.task.title}</h4>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Priority: <strong>{lineage.task.priority}</strong></span>
                    {lineage.task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {lineage.task.due_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-slate-50 text-center">
          <p className="text-[11px] text-[var(--foreground-muted)]">
            EaseLife Visible Lineage &bull; Every action grounded in direction.
          </p>
        </div>
      </div>
    </>
  );
}
