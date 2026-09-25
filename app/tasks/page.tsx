import { getUserTasks } from "@/lib/execution/task-service";
import { CheckSquare } from "lucide-react";
import { TasksClient } from "./tasks-client";

interface TaskItem {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  weight: number;
  priority: string;
  due_date: string | null;
  projects?: { id: string; title: string } | null;
  goals?: { id: string; title: string } | null;
}

export default async function TasksPage() {
  let tasks: TaskItem[] = [];
  try {
    const t = await getUserTasks();
    if (t) tasks = t as unknown as TaskItem[];
  } catch {}

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[var(--primary)]" />
          All Tasks & Lineage
        </h1>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          Every task connects upward to a Project or Goal.
        </p>
      </div>

      <TasksClient initialTasks={tasks} />
    </div>
  );
}
