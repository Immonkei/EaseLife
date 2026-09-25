import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#235789] flex items-center justify-center border border-blue-100">
        <Compass className="w-5 h-5" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-semibold text-slate-900">404 &mdash; Direction Lost</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          The view or route you requested does not exist or has been relocated.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#235789] hover:bg-[#1b456e] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Daily Runway</span>
      </Link>
    </div>
  );
}
