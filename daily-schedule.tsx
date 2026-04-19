"use client"

import { PHASE_CONFIGS } from '@/lib/data'

const PHASE_SCHEDULES = {
  1: [
    { time: '6:00–8:00am',  activity: 'Cambly tutoring sessions',                      tag: 'CAMBLY',  hours: 2,   note: 'US students online now. Build regular slots.' },
    { time: '8:00–9:00am',  activity: 'Upwork — submit 3 proposals + reply to messages',tag: 'UPWORK',  hours: 1,   note: '30 min proposals max. Do not obsess.' },
    { time: '9:00am–3:00pm',activity: 'Call center shift (once approved)',               tag: 'JOBS',    hours: 6,   note: 'This is your income floor. Priority.' },
    { time: '3:00–4:00pm',  activity: 'SpiceClassifieds — WhatsApp + seller onboarding',tag: 'SPICE',   hours: 1,   note: 'Message 10 businesses. Respond to all inquiries.' },
    { time: '4:00–4:30pm',  activity: 'Respondent + UserTesting — check for new studies',tag: 'INCOME', hours: 0.5, note: 'Apply immediately when available.' },
    { time: 'Evening',       activity: 'Rest. No work evenings in Phase 1.',             tag: 'REST',    hours: 0,   note: 'Burnout ends plans. Non-negotiable.' },
  ],
  2: [
    { time: '6:00–7:00am',  activity: 'Cambly (1–2 sessions — reduce as income grows)', tag: 'CAMBLY',  hours: 1,   note: 'Maintain regulars. Cut hours if agency fills.' },
    { time: '7:00–8:00am',  activity: 'Email / messages — client comms, applications',  tag: 'ADMIN',   hours: 1,   note: 'Inbox zero before work starts.' },
    { time: '8:00am–2:00pm',activity: 'Call center shift',                               tag: 'JOBS',    hours: 6,   note: 'Still your income floor until replaced.' },
    { time: '2:00–4:00pm',  activity: 'Upwork client work OR agency client delivery',   tag: 'UPWORK',  hours: 2,   note: 'Whichever is earning. Not both.' },
    { time: '4:00–5:00pm',  activity: 'SpiceClassifieds — seller growth + outreach',    tag: 'SPICE',   hours: 1,   note: 'Push toward 200 listings target.' },
    { time: '5:00–6:00pm',  activity: 'Amazon product research — Helium10, 1hr only',  tag: 'AMAZON',  hours: 1,   note: 'Research only. No spending yet.' },
  ],
  3: [
    { time: '6:00–7:00am',  activity: 'Cambly (1–2 sessions, declining)',               tag: 'CAMBLY',  hours: 1,   note: 'Phase out as agency income replaces it.' },
    { time: '7:00–9:00am',  activity: 'Agency client work / Upwork deliverables',       tag: 'AGENCY',  hours: 2,   note: 'Deliver before anything else.' },
    { time: '9:00am–12:00', activity: 'Call center (reduce hours if agency allows)',    tag: 'JOBS',    hours: 3,   note: 'Can drop to part-time now if income allows.' },
    { time: '12:00–2:00pm', activity: 'Amazon FBA — supplier comms, listing build',     tag: 'AMAZON',  hours: 2,   note: 'Respond to suppliers same day.' },
    { time: '2:00–3:00pm',  activity: 'SpiceClassifieds — event categories + Business Pro',tag: 'SPICE',hours: 1,  note: 'Festival season = highest traffic.' },
    { time: '3:00–4:00pm',  activity: 'Admin — invoices, applications, follow-ups',     tag: 'ADMIN',   hours: 1,   note: 'TikTok passive scroll 20min to learn format.' },
  ],
  4: [
    { time: '6:00–7:00am',  activity: 'Amazon PPC — review yesterday\'s campaign',     tag: 'AMAZON',  hours: 1,   note: 'Check ACOS, adjust bids. Daily habit.' },
    { time: '7:00–9:00am',  activity: 'Agency clients — delivery + check-ins',         tag: 'AGENCY',  hours: 2,   note: 'Maintain quality. This funds everything.' },
    { time: '9:00–10:00am', activity: 'TikTok — post one video + reply to comments',   tag: 'TIKTOK',  hours: 1,   note: 'Consistency beats virality.' },
    { time: '10:00–12:00',  activity: 'Amazon — customer questions, inventory mgmt',   tag: 'AMAZON',  hours: 2,   note: 'Respond within 24hrs for metrics.' },
    { time: '12:00–2:00pm', activity: 'SpiceClassifieds + Property management',        tag: 'SPICE',   hours: 2,   note: 'Business Pro outreach + guest requests.' },
    { time: '2:00–3:00pm',  activity: 'Strategy — weekly income per hour analysis',    tag: 'STRATEGY',hours: 1,   note: 'Which stream made most per hour? Double down.' },
  ],
}

const TAG_COLORS: Record<string, string> = {
  CAMBLY: 'var(--accent)', JOBS: 'var(--warn)', UPWORK: 'var(--accent2)',
  AGENCY: 'var(--purple)', SPICE: 'var(--accent)', AMAZON: 'var(--warn)',
  INCOME: 'var(--accent)', ADMIN: 'var(--muted)', REST: 'var(--muted)',
  TIKTOK: 'var(--danger)', STRATEGY: 'var(--purple)',
}

interface DailyScheduleProps {
  currentPhase: number
}

export function DailySchedule({ currentPhase }: DailyScheduleProps) {
  const schedule = PHASE_SCHEDULES[currentPhase as keyof typeof PHASE_SCHEDULES] || PHASE_SCHEDULES[1]
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]
  const totalHours = schedule.reduce((s, b) => s + b.hours, 0)

  return (
    <div
      className="bg-surface border border-border rounded-md p-5"
      style={{ borderTopWidth: 2, borderTopColor: config.cssColor }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">
          // Phase {currentPhase} Daily Schedule
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">{totalHours}hr active</div>
      </div>

      <div className="text-[10px] font-mono mb-4 p-2.5 rounded-sm border border-border bg-surface2" style={{ color: config.cssColor }}>
        {config.focus}
      </div>

      <div className="flex flex-col gap-0">
        {schedule.map((block, i) => {
          const color = TAG_COLORS[block.tag] || 'var(--muted)'
          const isRest = block.tag === 'REST'
          return (
            <div
              key={i}
              className={`flex items-start gap-3 py-2.5 ${i < schedule.length - 1 ? 'border-b border-border' : ''}`}
            >
              {/* Time */}
              <div className="w-[90px] shrink-0">
                <div className="font-mono text-[10px] text-muted-foreground leading-tight">{block.time}</div>
                {block.hours > 0 && (
                  <div className="font-mono text-[9px] mt-0.5" style={{ color }}>
                    {block.hours}hr
                  </div>
                )}
              </div>

              {/* Color bar */}
              <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ background: isRest ? 'var(--dim)' : color }} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[12px] leading-snug ${isRest ? 'text-muted-foreground italic' : 'text-text'}`}>
                    {block.activity}
                  </span>
                  {!isRest && (
                    <span
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm shrink-0"
                      style={{ background: color + '20', color }}
                    >
                      {block.tag}
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">{block.note}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-[10px] font-mono text-muted-foreground">
          This is the ceiling — <span className="text-text">{totalHours} hours/day</span>. Anything above this is borrowed from health and judgment.
        </div>
      </div>
    </div>
  )
}
