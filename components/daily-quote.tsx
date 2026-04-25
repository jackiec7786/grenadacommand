"use client"

import { useState, useEffect } from 'react'
import type { QuoteResponse } from '@/app/api/quote/route'

function todayKey() {
  return `quote-dismissed-${new Date().toISOString().slice(0, 10)}`
}

export function DailyQuote() {
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(todayKey())) {
      setDismissed(true)
      setLoading(false)
      return
    }
    fetch('/api/quote')
      .then(r => r.json())
      .then(d => { setQuote(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(todayKey(), '1')
    setDismissed(true)
  }

  const handleCopy = async () => {
    if (!quote) return
    await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNew = () => {
    setLoading(true)
    fetch('/api/quote?refresh=1')
      .then(r => r.json())
      .then(d => { setQuote(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  if (dismissed) return null

  if (loading) {
    return (
      <div className="rounded-md border border-border bg-surface p-4 animate-pulse">
        <div className="h-3 bg-dim rounded w-3/4 mb-2" />
        <div className="h-3 bg-dim rounded w-1/2" />
      </div>
    )
  }

  if (!quote) return null

  return (
    <div className="rounded-md border border-border bg-surface p-4 relative" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--primary)' }}>
      <div className="text-[9px] font-mono tracking-[0.2em] text-primary uppercase mb-2">// Daily Quote</div>
      <p className="font-mono text-[12px] text-text leading-relaxed mb-1">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="font-mono text-[10px] text-muted-foreground">— {quote.author}</p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCopy}
          className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-sm border border-border text-muted-foreground hover:text-text transition-all cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleNew}
          className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-sm border border-border text-muted-foreground hover:text-text transition-all cursor-pointer"
        >
          New Quote
        </button>
        <button
          onClick={handleDismiss}
          className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-sm border border-border text-muted-foreground hover:text-danger transition-all cursor-pointer ml-auto"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
