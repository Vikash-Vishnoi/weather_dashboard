"use client";

import { WeatherIcon } from "./WeatherIcon";
import { getDayName, formatTemp } from "@/lib/utils";
import { Droplets } from "lucide-react";

export function ForecastCard({ forecast, unit }) {
  const maxTemp = Math.max(...forecast.map((d) => d.temp_max));
  const minTemp = Math.min(...forecast.map((d) => d.temp_min));
  const range = maxTemp - minTemp || 1;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6">
      <h2 className="text-white/40 text-xs font-medium uppercase tracking-widest mb-5">
        5-Day Forecast
      </h2>
      <div className="space-y-1">
        {forecast.map((day, i) => {
          const barLeft = ((day.temp_min - minTemp) / range) * 100;
          const barWidth = ((day.temp_max - day.temp_min) / range) * 100;

          return (
            <div
              key={i}
              className="flex items-center gap-3 sm:gap-4 py-2.5 border-b border-white/5 last:border-0"
              style={{
                opacity: 0,
                animation: "fadeSlideIn 0.4s ease forwards",
                animationDelay: `${i * 60}ms`,
              }}
            >
              <span className="text-white/60 font-medium text-sm w-8 shrink-0">
                {getDayName(day.dt)}
              </span>

              <div className="shrink-0">
                <WeatherIcon conditionId={day.condition.id} isDay={true} size="sm" />
              </div>

              <div className="flex items-center gap-1 w-10 shrink-0">
                {day.pop > 20 && (
                  <>
                    <Droplets size={11} className="text-blue-400/70" />
                    <span className="text-blue-400/70 text-xs">{day.pop}%</span>
                  </>
                )}
              </div>

              <div className="flex-1 flex items-center gap-3 min-w-0">
                <span className="text-white/40 text-sm w-10 text-right shrink-0">
                  {formatTemp(day.temp_min, unit)}
                </span>
                <div className="flex-1 relative h-1.5 bg-white/10 rounded-full">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-amber-400"
                    style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 8)}%` }}
                  />
                </div>
                <span className="text-white font-semibold text-sm w-10 shrink-0">
                  {formatTemp(day.temp_max, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
