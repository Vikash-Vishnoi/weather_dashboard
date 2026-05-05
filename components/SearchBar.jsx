"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Clock, MapPin, Loader2 } from "lucide-react";

export function SearchBar({
  onSearch,
  onGeolocate,
  history,
  onClearHistory,
  isLoading,
  isGeoLoading,
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  const showDropdown = isFocused && history.length > 0 && !query;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setIsFocused(false);
    }
  }

  function handleHistoryClick(city) {
    setQuery(city);
    onSearch(city);
    setIsFocused(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={
            `flex items-center gap-3 px-4 py-3.5 rounded-2xl ` +
            `bg-white/10 border transition-all duration-300 ` +
            `${isFocused ? "border-white/50 shadow-lg shadow-black/20" : "border-white/20"}`
          }
        >
          {isLoading ? (
            <Loader2 size={20} className="text-white/70 shrink-0 animate-spin" />
          ) : (
            <Search size={20} className="text-white/70 shrink-0" />
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-base font-medium"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}

          <div className="w-px h-5 bg-white/20" />

          <button
            type="button"
            onClick={onGeolocate}
            disabled={isGeoLoading}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium shrink-0"
            title="Use my location"
          >
            {isGeoLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <MapPin size={16} />
            )}
            <span className="hidden sm:inline">Locate</span>
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden z-50 shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Recent</span>
            <button
              onClick={onClearHistory}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
              type="button"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => handleHistoryClick(item.city)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                type="button"
              >
                <Clock size={14} className="text-white/30 shrink-0" />
                <span className="text-white/80 text-sm font-medium">{item.city}</span>
                <span className="text-white/30 text-xs ml-auto">{item.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
