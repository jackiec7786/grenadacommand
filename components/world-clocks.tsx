"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Clock, MapPin } from 'lucide-react'

interface TimeZone {
  id: string
  city: string
  timezone: string
}

const TIME_ZONES: TimeZone[] = [
  { id: 'grenada',  city: 'Grenada',  timezone: 'America/Grenada' },
  { id: 'newyork',  city: 'New York', timezone: 'America/New_York' },
  { id: 'london',   city: 'London',   timezone: 'Europe/London' },
  { id: 'karachi',  city: 'Karachi',  timezone: 'Asia/Karachi' },
  { id: 'dubai',    city: 'Dubai',    timezone: 'Asia/Dubai' },
  { id: 'tokyo',    city: 'Tokyo',    timezone: 'Asia/Tokyo' },
]

function formatTime(date: Date, timezone: string) {
  return date.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
}

function formatDate(date: Date, timezone: string) {
  return date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric' })
}

function getTimeDiff(timezone: string) {
  const now = new Date()
  const target = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
  const local = new Date(now.toLocaleString('en-US'))
  const diff = Math.round((target.getTime() - local.getTime()) / (1000 * 60 * 60))
  return diff === 0 ? 'Local' : diff > 0 ? `+${diff}h` : `${diff}h`
}

function isDaytime(date: Date, timezone: string) {
  const h = parseInt(date.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', hour12: false }))
  return h >= 6 && h < 20
}

export function WorldClocks() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userTimezone] = useState(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return 'America/Grenada' }
  })

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const midnight = (() => {
    const now = new Date(currentTime.toLocaleString('en-US', { timeZone: userTimezone }))
    const m = new Date(now)
    m.setHours(24, 0, 0, 0)
    const diff = m.getTime() - now.getTime()
    const h = Math.floor(diff / (1000 * 60 * 60))
    const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const sec = Math.floor((diff % (1000 * 60)) / 1000)
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  })()

  const primaryTz = userTimezone === 'America/Grenada' ? 'America/Grenada' : userTimezone
  const primaryLabel = userTimezone === 'America/Grenada' ? 'Grenada' : 'Local Time'

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wide text-text">
          <Globe className="h-4 w-4 text-primary" />
          WORLD CLOCKS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-surface2 rounded-md p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-mono tracking-wider text-primary uppercase">Local Time — {primaryLabel}</span>
          </div>
          <div className="text-2xl font-bold font-mono text-text tracking-tight">
            {formatTime(currentTime, primaryTz)}
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-1">
            {formatDate(currentTime, primaryTz)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {TIME_ZONES.filter(tz => tz.timezone !== primaryTz).map(tz => {
            const isDay = isDaytime(currentTime, tz.timezone)
            return (
              <div key={tz.id} className={`rounded-md p-3 border transition-colors ${isDay ? 'bg-surface2/50 border-border' : 'bg-surface border-dim'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">{tz.city}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isDay ? 'bg-warn/20 text-warn' : 'bg-purple/20 text-purple'}`}>
                    {isDay ? 'DAY' : 'NIGHT'}
                  </span>
                </div>
                <div className="text-base font-bold font-mono text-text">{formatTime(currentTime, tz.timezone)}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] font-mono text-muted-foreground">{formatDate(currentTime, tz.timezone)}</span>
                  <span className="text-[9px] font-mono text-accent2">{getTimeDiff(tz.timezone)}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-dim/30 rounded-md p-3 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Until Midnight</span>
            </div>
            <span className="text-sm font-mono font-bold text-purple">{midnight}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
