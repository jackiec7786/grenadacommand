"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  title: string
  accentColor?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function MobileCard({ title, accentColor, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTopWidth: accentColor ? 3 : 1,
        borderTopColor: accentColor ?? 'var(--border)',
      }}
    >
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer transition-all"
        style={{ background: 'var(--surface2)' }}
      >
        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-text font-bold">{title}</span>
        <ChevronDown
          className="w-4 h-4 text-muted-foreground transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && <div className="px-4 py-4">{children}</div>}
    </div>
  )
}
