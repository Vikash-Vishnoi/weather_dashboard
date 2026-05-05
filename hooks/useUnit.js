"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "weather_unit";

export function useUnit() {
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "metric" || stored === "imperial") setUnit(stored);
    } catch {}
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === "metric" ? "imperial" : "metric";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  return { unit, toggleUnit };
}
