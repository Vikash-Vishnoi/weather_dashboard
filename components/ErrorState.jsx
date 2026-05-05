"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-16 text-center gap-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg mb-1">Something went wrong</h3>
        <p className="text-white/50 text-sm max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-colors"
          type="button"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
}
