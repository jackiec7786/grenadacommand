"use client"

import { useState, useEffect } from 'react'
import type { PrepState } from '@/app/api/grenada/hurricane-prep/route'

const PREP_ITEMS = [
  { id: 'water',      label: '5+ gallons of water stored',     category: 'Essentials' },
  { id: 'food',       label: 'Non-perishable food (7 days)',    category: 'Essentials' },
  { id: 'documents',  label: 'Documents in waterproof bag',     category: 'Essentials' },
  { id: 'meds',       label: 'Medications (30-day supply)',     category: 'Essentials' },
  { id: 'cash',       label: 'Cash on hand (ATMs may fail)',    category: 'Essentials' },
  { id: 'flashlight', label: 'Flashlights + spare batteries',  category: 'Supplies' },
  { id: 'radio',      label: 'Battery-powered radio',          category: 'Supplies' },
  { id: 'powerbank',  label: 'Power banks fully charged',      category: 'Supplies' },
  { id: 'fuel',       label: 'Vehicle fuel tank full',         category: 'Supplies' },
  { id: 'shutters',   label: 'Hurricane shutters ready',       category: 'Home' },
  { id: 'drain',      label: 'Drains and gutters cleared',     category: 'Home' },
  { id: 'plan',       label: 'Evacuation plan confirmed',      category: 'Home' },
  { id: 'nemo',       label: 'NEMO contact saved (+1 473 440 0838)', category: 'Emergency' },
  { id: 'shelter',    label: 'Nearest shelter location known', category: 'Emergency' },
]

const CATEGORIES = ['Essentials', 'Supplies', 'Home', 'Emergency']

type Phase = 'pre' | 'active' | 'peak' | 'post'

function getStatus(now: Date): { label: string; countdown: number; countdownLabel: string; phase: Phase } {
  const y = now.getFullYear()
  const start  = new Date(y, 5,  1)   // Jun 1
  const peakS  = new Date(y, 7, 15)   // Aug 15
  const peakE  = new Date(y, 9, 15)   // Oct 15
  const end    = new Date(y, 10, 30)  // Nov 30
  const days = (a: Date, b: Date) => Math.ceil((b.getTime() - a.getTime()) / 86_400_000)

  if (now < start)  return { label: 'Pre-Season',    countdown: days(now, start),                     countdownLabel: 'days to season start', phase: 'pre' }
  if (now > end)    return { label: 'Off-Season',    countdown: days(now, new Date(y + 1, 5, 1)),     countdownLabel: 'days to next season',  phase: 'post' }
  if (now >= peakS && now <= peakE) return { label: 'Peak Season', countdown: days(now, peakE),       countdownLabel: 'days until peak ends', phase: 'peak' }
  return { label: 'Active Season', countdown: days(now, end), countdownLabel: 'days left in season',  phase: 'active' }
}

const PHASE_COLOR: Record<Phase, string> = {
  pre: 'var(--accent)',
  active: 'var(--warn)',
  peak: 'var(--danger)',
  post: 'var(--accent2)',
}

export function HurricaneSeason() {
  const [prep, setPrep] = useState<PrepState>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const status = getStatus(new Date())
  const checkedCount = PREP_ITEMS.filter(i => prep[i.id]?.checked).length
  const pct = Math.round((checkedCount / PREP_ITEMS.length) * 100)
  const barColor = pct === 100 ? 'var(--accent)' : pct > 50 ? 'var(--warn)' : 'var(--danger)'

  useEffect(() => {
    fetch('/api/grenada/hurricane-prep')
      .then(r => r.json())
      .then(d => { if (d && typeof d === 'object') setPrep(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (itemId: string) => {
    const next = !prep[itemId]?.checked
    setPrep(prev => ({ ...prev, [itemId]: { checked: next, checkedAt: next ? new Date().toISOString() : null } }))
    setSaving(itemId)
    await fetch('/api/grenada/hurricane-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, checked: next }),
    }).catch(() => {})
    setSaving(null)
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: PHASE_COLOR[status.phase] }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Hurricane Season</div>
        <span className="text-[9px] font-mono" style={{ color: PHASE_COLOR[status.phase] }}>● {status.label}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-mono text-[32px] font-extrabold text-text leading-none">{status.countdown}</span>
        <span className="font-mono text-[13px] text-muted-foreground">{status.countdownLabel}</span>
      </div>
      <div className="font-mono text-[11px] text-muted-foreground mb-4">Atlantic season: June 1 – Nov 30</div>

      <div className="flex items-center justify-between mb-1">
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Preparedness</div>
        <span className="font-mono text-[11px] font-semibold text-text">{checkedCount}/{PREP_ITEMS.length}</span>
      </div>
      <div className="h-1.5 bg-dim rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: barColor }} />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-1.5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-5 bg-dim rounded" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">{cat}</div>
              <div className="space-y-1">
                {PREP_ITEMS.filter(i => i.category === cat).map(item => {
                  const checked = !!prep[item.id]?.checked
                  return (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(item.id)}
                        disabled={saving === item.id}
                        className="accent-accent w-3.5 h-3.5 shrink-0"
                      />
                      <span className={`font-mono text-[11px] transition-all ${checked ? 'text-muted-foreground line-through' : 'text-text'}`}>
                        {item.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
