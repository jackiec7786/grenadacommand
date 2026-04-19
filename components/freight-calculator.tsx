"use client"

import { useState } from 'react'

interface FreightCalcProps {}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function dateInputFormat(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function FreightCalculator() {
  const [mode, setMode] = useState<'forward' | 'reverse'>('reverse')
  const [startDate, setStartDate] = useState(dateInputFormat(new Date()))
  const [targetDate, setTargetDate] = useState('')

  // Timelines from the plan
  const STEPS = [
    { label: 'Supplier production',          minDays: 21, maxDays: 35, color: 'var(--warn)' },
    { label: 'Quality inspection',            minDays: 2,  maxDays: 5,  color: 'var(--accent2)' },
    { label: 'Freight to US (sea)',           minDays: 21, maxDays: 35, color: 'var(--purple)' },
    { label: 'Customs clearance',             minDays: 3,  maxDays: 7,  color: 'var(--warn)' },
    { label: 'Prep centre processing',        minDays: 3,  maxDays: 7,  color: 'var(--accent2)' },
    { label: 'Amazon FBA check-in',           minDays: 3,  maxDays: 10, color: 'var(--accent)' },
    { label: 'Listing live + indexed',        minDays: 1,  maxDays: 3,  color: 'var(--accent)' },
  ]

  const totalMin = STEPS.reduce((s, step) => s + step.minDays, 0)
  const totalMax = STEPS.reduce((s, step) => s + step.maxDays, 0)

  // Forward mode: given PO date, when does listing go live?
  const poDate = new Date(startDate)
  const liveMin = addDays(poDate, totalMin)
  const liveMax = addDays(poDate, totalMax)

  // Reverse mode: given target live date, when must PO be placed?
  const target = targetDate ? new Date(targetDate) : null
  const poNeededMin = target ? addDays(target, -totalMax) : null
  const poNeededMax = target ? addDays(target, -totalMin) : null

  // Step-by-step timeline for forward mode
  let cursor = new Date(poDate)
  const stepTimeline = STEPS.map(step => {
    const from = new Date(cursor)
    const toMin = addDays(cursor, step.minDays)
    const toMax = addDays(cursor, step.maxDays)
    cursor = new Date(toMin) // use min for display
    return { ...step, from, toMin, toMax }
  })

  const today = new Date()
  const daysUntilPO = poNeededMin ? Math.ceil((poNeededMin.getTime() - today.getTime()) / 86400000) : null

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--warn)' }}>
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">// Freight Timeline Calculator</div>

      {/* Mode toggle */}
      <div className="flex gap-1.5 mb-4">
        {[
          { id: 'forward', label: 'PO date → Live date' },
          { id: 'reverse', label: 'Live date → PO date' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className="flex-1 text-[10px] font-mono py-1.5 rounded-sm border cursor-pointer transition-all"
            style={mode === m.id
              ? { background: 'var(--warn)', color: 'var(--bg)', borderColor: 'var(--warn)', fontWeight: 600 }
              : { borderColor: 'var(--border)', color: 'var(--muted)' }
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'forward' ? (
        <div className="space-y-4">
          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">PO placed on</div>
            <input type="date" className="w-full bg-dim border border-border text-text font-mono text-sm p-2.5 rounded-sm focus:outline-none focus:border-warn" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <div className="p-3 rounded-md border border-border bg-surface2">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">Listing goes live</div>
            <div className="font-mono text-[18px] font-bold text-accent">{formatDate(liveMin)}</div>
            <div className="font-mono text-[11px] text-muted-foreground">to {formatDate(liveMax)} (worst case)</div>
            <div className="font-mono text-[10px] text-muted-foreground mt-1">{totalMin}–{totalMax} days total</div>
          </div>

          {/* Step breakdown */}
          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">Step breakdown</div>
            <div className="flex flex-col gap-1.5">
              {stepTimeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: step.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-text">{step.label}</span>
                      <span className="font-mono text-[9px] text-muted-foreground">{step.minDays}–{step.maxDays} days</span>
                    </div>
                    <div className="font-mono text-[9px] text-muted-foreground">
                      {formatDate(step.from)} → {formatDate(step.toMin)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">I want to be live by</div>
            <input type="date" className="w-full bg-dim border border-border text-text font-mono text-sm p-2.5 rounded-sm focus:outline-none focus:border-warn" value={targetDate} min={dateInputFormat(new Date())} onChange={e => setTargetDate(e.target.value)} />
          </div>

          {target && poNeededMin && poNeededMax && (
            <>
              <div
                className="p-3 rounded-md border"
                style={{
                  borderColor: daysUntilPO !== null && daysUntilPO < 0 ? 'var(--danger)40' : 'var(--warn)40',
                  background: daysUntilPO !== null && daysUntilPO < 0 ? 'var(--danger)08' : 'var(--warn)08',
                }}
              >
                <div className="text-[9px] font-mono uppercase tracking-[0.1em] mb-2" style={{ color: daysUntilPO !== null && daysUntilPO < 0 ? 'var(--danger)' : 'var(--warn)' }}>
                  Place PO by
                </div>
                <div className="font-mono text-[20px] font-bold" style={{ color: daysUntilPO !== null && daysUntilPO < 0 ? 'var(--danger)' : 'var(--warn)' }}>
                  {formatDate(poNeededMin)}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  latest by {formatDate(poNeededMax)}
                </div>
                {daysUntilPO !== null && (
                  <div className="font-mono text-[11px] mt-1" style={{ color: daysUntilPO < 0 ? 'var(--danger)' : daysUntilPO < 14 ? 'var(--warn)' : 'var(--accent2)' }}>
                    {daysUntilPO < 0
                      ? `${Math.abs(daysUntilPO)} days overdue — live date at risk`
                      : daysUntilPO === 0
                      ? 'Place PO today'
                      : `${daysUntilPO} days from now to place PO`
                    }
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-muted-foreground p-2.5 rounded-sm border border-border bg-surface2">
                Remember: Plan rule — minimum $15,000 capital before placing any private label PO.
              </div>
            </>
          )}

          {!targetDate && (
            <div className="text-center py-4 text-[11px] font-mono text-muted-foreground">
              Set your target live date to calculate when to place the PO.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
