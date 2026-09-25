import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[var(--primary)] flex items-center justify-center">
        <Compass className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[var(--foreground)]">404 — Direction Lost</h2>
        <p className="text-xs text-[var(--foreground-muted)] max-w-sm">
          The view or page you requested does not exist or has moved.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Daily Runway</span>
      </Link>
    </div>
  );
}
