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
import { formatTime, isDay } from "@/lib/utils";
export default function WeatherClient() {
  const { unit, toggleUnit } = useUnit();
  const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [isAutoGeoLocating, setIsAutoGeoLocating] = useState(false);

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

  const handleGeolocate = useCallback((options = {}) => {
    lastActionRef.current = "geolocate";
    lastRequestRef.current = null;
    if (!navigator.geolocation) {
      if (!options.silent) setError("Geolocation is not supported in this browser.");
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
        if (options.silent) setIsAutoGeoLocating(false);
        fetchWeather(request);
      },
      () => {
        setIsGeoLoading(false);
        if (options.silent) {
          // Auto-geolocate failed (user ignored/denied/timed out) — fall back silently
          setIsAutoGeoLocating(false);
        } else {
          setError("Unable to access your location.");
        }
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

    // Mark as silently auto-geolocating so errors don't block the welcome screen
    setIsAutoGeoLocating(true);
    handleGeolocate({ silent: true });
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

  const localTime = data?.current
    ? formatTime(data.current.dt, data.current.timezone)
    : null;
  const showSkeleton = isLoading && !data;
  const isUpdating = isLoading && data;
  // Show the welcome screen if there's no data/error, OR if the only "error"
  // is from the silent auto-geolocate attempt (user ignored/denied permission).
  const showEmpty = (!error && !data && !showSkeleton) || (isAutoGeoLocating && !data);

  return (
    <section className="flex flex-col gap-4">
      <div className="px-2 pt-4 pb-2 sm:px-4">
        <div className="mt-0">
          <SearchBar
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            history={history}
            onClearHistory={clearHistory}
            onRemoveHistory={removeFromHistory}
            isLoading={isLoading}
            isGeoLoading={isGeoLoading}
          />

          {/* C / F unit toggle */}
          <div className="flex justify-end mt-3 pr-1">
            <div className="flex items-center rounded-xl bg-white/10 border border-white/15 p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => unit === "imperial" && toggleUnit()}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  unit === "metric"
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow shadow-sky-900/40"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => unit === "metric" && toggleUnit()}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  unit === "imperial"
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow shadow-sky-900/40"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {showEmpty && (
          <div className="mt-8">
            <WelcomeState />
          </div>
        )}
      </div>

      {showSkeleton && <LoadingSkeleton />}

      {!showSkeleton && error && (
        <ErrorState message={error} onRetry={handleRetry} />
      )}

      {!showSkeleton && !error && data && (
        <div
          className={`grid gap-4 lg:grid-cols-[1.15fr_0.85fr] ${isUpdating ? "opacity-70" : ""}`}
        >
          <div className="flex flex-col gap-3 h-full">
            <CurrentWeatherCard data={data.current} unit={unit} localTime={localTime} isUpdating={isUpdating} />
          </div>

          <div className="flex flex-col gap-3 h-full">
            {data.forecast?.length > 0 && (
              <ForecastCard forecast={data.forecast} unit={unit} />
            )}
            {(!data.forecast || data.forecast.length === 0) && (
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
