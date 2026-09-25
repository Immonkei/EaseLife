"use client";

import { Star, Network } from "lucide-react";

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
    <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-semibold text-sm text-slate-900">Task Backlog</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Tasks waiting in line. Star a task to make it one of today&apos;s 3 priorities.
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 tabular-nums">
          {tasks.length}
        </span>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="py-2.5 flex items-center justify-between gap-3 group transition-colors hover:bg-slate-50/60 px-1 rounded-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => onToggleTask(t.id, t.status)}
                  className="w-4.5 h-4.5 rounded-full border border-slate-300 hover:border-[#00A896] hover:bg-teal-50 shrink-0 transition-colors"
                  aria-label={`Mark task ${t.title} as completed`}
                />
                <div className="min-w-0">
                  <span className="text-xs font-medium text-slate-800 truncate block">
                    {t.title}
                  </span>
                  {t.projects?.title && (
                    <span className="text-[10px] text-slate-400">
                      {t.projects.title}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onSetTop3(t.id, nextFocusSlot)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors border border-amber-200/60"
                  title="Make this a Top Focus task for today"
                >
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>Set as Focus</span>
                </button>

                <button
                  onClick={() => onInspectLineage(t.id)}
                  className="p-1.5 text-slate-400 hover:text-[#235789] hover:bg-slate-100 rounded-md transition-colors"
                  title="View Goal Connection"
                  aria-label="View Goal Connection"
                >
                  <Network className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No pending tasks in queue. You are all caught up!
        </div>
      )}
    </section>
  );
}
