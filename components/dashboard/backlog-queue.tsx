import { Network } from "lucide-react";

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
}

export function BacklogQueue({
  tasks,
  onToggleTask,
  onSetTop3,
  onInspectLineage,
}: BacklogQueueProps) {
  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-sm text-slate-900">Task Queue</h3>
        <span className="text-xs text-slate-400">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} ready
        </span>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="py-2.5 flex items-center justify-between gap-3 group transition-colors hover:bg-slate-50/50 px-1 rounded-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => onToggleTask(t.id, t.status)}
                  className="w-4.5 h-4.5 rounded-full border border-slate-300 hover:border-[#00A896] hover:bg-teal-50 shrink-0 transition-colors"
                  aria-label={`Mark task ${t.title} as completed`}
                />
                <span className="text-xs font-medium text-slate-800 truncate">
                  {t.title}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => onInspectLineage(t.id)}
                  className="text-xs text-[#235789] hover:underline flex items-center gap-1 font-medium transition-colors"
                >
                  <Network className="w-3 h-3" />
                  <span>Lineage</span>
                </button>

                {/* Make Top 1, 2, 3 assignment buttons */}
                <div className="flex items-center gap-1 text-[10px] font-medium">
                  {([1, 2, 3] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onSetTop3(t.id, pos)}
                      className="w-5 h-5 rounded bg-slate-100 hover:bg-[#235789] hover:text-white transition-colors text-slate-600 flex items-center justify-center"
                      title={`Assign to Focus Slot #${pos}`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No pending tasks in queue. All caught up.
        </div>
      )}
    </section>
  );
}
