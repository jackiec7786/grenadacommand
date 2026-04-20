"use client"

import { useState, useEffect } from 'react'

interface LocationData {
  city: string
  country: string
  timezone: string
  lat: number
  lon: number
}

interface WeatherData {
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  wind_speed_10m: number
  weather_code: number
}

function getCondition(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: '☀️', label: 'Clear' }
  if (code <= 3) return { emoji: '⛅', label: 'Partly Cloudy' }
  if (code === 45 || code === 48) return { emoji: '🌫️', label: 'Foggy' }
  if (code >= 51 && code <= 55) return { emoji: '🌦️', label: 'Drizzle' }
  if (code >= 61 && code <= 65) return { emoji: '🌧️', label: 'Rain' }
  if (code >= 71 && code <= 77) return { emoji: '❄️', label: 'Snow' }
  if (code >= 80 && code <= 82) return { emoji: '🌧️', label: 'Showers' }
  if (code === 95) return { emoji: '⛈️', label: 'Thunderstorm' }
  if (code === 96 || code === 99) return { emoji: '⛈️', label: 'Severe Storm' }
  return { emoji: '🌡️', label: 'Unknown' }
}

export function WeatherWidget() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/location')
      .then(r => r.json())
      .then((loc: LocationData) => {
        setLocation(loc)
        return fetch(`/api/weather?lat=${loc.lat}&lon=${loc.lon}`)
      })
      .then(r => r.json())
      .then((data: WeatherData | null) => { if (data) setWeather(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const condition = weather ? getCondition(weather.weather_code) : null
  const locationLabel = location ? `${location.city}, ${location.country}` : 'Loading...'

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// {locationLabel}</div>
        {loading
          ? <span className="text-[9px] font-mono text-muted-foreground">Loading...</span>
          : weather
            ? <span className="text-[9px] font-mono text-primary">● Live</span>
            : <span className="text-[9px] font-mono text-muted-foreground">Unavailable</span>
        }
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-dim rounded w-32" />
          <div className="h-3 bg-dim rounded w-48" />
        </div>
      ) : weather && condition ? (
        <>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl leading-none">{condition.emoji}</span>
            <div>
              <div className="font-mono text-[36px] font-extrabold text-text leading-none">
                {Math.round(weather.temperature_2m)}°C
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">{condition.label}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="font-mono text-[10px] text-muted-foreground">Feels like</div>
              <div className="font-mono text-[13px] font-semibold text-text">{Math.round(weather.apparent_temperature)}°C</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[10px] text-muted-foreground">Humidity</div>
              <div className="font-mono text-[13px] font-semibold text-text">{weather.relative_humidity_2m}%</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[10px] text-muted-foreground">Wind</div>
              <div className="font-mono text-[13px] font-semibold text-text">{Math.round(weather.wind_speed_10m)} km/h</div>
            </div>
          </div>
        </>
      ) : (
        <div className="font-mono text-[11px] text-muted-foreground">Weather data unavailable</div>
      )}
    </div>
  )
}
