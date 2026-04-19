"use client"

import { useState } from 'react'

const TIMELINE: {
  month: number
  trackA: string
  spice: string
  amazon: string
  other: string
  capital: string
}[] = [
  { month: 1,  trackA: 'Apply TTEC/Transcom/OutPlex. Start Cambly. Build Upwork. Target $300–500.', spice: 'Fix payment bug. Add paid tiers. WhatsApp broadcast. Facebook groups. Google Business Profile.', amazon: 'Form Wyoming C-Corp. Open Mercury. Start Helium10. Begin product research. Start TikTok account.', other: 'POD: Set up Etsy + Printful. Apply Amazon Merch.', capital: '$8,500–9,000' },
  { month: 2,  trackA: 'Call center onboarding. Cambly daily. 10+ Upwork proposals/week. Target $1,400–2,400.', spice: '500 listings target. Pitch 3 car dealers for Business Pro. CBI developer outreach.', amazon: 'Validate Product 1 (7 criteria). Contact 3 Alibaba suppliers. Request samples.', other: 'POD: First designs live. TikTok affiliate: Apply at 1,000 followers.', capital: '$9,500–10,500' },
  { month: 3,  trackA: 'All platforms active. Target $2,300–3,700. Begin digital agency outreach.', spice: 'First subscriptions target. First lead sales. SEO category pages live.', amazon: 'Evaluate samples. Select supplier. Apply Amazon Seller account. Build listing draft.', other: 'Content: Start weekly Substack or LinkedIn. Property mgmt: Join Grenada expat groups.', capital: '$11,000–12,500' },
  { month: 4,  trackA: 'Target $3,000+/month. First agency client if outreach working. AI services on Upwork.', spice: '2–3 Business Pro accounts. Lead gen flowing. SpiceClassifieds $300–800/month.', amazon: 'Wholesale START: Find brand, contact distributor, order 20–50 units, ship to Dollan Prep.', other: 'Property mgmt: First conversation with 1–2 property owners. Digital products: Outline first product.', capital: '$10,000–12,000' },
  { month: 5,  trackA: 'Maintain $3,000+/month. Optimize top 2 earners.', spice: 'Stable subscription base. $500–1,000/month.', amazon: 'Wholesale ACTIVE: Listings live on FBA. Monitor velocity. Negotiate private label MOQ.', other: 'Property mgmt: First property under management if contact confirmed. Content: 500 subscribers target.', capital: '$12,000–14,000' },
  { month: 6,  trackA: 'Maintain $3,000+/month. Agency at $800–1,500/month if client retained.', spice: '500+ listings. $500–1,500/month. Assess St. Lucia expansion readiness.', amazon: 'Wholesale SCALING: $375–750 profit. Identify TikTok US rep. Private label listing finalized.', other: 'Property mgmt: $400–800/month from 1–2 properties. Digital products: First product launched.', capital: '$13,500–16,000' },
  { month: 7,  trackA: 'Maintain $3,000+/month.', spice: 'If $2,000+/month and 500+ listings: Begin St. Lucia subdomain research.', amazon: 'Place private label PO (capital $15K+). Wind down wholesale reorders.', other: 'Content: Monetization beginning if 1,000+ subscribers. POD: $100–300/month.', capital: '$10,000–13,000' },
  { month: 8,  trackA: 'Maintain $3,000+/month.', spice: 'St. Lucia: Identify local VA contact. Negotiate first St. Lucia partnerships.', amazon: 'Freight in transit. PPC campaigns built. Vine enrollment ready.', other: 'B2B export: Pre-sell to 3 US buyers manually. Property mgmt: $800–1,600/month.', capital: '$12,000–14,500' },
  { month: 9,  trackA: 'Maintain $3,000+/month.', spice: 'St. Lucia subdomain soft launch if Grenada stable.', amazon: 'FBA LIVE. PPC at $40/day. First Vine reviews. First profitable month. Apply TikTok Shop USA.', other: 'Digital products: $200–500/month. TikTok affiliate earnings.', capital: '$13,000–16,000' },
  { month: 10, trackA: 'Maintain $3,000+/month.', spice: 'Grenada $1,500–3,000/month. St. Lucia ramping.', amazon: 'First profitable Amazon month. TikTok Shop approved. Send creator samples.', other: 'CBI consulting: First conversations with licensed local agent partner.', capital: '$14,500–18,500' },
  { month: 11, trackA: 'Maintain $3,000+/month.', spice: 'St. Lucia generating first revenue. Plan Antigua.', amazon: 'TikTok Shop live. First creator videos. Monitor conversion.', other: 'B2B export: $500–1,000/month from 3–5 supplier relationships.', capital: '$16,000–21,500' },
  { month: 12, trackA: 'Jobs + agency $5,000–8,000/month.', spice: 'Multi-island $1,000–4,000/month. Review Antigua timeline.', amazon: 'FBA + TikTok $2,500–7,000/month. Plan Product 2.', other: 'All streams active. Review Year 2 plan.', capital: '$18,000–26,000+' },
]

