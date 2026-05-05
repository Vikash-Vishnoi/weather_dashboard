"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { WelcomeState } from "@/components/WelcomeState";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useUnit } from "@/hooks/useUnit";
import { formatTime, getWeatherGradient, isDay } from "@/lib/utils";
import { ThermometerSun } from "lucide-react";

export default function WeatherClient() {
  const { unit, toggleUnit } = useUnit();
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);

  const lastRequestRef = useRef(null);
  const lastActionRef = useRef("search");
  const autoGeoRequestedRef = useRef(false);

  const GEO_PROMPT_KEY = "weather_geo_prompted";

  const fetchWeather = useCallback(
    async (params, options = {}) => {
      setIsLoading(true);
      setError("");

      try {
        const searchParams = new URLSearchParams({
          unit,
          ...params,
        });
        const response = await fetch(`/api/weather?${searchParams.toString()}`, {
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to fetch weather.");
        }

        setData(payload);
        if (!options.skipHistory && payload?.current?.city && payload?.current?.country) {
          addToHistory(payload.current.city, payload.current.country);
        }
      } catch (err) {
        setData(null);
        setError(err instanceof Error ? err.message : "Unable to fetch weather.");
      } finally {
        setIsLoading(false);
      }
    },
    [unit, addToHistory]
  );

  const handleSearch = useCallback(
    (city) => {
      const request = { city };
      lastActionRef.current = "search";
      lastRequestRef.current = request;
      fetchWeather(request);
    },
    [fetchWeather]
  );

  const handleGeolocate = useCallback(() => {
    lastActionRef.current = "geolocate";
    lastRequestRef.current = null;
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setIsGeoLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const request = {
          lat: String(pos.coords.latitude.toFixed(4)),
          lon: String(pos.coords.longitude.toFixed(4)),
        };
        lastRequestRef.current = request;
        setIsGeoLoading(false);
        fetchWeather(request);
      },
      () => {
        setIsGeoLoading(false);
        setError("Unable to access your location.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, [fetchWeather]);

  const attemptAutoGeolocate = useCallback(async () => {
    if (autoGeoRequestedRef.current) return;
    autoGeoRequestedRef.current = true;

    if (!navigator.geolocation) return;

    let permissionState = null;
    if (navigator.permissions?.query) {
      try {
        const status = await navigator.permissions.query({ name: "geolocation" });
        permissionState = status.state;
      } catch {}
    }

    if (permissionState === "denied") return;

    if (permissionState !== "granted") {
      try {
        const hasPrompted = localStorage.getItem(GEO_PROMPT_KEY) === "1";
        if (hasPrompted) return;
        localStorage.setItem(GEO_PROMPT_KEY, "1");
      } catch {}
    }

    handleGeolocate();
  }, [handleGeolocate]);

  const handleRetry = useCallback(() => {
    if (lastActionRef.current === "geolocate") {
      handleGeolocate();
      return;
    }
    if (lastRequestRef.current) {
      fetchWeather(lastRequestRef.current);
    }
  }, [fetchWeather, handleGeolocate]);

  useEffect(() => {
    if (!lastRequestRef.current) return;
    fetchWeather(lastRequestRef.current, { skipHistory: true });
  }, [unit, fetchWeather]);

  useEffect(() => {
    // Auto-fetch location on first visit or when permission is already granted.
    attemptAutoGeolocate();
  }, [attemptAutoGeolocate]);

  const dayTime = data?.current
    ? isDay(data.current.sunrise, data.current.sunset, data.current.dt)
    : true;
  const headerGradient = data?.current
    ? getWeatherGradient(data.current.condition.id, dayTime)
    : "from-sky-500 via-blue-500 to-indigo-600";
  const localTime = data?.current
    ? formatTime(data.current.dt, data.current.timezone)
    : null;
  const showSkeleton = isLoading && !data;
  const isUpdating = isLoading && data;
  const showEmpty = !error && !data && !showSkeleton;

  return (
    <section className="flex flex-col gap-10">
      <div className="px-6 pt-10 pb-14 sm:px-8 sm:pt-12 sm:pb-16">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
        
            {data && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  {data.current.city}, {data.current.country}
                </span>
                {localTime && (
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    Local time {localTime}
                  </span>
                )}
                {isUpdating && <span className="text-white/40">Updating...</span>}
              </div>
            )}
          </div>

        </header>

        <div className="mt-6">
          <SearchBar
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            history={history}
            onClearHistory={clearHistory}
            isLoading={isLoading}
            isGeoLoading={isGeoLoading}
          />
        </div>

        {showEmpty && (
          <div className="mt-8">
            <WelcomeState />
          </div>
        )}
      </div>

      {showSkeleton && <LoadingSkeleton />}

      {!showSkeleton && (error || data) && (
        <div
          className={`grid gap-6 lg:grid-cols-[1.15fr_0.85fr] ${isUpdating ? "opacity-70" : ""}`}
        >
          <div className="space-y-6">
            {error && <ErrorState message={error} onRetry={handleRetry} />}
            {!error && data && <CurrentWeatherCard data={data.current} unit={unit} />}
          </div>

          <div className="space-y-6">
            {!error && data && data.forecast?.length > 0 && (
              <ForecastCard forecast={data.forecast} unit={unit} />
            )}
            {!error && data && (!data.forecast || data.forecast.length === 0) && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                Forecast data is currently unavailable.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
