"use client"

import { INCOME_STREAMS } from '@/lib/data'

interface ConcentrationMonitorProps {
  income: Record<string, number>
}

export function ConcentrationMonitor({ income }: ConcentrationMonitorProps) {
  const total = Object.values(income).reduce((s, v) => s + (v || 0), 0)

  const streams = INCOME_STREAMS
    .map(s => ({ ...s, amount: income[s.id] || 0 }))
    .filter(s => s.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const getColor = (pct: number) => {
    if (pct > 50) return 'var(--danger)'
    if (pct > 40) return 'var(--warn)'
    if (pct > 25) return 'var(--accent2)'
    return 'var(--accent)'
  }

  const topStream = streams[0]
  const topPct = total > 0 && topStream ? Math.round((topStream.amount / total) * 100) : 0
  const tiktokAmount = income['tiktok'] || 0
  const tiktokPct = total > 0 ? Math.round((tiktokAmount / total) * 100) : 0

  const overallRisk = topPct > 50 ? 'CRITICAL' : topPct > 40 ? 'WARNING' : tiktokPct > 30 ? 'WARNING' : 'HEALTHY'
  const riskColor = overallRisk === 'CRITICAL' ? 'var(--danger)' : overallRisk === 'WARNING' ? 'var(--warn)' : 'var(--accent)'

  // Palette of distinct colors for chart segments
  const SEGMENT_COLORS = [
    'var(--accent)', 'var(--accent2)', 'var(--warn)',
    'var(--purple)', 'var(--danger)', 'var(--muted)',
    'var(--text)', '#60a5fa', '#f472b6',
  ]

  // Build pie segments
  let cumulative = 0
  const segments = streams.map((s, i) => {
    const pct = total > 0 ? (s.amount / total) * 100 : 0
    const startAngle = (cumulative / 100) * 360
    const endAngle = ((cumulative + pct) / 100) * 360
    cumulative += pct
    const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
    return { ...s, pct, startAngle, endAngle, color }
  })

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    if (endAngle - startAngle >= 360) endAngle = startAngle + 359.99
    const start = polarToCartesian(cx, cy, r, startAngle)
    const end = polarToCartesian(cx, cy, r, endAngle)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: riskColor }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Revenue Concentration</div>
        <span
          className="text-[9px] font-mono px-2 py-1 rounded-sm font-bold"
          style={{ background: riskColor + '20', color: riskColor }}
        >
          {overallRisk}
        </span>
      </div>

      {total === 0 ? (
        <div className="text-center py-8 text-[11px] font-mono text-muted-foreground">
          Enter income in the tracker to see concentration analysis.
        </div>
      ) : (
        <>
          {/* Warnings */}
          <div className="space-y-2 mb-4">
            {topPct > 40 && topStream && (
              <div className="p-2.5 rounded-sm border text-[11px] font-mono" style={{ borderColor: getColor(topPct) + '60', color: getColor(topPct), background: getColor(topPct) + '0d' }}>
                ⚠ {topStream.name} is {topPct}% of income — plan rule: max 40%
              </div>
            )}
            {tiktokPct > 30 && (
              <div className="p-2.5 rounded-sm border text-[11px] font-mono" style={{ borderColor: 'var(--danger)60', color: 'var(--danger)', background: 'var(--danger)0d' }}>
                ⚠ TikTok is {tiktokPct}% of income — plan rule: max 30%
              </div>
            )}
            {overallRisk === 'HEALTHY' && (
              <div className="p-2.5 rounded-sm border text-[11px] font-mono" style={{ borderColor: 'var(--accent)60', color: 'var(--accent)', background: 'var(--accent)0d' }}>
                ✓ Revenue well distributed — no single platform above 40%
              </div>
            )}
          </div>

          {/* Pie chart + legend */}
          <div className="flex items-center gap-4">
            <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
              {segments.map((s, i) => (
                <path key={i} d={describeArc(40, 40, 36, s.startAngle, s.endAngle)} fill={s.color} opacity={0.9} />
              ))}
              <circle cx="40" cy="40" r="20" fill="var(--surface2)" />
              <text x="40" y="44" textAnchor="middle" fill="var(--text)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                ${total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total}
              </text>
            </svg>

            <div className="flex-1 flex flex-col gap-1.5">
              {segments.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                  <span className="font-mono text-[10px] text-muted-foreground flex-1 truncate">{s.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-dim rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm" style={{ width: `${s.pct}%`, background: getColor(s.pct) }} />
                    </div>
                    <span
                      className="font-mono text-[10px] w-8 text-right"
                      style={{ color: getColor(s.pct), fontWeight: s.pct > 40 ? 700 : 400 }}
                    >
                      {s.pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules reminder */}
          <div className="mt-4 pt-3 border-t border-border space-y-1">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Plan Rules</div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">Max per platform</span>
              <span style={{ color: topPct > 40 ? 'var(--danger)' : 'var(--accent)' }}>40% {topPct > 40 ? `⚠ (${topPct}%)` : '✓'}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground">TikTok max</span>
              <span style={{ color: tiktokPct > 30 ? 'var(--danger)' : 'var(--accent)' }}>30% {tiktokPct > 30 ? `⚠ (${tiktokPct}%)` : '✓'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
