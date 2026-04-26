"use client"

import { useState, useEffect } from 'react'

const BASE_CURRENCIES = [
  { code: 'USD', symbol: '$',   name: 'US Dollar',          flag: '🇺🇸', fallback: 1 },
  { code: 'XCD', symbol: 'EC$', name: 'EC Dollar (Grenada)', flag: '🇬🇩', fallback: 2.70 }, // Fixed peg
  { code: 'GBP', symbol: '£',   name: 'British Pound',      flag: '🇬🇧', fallback: 0.787 },
  { code: 'EUR', symbol: '€',   name: 'Euro',               flag: '🇪🇺', fallback: 0.923 },
  { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar',    flag: '🇨🇦', fallback: 1.365 },
  { code: 'TTD', symbol: 'TT$', name: 'Trinidad Dollar',    flag: '🇹🇹', fallback: 6.78 },
]

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500, 1000]

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('XCD')
  const [rates, setRates] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    fetch('/api/rates')
      .then(r => r.json())
      .then((data: Record<string, number> | null) => { if (data) setRates(data) })
      .catch(() => {})
  }, [])

  const getRate = (code: string) => {
    if (code === 'XCD') return 2.70 // Always use fixed peg
    if (rates) return rates[code] ?? BASE_CURRENCIES.find(c => c.code === code)!.fallback
    return BASE_CURRENCIES.find(c => c.code === code)!.fallback
  }

  const amountN = parseFloat(amount) || 0
  const from = BASE_CURRENCIES.find(c => c.code === fromCurrency)!
  const to = BASE_CURRENCIES.find(c => c.code === toCurrency)!
  const inUSD = amountN / getRate(fromCurrency)
  const result = inUSD * getRate(toCurrency)

  const swap = () => { setFromCurrency(toCurrency); setToCurrency(fromCurrency) }

  const contextLabel = () => {
    if (fromCurrency === 'USD' && toCurrency === 'XCD') {
      const ecd = result
      if (amountN <= 20) return `~${ecd.toFixed(0)} EC for small local purchases`
      if (amountN <= 100) return `~${ecd.toFixed(0)} EC — groceries / transport budget`
      if (amountN <= 500) return `~${ecd.toFixed(0)} EC — weekly living costs`
      return `~${ecd.toFixed(0)} EC — monthly rent territory`
    }
    if (fromCurrency === 'XCD' && toCurrency === 'USD') {
      if (amountN <= 50) return `${result.toFixed(2)} USD — small daily expense`
      if (amountN <= 300) return `${result.toFixed(2)} USD — ~${(result / 10.20).toFixed(1)} Cambly hours to earn this`
    }
    return null
  }
  const context = contextLabel()

  return (
    <div className="bg-surface border border-border rounded-md p-4" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Currency Converter</div>
        {rates
          ? <span className="text-[9px] font-mono text-primary">● Live rates</span>
          : <span className="text-[9px] font-mono text-muted-foreground">Fallback rates</span>
        }
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[14px] text-muted-foreground">{from.symbol}</span>
          <input
            type="number"
            className="w-full bg-dim border border-border text-text font-mono text-[20px] font-bold px-10 py-3 rounded-sm focus:outline-none focus:border-primary text-right"
            value={amount}
            min={0}
            onChange={e => setAmount(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-muted-foreground">{fromCurrency}</span>
        </div>
      </div>

      {/* Currency pair selectors */}
      <div className="flex flex-col items-stretch gap-2 mb-4">
        <select className="flex-1 bg-dim border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-primary min-h-[44px]" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
          {BASE_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
        </select>
        <button onClick={swap} className="w-full px-4 py-2 rounded-sm border border-border text-muted-foreground hover:text-text hover:border-muted-foreground transition-all cursor-pointer font-mono text-sm min-h-[44px]">⇄ Swap</button>
        <select className="flex-1 bg-dim border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-primary min-h-[44px]" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
          {BASE_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
        </select>
      </div>

      {/* Result */}
      <div className="p-4 rounded-md border mb-4 text-center" style={{ borderColor: 'var(--accent)30', background: 'var(--accent)06' }}>
        <div className="font-mono text-[11px] text-muted-foreground mb-1">{amountN} {fromCurrency} =</div>
        <div className="font-mono text-[28px] font-extrabold text-primary leading-none break-all">
          {to.symbol}{result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="font-mono text-[11px] text-muted-foreground mt-1">{toCurrency}</div>
        {context && (
          <div className="font-mono text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">{context}</div>
        )}
      </div>

      {/* Quick amounts */}
      <div>
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">Quick amounts ({fromCurrency})</div>
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_AMOUNTS.map(a => (
            <button key={a} onClick={() => setAmount(String(a))} className="text-[10px] font-mono px-1 py-2 rounded-sm border cursor-pointer transition-all min-h-[40px]" style={parseFloat(amount) === a ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
              {from.symbol}{a}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border space-y-1">
        <div className="text-[9px] font-mono text-muted-foreground">
          🔒 USD/XCD is fixed at 2.70 — Eastern Caribbean Currency Union peg, permanent
        </div>
        <div className="text-[9px] font-mono text-muted-foreground">
          {rates ? 'Rates updated every 6 hours — check Wise before moving money' : 'Using fallback rates — check Wise for exact transfer rates'}
        </div>
      </div>
    </div>
  )
}
