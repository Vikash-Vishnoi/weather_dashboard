"use client";

import { Search } from "lucide-react";

export function WelcomeState() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-6 py-6 text-center animate-fade-in">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Search size={36} className="text-white/20" />
        </div>
      </div>

      <div>
        <h2 className="text-white/80 font-semibold text-xl mb-2">
          Search for a city
        </h2>
        <p className="text-white/40 text-sm max-w-xs">
          Enter any city name to get current weather and a 5-day forecast, or use your location.
        </p>
      </div>
    </div>
  );
}
