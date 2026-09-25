"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("EaseLife Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EE6352] flex items-center justify-center border border-red-100">
        <AlertCircle className="w-5 h-5" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-semibold text-slate-900">
          Something interrupted this runway
        </h2>
        <p className="text-xs text-slate-500 max-w-sm">
          {error?.message || "An unexpected error occurred while loading this view."}
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#235789] hover:bg-[#1b456e] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
