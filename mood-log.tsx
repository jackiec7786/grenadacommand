"use client"

import { type MoodEntry } from '@/lib/data'

interface MoodLogProps {
  mood: MoodEntry[]
  onLogMood: (level: MoodEntry['level']) => void
}

const MOOD_CONFIG = {
  green:  { emoji: '🟢', label: 'Strong',   color: 'var(--accent)',  bg: 'rgba(45,255,110,0.08)'  },
  yellow: { emoji: '🟡', label: 'Okay',     color: 'var(--warn)',    bg: 'rgba(255,140,66,0.08)'  },
  red:    { emoji: '🔴', label: 'Rough',    color: 'var(--danger)',  bg: 'rgba(255,68,87,0.08)'   },
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

function getLast30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export function MoodLog({ mood, onLogMood }: MoodLogProps) {
  const today = getTodayStr()
  const todayEntry = mood.find(m => m.date === today)
  const moodMap: Record<string, MoodEntry['level']> = {}
  mood.forEach(m => { moodMap[m.date] = m.level })

  const last30 = getLast30Days()
  const greenCount = mood.filter(m => m.level === 'green').length
  const yellowCount = mood.filter(m => m.level === 'yellow').length
  const redCount = mood.filter(m => m.level === 'red').length

  return (
    <div className="bg-surface border border-border rounded-md p-5 border-t-2" style={{ borderTopColor: 'var(--accent2)' }}>
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">
        // Daily Energy Log
      </div>

      {/* Today's log */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-muted-foreground mb-2">
          {todayEntry ? `Today: ${MOOD_CONFIG[todayEntry.level].label}` : 'How is today?'}
        </div>
        <div className="flex gap-2">
          {(['green', 'yellow', 'red'] as const).map(level => {
            const cfg = MOOD_CONFIG[level]
            const isSelected = todayEntry?.level === level
            return (
              <button
                key={level}
                onClick={() => onLogMood(level)}
                className="flex-1 py-2.5 rounded-sm border font-mono text-[11px] tracking-[0.1em] uppercase font-semibold cursor-pointer transition-all flex flex-col items-center gap-1"
                style={{
                  borderColor: isSelected ? cfg.color : 'var(--border)',
                  background: isSelected ? cfg.bg : 'var(--surface2)',
                  color: isSelected ? cfg.color : 'var(--muted)',
                }}
              >
                <span className="text-[18px]">{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 30-day grid */}
      <div className="mb-4">
        <div className="text-[9px] font-mono text-muted-foreground mb-2 tracking-[0.1em] uppercase">
          Last 30 days
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
          {last30.map(date => {
            const level = moodMap[date]
            const cfg = level ? MOOD_CONFIG[level] : null
            return (
              <div
                key={date}
                className="aspect-square rounded-sm"
                style={{
                  background: cfg ? cfg.bg : 'var(--dim)',
                  border: `1px solid ${cfg ? cfg.color + '60' : 'transparent'}`,
                }}
                title={date}
              />
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-4 pt-3 border-t border-border">
        {(['green', 'yellow', 'red'] as const).map(level => {
          const cfg = MOOD_CONFIG[level]
          const count = level === 'green' ? greenCount : level === 'yellow' ? yellowCount : redCount
          return (
            <div key={level} className="flex items-center gap-1.5">
              <span className="text-[12px]">{cfg.emoji}</span>
              <span className="font-mono text-[11px]" style={{ color: cfg.color }}>{count}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{cfg.label}</span>
            </div>
          )
        })}
      </div>

      {redCount > greenCount && redCount > 2 && (
        <div className="mt-3 text-[11px] font-mono text-muted-foreground border-t border-border pt-3">
          Rough patch. Do not make strategic decisions on red days. Execute the plan.
        </div>
      )}
    </div>
  )
}
