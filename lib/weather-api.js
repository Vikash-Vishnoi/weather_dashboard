const BASE_URL = "https://api.openweathermap.org/data/2.5";

export class WeatherAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "WeatherAPIError";
  }
}

export async function fetchWeatherByCity(city, unit = "metric", apiKey) {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${apiKey}`,
      { next: { revalidate: 300 } }
    ),
    fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${apiKey}`,
      { next: { revalidate: 300 } }
    ),
  ]);

  if (!currentRes.ok) {
    if (currentRes.status === 404) {
      throw new WeatherAPIError("City not found. Please check the spelling and try again.", 404);
    }
    if (currentRes.status === 401) {
      throw new WeatherAPIError("Invalid API key.", 401);
    }
    throw new WeatherAPIError("Failed to fetch weather data. Please try again.", currentRes.status);
  }

  const [currentData, forecastData] = await Promise.all([
    currentRes.json(),
    forecastRes.json(),
  ]);

  return parseWeatherData(currentData, forecastData);
}

export async function fetchWeatherByCoords(lat, lon, unit = "metric", apiKey) {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`,
      { next: { revalidate: 300 } }
    ),
    fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`,
      { next: { revalidate: 300 } }
    ),
  ]);

  if (!currentRes.ok) {
    throw new WeatherAPIError("Failed to fetch weather for your location.", currentRes.status);
  }

  const [currentData, forecastData] = await Promise.all([
    currentRes.json(),
    forecastRes.json(),
  ]);

  return parseWeatherData(currentData, forecastData);
}

function parseWeatherData(currentData, forecastData) {
  const current = {
    city: currentData.name,
    country: currentData.sys.country,
    temp: Math.round(currentData.main.temp),
    feels_like: Math.round(currentData.main.feels_like),
    temp_min: Math.round(currentData.main.temp_min),
    temp_max: Math.round(currentData.main.temp_max),
    humidity: currentData.main.humidity,
    wind_speed: currentData.wind.speed,
    wind_deg: currentData.wind.deg,
    visibility: currentData.visibility,
    pressure: currentData.main.pressure,
    sunrise: currentData.sys.sunrise,
    sunset: currentData.sys.sunset,
    condition: currentData.weather[0],
    dt: currentData.dt,
    timezone: currentData.timezone,
    coord: currentData.coord,
  };

  const dailyMap = new Map();
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) dailyMap.set(date, []);
    dailyMap.get(date).push(item);
  });

  const today = new Date().toDateString();
  const forecast = [];

  dailyMap.forEach((items, date) => {
    if (date === today || forecast.length >= 5) return;
    const midday = items.find((i) => {
      const h = new Date(i.dt * 1000).getHours();
      return h >= 11 && h <= 14;
    }) || items[Math.floor(items.length / 2)];

    forecast.push({
      dt: midday.dt,
      temp_max: Math.round(Math.max(...items.map((i) => i.main.temp_max))),
      temp_min: Math.round(Math.min(...items.map((i) => i.main.temp_min))),
      humidity: Math.round(
        items.reduce((a, i) => a + i.main.humidity, 0) / items.length
      ),
      wind_speed: midday.wind.speed,
      condition: midday.weather[0],
      pop: Math.round(Math.max(...items.map((i) => i.pop)) * 100),
    });
  });

  return { current, forecast: forecast.slice(0, 5) };
}
