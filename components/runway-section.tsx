"use client"

interface RunwaySectionProps {
  cash: number
  onCashChange: (value: number) => void
  monthlyIncome: number
}

export function RunwaySection({ cash, onCashChange, monthlyIncome }: RunwaySectionProps) {
  const monthly = 1300
  const weeks = cash > 0 ? Math.floor((cash / monthly) * 4.33) : 0
  const months = cash > 0 ? (cash / monthly).toFixed(1) : '0'
  const pct = Math.min(100, (weeks / 26) * 100)

  const runwayColor =
    weeks < 4 ? 'var(--danger)' :
    weeks < 8 ? 'var(--warn)' :
    'var(--accent)'

  return (
    <div
      className="bg-surface border border-border rounded border-l-[3px] p-4 px-5 mb-7"
      style={{ borderLeftColor: runwayColor }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: runwayColor }}>
          // Cash Runway
        </span>
        <div className="flex items-center gap-2.5">
          <label className="text-[11px] text-muted-foreground font-mono">Cash $</label>
          <input
            type="number"
            className="bg-dim border border-border text-text font-mono text-[13px] px-2 py-1 rounded-sm w-[90px] text-right focus:outline-none focus:border-primary"
            placeholder="0"
            min={0}
            value={cash || ''}
            onChange={(e) => onCashChange(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Stats — responsive flex-wrap */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-3">
        <div>
          <div className="text-[22px] font-bold font-mono" style={{ color: runwayColor }}>
            {weeks || '—'}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">
            Weeks left
          </div>
        </div>
        <div>
          <div className="text-[22px] font-bold font-mono" style={{ color: runwayColor }}>
            {weeks ? months : '—'}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">
            Months left
          </div>
        </div>
        <div>
          <div className="text-[22px] font-bold font-mono" style={{ color: runwayColor }}>
            ${monthlyIncome.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">
            Earned this month
          </div>
        </div>
        <div>
          <div className="text-[22px] font-bold font-mono text-muted-foreground">
            ${monthly.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">
            Monthly costs
          </div>
        </div>
      </div>

      <div className="bg-dim h-1.5 rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, var(--danger), ${runwayColor})`,
          }}
        />
      </div>
    </div>
  )
}
