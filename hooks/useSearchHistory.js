"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "weather_search_history";
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const addToHistory = useCallback((city, country) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.city.toLowerCase() !== city.toLowerCase()
      );
      const updated = [
        { city, country, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const removeFromHistory = useCallback((cityToRemove) => {
    setHistory((prev) => {
      const updated = prev.filter(
        (item) => item.city.toLowerCase() !== cityToRemove.toLowerCase()
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return { history, addToHistory, clearHistory, removeFromHistory };
}
