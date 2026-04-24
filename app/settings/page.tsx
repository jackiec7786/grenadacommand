"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProfileTab } from './_profile'
import { IncomeTab } from './_income'
import { TasksTab } from './_tasks'
import { DataTab } from './_data'
import { AdvancedTab } from './_advanced'

type Tab = 'profile' | 'income' | 'tasks' | 'data' | 'advanced'
const TABS: { id: Tab; label: string }[] = [
  { id: 'profile',  label: 'Profile'   },
  { id: 'income',   label: 'Income'    },
  { id: 'tasks',    label: 'Tasks'     },
  { id: 'data',     label: 'Data'      },
  { id: 'advanced', label: 'Advanced'  },
]

interface Settings {
  sessionTimeoutDays: number
  currency: 'USD' | 'XCD'
  theme: 'dark' | 'light'
  monthlyGoal: number
  customTaskLists: Record<number, { label: string; tag: string; time: string }[]> | null
  customIncomeSources: { id: string; name: string; max: number }[] | null
}

const DEFAULTS: Settings = { sessionTimeoutDays: 7, currency: 'USD', theme: 'light', monthlyGoal: 2500, customTaskLists: null, customIncomeSources: null }

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => setSettings(DEFAULTS))
  }, [])

  const save = async (updates: Partial<Settings>) => {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) setSettings(prev => prev ? { ...prev, ...updates } : prev)
  }

  const tabBtn = (tab: Tab) => ({
    onClick: () => setActiveTab(tab),
    className: 'shrink-0 px-4 py-2 rounded-sm font-mono text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer',
    style: activeTab === tab
      ? { background: 'var(--primary)', color: 'var(--bg)', fontWeight: 700 }
      : { background: 'transparent', color: 'var(--muted-foreground)', border: '1px solid var(--border)' },
  })

  return (
    <div className="max-w-[760px] mx-auto px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-text transition-all">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>
        <span className="text-muted-foreground text-[11px]">/</span>
        <span className="text-[11px] font-mono text-text">Settings</span>
      </div>

      <div className="mb-6">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-1">// Grenada Command Center</div>
        <h1 className="text-[24px] font-extrabold text-text">Settings</h1>
      </div>

      <nav className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(tab => <button key={tab.id} {...tabBtn(tab.id)}>{tab.label}</button>)}
      </nav>

      {!settings ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface rounded-md border border-border animate-pulse" />)}
        </div>
      ) : (
        <>
          {activeTab === 'profile' && (
            <ProfileTab theme={settings.theme} sessionTimeoutDays={settings.sessionTimeoutDays} onSave={save} />
          )}
          {activeTab === 'income' && (
            <IncomeTab currency={settings.currency} monthlyGoal={settings.monthlyGoal} customSources={settings.customIncomeSources} onSave={save} />
          )}
          {activeTab === 'tasks' && (
            <TasksTab customTaskLists={settings.customTaskLists} onSave={save} />
          )}
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'advanced' && <AdvancedTab />}
        </>
      )}
    </div>
  )
}
