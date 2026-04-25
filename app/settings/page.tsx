"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProfileTab } from './_profile'
import { IncomeTab } from './_income'
import { TasksTab } from './_tasks'
import { DataTab } from './_data'
import { AdvancedTab } from './_advanced'
import { MilestonesTab } from './_milestones'
import { ChecklistsTab } from './_checklists'
import { StreamsTab } from './_streams'
import { EventsTab } from './_events'
import { RisksTab } from './_risks'
import { PsychTab } from './_psych'
import { ResilienceTab } from './_resilience'
import { invalidateConfigCache } from '@/hooks/use-config'
import type { MergedConfig } from '@/lib/config'

type Tab = 'profile' | 'income' | 'tasks' | 'milestones' | 'checklists' | 'streams' | 'events' | 'risk' | 'psych' | 'resilience' | 'data' | 'advanced'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile',    label: 'Profile'     },
  { id: 'income',     label: 'Income'      },
  { id: 'tasks',      label: 'Tasks'       },
  { id: 'milestones', label: 'Milestones'  },
  { id: 'checklists', label: 'Checklists'  },
  { id: 'streams',    label: 'Streams'     },
  { id: 'events',     label: 'Events'      },
  { id: 'risk',       label: 'Risk'        },
  { id: 'psych',      label: 'Psych'       },
  { id: 'resilience', label: 'Resilience'  },
  { id: 'data',       label: 'Data'        },
  { id: 'advanced',   label: 'Advanced'    },
]

interface Settings {
  sessionTimeoutDays: number
  currency: 'USD' | 'XCD'
  theme: 'dark' | 'light'
  monthlyGoal: number
}

const DEFAULT_SETTINGS: Settings = { sessionTimeoutDays: 7, currency: 'USD', theme: 'light', monthlyGoal: 2500 }

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [config, setConfig] = useState<MergedConfig | null>(null)
  const [configError, setConfigError] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)

  const loadConfig = () => {
    setConfigError(false)
    setConfigLoading(true)
    fetch('/api/config')
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)))
      .then(d => { if (d) { setConfig(d); } else { setConfigError(true) } })
      .catch(() => setConfigError(true))
      .finally(() => setConfigLoading(false))
  }

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings({ ...DEFAULT_SETTINGS, ...d })).catch(() => setSettings(DEFAULT_SETTINGS))
    loadConfig()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveSettings = async (updates: Partial<Settings>) => {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) setSettings(prev => prev ? { ...prev, ...updates } : prev)
  }

  const saveConfig = async (updates: Record<string, unknown>) => {
    const res = await fetch('/api/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      setConfig(prev => prev ? { ...prev, ...updates } as MergedConfig : prev)
      invalidateConfigCache()
    }
  }

  const tabBtn = (tab: Tab) => ({
    onClick: () => setActiveTab(tab),
    className: 'shrink-0 px-3 py-2 rounded-sm font-mono text-[10px] tracking-[0.1em] uppercase transition-all cursor-pointer',
    style: activeTab === tab
      ? { background: 'var(--primary)', color: 'var(--bg)', fontWeight: 700 }
      : { background: 'transparent', color: 'var(--muted-foreground)', border: '1px solid var(--border)' },
  })

  const configTabs: Tab[] = ['tasks', 'milestones', 'checklists', 'streams', 'events', 'risk', 'psych', 'resilience']
  const needsConfig = configTabs.includes(activeTab)
  const isLoading = !settings || (needsConfig && !config && !configError) || configLoading

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
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

      <nav className="flex gap-1 mb-6 overflow-x-auto pb-1 flex-wrap">
        {TABS.map(tab => <button key={tab.id} {...tabBtn(tab.id)}>{tab.label}</button>)}
      </nav>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface rounded-md border border-border animate-pulse" />)}
        </div>
      ) : (
        <>
          {needsConfig && configError && !config && (
            <div className="p-4 rounded-md space-y-3" style={{ background: 'color-mix(in srgb, var(--danger) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)' }}>
              <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'var(--danger)' }}>
                ⚠ Failed to load configuration. Redis may be unavailable or the response was malformed.
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">Your data is safe. Check Settings → Advanced for Redis status.</p>
              <button onClick={loadConfig} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer transition-all" style={{ background: 'var(--danger)', color: '#fff' }}>
                Retry
              </button>
            </div>
          )}
          {activeTab === 'profile' && settings && (
            <ProfileTab theme={settings.theme} sessionTimeoutDays={settings.sessionTimeoutDays} onSave={saveSettings} />
          )}
          {activeTab === 'income' && settings && (
            <IncomeTab currency={settings.currency} monthlyGoal={settings.monthlyGoal} onSave={saveSettings} />
          )}
          {activeTab === 'tasks' && config && (
            <TasksTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'milestones' && config && (
            <MilestonesTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'checklists' && config && (
            <ChecklistsTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'streams' && config && (
            <StreamsTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'events' && config && (
            <EventsTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'risk' && config && (
            <RisksTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'psych' && config && (
            <PsychTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'resilience' && config && (
            <ResilienceTab config={config} onSaveConfig={saveConfig} />
          )}
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'advanced' && <AdvancedTab />}
        </>
      )}
    </div>
  )
}
