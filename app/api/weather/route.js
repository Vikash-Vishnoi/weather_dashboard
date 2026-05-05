import { fetchWeatherByCity, fetchWeatherByCoords, WeatherAPIError } from "@/lib/weather-api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const unit = searchParams.get("unit") || "metric";

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Weather API key not configured. Please add OPENWEATHER_API_KEY to your .env.local file." },
      { status: 500 }
    );
  }

  try {
    let data;
    if (lat && lon) {
      data = await fetchWeatherByCoords(parseFloat(lat), parseFloat(lon), unit, apiKey);
    } else if (city) {
      data = await fetchWeatherByCity(city, unit, apiKey);
    } else {
      return Response.json({ error: "Provide a city name or coordinates." }, { status: 400 });
    }

    return Response.json(data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    if (err instanceof WeatherAPIError) {
      return Response.json({ error: err.message }, { status: err.statusCode || 500 });
    }
    return Response.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}
