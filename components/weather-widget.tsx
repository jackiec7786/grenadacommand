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

const GRENADA_TZ = 'America/Grenada'

export function WeatherWidget() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showManual, setShowManual] = useState(false)
  const [manualCity, setManualCity] = useState('')
  const [geocoding, setGeocoding] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const serverLoc: LocationData = await fetch('/api/location').then(r => r.json())
        let loc = serverLoc
        if (serverLoc.timezone === GRENADA_TZ) {
          try {
            const d = await fetch('https://ipapi.co/json/').then(r => r.json())
            if (d?.timezone && d.timezone !== GRENADA_TZ) {
              loc = { city: d.city ?? serverLoc.city, country: d.country_name ?? serverLoc.country, timezone: d.timezone, lat: d.latitude ?? serverLoc.lat, lon: d.longitude ?? serverLoc.lon }
            }
          } catch { /* stay with server loc */ }
        }
        setLocation(loc)
        const data: WeatherData | null = await fetch(`/api/weather?lat=${loc.lat}&lon=${loc.lon}`).then(r => r.json())
        if (data) setWeather(data)
      } catch { /* leave weather null */ } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleManualCity = async () => {
    if (!manualCity.trim()) return
    setGeocoding(true)
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(manualCity)}&count=1&language=en&format=json`)
      const data = await res.json()
      const r = data?.results?.[0]
      if (r) {
        const newLoc: LocationData = { city: r.name, country: r.country, timezone: r.timezone ?? 'UTC', lat: r.latitude, lon: r.longitude }
        setLocation(newLoc)
        const wd: WeatherData | null = await fetch(`/api/weather?lat=${r.latitude}&lon=${r.longitude}`).then(x => x.json())
        if (wd) setWeather(wd)
        setShowManual(false)
        setManualCity('')
      }
    } catch { /* ignore */ } finally {
      setGeocoding(false)
    }
  }

  const condition = weather ? getCondition(weather.weather_code) : null
  const locationLabel = location ? `${location.city}, ${location.country}` : 'Loading...'

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// {locationLabel}</div>
        <div className="flex items-center gap-3">
          {!loading && (
            <button onClick={() => setShowManual(p => !p)} className="text-[9px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all">
              {showManual ? 'Cancel' : 'Change city'}
            </button>
          )}
          {loading
            ? <span className="text-[9px] font-mono text-muted-foreground">Loading...</span>
            : weather
              ? <span className="text-[9px] font-mono text-primary">● Live</span>
              : <span className="text-[9px] font-mono text-muted-foreground">Unavailable</span>
          }
        </div>
      </div>

      {showManual && (
        <div className="flex gap-2 mb-4">
          <input
            className="bg-dim border border-border text-text font-mono text-xs px-2 py-1.5 rounded-sm focus:outline-none focus:border-accent flex-1 min-h-[40px]"
            placeholder="Enter city name..."
            value={manualCity}
            onChange={e => setManualCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleManualCity()}
            autoFocus
          />
          <button onClick={handleManualCity} disabled={!manualCity.trim() || geocoding}
            className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40 min-h-[40px]"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            {geocoding ? '...' : 'Find'}
          </button>
        </div>
      )}

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
              <div className="font-mono text-[36px] font-extrabold text-text leading-none">{Math.round(weather.temperature_2m)}°C</div>
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
        <div className="space-y-2">
          <div className="font-mono text-[11px] text-muted-foreground">Weather data unavailable.</div>
          {!showManual && (
            <button onClick={() => setShowManual(true)} className="text-[11px] font-mono text-accent hover:underline cursor-pointer">
              Enter city manually →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
