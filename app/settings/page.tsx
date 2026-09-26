import { Settings, ShieldCheck, Database, Layers } from "lucide-react";

export default function SettingsPage() {
  const domains = [
    { name: "Career & Craft", color: "#235789", desc: "Professional trajectory, engineering, craft, leadership" },
    { name: "Health & Vitality", color: "#00A896", desc: "Physical fitness, nutrition, recovery, mental clarity" },
    { name: "Personal Growth", color: "#60D394", desc: "Knowledge acquisition, deliberate practice, habits" },
    { name: "Relationships", color: "#F4D35E", desc: "Family, close friendships, community impact" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-black/[0.06] pb-4">
        <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
          Settings & Themes
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          System domains, database status, and operational preferences.
        </p>
      </div>

      {/* Life Domains Configuration */}
      <div className="bg-white border border-black/[0.06] rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2.5">
          <Layers className="w-4 h-4 text-[#235789]" />
          <h3 className="font-medium text-xs text-zinc-900 uppercase tracking-wide">Themes & Domains</h3>
        </div>

        <p className="text-xs text-zinc-500">
          Domains provide optional context for your long-term focus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {domains.map((dom) => (
            <div
              key={dom.name}
              className="p-3 rounded-lg border border-black/[0.06] bg-zinc-50/50 space-y-1 hover:border-black/[0.12] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: dom.color }}
                />
                <span className="text-xs font-medium text-zinc-800">{dom.name}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal pl-4">
                {dom.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Backend & Security */}
      <div className="bg-white border border-black/[0.06] rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2 border-b border-black/[0.04] pb-2.5">
          <Database className="w-4 h-4 text-[#00A896]" />
          <h3 className="font-medium text-xs text-zinc-900 uppercase tracking-wide">Database & Security</h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-black/[0.04]">
            <span className="text-zinc-500">Cloud Architecture</span>
            <span className="font-normal text-zinc-800">Hosted Supabase Cloud</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-black/[0.04]">
            <span className="text-zinc-500">Row Level Security (RLS)</span>
            <span className="inline-flex items-center gap-1 font-normal text-zinc-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Active on all tables
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-zinc-500">Ownership Constraint</span>
            <span className="font-normal text-zinc-800">Postgres XOR Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
