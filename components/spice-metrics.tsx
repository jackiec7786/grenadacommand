"use client"

interface SpiceMetricsProps {
  spice: { listings: number; whatsapp: number; subscriptions: number }
  onUpdate: (field: keyof { listings: number; whatsapp: number; subscriptions: number }, value: number) => void
}

const TARGETS = {
  listings: 500,
  whatsapp: 200,
  subscriptions: 10,
}

const FIELDS: { key: keyof typeof TARGETS; label: string; sublabel: string; color: string }[] = [
  { key: 'listings',      label: 'Active Listings',      sublabel: 'target 500 before paid ads', color: 'var(--accent)' },
  { key: 'whatsapp',      label: 'WhatsApp Subscribers', sublabel: 'broadcast list size',        color: 'var(--accent2)' },
  { key: 'subscriptions', label: 'Paid Subscriptions',   sublabel: 'Power Seller + Business Pro', color: 'var(--warn)' },
]

export function SpiceMetrics({ spice, onUpdate }: SpiceMetricsProps) {
  return (
    <div className="bg-surface border border-border rounded-md p-5 border-t-2" style={{ borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// SpiceClassifieds</div>
        <div className="flex gap-2">
          <a href="https://spiceclassifieds.com/post" target="_blank" rel="noopener noreferrer"
            className="font-mono text-[9px] px-2.5 py-1 rounded-sm border cursor-pointer transition-all min-h-[32px] flex items-center"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            + Listing
          </a>
          <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer"
            className="font-mono text-[9px] px-2.5 py-1 rounded-sm border cursor-pointer transition-all min-h-[32px] flex items-center"
            style={{ borderColor: 'var(--accent2)', color: 'var(--accent2)' }}>
            Broadcast
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {FIELDS.map(({ key, label, sublabel, color }) => {
          const val = spice[key] || 0
          const target = TARGETS[key]
          const pct = Math.min(100, (val / target) * 100)
          return (
            <div key={key}>
              <div className="flex items-end justify-between mb-1.5">
                <div>
                  <div className="text-[12px] text-text font-medium">{label}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{sublabel}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" className="bg-dim border border-border font-mono text-[15px] font-bold px-2 py-1 rounded-sm w-20 text-right focus:outline-none focus:border-primary min-h-[36px]"
                    style={{ color }} value={val || ''} placeholder="0" min={0}
                    onChange={e => onUpdate(key, parseInt(e.target.value) || 0)} />
                  <span className="font-mono text-[10px] text-muted-foreground">/ {target}</span>
                </div>
              </div>
              <div className="h-1.5 bg-dim rounded-sm overflow-hidden">
                <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-1 text-right">{pct.toFixed(0)}% to target</div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        {spice.listings === 0 && (
          <div className="text-[11px] font-mono text-muted-foreground">No listings yet. <a href="https://spiceclassifieds.com/post" target="_blank" rel="noopener noreferrer" className="text-accent underline cursor-pointer">Add your first one →</a></div>
        )}
        {spice.listings > 0 && spice.listings < 50 && (
          <div className="text-[11px] font-mono text-warn">⚠ Fix payment bug before promoting listings</div>
        )}
        {spice.listings >= 50 && spice.listings < 200 && (
          <div className="text-[11px] font-mono text-muted-foreground">Growing — reach 200 before running paid ads</div>
        )}
        {spice.listings >= 200 && spice.listings < 500 && (
          <div className="text-[11px] font-mono text-accent2">On track — push WhatsApp and Business Pro outreach</div>
        )}
        {spice.listings >= 500 && (
          <div className="text-[11px] font-mono text-primary">✓ Listing target hit — activate paid tiers and event categories</div>
        )}
      </div>
    </div>
  )
}