const TRACK_COLORS = {
  trackA:  'var(--accent2)',
  spice:   'var(--accent)',
  amazon:  'var(--warn)',
  other:   'var(--purple)',
  capital: 'var(--muted)',
}

const TRACK_LABELS = {
  trackA:  'Track A — Jobs & Services',
  spice:   'SpiceClassifieds',
  amazon:  'Amazon / Business',
  other:   'Other Streams',
  capital: 'Capital Position',
}

interface TimelineViewProps {
  currentPhase: number
  planStartDate: string
}

function getMonthNumber(planStartDate: string): number {
  if (!planStartDate) return 1
  const days = Math.max(0, Math.floor((Date.now() - new Date(planStartDate).getTime()) / 86400000))
  return Math.min(12, Math.ceil((days + 1) / 30))
}

export function TimelineView({ currentPhase, planStartDate }: TimelineViewProps) {
  const currentPlanMonth = getMonthNumber(planStartDate)
  const [selectedMonth, setSelectedMonth] = useState(currentPlanMonth)
  const [activeTrack, setActiveTrack] = useState<keyof typeof TRACK_LABELS>('trackA')

  const monthData = TIMELINE.find(t => t.month === selectedMonth) || TIMELINE[0]

  const phaseMonths: Record<number, number[]> = {
    1: [1, 2, 3],
    2: [3, 4, 5],
    3: [5, 6, 7, 8, 9],
    4: [9, 10, 11, 12],
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// 12-Month Timeline</div>
        <div className="font-mono text-[10px]" style={{ color: 'var(--accent2)' }}>
          You are on Month {currentPlanMonth}
        </div>
      </div>

      {/* Month selector */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {TIMELINE.map(t => {
          const isCurrentMonth = t.month === currentPlanMonth
          const isSelected = t.month === selectedMonth
          const phaseForMonth = Object.entries(phaseMonths).find(([, months]) => months.includes(t.month))?.[0]
          const phaseColors: Record<string, string> = { '1': 'var(--danger)', '2': 'var(--warn)', '3': 'var(--accent2)', '4': 'var(--accent)' }
          const color = phaseColors[phaseForMonth || '1'] || 'var(--muted)'

          return (
            <button
              key={t.month}
              onClick={() => setSelectedMonth(t.month)}
              className="relative text-[10px] font-mono w-8 h-8 rounded-sm border cursor-pointer transition-all flex items-center justify-center"
              style={isSelected
                ? { background: color, color: 'var(--bg)', borderColor: color, fontWeight: 700 }
                : isCurrentMonth
                ? { borderColor: color, color }
                : { borderColor: 'var(--border)', color: 'var(--muted)' }
              }
            >
              {t.month}
              {isCurrentMonth && !isSelected && (
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Track tabs */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {(Object.entries(TRACK_LABELS) as [keyof typeof TRACK_LABELS, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTrack(key)}
            className="text-[9px] font-mono px-2 py-1 rounded-sm border cursor-pointer transition-all tracking-[0.05em]"
            style={activeTrack === key
              ? { background: TRACK_COLORS[key], color: 'var(--bg)', borderColor: TRACK_COLORS[key], fontWeight: 600 }
              : { borderColor: 'var(--border)', color: 'var(--muted)' }
            }
          >
            {label.split(' — ')[0]}
          </button>
        ))}
      </div>

      {/* Month content */}
      <div className="p-3 rounded-md border border-border bg-surface2 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color: TRACK_COLORS[activeTrack] }}>
            Month {selectedMonth} — {TRACK_LABELS[activeTrack]}
          </div>
          {selectedMonth === currentPlanMonth && (
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm" style={{ background: 'var(--accent2)', color: 'var(--bg)' }}>
              THIS MONTH
            </span>
          )}
        </div>
        <div className="text-[12px] text-text leading-relaxed">
          {monthData[activeTrack]}
        </div>
      </div>

      {/* All tracks summary for selected month */}
      <div className="border-t border-border pt-3">
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-2">Month {selectedMonth} — All Tracks</div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(TRACK_LABELS) as [keyof typeof TRACK_LABELS, string][]).filter(([k]) => k !== 'capital').map(([key, label]) => (
            <div key={key} className="p-2 rounded-sm bg-surface2 border border-border">
              <div className="text-[8px] font-mono uppercase tracking-[0.1em] mb-1" style={{ color: TRACK_COLORS[key] }}>
                {label.split(' — ')[0]}
              </div>
              <div className="text-[10px] text-text leading-snug line-clamp-2">{monthData[key]}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between p-2 rounded-sm bg-surface2 border border-border">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Capital Target</span>
          <span className="font-mono text-[12px] font-bold" style={{ color: 'var(--accent)' }}>{monthData.capital}</span>
        </div>
      </div>
    </div>
  )
}
