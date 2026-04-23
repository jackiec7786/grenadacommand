"use client"

import { useState, useEffect } from 'react'
import { PHASE_CONFIGS, PHASE_INCOME_TARGETS, TASKS, type MoodEntry, type AppState } from '@/lib/data'

interface MorningBriefProps {
  state: AppState
  totalIncome: number
  onLogMood: (level: MoodEntry['level']) => void
  onLogToday: () => void
}

function getTodayStr() { return new Date().toISOString().slice(0, 10) }
function getPlanWeek(start: string) {
  if (!start) return { week: 1, month: 1 }
  const days = Math.max(0, Math.floor((Date.now() - new Date(start).getTime()) / 86400000))
  return { week: Math.ceil((days + 1) / 7), month: Math.min(12, Math.ceil((days + 1) / 30)) }
}

const GREETINGS = [
  'Good morning. One thing at a time.',
  'New day. Same plan. Execute.',
  'The gap between now and stable income closes today.',
  'Consistent beats clever. Start.',
  'You are further along than it feels. Keep going.',
]

export function MorningBrief({ state, totalIncome, onLogMood, onLogToday }: MorningBriefProps) {
  const [locationTz, setLocationTz] = useState({ timezone: 'America/Grenada', city: 'Grenada' })
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetch('/api/location')
      .then(r => r.json())
      .then(data => {
        if (data?.timezone) setLocationTz({ timezone: data.timezone, city: data.city })
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const today = getTodayStr()
  const { week, month } = getPlanWeek(state.planStartDate || '')
  const config = PHASE_CONFIGS[state.currentPhase as keyof typeof PHASE_CONFIGS]
  const target = PHASE_INCOME_TARGETS[state.currentPhase]
  const weeksRunway = state.cash > 0 ? Math.floor((state.cash / 1300) * 4.33) : 0
  const todayMood = (state.mood || []).find(m => m.date === today)?.level
  const loggedToday = state.lastActiveDate === today
  const goalPct = Math.min(100, Math.round((totalIncome / target) * 100))

  // Today's one priority task (first incomplete)
  const phaseKey = `p${state.currentPhase}`
  const phaseTasks = TASKS[state.currentPhase] || []
  const phaseDone = state.tasks?.[phaseKey] || {}
  const nextTask = phaseTasks.find((_, i) => !phaseDone[i])

  // Greeting — deterministic per day
  const dayHash = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const greeting = GREETINGS[dayHash % GREETINGS.length]

  const runwayColor = weeksRunway < 4 ? 'var(--danger)' : weeksRunway < 8 ? 'var(--warn)' : 'var(--accent)'
  const moodColors = { green: 'var(--accent)', yellow: 'var(--warn)', red: 'var(--danger)' }

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: locationTz.timezone })
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: locationTz.timezone })

  return (
    <div
      className="rounded-md p-5 border mb-6"
      style={{ borderColor: config.cssColor + '40', background: config.cssColor + '06' }}
    >
      {/* Time + greeting */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-[32px] font-extrabold leading-none text-text">{timeStr}</div>
          <div className="font-mono text-[11px] text-muted-foreground mt-1">{dateStr} · {locationTz.city}</div>
        </div>
        <div className="text-right">
          <div
            className="inline-block text-[9px] font-mono font-bold px-2.5 py-1 rounded-sm uppercase mb-1"
            style={{ background: config.cssColor, color: 'var(--bg)' }}
          >
            {config.name}
          </div>
          {state.planStartDate && (
            <div className="font-mono text-[10px] text-muted-foreground">Week {week} · Month {month}</div>
          )}
        </div>
      </div>

      <div className="text-[12px] font-mono text-muted-foreground mb-5 italic">{greeting}</div>

      {/* Key numbers — 4 stats */}
      <div className="grid grid-cols-4 gap-3 mb-5 max-[600px]:grid-cols-2">
        <div className="bg-surface rounded-sm p-2.5 border border-border text-center">
          <div className="font-mono text-[20px] font-bold leading-none" style={{ color: runwayColor }}>
            {weeksRunway || '—'}
          </div>
          <div className="font-mono text-[8px] text-muted-foreground uppercase mt-1 tracking-[0.1em]">Wks runway</div>
        </div>
        <div className="bg-surface rounded-sm p-2.5 border border-border text-center">
          <div className="font-mono text-[20px] font-bold leading-none" style={{ color: config.cssColor }}>
            ${totalIncome.toLocaleString()}
          </div>
          <div className="font-mono text-[8px] text-muted-foreground uppercase mt-1 tracking-[0.1em]">This month</div>
          <div className="mt-1 h-1 bg-dim rounded-sm overflow-hidden">
            <div className="h-full rounded-sm" style={{ width: `${goalPct}%`, background: config.cssColor }} />
          </div>
        </div>
        <div className="bg-surface rounded-sm p-2.5 border border-border text-center">
          <div className="font-mono text-[20px] font-bold leading-none text-purple">
            {state.streakDays || 0}
          </div>
          <div className="font-mono text-[8px] text-muted-foreground uppercase mt-1 tracking-[0.1em]">Day streak</div>
        </div>
        <div className="bg-surface rounded-sm p-2.5 border border-border text-center">
          <div className="font-mono text-[20px] font-bold leading-none text-muted-foreground">
            {goalPct}%
          </div>
          <div className="font-mono text-[8px] text-muted-foreground uppercase mt-1 tracking-[0.1em]">Of goal</div>
        </div>
      </div>

      {/* Today's one priority */}
      {nextTask && (
        <div
          className="p-3 rounded-sm border mb-4"
          style={{ borderColor: config.cssColor + '50', background: config.cssColor + '0a' }}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] mb-1.5" style={{ color: config.cssColor }}>
            Today's priority
          </div>
          <div className="text-[13px] font-semibold text-text">{nextTask.label}</div>
          <div className="font-mono text-[9px] text-muted-foreground mt-1">{nextTask.tag} · {nextTask.time}</div>
        </div>
      )}

      {/* Mood + streak logging */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-[10px] font-mono text-muted-foreground">How is today?</div>
        <div className="flex gap-1.5">
          {(['green', 'yellow', 'red'] as const).map(level => (
            <button
              key={level}
              onClick={() => onLogMood(level)}
              className="text-[10px] font-mono px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all"
              style={todayMood === level
                ? { background: moodColors[level], color: 'var(--bg)', borderColor: moodColors[level] }
                : { borderColor: 'var(--border)', color: 'var(--muted)' }
              }
            >
              {level === 'green' ? '🟢' : level === 'yellow' ? '🟡' : '🔴'}
            </button>
          ))}
        </div>
        <button
          onClick={onLogToday}
          disabled={loggedToday}
          className="text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all disabled:opacity-50 disabled:cursor-default ml-auto"
          style={loggedToday
            ? { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent)10' }
            : { borderColor: 'var(--border)', color: 'var(--muted)' }
          }
        >
          {loggedToday ? '✓ Logged today' : 'Log active day'}
        </button>
      </div>
    </div>
  )
}
