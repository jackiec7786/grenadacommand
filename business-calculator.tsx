"use client"

import { useState } from 'react'

type CalcMode = 'margin' | 'cambly' | 'fba'

export function BusinessCalculator() {
  const [mode, setMode] = useState<CalcMode>('margin')

  // Margin calc
  const [cost, setCost] = useState('')
  const [price, setPrice] = useState('')

  // Cambly calc
  const [hours, setHours] = useState('')
  const [isKids, setIsKids] = useState(false)
  const [sessions, setSessions] = useState('')

  // FBA unit economics
  const [unitCost, setUnitCost] = useState('')
  const [freight, setFreight] = useState('')
  const [targetPrice, setTargetPrice] = useState('')

  // Margin results
  const costN = parseFloat(cost) || 0
  const priceN = parseFloat(price) || 0
  const margin = priceN > 0 ? ((priceN - costN) / priceN * 100) : 0
  const profit = priceN - costN
  const isGoodMargin = margin >= 35

  // Cambly results
  const hoursN = parseFloat(hours) || 0
  const sessionsN = parseFloat(sessions) || 0
  const rate = isKids ? 12.00 : 10.20
  const camblyEarnings = hoursN * rate
  const monthlyFull = 20 * 5 * rate // 4hrs/day, 5 days
  const sessionEarnings = sessionsN * 0.5 * rate // 30min sessions

  // FBA results
  const unitCostN = parseFloat(unitCost) || 0
  const freightN = parseFloat(freight) || 0
  const targetN = parseFloat(targetPrice) || 0
  const amazonFee = targetN * 0.15 // ~15% referral
  const fbaFee = 3.22 // typical small/standard
  const totalCost = unitCostN + freightN + amazonFee + fbaFee
  const fbaProfit = targetN - totalCost
  const fbaMargin = targetN > 0 ? (fbaProfit / targetN * 100) : 0
  const breakEven = unitCostN + freightN + fbaFee > 0
    ? Math.ceil((unitCostN + freightN + fbaFee) / (1 - 0.15))
    : 0

  const MODES: { id: CalcMode; label: string }[] = [
    { id: 'margin', label: 'Profit Margin' },
    { id: 'cambly', label: 'Cambly Earnings' },
    { id: 'fba',    label: 'FBA Unit Economics' },
  ]

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">// Business Calculator</div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="text-[10px] font-mono px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all tracking-[0.05em]"
            style={mode === m.id
              ? { background: 'var(--accent2)', color: 'var(--bg)', borderColor: 'var(--accent2)', fontWeight: 600 }
              : { borderColor: 'var(--border)', color: 'var(--muted)' }
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Margin Calculator */}
      {mode === 'margin' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Unit Cost ($)', val: cost, set: setCost, placeholder: '0.00' },
              { label: 'Selling Price ($)', val: price, set: setPrice, placeholder: '0.00' },
            ].map(({ label, val, set, placeholder }) => (
              <div key={label}>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">{label}</div>
                <input
                  type="number"
                  className="w-full bg-dim border border-border text-text font-mono text-[16px] px-3 py-2.5 rounded-sm focus:outline-none focus:border-accent2 text-right"
                  value={val}
                  placeholder={placeholder}
                  min={0}
                  onChange={e => set(e.target.value)}
                />
              </div>
            ))}
          </div>

          {priceN > 0 && (
            <div
              className="p-4 rounded-md border"
              style={{
                borderColor: isGoodMargin ? 'var(--accent)40' : 'var(--danger)40',
                background: isGoodMargin ? 'var(--accent)08' : 'var(--danger)08',
              }}
            >
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-mono text-[28px] font-extrabold leading-none" style={{ color: isGoodMargin ? 'var(--accent)' : 'var(--danger)' }}>
                    {margin.toFixed(1)}%
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Margin</div>
                </div>
                <div>
                  <div className="font-mono text-[28px] font-extrabold leading-none text-text">
                    ${profit.toFixed(2)}
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Profit / unit</div>
                </div>
                <div>
                  <div className="font-mono text-[28px] font-extrabold leading-none text-muted-foreground">
                    {priceN > 0 ? (priceN / costN).toFixed(2) : '—'}x
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Markup</div>
                </div>
              </div>
              <div className="mt-3 text-center font-mono text-[10px]" style={{ color: isGoodMargin ? 'var(--accent)' : 'var(--danger)' }}>
                {isGoodMargin ? '✓ Above 35% plan threshold' : '⚠ Below 35% — reconsider pricing or supplier'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cambly Calculator */}
      {mode === 'cambly' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setIsKids(false)}
                className="px-3 py-1.5 rounded-sm text-[10px] font-mono border cursor-pointer transition-all"
                style={!isKids ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Cambly ($10.20/hr)
              </div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setIsKids(true)}
                className="px-3 py-1.5 rounded-sm text-[10px] font-mono border cursor-pointer transition-all"
                style={isKids ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Cambly Kids ($12/hr)
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">Hours today</div>
              <input type="number" className="w-full bg-dim border border-border text-text font-mono text-[16px] px-3 py-2.5 rounded-sm focus:outline-none focus:border-accent text-right" value={hours} placeholder="0" min={0} step={0.5} onChange={e => setHours(e.target.value)} />
            </div>
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">Sessions (30 min)</div>
              <input type="number" className="w-full bg-dim border border-border text-text font-mono text-[16px] px-3 py-2.5 rounded-sm focus:outline-none focus:border-accent text-right" value={sessions} placeholder="0" min={0} onChange={e => setSessions(e.target.value)} />
            </div>
          </div>

          <div className="bg-surface2 rounded-md border border-border p-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Today (hours)', val: `$${camblyEarnings.toFixed(2)}` },
                { label: 'Today (sessions)', val: sessionsN > 0 ? `$${sessionEarnings.toFixed(2)}` : '—' },
                { label: '4hr/day monthly', val: `$${(rate * 4 * 21).toFixed(0)}` },
                { label: '2hr/day monthly', val: `$${(rate * 2 * 21).toFixed(0)}` },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.1em] mb-0.5">{label}</div>
                  <div className="font-mono text-[18px] font-bold text-primary">{val}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border text-[10px] font-mono text-muted-foreground">
              Rate: ${rate.toFixed(2)}/hr · Paid every Monday to PayPal
            </div>
          </div>
        </div>
      )}

      {/* FBA Unit Economics */}
      {mode === 'fba' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Unit Cost ($)', val: unitCost, set: setUnitCost },
              { label: 'Freight per unit ($)', val: freight, set: setFreight },
              { label: 'Target Selling Price ($)', val: targetPrice, set: setTargetPrice },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">{label}</div>
                <input type="number" className="w-full bg-dim border border-border text-text font-mono text-[16px] px-3 py-2.5 rounded-sm focus:outline-none focus:border-warn text-right" value={val} placeholder="0.00" min={0} onChange={e => set(e.target.value)} />
              </div>
            ))}
            <div className="bg-surface2 rounded-sm border border-border p-2">
              <div className="text-[9px] font-mono text-muted-foreground uppercase mb-1">Auto-calculated</div>
              <div className="font-mono text-[11px] text-muted-foreground">Amazon fee (15%): ${amazonFee.toFixed(2)}</div>
              <div className="font-mono text-[11px] text-muted-foreground">FBA fulfil fee: $3.22</div>
            </div>
          </div>

          {targetN > 0 && (
            <div
              className="p-4 rounded-md border"
              style={{
                borderColor: fbaMargin >= 35 ? 'var(--accent)40' : fbaMargin >= 20 ? 'var(--warn)40' : 'var(--danger)40',
                background: fbaMargin >= 35 ? 'var(--accent)08' : fbaMargin >= 20 ? 'var(--warn)08' : 'var(--danger)08',
              }}
            >
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div>
                  <div className="font-mono text-[24px] font-extrabold leading-none" style={{ color: fbaMargin >= 35 ? 'var(--accent)' : fbaMargin >= 20 ? 'var(--warn)' : 'var(--danger)' }}>
                    {fbaMargin.toFixed(1)}%
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Net margin</div>
                </div>
                <div>
                  <div className="font-mono text-[24px] font-extrabold leading-none text-text">
                    ${fbaProfit.toFixed(2)}
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Profit / unit</div>
                </div>
                <div>
                  <div className="font-mono text-[24px] font-extrabold leading-none text-muted-foreground">
                    ${breakEven}
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Break-even price</div>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Cost breakdown</div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {[
                    { l: 'Unit', v: unitCostN },
                    { l: 'Freight', v: freightN },
                    { l: 'Amazon', v: amazonFee + fbaFee },
                    { l: 'Total', v: totalCost },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <div className="font-mono text-[11px] text-text">${v.toFixed(2)}</div>
                      <div className="font-mono text-[8px] text-muted-foreground">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
