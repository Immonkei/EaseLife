import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" />
          Settings & Life Domains
        </h1>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          Manage your account, timezone, and life domains.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[var(--foreground)]">Supabase Configuration</h3>
        <p className="text-xs text-[var(--foreground-muted)]">
          EaseLife uses Supabase Cloud (Option A). Verify your environment variables in <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">.env.local</code>.
        </p>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">Default Life Domains</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <span className="p-2 rounded bg-blue-50 text-blue-800 border border-blue-100">Career & Craft</span>
            <span className="p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">Health & Vitality</span>
            <span className="p-2 rounded bg-green-50 text-green-800 border border-green-100">Personal Growth</span>
            <span className="p-2 rounded bg-amber-50 text-amber-800 border border-amber-100">Relationships</span>
          </div>
        </div>
      </div>
    </div>
  );
}
