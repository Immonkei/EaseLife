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
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-[#235789]" />
          Tasks
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage, organize, and complete your to-dos.
        </p>
      </div>

      <TasksClient initialTasks={tasks} />
    </div>
  );
}
