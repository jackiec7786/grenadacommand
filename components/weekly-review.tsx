"use client"

import { useState } from 'react'
import { type WeeklyReview, type MoodEntry } from '@/lib/data'
import { Check, ChevronDown, ChevronUp, Plus } from 'lucide-react'

interface WeeklyReviewProps {
  reviews: WeeklyReview[]
  currentPhase: number
  cash: number
  monthlyIncome: number
  planStartDate: string
  onSave: (review: WeeklyReview) => void
}

function getPlanWeek(startDate: string): { week: number; month: number } {
  if (!startDate) return { week: 1, month: 1 }
  const days = Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000))
  return { week: Math.ceil((days + 1) / 7), month: Math.ceil((days + 1) / 30) }
}

const MOOD_COLORS = { green: 'var(--accent)', yellow: 'var(--warn)', red: 'var(--danger)' }
const MOOD_LABELS = { green: 'Strong week', yellow: 'Okay week', red: 'Rough week' }

export function WeeklyReviewPanel({ reviews, currentPhase, cash, monthlyIncome, planStartDate, onSave }: WeeklyReviewProps) {
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { week, month } = getPlanWeek(planStartDate)

  const todayStr = new Date().toISOString().slice(0, 10)
  const alreadyThisWeek = reviews.some(r => {
    const d = new Date(r.dateCompleted)
    const rWeek = Math.ceil((Math.floor((d.getTime() - new Date(planStartDate || todayStr).getTime()) / 86400000) + 1) / 7)
    return rWeek === week
  })

  const [form, setForm] = useState({
    wentWell: '',
    didntWork: '',
    oneFocus: '',
    energyRating: 'yellow' as MoodEntry['level'],
  })

  const handleSave = () => {
    if (!form.wentWell.trim() || !form.oneFocus.trim()) return
    const review: WeeklyReview = {
      id: `wr-${Date.now()}`,
      weekNumber: week,
      planMonth: month,
      dateCompleted: todayStr,
      wentWell: form.wentWell,
      didntWork: form.didntWork,
      oneFocus: form.oneFocus,
      incomeThisWeek: Math.round(monthlyIncome / 4),
      cashPosition: cash,
      phaseAtTime: currentPhase,
      energyRating: form.energyRating,
    }
    onSave(review)
    setForm({ wentWell: '', didntWork: '', oneFocus: '', energyRating: 'yellow' })
    setOpen(false)
  }

  const sortedReviews = [...reviews].sort((a, b) => b.weekNumber - a.weekNumber)

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Weekly Review</div>
          <div className="text-[11px] font-mono text-muted-foreground mt-0.5">Week {week} · Month {month}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">{reviews.length} reviews logged</span>
          {!alreadyThisWeek && (
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all tracking-[0.1em] uppercase"
              style={open
                ? { background: 'var(--accent2)', color: 'var(--bg)', borderColor: 'var(--accent2)' }
                : { borderColor: 'var(--accent2)', color: 'var(--accent2)' }
              }
            >
              <Plus className="w-3 h-3" />
              Review Week {week}
            </button>
          )}
          {alreadyThisWeek && (
            <span className="text-[10px] font-mono text-primary flex items-center gap-1">
              <Check className="w-3 h-3" /> Done this week
            </span>
          )}
        </div>
      </div>

      {/* New review form */}
      {open && !alreadyThisWeek && (
        <div className="mb-5 p-4 rounded-md border border-accent2/30 bg-surface2 space-y-3">
          <div className="text-[10px] font-mono text-accent2 uppercase tracking-[0.15em] mb-1">
            Week {week} Review — {todayStr}
          </div>

          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-1">What went well?</label>
            <textarea
              className="w-full bg-surface border border-border text-text font-mono text-xs p-2.5 rounded-sm resize-none h-16 focus:outline-none focus:border-accent2"
              placeholder="Income sources that worked, habits that held, progress made..."
              value={form.wentWell}
              onChange={e => setForm(f => ({ ...f, wentWell: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-1">What didn't work?</label>
            <textarea
              className="w-full bg-surface border border-border text-text font-mono text-xs p-2.5 rounded-sm resize-none h-16 focus:outline-none focus:border-accent2"
              placeholder="What slowed you down, what to drop, what to fix..."
              value={form.didntWork}
              onChange={e => setForm(f => ({ ...f, didntWork: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-1">One focus next week *</label>
            <input
              className="w-full bg-surface border border-border text-text font-mono text-xs p-2.5 rounded-sm focus:outline-none focus:border-accent2"
              placeholder="One thing. Not five. One."
              value={form.oneFocus}
              onChange={e => setForm(f => ({ ...f, oneFocus: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-2">This week's energy</label>
            <div className="flex gap-2">
              {(['green', 'yellow', 'red'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setForm(f => ({ ...f, energyRating: level }))}
                  className="flex-1 py-2 rounded-sm border font-mono text-[10px] uppercase cursor-pointer transition-all"
                  style={form.energyRating === level
                    ? { background: MOOD_COLORS[level] + '20', borderColor: MOOD_COLORS[level], color: MOOD_COLORS[level] }
                    : { borderColor: 'var(--border)', color: 'var(--muted)' }
                  }
                >
                  {MOOD_LABELS[level]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={!form.wentWell.trim() || !form.oneFocus.trim()}
              className="flex-1 py-2 rounded-sm font-mono text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-all disabled:opacity-40"
              style={{ background: 'var(--accent2)', color: 'var(--bg)' }}
            >
              Save Review
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-sm font-mono text-[11px] uppercase tracking-[0.1em] cursor-pointer border border-border text-muted-foreground hover:border-muted-foreground transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Past reviews */}
      {sortedReviews.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">Past Reviews</div>
          {sortedReviews.slice(0, 6).map(review => {
            const isExpanded = expandedId === review.id
            return (
              <div
                key={review.id}
                className="border border-border rounded-sm overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-2.5 px-3 cursor-pointer hover:bg-surface2 transition-all"
                  onClick={() => setExpandedId(isExpanded ? null : review.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: MOOD_COLORS[review.energyRating] }} />
                    <div>
                      <span className="font-mono text-[11px] text-text">Week {review.weekNumber}</span>
                      <span className="font-mono text-[10px] text-muted-foreground ml-2">M{review.planMonth} · P{review.phaseAtTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground">{review.dateCompleted}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border bg-surface2 space-y-2 pt-2">
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-0.5">Went well</div>
                      <div className="text-[12px] text-text">{review.wentWell}</div>
                    </div>
                    {review.didntWork && (
                      <div>
                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-0.5">Didn't work</div>
                        <div className="text-[12px] text-text">{review.didntWork}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-0.5">Focus that week</div>
                      <div className="text-[12px] font-semibold" style={{ color: 'var(--accent2)' }}>{review.oneFocus}</div>
                    </div>
                    <div className="flex gap-4 pt-1 border-t border-border">
                      <div>
                        <div className="text-[8px] font-mono text-muted-foreground uppercase">~Weekly Income</div>
                        <div className="font-mono text-[12px] text-text">${review.incomeThisWeek.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-muted-foreground uppercase">Cash then</div>
                        <div className="font-mono text-[12px] text-text">${review.cashPosition.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {reviews.length === 0 && !open && (
        <div className="text-center py-6 text-[11px] font-mono text-muted-foreground">
          No reviews yet. Do your first one at the end of this week.<br />
          <span className="text-[10px] opacity-60">Takes 5 minutes. Worth every one.</span>
        </div>
      )}
    </div>
  )
}
