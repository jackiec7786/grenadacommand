"use client"

import { useState } from 'react'
import { PHASES, MILESTONES, PHASE_CONFIGS } from '@/lib/data'

interface ProgressDashboardProps {
  currentPhase: number
  milestones: Record<string, boolean>
  onMilestoneToggle: (id: string) => void
}

export function ProgressDashboard({ currentPhase, milestones, onMilestoneToggle }: ProgressDashboardProps) {
  const [showNext, setShowNext] = useState(false)
  const totalDone = Object.values(milestones).filter(Boolean).length
  const overallPct = Math.round((totalDone / MILESTONES.length) * 100)

  const currentMilestones = MILESTONES.filter(m => m.phase === currentPhase)
  const nextMilestones = MILESTONES.filter(m => m.phase === currentPhase + 1)
  const currentDone = currentMilestones.filter(m => milestones[m.id]).length

  return (
    <div className="bg-surface border border-border rounded-md p-5 animate-fade-slide-in" style={{ borderTopWidth: 2, borderTopColor: 'var(--purple)', animationDelay: '0.15s' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Plan Progress</div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-20 bg-dim rounded-sm overflow-hidden">
            <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${overallPct}%`, background: 'var(--purple)' }} />
          </div>
          <span className="font-mono text-[11px] text-purple">{overallPct}%</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 max-[600px]:grid-cols-2">
        {PHASES.map(phase => {
          const cfg = PHASE_CONFIGS[phase.n as keyof typeof PHASE_CONFIGS]
          const isCurrent = phase.n === currentPhase
          const isComplete = phase.n < currentPhase
          const phaseMilestones = MILESTONES.filter(m => m.phase === phase.n)
          const phaseDone = phaseMilestones.filter(m => milestones[m.id]).length
          const phasePct = Math.round((phaseDone / phaseMilestones.length) * 100)
          return (
            <div key={phase.n} className="border rounded p-3 text-center transition-all"
              style={isCurrent ? { borderColor: cfg.cssColor, background: cfg.cssColor + '0d' }
                : isComplete ? { borderColor: 'var(--accent)', background: 'rgba(45,255,110,0.04)' }
                : { borderColor: 'var(--border)' }}>
              <div className="font-mono text-xl font-bold leading-none mb-0.5"
                style={{ color: isCurrent ? cfg.cssColor : isComplete ? 'var(--accent)' : 'var(--muted)' }}>
                {isComplete ? '✓' : phase.n}
              </div>
              <div className="text-[9px] tracking-[0.1em] uppercase mb-1"
                style={{ color: isCurrent ? cfg.cssColor : isComplete ? 'var(--accent)' : 'var(--muted)' }}>
                {phase.name}
              </div>
              <div className="text-[8px] font-mono text-muted-foreground">{phaseDone}/{phaseMilestones.length}</div>
              <div className="mt-1 h-0.5 bg-dim rounded-sm overflow-hidden">
                <div className="h-full rounded-sm"
                  style={{ width: `${phasePct}%`, background: isCurrent ? cfg.cssColor : isComplete ? 'var(--accent)' : 'var(--muted)' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Current phase milestones */}
      <div className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground uppercase mb-2">
        Phase {currentPhase} — {currentDone}/{currentMilestones.length} done
      </div>
      <div className="flex flex-col gap-2">
        {currentMilestones.map(milestone => {
          const isDone = !!milestones[milestone.id]
          const cfg = PHASE_CONFIGS[milestone.phase as keyof typeof PHASE_CONFIGS]
          return (
            <div key={milestone.id} onClick={() => onMilestoneToggle(milestone.id)}
              className={`flex items-center gap-2.5 p-2 px-2.5 rounded-sm bg-surface2 border cursor-pointer transition-all hover:border-purple ${isDone ? 'border-border opacity-60' : 'border-border'}`}>
              <div className="w-2.5 h-2.5 rounded-full border-2 shrink-0 transition-all"
                style={isDone ? { background: cfg.cssColor, borderColor: cfg.cssColor } : { borderColor: 'var(--muted)' }} />
              <span className={`text-xs flex-1 ${isDone ? 'text-muted-foreground line-through' : 'text-text'}`}>{milestone.text}</span>
              <span className="font-mono text-[9px] text-muted-foreground shrink-0">{milestone.month}</span>
            </div>
          )
        })}
      </div>

      {/* Next phase (collapsed) */}
      {nextMilestones.length > 0 && currentPhase < 4 && (
        <div className="mt-3 pt-3 border-t border-border">
          <button onClick={() => setShowNext(p => !p)}
            className="text-[10px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all flex items-center gap-1.5 min-h-[36px]">
            {showNext ? '▼' : '▶'} Phase {currentPhase + 1} milestones ({nextMilestones.filter(m => milestones[m.id]).length}/{nextMilestones.length} done)
          </button>
          {showNext && (
            <div className="flex flex-col gap-1.5 mt-2">
              {nextMilestones.map(milestone => {
                const isDone = !!milestones[milestone.id]
                const cfg = PHASE_CONFIGS[milestone.phase as keyof typeof PHASE_CONFIGS]
                return (
                  <div key={milestone.id} onClick={() => onMilestoneToggle(milestone.id)}
                    className={`flex items-center gap-2.5 p-2 px-2.5 rounded-sm bg-surface2 border cursor-pointer transition-all opacity-70 hover:opacity-100 ${isDone ? 'border-border opacity-50' : 'border-border'}`}>
                    <div className="w-2 h-2 rounded-full border-2 shrink-0" style={{ borderColor: 'var(--muted)' }} />
                    <span className={`text-xs flex-1 ${isDone ? 'text-muted-foreground line-through' : 'text-text'}`}>{milestone.text}</span>
                    <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: cfg.cssColor + '20', color: cfg.cssColor }}>P{milestone.phase}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-border">
        <span className="font-mono text-[10px] text-muted-foreground">{totalDone}/{MILESTONES.length} milestones complete</span>
      </div>
    </div>
  )
}
