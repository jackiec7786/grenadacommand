"use client"

import { AlertTriangle } from 'lucide-react'

interface CrisisBannerProps {
  cash: number
}

export function CrisisBanner({ cash }: CrisisBannerProps) {
  const monthly = 1300
  const weeks = cash > 0 ? Math.floor((cash / monthly) * 4.33) : 0
  const showCrisis = cash > 0 && weeks < 4

  if (!showCrisis) return null

  return (
    <div className="bg-danger/10 border border-danger rounded p-3.5 px-4.5 mb-5">
      <div className="text-[11px] font-mono text-danger tracking-[0.2em] uppercase mb-1.5 flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5" />
        Cash Crisis Alert
      </div>
      <div className="text-[13px] text-text leading-relaxed">
        Runway under 4 weeks. Activate crisis protocol: Cambly 6hrs/day → Flood research studies
        → Post Google profile offer locally → Reduce costs now.
      </div>
    </div>
  )
}
