import { Settings, ShieldCheck, Database, Layers } from "lucide-react";

export default function SettingsPage() {
  const domains = [
    { name: "Career & Craft", color: "#235789", desc: "Professional trajectory, engineering, craft, leadership" },
    { name: "Health & Vitality", color: "#00A896", desc: "Physical fitness, nutrition, recovery, mental clarity" },
    { name: "Personal Growth", color: "#60D394", desc: "Knowledge acquisition, deliberate practice, habits" },
    { name: "Relationships", color: "#F4D35E", desc: "Family, close friendships, community impact" },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          Settings & Life Domains
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage system domains, database connection, and operational environment.
        </p>
      </div>

      {/* Life Domains Configuration */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-[#235789]" />
          <h3 className="font-semibold text-sm text-slate-900">Life Domains</h3>
        </div>

        <p className="text-xs text-slate-500">
          Domains categorize high-level visions, strategic goals, and projects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {domains.map((dom) => (
            <div
              key={dom.name}
              className="p-3.5 rounded-lg border border-slate-200/80 bg-white space-y-1 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: dom.color }}
                />
                <span className="text-xs font-semibold text-slate-800">{dom.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal pl-4.5">
                {dom.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Backend & Security */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="w-4 h-4 text-[#00A896]" />
          <h3 className="font-semibold text-sm text-slate-900">Database & Security</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Cloud Architecture</span>
            <span className="font-medium text-slate-900">Option A: Hosted Supabase Cloud</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Row Level Security (RLS)</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#00A896]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Active on all 15 tables
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600">Task XOR Ownership Constraint</span>
            <span className="font-medium text-slate-900">Enforced by Postgres CHECK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
