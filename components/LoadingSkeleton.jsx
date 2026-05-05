"use client";

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <div className="space-y-3">
          <div className="h-24 w-48 bg-white/10 rounded-2xl" />
          <div className="h-4 w-32 bg-white/10 rounded-full" />
          <div className="h-4 w-24 bg-white/10 rounded-full" />
        </div>
        <div className="h-32 w-32 bg-white/10 rounded-full sm:ml-auto" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2"
          >
            <div className="h-3 w-16 bg-white/10 rounded-full" />
            <div className="h-6 w-20 bg-white/10 rounded-full" />
            <div className="h-3 w-12 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
        <div className="h-3 w-24 bg-white/10 rounded-full mb-5" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
            <div className="h-4 w-8 bg-white/10 rounded-full" />
            <div className="h-8 w-8 bg-white/10 rounded-full" />
            <div className="flex-1 h-2 bg-white/10 rounded-full" />
            <div className="h-4 w-16 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
