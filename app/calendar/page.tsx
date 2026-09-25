import { Calendar } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Time Blocks & Calendar
        </h1>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          Separation of scheduling from task identity.
        </p>
      </div>

      <div className="p-12 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
        <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-sm font-medium text-slate-600">Calendar Timeline</p>
        <p className="text-xs text-slate-400">
          Scheduled time blocks appear on your Daily Runway timeline.
        </p>
      </div>
    </div>
  );
}
