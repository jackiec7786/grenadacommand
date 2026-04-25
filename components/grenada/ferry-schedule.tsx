"use client"

import { useState, useEffect } from 'react'
import type { FerryBooking } from '@/app/api/grenada/ferry/route'

type Direction = 'stg_to_car' | 'car_to_stg'

const SCHEDULE: Record<Direction, { time: string; days: string; note?: string }[]> = {
  stg_to_car: [
    { time: '09:00', days: 'Mon–Sat', note: 'Express' },
    { time: '11:30', days: 'Mon–Sat' },
    { time: '17:00', days: 'Mon–Sat', note: 'Express' },
    { time: '09:00', days: 'Sun' },
  ],
  car_to_stg: [
    { time: '06:00', days: 'Mon–Sat', note: 'Express' },
    { time: '09:30', days: 'Mon–Sat' },
    { time: '15:30', days: 'Mon–Sat', note: 'Express' },
    { time: '06:00', days: 'Sun' },
  ],
}

const DIR_LABEL: Record<Direction, string> = {
  stg_to_car: "St. George's → Carriacou",
  car_to_stg: "Carriacou → St. George's",
}

function nextDeparture(dir: Direction): string | null {
  const now = new Date()
  const day = now.getDay()
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  for (const s of SCHEDULE[dir]) {
    const forToday = s.days === 'Mon–Sat' ? day >= 1 && day <= 6 : day === 0
    if (forToday && s.time > hhmm) return s.time
  }
  // First departure next day
  for (const s of SCHEDULE[dir]) {
    const tomorrowDay = (day + 1) % 7
    const valid = s.days === 'Mon–Sat' ? tomorrowDay >= 1 && tomorrowDay <= 6 : tomorrowDay === 0
    if (valid) return `Tomorrow ${s.time}`
  }
  return null
}

const inp = 'bg-dim border border-border text-text font-mono text-xs px-2 py-1.5 rounded-sm focus:outline-none focus:border-accent'

export function FerrySchedule() {
  const [dir, setDir] = useState<Direction>('stg_to_car')
  const [bookings, setBookings] = useState<FerryBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [showBook, setShowBook] = useState(false)
  const [bookDate, setBookDate] = useState('')
  const [bookTime, setBookTime] = useState('')
  const [bookNotes, setBookNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/grenada/ferry')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setBookings(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addBooking = async () => {
    if (!bookDate || !bookTime) return
    setSaving(true)
    try {
      const res = await fetch('/api/grenada/ferry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: bookDate, time: bookTime, direction: dir, notes: bookNotes }),
      }).then(r => r.json())
      if (res?.ok) {
        const newBooking: FerryBooking = { id: res.id, date: bookDate, time: bookTime, direction: dir, notes: bookNotes, createdAt: new Date().toISOString() }
        setBookings(prev => [...prev, newBooking].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)))
        setBookDate('')
        setBookTime('')
        setBookNotes('')
        setShowBook(false)
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const removeBooking = async (id: string) => {
    await fetch('/api/grenada/ferry', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = bookings.filter(b => b.date >= today)
  const next = nextDeparture(dir)

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Osprey Lines Ferry</div>
        {next && <span className="text-[9px] font-mono text-primary">Next: {next}</span>}
      </div>

      <div className="flex gap-1 mb-4">
        {(['stg_to_car', 'car_to_stg'] as Direction[]).map(d => (
          <button
            key={d}
            onClick={() => setDir(d)}
            className="flex-1 py-1.5 rounded-sm font-mono text-[10px] cursor-pointer border transition-all"
            style={dir === d
              ? { background: 'var(--accent2)', color: 'var(--bg)', borderColor: 'var(--accent2)' }
              : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
            }
          >
            {d === 'stg_to_car' ? 'STG → CAR' : 'CAR → STG'}
          </button>
        ))}
      </div>

      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-2">
        Schedule · {DIR_LABEL[dir]}
      </div>
      <div className="space-y-1.5 mb-4">
        {SCHEDULE[dir].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="font-mono text-[13px] font-semibold text-text w-12 shrink-0">{s.time}</span>
            <span className="font-mono text-[10px] text-muted-foreground flex-1">{s.days}</span>
            {s.note && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm shrink-0"
                style={{ background: 'var(--accent2)20', color: 'var(--accent2)' }}>
                {s.note}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em]">My Trips</div>
          <button
            onClick={() => setShowBook(p => !p)}
            className="text-[9px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all"
          >
            {showBook ? 'Cancel' : '+ Plan Trip'}
          </button>
        </div>

        {showBook && (
          <div className="space-y-2 mb-3">
            <div className="flex gap-2">
              <input
                type="date"
                className={`${inp} flex-1`}
                value={bookDate}
                min={today}
                onChange={e => setBookDate(e.target.value)}
              />
              <select
                className={`${inp} w-24 cursor-pointer`}
                value={bookTime}
                onChange={e => setBookTime(e.target.value)}
              >
                <option value="">Time</option>
                {SCHEDULE[dir].map(s => (
                  <option key={s.time} value={s.time}>{s.time}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <input
                className={`${inp} flex-1`}
                placeholder="Notes (optional)"
                value={bookNotes}
                onChange={e => setBookNotes(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addBooking()}
              />
              <button
                onClick={addBooking}
                disabled={!bookDate || !bookTime || saving}
                className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40"
                style={{ background: 'var(--accent2)', color: 'var(--bg)' }}
              >
                {saving ? '...' : 'Add'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-1.5">
            {[1, 2].map(i => <div key={i} className="h-5 bg-dim rounded" />)}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="font-mono text-[11px] text-muted-foreground">No upcoming trips planned.</div>
        ) : (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {upcoming.map(b => (
              <div key={b.id} className="flex items-center gap-2 group">
                <span className="font-mono text-[10px] text-muted-foreground w-20 shrink-0">{b.date}</span>
                <span className="font-mono text-[11px] font-semibold text-text w-12 shrink-0">{b.time}</span>
                <span className="font-mono text-[9px] text-muted-foreground flex-1 truncate">
                  {DIR_LABEL[b.direction]}
                </span>
                <button
                  onClick={() => removeBooking(b.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all shrink-0"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
