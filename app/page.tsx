import Link from "next/link";
import { Compass, Target, Flag, FolderKanban, CheckSquare, ArrowRight, Repeat } from "lucide-react";
import { EaseLifeLogo } from "@/components/brand/logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between">
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-[var(--border)] bg-white/80 backdrop-blur-xs sticky top-0 z-10">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <EaseLifeLogo size={36} showTagline={true} />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold text-[var(--foreground-muted)] hover:text-[#235789] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-semibold bg-[#235789] text-white rounded-lg hover:opacity-90 transition-opacity shadow-2xs"
          >
            Open Runway
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#235789]">
            <span>✨ Opinionated Personal Operating System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight leading-tight">
            Structure Your Vision. <br />
            <span className="text-[#00A896]">Ease Your Days.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--foreground-muted)]">
            EaseLife connects your long-term life direction directly to daily execution through
            <strong className="text-[var(--foreground)] font-semibold"> Visible Lineage</strong>.
            Always know why your work matters today.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#235789] text-white font-semibold text-sm hover:opacity-95 shadow-sm transition-all"
          >
            Launch Daily Runway
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-white border border-[var(--border)] text-[#235789] font-semibold text-sm hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Create Account
          </Link>
        </div>

        {/* Visible Lineage Demonstration Diagram ("Tethered Actions") */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-xs max-w-xl mx-auto text-left space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              The Visible Lineage Hierarchy — &quot;Tethered Actions&quot;
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#00A896]">
              Continuous Alignment
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
              <Compass className="w-4 h-4 text-[#235789] shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-[#235789]">1. Life Vision</div>
                <div className="text-xs font-semibold text-blue-950">Become a Principal Systems Architect</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3 ml-4">
              <Target className="w-4 h-4 text-[#00A896] shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-[#00A896]">2. Strategic Goal</div>
                <div className="text-xs font-semibold text-emerald-950">Master Technical System Architecture</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-3 ml-8">
              <Flag className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-700">3. Milestone Checkpoint</div>
                <div className="text-xs font-semibold text-amber-950">Ship EaseLife Operating System</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3 ml-12">
              <FolderKanban className="w-4 h-4 text-indigo-700 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-indigo-700">4. Finite Project</div>
                <div className="text-xs font-semibold text-indigo-950">EaseLife Platform Implementation</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-3 ml-16">
              <CheckSquare className="w-4 h-4 text-[#235789] shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-600">5. Today&apos;s Concrete Action</div>
                <div className="text-xs font-semibold text-[var(--foreground)]">Implement Supabase RLS Policies</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--border)] text-center text-xs text-[var(--foreground-muted)]">
        EaseLife Personal Operating System &bull; Structure Your Vision. Ease Your Days.
      </footer>
    </div>
  );
}
