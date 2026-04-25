"use client"

import type { MoodEntry } from '@/lib/data'
import { useState } from 'react'
import { useConfig } from '@/hooks/use-config'

interface PsychSupportProps {
  mood: MoodEntry[]
  streakDays: number
  monthlyIncome: number
  planStartDate: string
  cash: number
}

function getTodayStr() { return new Date().toISOString().slice(0, 10) }

function getPlanMonth(startDate: string): number {
  if (!startDate) return 1
  const days = Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000))
  return Math.min(12, Math.ceil((days + 1) / 30))
}

function getRandomMessage(arr: string[], seed: string): string {
  const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return arr[hash % arr.length]
}

export function PsychSupport({ mood, streakDays, monthlyIncome, planStartDate, cash }: PsychSupportProps) {
  const appConfig = useConfig()
  const [dismissed, setDismissed] = useState(false)

  const today = getTodayStr()
  const todayMood = mood.find(m => m.date === today)?.level
  const planMonth = getPlanMonth(planStartDate)
  const weeksRunway = cash > 0 ? Math.floor((cash / 1300) * 4.33) : 0
  const recentRedDays = mood.filter(m => {
    const d = new Date(m.date)
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7)
    return m.level === 'red' && d >= cutoff
  }).length

  if (dismissed) return null

  // Determine which message type to show
  let messageType = 'onTrack'
  let accent = 'var(--accent2)'
  let title = 'Keep going.'

  if (planMonth === 1 && monthlyIncome < 200) {
    messageType = 'month1'
    accent = 'var(--accent2)'
    title = 'Month 1 reality check.'
  } else if (todayMood === 'red' || recentRedDays >= 3) {
    messageType = 'lowMood'
    accent = 'var(--warn)'
    title = 'Rough patch.'
  } else if (monthlyIncome < 500 && planMonth <= 2 && weeksRunway > 2) {
    messageType = 'lowIncome'
    accent = 'var(--accent2)'
    title = 'Income is ramping.'
  } else if (streakDays === 7 || streakDays === 14 || streakDays === 30) {
    messageType = 'streakMilestone'
    accent = 'var(--accent)'
    title = `${streakDays} days straight.`
  } else if (monthlyIncome > 1000 || streakDays > 7) {
    messageType = 'onTrack'
    accent = 'var(--accent)'
    title = 'Building momentum.'
  } else {
    return null
  }

  const messages = appConfig.psychMessages[messageType] ?? []
  if (messages.length === 0) return null
  const message = getRandomMessage(messages, today + messageType)

  return (
    <div
      className="rounded-md p-4 border mb-6 relative"
      style={{ borderColor: accent + '40', background: accent + '08' }}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-[10px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all"
      >
        ✕
      </button>
      <div className="flex items-start gap-3">
        <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: accent }} />
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: accent }}>
            {title}
          </div>
          <div className="text-[13px] text-text leading-relaxed font-medium">
            {message}
          </div>
          {messageType === 'month1' && (
            <div className="mt-2 text-[10px] font-mono text-muted-foreground">
              Month 1 target: $300–800. You are in the ramp period. Actions now create income in 7–14 days.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
