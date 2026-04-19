"use client"

import { PHASE_SCORECARDS } from '@/lib/data'
import { Check } from 'lucide-react'

interface WeeklyScorecardProps {
  currentPhase: number
  currentWeek: number
  onWeekChange: (week: number) => void
  scores: Record<string, Record<number, boolean>>
  onScoreToggle: (weekKey: string, index: number) => void
}

export function WeeklyScorecard({ currentPhase, currentWeek, onWeekChange, scores, onScoreToggle }: WeeklyScorecardProps) {
  const weekKey = `p${currentPhase}w${currentWeek}`
  const weekItems = PHASE_SCORECARDS[currentPhase]?.[currentWeek] || []
  const weekScores = scores[weekKey] || {}
  const doneCount = Object.values(weekScores).filter(Boolean).length
  const total = weekItems.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const msgs = ['Start anywhere.', 'Keep going.', 'Halfway there.', 'Nearly done.', 'Week complete ✓']
  const msgIndex = Math.min(4, total > 0 ? Math.floor((doneCount / total) * 4) : 0)

  const phaseColors: Record<number, string> = {
    1: 'var(--danger)',
    2: 'var(--warn)',
    3: 'var(--accent2)',
    4: 'var(--accent)',
  }
  const color = phaseColors[currentPhase] || 'var(--accent2)'

  return (
    <div
      className="bg-surface border border-border rounded-md p-5 animate-fade-slide-in"
      style={{ borderTopWidth: 2, borderTopColor: color, animationDelay: '0.05s' }}
    >
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-3">
        // Phase {currentPhase} Weekly Scorecard
      </div>

      {/* Week Tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {[1, 2, 3, 4].map(w => (
          <button
            key={w}
            onClick={() => onWeekChange(w)}
            className="text-[10px] font-mono px-2.5 py-1 rounded-sm border cursor-pointer transition-all tracking-[0.1em]"
            style={currentWeek === w
              ? { background: color, color: 'var(--bg)', borderColor: color, fontWeight: 600 }
              : { borderColor: 'var(--border)', color: 'var(--muted)' }
            }
          >
            Week {w}
          </button>
        ))}
      </div>

      {/* Score Items */}
      <div className="flex flex-col gap-2.5">
        {weekItems.map((text, i) => {
          const isDone = !!weekScores[i]
          return (
            <div
              key={i}
              onClick={() => onScoreToggle(weekKey, i)}
              className={`flex items-start gap-3 cursor-pointer p-2 px-2.5 rounded border transition-all ${
                isDone ? 'border-transparent' : 'border-transparent hover:border-border hover:bg-surface2'
              }`}
            >
              <div
                className="w-5 h-5 border-2 rounded-sm shrink-0 flex items-center justify-center transition-all mt-0.5"
                style={isDone ? { background: color, borderColor: color } : { borderColor: 'var(--muted)' }}
              >
                {isDone && <Check className="w-3 h-3 text-bg" strokeWidth={3} />}
              </div>
              <span className={`text-[13px] leading-relaxed ${isDone ? 'text-muted-foreground line-through' : 'text-text'}`}>
                {text}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress */}
      <div className="mt-3.5 pt-3.5 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[22px] font-bold" style={{ color }}>{doneCount}/{total}</div>
          <div className="text-[11px] text-muted-foreground">{msgs[msgIndex]}</div>
        </div>
        <div className="h-1.5 bg-dim rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? 'var(--accent)' : color }}
          />
        </div>
      </div>
    </div>
  )
}
