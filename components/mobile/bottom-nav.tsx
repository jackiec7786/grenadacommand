"use client"

import { useState } from 'react'
import { Home, DollarSign, TrendingUp, Briefcase, Heart, Wrench, Lock, X } from 'lucide-react'

type Tab = 'today' | 'finances' | 'progress' | 'business' | 'wellbeing' | 'tools'

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; minPhase: number }[] = [
  { id: 'today',     label: 'Today',     icon: <Home className="w-5 h-5" />,       minPhase: 1 },
  { id: 'finances',  label: 'Money',     icon: <DollarSign className="w-5 h-5" />, minPhase: 1 },
  { id: 'progress',  label: 'Progress',  icon: <TrendingUp className="w-5 h-5" />, minPhase: 1 },
  { id: 'business',  label: 'Business',  icon: <Briefcase className="w-5 h-5" />,  minPhase: 2 },
  { id: 'wellbeing', label: 'Wellbeing', icon: <Heart className="w-5 h-5" />,      minPhase: 3 },
  { id: 'tools',     label: 'Tools',     icon: <Wrench className="w-5 h-5" />,     minPhase: 4 },
]

const OVERRIDES_KEY = 'grenada:unlocked-tabs'

function getOverrides(): Set<Tab> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function saveOverride(tab: Tab) {
  try {
    const overrides = getOverrides()
    overrides.add(tab)
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify([...overrides]))
  } catch {}
}

interface Props {
  activeTab: Tab
  visibleTabs: Tab[]
  currentPhase: number
  onTabChange: (tab: Tab) => void
  onMorePress: () => void
}

export function BottomNav({ activeTab, visibleTabs, currentPhase, onTabChange, onMorePress }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const items = NAV_ITEMS.filter(n => visibleTabs.includes(n.id))
  const showMore = items.length < NAV_ITEMS.length || items.length > 4

  const barItems = showMore ? items.slice(0, 4) : items
  const overflowItems = items.slice(4)

  const handleTabSelect = (id: Tab) => {
    onTabChange(id)
    setSheetOpen(false)
  }

  const handleLockedTabTap = (item: typeof NAV_ITEMS[0]) => {
    const overrides = getOverrides()
    if (overrides.has(item.id)) {
      handleTabSelect(item.id)
      return
    }
    const confirmed = window.confirm(
      `${item.label} tab is designed for Phase ${item.minPhase}+. You're currently in Phase ${currentPhase}. Open anyway?`
    )
    if (confirmed) {
      saveOverride(item.id)
      handleTabSelect(item.id)
    }
  }

  const handleSettingsPress = () => {
    setSheetOpen(false)
    onMorePress()
  }

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {barItems.map(item => {
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] transition-all cursor-pointer relative"
              style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
            >
              {item.icon}
              <span className="font-mono text-[9px] tracking-[0.05em]">{item.label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-[2px] rounded-full" style={{ background: 'var(--primary)' }} />
              )}
            </button>
          )
        })}

        {showMore && (
          <button
            onClick={() => setSheetOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] cursor-pointer relative"
            style={{ color: overflowItems.some(t => t.id === activeTab) ? 'var(--primary)' : 'var(--muted-foreground)' }}
          >
            <span className="text-lg leading-none font-bold">⋯</span>
            <span className="font-mono text-[9px] tracking-[0.05em]">More</span>
            {overflowItems.some(t => t.id === activeTab) && (
              <span className="absolute bottom-0 w-8 h-[2px] rounded-full" style={{ background: 'var(--primary)' }} />
            )}
          </button>
        )}
      </nav>

      {/* Tab picker sheet */}
      {sheetOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-[55]"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-[60] rounded-t-2xl"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderBottom: 'none',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div className="mx-auto mt-3 w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />

            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <div>
                <div className="text-[9px] font-mono tracking-[0.2em] text-primary uppercase">// Navigation</div>
                <h2 className="font-mono text-[15px] font-bold text-text">Switch Tab</h2>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-2 rounded-md text-muted-foreground hover:text-text cursor-pointer transition-all"
                style={{ border: '1px solid var(--border)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const unlocked = visibleTabs.includes(item.id)
                const active = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => unlocked ? handleTabSelect(item.id) : handleLockedTabTap(item)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: active ? 'var(--primary)15' : 'var(--surface2)',
                      border: `1px solid ${active ? 'var(--primary)40' : 'var(--border)'}`,
                      opacity: unlocked ? 1 : 0.55,
                    }}
                  >
                    <span style={{ color: active ? 'var(--primary)' : unlocked ? 'var(--text)' : 'var(--muted-foreground)' }}>
                      {unlocked ? item.icon : <Lock className="w-5 h-5" />}
                    </span>
                    <span
                      className="flex-1 font-mono text-[13px] text-left"
                      style={{ color: active ? 'var(--primary)' : 'var(--text)', fontWeight: active ? 700 : 400 }}
                    >
                      {item.label}
                    </span>
                    {!unlocked && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: 'var(--dim)', color: 'var(--muted-foreground)' }}>
                        Phase {item.minPhase}+
                      </span>
                    )}
                    {active && (
                      <span className="font-mono text-[9px]" style={{ color: 'var(--primary)' }}>●</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={handleSettingsPress}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-mono text-[12px]"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
              >
                <span className="text-base">☰</span>
                Settings &amp; Menu
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
