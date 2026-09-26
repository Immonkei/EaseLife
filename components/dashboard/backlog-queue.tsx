"use client";

import { Star, Compass } from "lucide-react";

interface QueueTask {
  id: string;
  title: string;
  status: string;
  weight: number;
  projects?: { title: string } | null;
  goals?: { title: string } | null;
}

interface BacklogQueueProps {
  tasks: QueueTask[];
  onToggleTask: (taskId: string, currentStatus: string) => void;
  onSetTop3: (taskId: string, position: 1 | 2 | 3) => void;
  onInspectLineage: (taskId: string) => void;
  nextFocusSlot?: 1 | 2 | 3;
}

export function BacklogQueue({
  tasks,
  onToggleTask,
  onSetTop3,
  onInspectLineage,
  nextFocusSlot = 1,
}: BacklogQueueProps) {
  return (
    <section className="bg-white border border-black/[0.06] rounded-xl p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
        <div>
          <h3 className="font-semibold text-xs text-zinc-900 tracking-tight">Runway Queue</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Secondary actions waiting in line. Set as today&apos;s focus when ready.
          </p>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 tabular-nums">
          {tasks.length}
        </span>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="divide-y divide-black/[0.04]">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="py-2.5 flex items-center justify-between gap-3 group transition-colors hover:bg-zinc-50/70 px-1 rounded-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => onToggleTask(t.id, t.status)}
                  className="w-4 h-4 rounded-full border border-zinc-300 hover:border-zinc-800 shrink-0 transition-colors"
                  aria-label={`Mark action ${t.title} as completed`}
                />
                <div className="min-w-0">
                  <span className="text-xs font-medium text-zinc-800 truncate block">
                    {t.title}
                  </span>
                  {t.projects?.title && (
                    <span className="text-[10px] text-[#235789] block truncate font-medium">
                      ↳ {t.projects.title}
                    </span>
                  )}
                </div>
              </div>

              {/* Action controls appear gracefully on hover */}
              <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onSetTop3(t.id, nextFocusSlot)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-[#235789]/10 hover:bg-[#235789]/15 text-[#235789] transition-colors"
                  title="Make this a Top Focus action for today"
                >
                  <Star className="w-3 h-3 text-[#235789] fill-[#235789]" />
                  <span>Focus</span>
                </button>

                <button
                  onClick={() => onInspectLineage(t.id)}
                  className="p-1.5 text-zinc-400 hover:text-[#235789] hover:bg-[#235789]/10 rounded-md transition-colors"
                  title="Why this matters"
                  aria-label="Why this matters"
                >
                  <Compass className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-zinc-400">
          Runway is clear. No pending actions in queue.
        </div>
      )}
    </section>
  );
}
