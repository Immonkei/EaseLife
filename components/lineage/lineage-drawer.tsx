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
        if (!res.ok) throw new Error("Could not resolve lineage");
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/25 backdrop-blur-2xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-slate-200/80 shadow-xl z-50 flex flex-col transform transition-transform duration-200 ease-out">
        {/* Header */}
        <div className="h-14 px-5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#235789]" />
            <div>
              <h3 className="font-semibold text-sm text-slate-900 tracking-tight">
                Goal & Vision Connection
              </h3>
            </div>
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-xs text-slate-500 space-y-3">
              <div className="w-5 h-5 border-2 border-[#235789] border-t-transparent rounded-full animate-spin" />
              <span>Connecting task to goals...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-[#EE6352] text-xs rounded-lg">
              {error}
            </div>
          )}

          {lineage && (
            <div className="relative pl-7 space-y-5">
              {/* Vertical Spine Line */}
              <div className="absolute left-[13px] top-3 bottom-5 w-0.5 bg-slate-200" />

              {/* 1. Life Vision */}
              <div className="relative">
                <div className="absolute -left-[27px] top-2.5 w-6 h-6 rounded-full bg-[#235789] text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-lg shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Life Vision</span>
                    {lineage.domain && (
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                        style={{ backgroundColor: lineage.domain.color || "#235789" }}
                      >
                        {lineage.domain.name}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">{lineage.vision.title}</h4>
                </div>
              </div>

              {/* 2. Strategic Goal */}
              <div className="relative">
                <div className="absolute -left-[27px] top-2.5 w-6 h-6 rounded-full bg-[#00A896] text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-lg shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Strategic Goal</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-[#00A896]">
                      {lineage.goal.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">{lineage.goal.title}</h4>
                </div>
              </div>

              {/* 3. Milestone Checkpoint (if exists) */}
              {lineage.milestone && (
                <div className="relative">
                  <div className="absolute -left-[27px] top-2.5 w-6 h-6 rounded-full bg-[#F4D35E] text-slate-900 flex items-center justify-center shadow-xs ring-4 ring-white">
                    <Flag className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-lg shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">Milestone Checkpoint</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                        {lineage.milestone.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900">{lineage.milestone.title}</h4>
                  </div>
                </div>
              )}

              {/* 4. Finite Project (if exists) */}
              {lineage.project && (
                <div className="relative">
                  <div className="absolute -left-[27px] top-2.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                    <FolderKanban className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-lg shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">Project</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {lineage.project.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900">{lineage.project.title}</h4>
                  </div>
                </div>
              )}

              {/* 5. Concrete Executable Task */}
              <div className="relative">
                <div className="absolute -left-[27px] top-2.5 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-lg shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">Action Task</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700 tabular-nums">
                      Weight: {lineage.task.weight}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">{lineage.task.title}</h4>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/70">
                    <span>Priority: <strong className="text-slate-700 font-semibold">{lineage.task.priority}</strong></span>
                    {lineage.task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
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
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/80 text-center shrink-0">
          <p className="text-[11px] text-slate-500">
            EaseLife Visible Lineage &bull; Every action grounded in direction.
          </p>
        </div>
      </div>
    </>
  );
}
