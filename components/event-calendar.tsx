"use client"

import type { GrenadaEvent } from '@/lib/data'
import { useState } from 'react'
import { useConfig } from '@/hooks/use-config'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface EventCalendarProps {
  eventChecks: Record<string, boolean>
  onToggleCheck: (id: string) => void
}

const URGENCY_CONFIG = {
  now:      { label: 'ACT NOW',  color: 'var(--danger)',  bg: 'rgba(255,68,87,0.08)' },
  soon:     { label: 'SOON',     color: 'var(--warn)',    bg: 'rgba(255,140,66,0.08)' },
  upcoming: { label: 'UPCOMING', color: 'var(--accent2)', bg: 'rgba(0,196,160,0.06)' },
  future:   { label: 'FUTURE',   color: 'var(--muted)',   bg: 'transparent' },
}

const CATEGORY_ICONS: Record<GrenadaEvent['category'], string> = {
  festival: '🎉', sailing: '⛵', food: '🍫', culture: '🥁', business: '🔨',
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / 86400000)
}

export function EventCalendar({ eventChecks, onToggleCheck }: EventCalendarProps) {
  const config = useConfig()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sorted = [...config.events].sort((a, b) =>
    new Date(a.confirmedDates).getTime() - new Date(b.confirmedDates).getTime()
  )

  const activeEvents = sorted.filter(e => daysUntil(e.confirmedDates) > -30)
  const actionItems = (eventId: string) => {
    const ev = config.events.find(e => e.id === eventId)
    if (!ev) return []
    return ev.spiceAction.split('. ').filter(Boolean)
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Grenada Event Calendar</div>
        <div className="text-[10px] font-mono text-muted-foreground">{config.events.length} events tracked</div>
      </div>

      <div className="text-[11px] font-mono text-muted-foreground mb-4 leading-relaxed">
        Events drive SpiceClassifieds traffic spikes. Each event is a revenue window — prepare 4–6 weeks ahead.
      </div>

      <div className="flex flex-col gap-3">
        {activeEvents.map(event => {
          const urgency = URGENCY_CONFIG[event.urgency]
          const days = daysUntil(event.confirmedDates)
          const isExpanded = expandedId === event.id
          const actions = actionItems(event.id)
          const checkedCount = actions.filter((_, i) => eventChecks[`${event.id}_${i}`]).length

          return (
            <div
              key={event.id}
              className="border border-border rounded-md overflow-hidden"
              style={event.urgency === 'now' || event.urgency === 'soon' ? { borderColor: urgency.color + '40' } : {}}
            >
              {/* Header */}
              <div
                className="p-3 cursor-pointer transition-all"
                style={{ background: isExpanded ? urgency.bg : 'transparent' }}
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{CATEGORY_ICONS[event.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[13px] font-semibold text-text">{event.name}</span>
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm font-bold"
                        style={{ background: urgency.color, color: 'var(--bg)' }}
                      >
                        {urgency.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-[10px] text-muted-foreground">{event.dates}</span>
                      {days > 0 && days < 365 && (
                        <span className="font-mono text-[10px]" style={{ color: urgency.color }}>
                          {days} days away
                        </span>
                      )}
                      {days <= 0 && days > -30 && (
                        <span className="font-mono text-[10px] text-primary">Happening now</span>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground">{event.audienceSize} audience</span>
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground">{event.realisticRevenue}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {actions.length > 0 && (
                      <span className="font-mono text-[9px] text-muted-foreground">{checkedCount}/{actions.length}</span>
                    )}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-border" style={{ background: urgency.bg }}>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Audience</div>
                      <div className="text-[11px] text-text">{event.audience}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Revenue Model</div>
                      <div className="text-[11px] text-text">{event.revenueModel}</div>
                    </div>
                  </div>

                  {/* Action checklist */}
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">SpiceClassifieds Actions</div>
                    <div className="flex flex-col gap-1.5">
                      {actions.map((action, i) => {
                        const key = `${event.id}_${i}`
                        const done = !!eventChecks[key]
                        return (
                          <div
                            key={i}
                            onClick={() => onToggleCheck(key)}
                            className="flex items-start gap-2 cursor-pointer group"
                          >
                            <div
                              className="w-4 h-4 border-2 rounded-sm shrink-0 flex items-center justify-center mt-0.5 transition-all"
                              style={done ? { background: urgency.color, borderColor: urgency.color } : { borderColor: 'var(--muted)' }}
                            >
                              {done && <span className="text-bg text-[10px] font-bold">✓</span>}
                            </div>
                            <span className={`text-[11px] leading-snug transition-all ${done ? 'line-through text-muted-foreground' : 'text-text group-hover:text-text'}`}>
                              {action}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {actions.length > 0 && (
                    <div className="mt-3">
                      <div className="h-1 bg-dim rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all duration-500"
                          style={{ width: `${(checkedCount / actions.length) * 100}%`, background: urgency.color }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
