"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Target,
  FolderKanban,
  CheckSquare,
  X,
  Calendar,
  Compass,
  Zap,
} from "lucide-react";
import { LineageResult } from "@/lib/lineage/lineage-service";

interface LineageDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

export function LineageDrawer({ taskId, onClose }: LineageDrawerProps) {
  const [data, setData] = useState<{
    forTaskId: string | null;
    lineage: LineageResult | null;
    error: string | null;
  }>({
    forTaskId: null,
    lineage: null,
    error: null,
  });

  const loading = Boolean(taskId && data.forTaskId !== taskId);
  const lineage = data.forTaskId === taskId ? data.lineage : null;
  const error = data.forTaskId === taskId ? data.error : null;

  useEffect(() => {
    if (!taskId) return;

    let ignore = false;

    fetch(`/api/tasks/${taskId}/lineage`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not resolve context");
        return res.json();
      })
      .then((resData) => {
        if (!ignore) {
          setData({
            forTaskId: taskId,
            lineage: resData,
            error: null,
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          setData({
            forTaskId: taskId,
            lineage: null,
            error: err.message,
          });
        }
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      ignore = true;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [taskId, onClose]);

  if (!taskId) return null;

  const hasHigherContext = Boolean(lineage?.theme || lineage?.vision || lineage?.goal || lineage?.project);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-2xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-black/[0.06] shadow-xl z-50 flex flex-col transform transition-transform duration-200 ease-out">
        {/* Header */}
        <div className="h-14 px-6 border-b border-black/[0.05] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#235789]" />
            <h3 className="font-semibold text-xs text-zinc-900 tracking-tight">
              Why This Matters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-xs text-zinc-400 space-y-3">
              <div className="w-4 h-4 border-2 border-[#235789] border-t-transparent rounded-full animate-spin" />
              <span>Connecting action to purpose...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200/80 text-[#EE6352] text-xs rounded-lg">
              {error}
            </div>
          )}

          {lineage && (
            <div className="relative pl-7 space-y-4">
              {/* Vertical Spine Line */}
              {hasHigherContext && (
                <div className="absolute left-[11px] top-3 bottom-5 w-[1.5px] bg-gradient-to-b from-[#235789] via-[#00A896] to-zinc-300" />
              )}

              {/* 1. Life Theme / Horizon (if exists) */}
              {(lineage.theme || lineage.vision || lineage.domain) && (
                <div className="relative">
                  <div className="absolute -left-[27px] top-2.5 w-5 h-5 rounded-full bg-[#235789] text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                  <div className="p-3.5 bg-white border border-black/[0.06] rounded-lg shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-400 text-[10px] uppercase tracking-wider">Horizon</span>
                      {(lineage.theme?.color || lineage.domain?.color) && (
                        <span
                          className="px-1.5 py-0.2 rounded text-[10px] font-semibold text-white"
                          style={{ backgroundColor: lineage.theme?.color || lineage.domain?.color || "#235789" }}
                        >
                          {lineage.theme?.name || lineage.domain?.name}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-xs text-zinc-900 leading-snug">
                      {lineage.theme?.vision_statement || lineage.vision?.title || lineage.theme?.name}
                    </h4>
                  </div>
                </div>
              )}

              {/* 2. Strategic Goal (if exists) */}
              {lineage.goal && (
                <div className="relative">
                  <div className="absolute -left-[27px] top-2.5 w-5 h-5 rounded-full bg-[#00A896] text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                    <Target className="w-2.5 h-2.5" />
                  </div>
                  <div className="p-3.5 bg-white border border-black/[0.06] rounded-lg shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-400 text-[10px] uppercase tracking-wider">Outcome</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20">
                        {lineage.goal.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-zinc-900">{lineage.goal.title}</h4>
                  </div>
                </div>
              )}

              {/* 3. Finite Project (if exists) */}
              {lineage.project && (
                <div className="relative">
                  <div className="absolute -left-[27px] top-2.5 w-5 h-5 rounded-full bg-[#235789] text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                    <FolderKanban className="w-2.5 h-2.5" />
                  </div>
                  <div className="p-3.5 bg-white border border-black/[0.06] rounded-lg shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-400 text-[10px] uppercase tracking-wider">Project</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#235789]/10 text-[#235789]">
                        {lineage.project.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-zinc-900">{lineage.project.title}</h4>
                  </div>
                </div>
              )}

              {/* 4. Concrete Executable Task */}
              <div className="relative">
                <div className={`absolute -left-[27px] top-2.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-2xs ${
                  lineage.task.status === "COMPLETED" ? "bg-[#00A896] text-white" : "bg-zinc-900 text-white"
                }`}>
                  <CheckSquare className="w-2.5 h-2.5" />
                </div>
                <div className="p-3.5 bg-zinc-50 border border-black/[0.06] rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-500 text-[10px] uppercase tracking-wider">Today&apos;s Action</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      lineage.task.status === "COMPLETED" ? "bg-[#00A896]/15 text-[#00A896]" : "bg-zinc-200/70 text-zinc-700"
                    }`}>
                      {lineage.task.status === "COMPLETED" ? "Completed" : "Ready"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-zinc-900">{lineage.task.title}</h4>

                  {lineage.task.due_date && (
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1 border-t border-black/[0.04]">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>Due: {lineage.task.due_date}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Standalone card if no parent */}
              {!hasHigherContext && (
                <div className="p-3.5 bg-zinc-50 border border-black/[0.06] rounded-lg text-xs text-zinc-600 space-y-1">
                  <p className="font-medium text-zinc-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#00A896]" />
                    Direct Action
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    This action stands on its own without needing a parent project. Complete it today with peace of mind.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/[0.05] bg-white text-center shrink-0">
          <p className="text-[10px] text-zinc-400 tracking-wide uppercase">
            EaseLife &bull; Structure Your Vision. Ease Your Days.
          </p>
        </div>
      </div>
    </>
  );
}
