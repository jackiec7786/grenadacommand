"use client"

import { TASKS, PHASE_CONFIGS } from '@/lib/data'
import { Check } from 'lucide-react'

interface TodaysTasksProps {
  currentPhase: number
  onPhaseChange: (phase: number) => void
  tasks: Record<string, Record<number, boolean>>
  onTaskToggle: (phaseKey: string, index: number) => void
}

export function TodaysTasks({ currentPhase, onPhaseChange, tasks, onTaskToggle }: TodaysTasksProps) {
  const phaseKey = `p${currentPhase}`
  const phaseTasks = TASKS[currentPhase] || []
  const phaseDone = tasks[phaseKey] || {}
  const doneCount = Object.values(phaseDone).filter(Boolean).length
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]

  return (
    <div
      className="bg-surface border border-border rounded-md p-5 animate-fade-slide-in"
      style={{ borderTopWidth: 2, borderTopColor: config.cssColor, animationDelay: '0.1s' }}
    >
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-3">
        {"// Today's Focus"}
      </div>

      {/* Phase Selector */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {[1, 2, 3, 4].map(p => {
          const cfg = PHASE_CONFIGS[p as keyof typeof PHASE_CONFIGS]
          return (
            <button
              key={p}
              onClick={() => onPhaseChange(p)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-sm border cursor-pointer transition-all tracking-[0.1em]"
              style={currentPhase === p
                ? { background: cfg.cssColor, color: 'var(--bg)', borderColor: cfg.cssColor, fontWeight: 600 }
                : { borderColor: 'var(--border)', color: 'var(--muted)' }
              }
            >
              {cfg.name}
            </button>
          )
        })}
      </div>

      {/* Phase focus line */}
      <div className="text-[10px] font-mono text-muted-foreground mb-3 leading-relaxed">
        {config.focus}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1 bg-dim rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{
              width: `${phaseTasks.length > 0 ? (doneCount / phaseTasks.length) * 100 : 0}%`,
              background: config.cssColor,
            }}
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground shrink-0">
          {doneCount}/{phaseTasks.length}
        </span>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        {phaseTasks.map((task, i) => {
          const isDone = !!phaseDone[i]
          return (
            <div
              key={i}
              onClick={() => onTaskToggle(phaseKey, i)}
              className={`flex items-start gap-3 p-2.5 px-3 rounded border cursor-pointer transition-all bg-surface2 ${
                isDone ? 'border-border opacity-60' : 'border-border'
              }`}
              style={!isDone ? { ['--hover-border' as string]: config.cssColor } : {}}
              onMouseEnter={e => !isDone && ((e.currentTarget as HTMLElement).style.borderColor = config.cssColor)}
              onMouseLeave={e => !isDone && ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
            >
              <div
                className="w-[18px] h-[18px] border-2 rounded-sm shrink-0 flex items-center justify-center transition-all mt-0.5"
                style={isDone ? { background: config.cssColor, borderColor: config.cssColor } : { borderColor: 'var(--muted)' }}
              >
                {isDone && <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />}
              </div>
              <span className={`text-[13px] leading-relaxed flex-1 ${isDone ? 'text-muted-foreground line-through' : 'text-text'}`}>
                {task.label}
              </span>
              <div className="flex flex-col items-end gap-1 ml-auto shrink-0">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-dim text-muted-foreground tracking-[0.1em]">
                  {task.tag}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">{task.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
