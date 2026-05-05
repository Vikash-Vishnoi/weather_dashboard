"use client";

import { WeatherIcon } from "./WeatherIcon";
import {
  formatTemp,
  formatWindSpeed,
  formatVisibility,
  getVisibilityLabel,
  getWindDirection,
  formatTime,
  isDay as checkIsDay,
} from "@/lib/utils";
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Thermometer } from "lucide-react";

export function CurrentWeatherCard({ data, unit, localTime, isUpdating }) {
  const dayTime = checkIsDay(data.sunrise, data.sunset, data.dt);

  const stats = [
    {
      icon: <Droplets size={16} />,
      label: "Humidity",
      value: `${data.humidity}%`,
      sub: data.humidity > 70 ? "High" : data.humidity > 40 ? "Moderate" : "Low",
    },
    {
      icon: <Wind size={16} />,
      label: "Wind",
      value: formatWindSpeed(data.wind_speed, unit),
      sub: getWindDirection(data.wind_deg),
    },
    {
      icon: <Eye size={16} />,
      label: "Visibility",
      value: formatVisibility(data.visibility),
      sub: getVisibilityLabel(data.visibility),
    },
    {
      icon: <Gauge size={16} />,
      label: "Pressure",
      value: `${data.pressure}`,
      sub: "hPa",
    },
    {
      icon: <Sunrise size={16} />,
      label: "Sunrise",
      value: formatTime(data.sunrise, data.timezone),
      sub: "Local time",
    },
    {
      icon: <Sunset size={16} />,
      label: "Sunset",
      value: formatTime(data.sunset, data.timezone),
      sub: "Local time",
    },
  ];

  return (
    <div className="animate-fade-in h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-3">
        {/* Left: Temperature */}
        <div className="flex flex-col items-center sm:items-start shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl sm:text-9xl font-thin text-white tracking-tighter leading-none">
              {data.temp}
            </span>
            <span className="text-3xl sm:text-4xl text-white/60 font-light mt-2">
              °{unit === "metric" ? "C" : "F"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Thermometer size={14} className="text-white/50" />
            <span className="text-white/50 text-sm">
              Feels like {formatTemp(data.feels_like, unit)}
            </span>
          </div>
          <div className="flex gap-3 mt-1 text-sm text-white/40">
            <span>H: {formatTemp(data.temp_max, unit)}</span>
            <span>·</span>
            <span>L: {formatTemp(data.temp_min, unit)}</span>
          </div>
        </div>

        {/* Center: City name + local time */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {data.city}
          </h2>
          <span className="text-lg sm:text-xl font-light text-white/55 tracking-wide mt-0.5">
            {data.country}
          </span>
          {localTime && (
            <p className="text-white/40 text-sm mt-2 font-medium">
              Local time · {localTime}
            </p>
          )}
          {isUpdating && (
            <span className="text-xs text-white/30 mt-1">Updating...</span>
          )}
        </div>

        {/* Right: Weather icon + condition */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <WeatherIcon
            conditionId={data.condition.id}
            isDay={dayTime}
            size="xl"
          />
          <div className="text-center">
            <p className="text-white font-semibold text-lg capitalize">
              {data.condition.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-colors duration-200"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-2 text-white/40 mb-2">
              {stat.icon}
              <span className="text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="text-white font-semibold text-xl">{stat.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
