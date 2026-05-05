export function formatTemp(temp, unit) {
  return `${temp}°${unit === "metric" ? "C" : "F"}`;
}

export function formatWindSpeed(speed, unit) {
  return unit === "metric" ? `${speed} m/s` : `${speed} mph`;
}

export function getWindDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatTime(unix, timezone) {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

export function getDayName(unix) {
  return new Date(unix * 1000).toLocaleDateString("en-US", { weekday: "short" });
}

export function getWeatherGradient(conditionId, isDay) {
  if (conditionId >= 200 && conditionId < 300) {
    return "from-slate-900 via-slate-700 to-indigo-900";
  }
  if (conditionId >= 300 && conditionId < 600) {
    return "from-slate-700 via-blue-900 to-slate-800";
  }
  if (conditionId >= 600 && conditionId < 700) {
    return "from-blue-100 via-slate-200 to-blue-300";
  }
  if (conditionId >= 700 && conditionId < 800) {
    return "from-slate-500 via-slate-400 to-slate-600";
  }
  if (conditionId === 800) {
    return isDay
      ? "from-sky-400 via-blue-500 to-indigo-600"
      : "from-indigo-950 via-slate-900 to-slate-950";
  }
  if (conditionId > 800) {
    return isDay
      ? "from-slate-400 via-blue-400 to-slate-500"
      : "from-slate-800 via-slate-700 to-slate-900";
  }
  return "from-sky-500 via-blue-600 to-indigo-700";
}

export function isDay(sunrise, sunset, dt) {
  return dt > sunrise && dt < sunset;
}

export function getVisibilityLabel(meters) {
  if (meters >= 10000) return "Excellent";
  if (meters >= 5000) return "Good";
  if (meters >= 2000) return "Moderate";
  if (meters >= 1000) return "Poor";
  return "Very Poor";
}

export function formatVisibility(meters) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}

