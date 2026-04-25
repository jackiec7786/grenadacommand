"use client"

import { Home, DollarSign, TrendingUp, Briefcase, Heart, Wrench } from 'lucide-react'

type Tab = 'today' | 'finances' | 'progress' | 'business' | 'wellbeing' | 'tools'

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'today',     label: 'Today',    icon: <Home className="w-5 h-5" /> },
  { id: 'finances',  label: 'Money',    icon: <DollarSign className="w-5 h-5" /> },
  { id: 'progress',  label: 'Progress', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'business',  label: 'Business', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'wellbeing', label: 'Wellbeing',icon: <Heart className="w-5 h-5" /> },
  { id: 'tools',     label: 'Tools',    icon: <Wrench className="w-5 h-5" /> },
]

interface Props {
  activeTab: Tab
  visibleTabs: Tab[]
  onTabChange: (tab: Tab) => void
  onMorePress: () => void
}

export function BottomNav({ activeTab, visibleTabs, onTabChange, onMorePress }: Props) {
  const items = NAV_ITEMS.filter(n => visibleTabs.includes(n.id))
  const showMore = items.length < NAV_ITEMS.length

  const allItems = showMore ? items.slice(0, 4) : items

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {allItems.map(item => {
        const active = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-all cursor-pointer"
            style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
          >
            {item.icon}
            <span className="font-mono text-[9px] tracking-[0.05em]">{item.label}</span>
            {active && (
              <span
                className="absolute bottom-0 w-8 h-[2px] rounded-full"
                style={{ background: 'var(--primary)' }}
              />
            )}
          </button>
        )
      })}
      {showMore && (
        <button
          onClick={onMorePress}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] cursor-pointer"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <span className="text-lg leading-none">⋯</span>
          <span className="font-mono text-[9px] tracking-[0.05em]">More</span>
        </button>
      )}
    </nav>
  )
}
