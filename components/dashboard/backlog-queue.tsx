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
    <section className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-[var(--foreground)]">Queue & Available Tasks</h3>
      {tasks && tasks.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {tasks.map((t) => (
            <div key={t.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => onToggleTask(t.id, t.status)}
                  className="w-5 h-5 rounded-full border border-slate-300 hover:border-[#00A896] shrink-0"
                  title="Toggle status"
                />
                <span className="text-sm font-medium text-slate-800 truncate">{t.title}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onInspectLineage(t.id)}
                  className="text-xs text-[#235789] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Network className="w-3 h-3" />
                  Lineage
                </button>

                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {([1, 2, 3] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onSetTop3(t.id, pos)}
                      className="w-5 h-5 rounded bg-[#EDF2F4] hover:bg-[#235789] hover:text-white transition-colors text-slate-700"
                      title={`Make Top ${pos}`}
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
        <p className="text-xs text-slate-400">No pending tasks in queue.</p>
      )}
    </section>
  );
}
