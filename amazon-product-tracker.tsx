"use client"

import { useState } from 'react'
import { type AmazonProduct, PRODUCT_VALIDATION_CRITERIA } from '@/lib/data'
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

interface AmazonProductTrackerProps {
  products: AmazonProduct[]
  onAdd: (p: AmazonProduct) => void
  onUpdate: (id: string, updates: Partial<AmazonProduct>) => void
  onRemove: (id: string) => void
}

const STATUS_CONFIG: Record<AmazonProduct['status'], { label: string; color: string }> = {
  'researching': { label: 'Researching',  color: 'var(--muted)'   },
  'validated':   { label: 'Validated',    color: 'var(--accent2)' },
  'sampling':    { label: 'Sampling',     color: 'var(--warn)'    },
  'ordered':     { label: 'PO Placed',    color: 'var(--purple)'  },
  'live':        { label: 'Live on FBA',  color: 'var(--accent)'  },
  'cut':         { label: 'Cut',          color: 'var(--danger)'  },
}

const PRESET_PRODUCTS = [
  { name: 'Neuropathy Relief Socks', niche: 'Health / Senior Care', targetPrice: 32, estimatedMargin: 40 },
  { name: 'Posture Correction Wearable', niche: 'Remote Worker Wellness', targetPrice: 52, estimatedMargin: 40 },
  { name: 'Crochet Festival Kit', niche: 'Gen Z Crafts / Festival', targetPrice: 34, estimatedMargin: 45 },
  { name: 'Dog Mobility Harness', niche: 'Pet Health / Senior Dogs', targetPrice: 48, estimatedMargin: 40 },
  { name: 'Analog Desk Timer', niche: 'Productivity / Home Office', targetPrice: 29, estimatedMargin: 38 },
]

