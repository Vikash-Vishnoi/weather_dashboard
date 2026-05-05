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

