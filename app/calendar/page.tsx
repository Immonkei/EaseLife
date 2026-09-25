import { Calendar, Clock, Plus } from "lucide-react";

export default function CalendarPage() {
  const sampleBlocks = [
    {
      id: "1",
      time: "09:00 AM – 10:30 AM",
      title: "Deep Work Sprint: Core Runway & Lineage Engine",
      category: "Execution",
      dotColor: "bg-[#235789]",
    },
    {
      id: "2",
      time: "11:00 AM – 11:45 AM",
      title: "Strategic Review: Life Visions & Goal Alignments",
      category: "Planning",
      dotColor: "bg-[#00A896]",
    },
    {
      id: "3",
      time: "02:00 PM – 03:00 PM",
      title: "Execution Runway: Task Backlog Processing",
      category: "Action",
      dotColor: "bg-slate-700",
    },
    {
      id: "4",
      time: "05:00 PM – 05:15 PM",
      title: "3-Minute Evening Reflection & Learning Loop",
      category: "Review",
      dotColor: "bg-[#F4D35E]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#235789]" />
            Time Blocks & Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict separation of operational scheduling from atomic task identity.
          </p>
        </div>

        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#235789] text-white text-xs font-semibold hover:bg-[#1b456e] transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Block</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Today&apos;s Time Schedule</span>
          </div>
          <span className="text-xs text-slate-400">Day View</span>
        </div>

        <div className="space-y-2.5">
          {sampleBlocks.map((block) => (
            <div
              key={block.id}
              className="p-3.5 rounded-lg border border-slate-200/80 bg-white flex items-center justify-between transition-colors hover:border-slate-300 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${block.dotColor} shrink-0`} />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                    {block.time}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {block.title}
                  </h4>
                </div>
              </div>

              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
                {block.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
