export default function Loading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-20 bg-slate-200/60 rounded-xl border border-slate-200/40" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-64 bg-slate-200/60 rounded-xl border border-slate-200/40" />
          <div className="h-48 bg-slate-200/60 rounded-xl border border-slate-200/40" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-56 bg-slate-200/60 rounded-xl border border-slate-200/40" />
          <div className="h-40 bg-slate-200/60 rounded-xl border border-slate-200/40" />
        </div>
      </div>
    </div>
  );
}
