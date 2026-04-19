"use client"

import { Check } from 'lucide-react'

interface SpiceRoadmapProps {
  phaseChecks: Record<string, boolean>
  onToggle: (id: string) => void
  spice: { listings: number; whatsapp: number; subscriptions: number }
}

const ROADMAP = [
  {
    period: 'Week 1',
    milestone: 'Fix, Launch, First Traffic',
    color: 'var(--danger)',
    items: [
      { id: 'sr1', text: 'Payment bug confirmed fixed by developer — test end-to-end' },
      { id: 'sr2', text: 'Featured ($15) and Premium ($50) listing tiers live and tested' },
      { id: 'sr3', text: 'WhatsApp 20 personal contacts — ask them to list on SpiceClassifieds' },
      { id: 'sr4', text: 'Post in 3 Grenada Facebook groups featuring 2–3 interesting listings' },
      { id: 'sr5', text: 'Google Business Profile claimed for SpiceClassifieds' },
    ],
  },
  {
    period: 'Weeks 2–4',
    milestone: 'Volume & First Revenue',
    color: 'var(--warn)',
    items: [
      { id: 'sr6',  text: 'Facebook groups: post daily — mix listings and local content' },
      { id: 'sr7',  text: 'Pitch 3 CBI developers for Business Pro ($99/month) subscription' },
      { id: 'sr8',  text: 'Add Jobs category — first 5 employer listings (offer first one free)' },
      { id: 'sr9',  text: 'Add Yachting/Marine category — pitch IGY Marina and Port Louis' },
      { id: 'sr10', text: 'First Featured listing sold — any amount confirms model works' },
    ],
  },
  {
    period: 'Month 2',
    milestone: 'First Subscriptions & 100 Listings',
    color: 'var(--accent2)',
    items: [
      { id: 'sr11', text: '100+ active listings — onboard sellers personally by WhatsApp' },
      { id: 'sr12', text: 'First Power Seller subscription ($29/month) signed' },
      { id: 'sr13', text: 'WhatsApp broadcast list at 50+ subscribers' },
      { id: 'sr14', text: 'Lead generation: first real estate inquiry forwarded to developer' },
      { id: 'sr15', text: 'Add Construction/Trades category — Hurricane Beryl reconstruction demand' },
    ],
  },
  {
    period: 'Month 3',
    milestone: '500 Listings Target & Event Readiness',
    color: 'var(--accent)',
    items: [
      { id: 'sr16', text: '500+ active listings — required before running paid ads' },
      { id: 'sr17', text: 'Event category live for next Grenada event (see Event Calendar)' },
      { id: 'sr18', text: 'Business Pro subscription ($99/month) pipeline: 5+ conversations active' },
      { id: 'sr19', text: 'SEO: category landing pages indexed — check Search Console' },
      { id: 'sr20', text: 'First Business Pro client signed — any amount confirms B2B model' },
    ],
  },
  {
    period: 'Month 6+',
    milestone: 'St. Lucia Expansion Gate',
    color: 'var(--purple)',
    items: [
      { id: 'sr21', text: 'Grenada generating $2,000+/month consistently for 30 days' },
      { id: 'sr22', text: 'St. Lucia subdomain research complete — identify local VA contact' },
      { id: 'sr23', text: 'First St. Lucia partnership conversations started' },
      { id: 'sr24', text: 'Grenada WhatsApp list at 200+ subscribers' },
      { id: 'sr25', text: 'CBI Partner subscription tier ($299/month) pitched to 3 developers' },
    ],
  },
]

export function SpiceRoadmap({ phaseChecks, onToggle, spice }: SpiceRoadmapProps) {
  const totalItems = ROADMAP.flatMap(r => r.items).length
  const doneItems = ROADMAP.flatMap(r => r.items).filter(i => phaseChecks[i.id]).length
  const pct = Math.round((doneItems / totalItems) * 100)

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// SpiceClassifieds Roadmap</div>
        <div className="font-mono text-[10px] text-muted-foreground">{doneItems}/{totalItems}</div>
      </div>

      {/* Current status */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Listings', value: spice.listings, target: 500, color: 'var(--accent)' },
          { label: 'WhatsApp', value: spice.whatsapp, target: 200, color: 'var(--accent2)' },
          { label: 'Paid Subs', value: spice.subscriptions, target: 10, color: 'var(--warn)' },
        ].map(stat => {
          const pct = Math.min(100, (stat.value / stat.target) * 100)
          return (
            <div key={stat.label} className="bg-surface2 rounded-sm p-2 border border-border">
              <div className="font-mono text-[16px] font-bold leading-none mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[8px] font-mono text-muted-foreground mb-1">{stat.label}</div>
              <div className="h-1 bg-dim rounded-sm overflow-hidden">
                <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: stat.color }} />
              </div>
              <div className="text-[8px] font-mono text-muted-foreground mt-0.5">/{stat.target}</div>
            </div>
          )
        })}
      </div>

      {/* Roadmap phases */}
      <div className="flex flex-col gap-3">
        {ROADMAP.map(phase => {
          const phaseDone = phase.items.filter(i => phaseChecks[i.id]).length
          const phaseTotal = phase.items.length
          const allDone = phaseDone === phaseTotal
          return (
            <div key={phase.period}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: phase.color }} />
                  <span className="font-mono text-[10px] font-semibold" style={{ color: phase.color }}>{phase.period}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{phase.milestone}</span>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">{phaseDone}/{phaseTotal}</span>
              </div>
              <div className="flex flex-col gap-1 pl-3.5 border-l-2" style={{ borderColor: phase.color + '40' }}>
                {phase.items.map(item => {
                  const isDone = !!phaseChecks[item.id]
                  return (
                    <div
                      key={item.id}
                      onClick={() => onToggle(item.id)}
                      className="flex items-start gap-2 cursor-pointer group"
                    >
                      <div
                        className="w-4 h-4 border-2 rounded-sm shrink-0 flex items-center justify-center mt-0.5 transition-all"
                        style={isDone ? { background: phase.color, borderColor: phase.color } : { borderColor: 'var(--muted)' }}
                      >
                        {isDone && <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />}
                      </div>
                      <span className={`text-[11px] leading-snug transition-all ${isDone ? 'line-through text-muted-foreground' : 'text-text'}`}>
                        {item.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
