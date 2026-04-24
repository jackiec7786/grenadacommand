"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { TASKS, PHASE_CONFIGS } from '@/lib/data'

interface Props {
  cash: number
  income: Record<string, number>
  streakDays: number
  currentPhase: number
  tasks: Record<string, Record<number, boolean>>
  onLogToday: () => void
  onStartTimer: (label: string) => void
  onDismiss: () => void
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function getSubMessage() {
  const h = new Date().getHours()
  if (h < 9) return "Early start. Make it count."
  if (h < 12) return "Best hours of the day. Stay focused."
  if (h < 15) return "Keep the momentum going."
  if (h < 18) return "Afternoon push — one big thing."
  return "Evening wrap-up. What got done today?"
}

export function DailyFocus({ cash, income, streakDays, currentPhase, tasks, onLogToday, onStartTimer, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)
  const [showSecondary, setShowSecondary] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (localStorage.getItem('focusDismissed') !== today) setVisible(true)
  }, [today])

  const dismiss = () => {
    localStorage.setItem('focusDismissed', today)
    setVisible(false)
    onDismiss()
  }

  if (!visible) return null

  const phaseKey = `p${currentPhase}`
  const phaseTasks = TASKS[currentPhase] || []
  const phaseDone = tasks[phaseKey] || {}
  const incomplete = phaseTasks.filter((_, i) => !phaseDone[i])
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]

  type FocusItem = { label: string; href?: string; actionLabel: string; action?: () => void }
  let primary: FocusItem

  if (cash < 500) {
    primary = { label: 'Cash is critically low — submit 5 Upwork proposals now.', href: 'https://upwork.com', actionLabel: 'Go to Upwork →' }
  } else if (!income.cambly || income.cambly < 50) {
    primary = { label: "Run Cambly 2 hours today — no Cambly income logged yet.", href: 'https://cambly.com/tutor', actionLabel: 'Go to Cambly →' }
  } else if (!streakDays) {
    primary = { label: 'Log today as active to keep your streak alive.', actionLabel: 'Log Active Day', action: () => { onLogToday(); dismiss() } }
  } else if (incomplete.length > 0) {
    primary = { label: incomplete[0].label, actionLabel: 'Start Timer', action: () => { onStartTimer(incomplete[0].label); dismiss() } }
  } else {
    primary = { label: "All tasks done — great work today!", actionLabel: 'Start Timer', action: () => dismiss() }
  }

  const secondary = incomplete[1] ?? null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/96 backdrop-blur-sm">
      <div className="w-full max-w-lg px-6 py-10">
        <div className="mb-8">
          <div className="text-[9px] font-mono tracking-[0.3em] text-muted-foreground uppercase mb-3">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-[30px] font-extrabold text-text leading-tight">
            {getGreeting()}, Fahd.
          </h1>
          <p className="text-[13px] font-mono text-muted-foreground mt-1">{getSubMessage()}</p>
        </div>

        <div className="mb-5 p-5 rounded-md border-2" style={{ borderColor: config.cssColor, background: config.cssColor + '0a' }}>
          <div className="text-[9px] font-mono tracking-[0.2em] uppercase mb-3" style={{ color: config.cssColor }}>
            // One Thing
          </div>
          <div className="text-[17px] font-semibold text-text mb-5 leading-snug">{primary.label}</div>
          <div className="flex gap-3 flex-wrap">
            {primary.href ? (
              <a href={primary.href} target="_blank" rel="noopener noreferrer" onClick={dismiss}
                className="font-mono text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm min-h-[44px] flex items-center cursor-pointer"
                style={{ background: config.cssColor, color: 'var(--bg)' }}>
                {primary.actionLabel}
              </a>
            ) : (
              <button onClick={primary.action ?? dismiss}
                className="font-mono text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm min-h-[44px] cursor-pointer"
                style={{ background: config.cssColor, color: 'var(--bg)' }}>
                {primary.actionLabel}
              </button>
            )}
          </div>
        </div>

        {secondary && (
          <div className="mb-5">
            {showSecondary ? (
              <div className="p-3 rounded-sm border border-border bg-surface2">
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">Then</div>
                <div className="text-[13px] font-mono text-text">{secondary.label}</div>
              </div>
            ) : (
              <button onClick={() => setShowSecondary(true)}
                className="text-[11px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all min-h-[44px] flex items-center">
                + See next task
              </button>
            )}
          </div>
        )}

        <button onClick={dismiss} className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all min-h-[44px]">
          <X className="w-3.5 h-3.5" />
          See full dashboard
        </button>
      </div>
    </div>
  )
}
