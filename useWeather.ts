'use client';

import { useEffect, useState } from 'react';

// =========================================================================
// WEATHER LOGIC (no styling in this file)
// =========================================================================

const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';

export type WeatherData = {
  location: string;
  temp: string;
  condition: string;
  humidity: string;
  wind: string;
  rainChance: string;
  loading: boolean;
};

const DEFAULT_WEATHER: WeatherData = {
  location: 'St. Elizabeth, JA',
  temp: '29°C',
  condition: 'Optimal Spraying Weather',
  humidity: '68%',
  wind: '12 km/h',
  rainChance: '15%',
  loading: true,
};

export function useWeather(): WeatherData {
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);

  useEffect(() => {
    const stopLoading = () =>
      setWeather((prev) => ({ ...prev, loading: false }));

    if (typeof window === 'undefined' || !navigator.geolocation) {
      stopLoading();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
          );
          if (res.ok) {
            const data = await res.json();
            setWeather({
              location: `${data.name}, JA`,
              temp: `${Math.round(data.main.temp)}°C`,
              condition: data.weather[0].main,
              humidity: `${data.main.humidity}%`,
              wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
              rainChance: '10%',
              loading: false,
            });
          } else {
            stopLoading();
          }
        } catch (err) {
          console.error('Weather API fetch failed:', err);
          stopLoading();
        }
      },
      () => stopLoading()
    );
  }, []);

  return weather;
}