export function AmazonProductTracker({ products, onAdd, onUpdate, onRemove }: AmazonProductTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCriteria, setShowCriteria] = useState(false)
  const [form, setForm] = useState({
    name: '', niche: '', targetPrice: '', estimatedMargin: '',
    bsrRange: '', competitorCount: '', helium10Score: '',
    supplierName: '', supplierContact: '', moq: '', unitCost: '', notes: '',
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    onAdd({
      id: `amz-${Date.now()}`,
      name: form.name,
      niche: form.niche,
      targetPrice: parseFloat(form.targetPrice) || 0,
      estimatedMargin: parseFloat(form.estimatedMargin) || 0,
      bsrRange: form.bsrRange,
      competitorCount: parseInt(form.competitorCount) || 0,
      status: 'researching',
      helium10Score: parseInt(form.helium10Score) || 0,
      supplierName: form.supplierName,
      supplierContact: form.supplierContact,
      sampleOrdered: false,
      sampleApproved: false,
      moq: parseInt(form.moq) || 0,
      unitCost: parseFloat(form.unitCost) || 0,
      notes: form.notes,
    })
    setForm({ name:'', niche:'', targetPrice:'', estimatedMargin:'', bsrRange:'', competitorCount:'', helium10Score:'', supplierName:'', supplierContact:'', moq:'', unitCost:'', notes:'' })
    setShowForm(false)
  }

  const activeProducts = products.filter(p => p.status !== 'cut')
  const cutProducts = products.filter(p => p.status === 'cut')

  const renderProduct = (p: AmazonProduct) => {
    const isExpanded = expandedId === p.id
    const cfg = STATUS_CONFIG[p.status]
    const margin = p.estimatedMargin > 0 ? p.estimatedMargin : null
    return (
      <div key={p.id} className="border border-border rounded-sm overflow-hidden">
        <div className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-surface2 transition-all" onClick={() => setExpandedId(isExpanded ? null : p.id)}>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.color }} />
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[12px] text-text truncate">{p.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[9px]" style={{ color: cfg.color }}>{cfg.label}</span>
              {p.niche && <span className="font-mono text-[9px] text-muted-foreground">{p.niche}</span>}
              {p.targetPrice > 0 && <span className="font-mono text-[9px] text-muted-foreground">${p.targetPrice}</span>}
              {margin && <span className="font-mono text-[9px]" style={{ color: margin >= 35 ? 'var(--accent)' : 'var(--warn)' }}>{margin}% margin</span>}
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />}
        </div>
        {isExpanded && (
          <div className="px-3 pb-3 pt-2 bg-surface2 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Status</div>
                <select className="w-full bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none" value={p.status} onChange={e => onUpdate(p.id, { status: e.target.value as AmazonProduct['status'] })}>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Helium10 Score</div>
                <input type="number" className="w-full bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none" value={p.helium10Score || ''} placeholder="0–100" min={0} max={100} onChange={e => onUpdate(p.id, { helium10Score: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Target Price', field: 'targetPrice', prefix: '$' },
                { label: 'Unit Cost', field: 'unitCost', prefix: '$' },
                { label: 'MOQ', field: 'moq', prefix: '' },
              ].map(({ label, field, prefix }) => (
                <div key={field}>
                  <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">{label}</div>
                  <input type="number" className="w-full bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none" value={(p as any)[field] || ''} placeholder={prefix + '0'} min={0} onChange={e => onUpdate(p.id, { [field]: parseFloat(e.target.value) || 0 })} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Supplier Name', field: 'supplierName' },
                { label: 'Supplier Contact', field: 'supplierContact' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">{label}</div>
                  <input className="w-full bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none" value={(p as any)[field]} onChange={e => onUpdate(p.id, { [field]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              {[
                { label: 'Sample Ordered', field: 'sampleOrdered' },
                { label: 'Sample Approved', field: 'sampleApproved' },
              ].map(({ label, field }) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={(p as any)[field]} onChange={e => onUpdate(p.id, { [field]: e.target.checked })} className="rounded border-border" />
                  <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
                </label>
              ))}
            </div>
            {p.unitCost > 0 && p.targetPrice > 0 && (
              <div className="p-2 rounded-sm bg-surface border border-border">
                <div className="text-[9px] font-mono text-muted-foreground uppercase mb-1">Estimated Margin</div>
                <div className="font-mono text-[14px] font-bold" style={{ color: ((p.targetPrice - p.unitCost) / p.targetPrice * 100) >= 35 ? 'var(--accent)' : 'var(--warn)' }}>
                  {Math.round((p.targetPrice - p.unitCost) / p.targetPrice * 100)}%
                  <span className="text-[10px] font-normal text-muted-foreground ml-2">(${(p.targetPrice - p.unitCost).toFixed(2)} per unit)</span>
                </div>
              </div>
            )}
            <textarea className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm resize-none h-12 focus:outline-none" placeholder="Notes..." value={p.notes} onChange={e => onUpdate(p.id, { notes: e.target.value })} />
            <button onClick={() => { onRemove(p.id); setExpandedId(null) }} className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-danger cursor-pointer transition-all">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--warn)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Amazon Product Tracker</div>
          <div className="font-mono text-[11px] text-muted-foreground mt-0.5">{activeProducts.length} active products</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all tracking-[0.1em] uppercase" style={showForm ? { background: 'var(--warn)', color: 'var(--bg)', borderColor: 'var(--warn)' } : { borderColor: 'var(--warn)', color: 'var(--warn)' }}>
          <Plus className="w-3 h-3" /> Add Product
        </button>
      </div>

      {/* Validation criteria */}
      <div className="mb-4">
        <button onClick={() => setShowCriteria(!showCriteria)} className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] hover:text-text transition-all cursor-pointer">
          {showCriteria ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          7 Validation Criteria
        </button>
        {showCriteria && (
          <div className="mt-2 pl-3 border-l-2 border-warn/40 space-y-1">
            {PRODUCT_VALIDATION_CRITERIA.map((c, i) => (
              <div key={i} className="text-[10px] text-muted-foreground">{i + 1}. {c}</div>
            ))}
          </div>
        )}
      </div>

      {/* Quick add presets */}
      {products.length === 0 && !showForm && (
        <div className="mb-4">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">Tier 1 Candidates from the Plan</div>
          <div className="flex flex-col gap-1.5">
            {PRESET_PRODUCTS.map((p, i) => (
              <div key={i} onClick={() => setForm(f => ({ ...f, name: p.name, niche: p.niche, targetPrice: String(p.targetPrice), estimatedMargin: String(p.estimatedMargin) }))} className="flex items-center justify-between p-2 rounded-sm border border-border cursor-pointer hover:border-warn/60 transition-all bg-surface2">
                <div>
                  <div className="font-mono text-[11px] text-text">{p.name}</div>
                  <div className="font-mono text-[9px] text-muted-foreground">{p.niche} · ${p.targetPrice} · ~{p.estimatedMargin}% margin</div>
                </div>
                <span className="text-[9px] font-mono text-warn">Add →</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-md border bg-surface2 space-y-2" style={{ borderColor: 'var(--warn)30' }}>
          <input className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none" placeholder="Product name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none" placeholder="Niche / category" value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))} />
          <div className="grid grid-cols-3 gap-2">
            {[['targetPrice','Target $'],['estimatedMargin','Margin %'],['helium10Score','H10 Score']].map(([k,l]) => (
              <input key={k} type="number" className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none" placeholder={l} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            ))}
          </div>
          <textarea className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm resize-none h-12 focus:outline-none" placeholder="Notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.name.trim()} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer disabled:opacity-40" style={{ background: 'var(--warn)', color: 'var(--bg)' }}>Save Product</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {activeProducts.map(renderProduct)}
        {cutProducts.length > 0 && (
          <div className="opacity-50">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] my-2">Cut Products</div>
            {cutProducts.map(renderProduct)}
          </div>
        )}
      </div>

      {products.length === 0 && !showForm && PRESET_PRODUCTS.length === 0 && (
        <div className="text-center py-4 text-[11px] font-mono text-muted-foreground">Add products to track from research to live on FBA.</div>
      )}
    </div>
  )
}
