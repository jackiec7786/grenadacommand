"use client"

import { Drawer } from 'vaul'
import Link from 'next/link'
import { Settings, LogOut, Sun, Moon, Download } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onLogout: () => void
  onExport: () => void
}

export function MobileDrawer({ open, onOpenChange, theme, onToggleTheme, onLogout, onExport }: Props) {
  const close = () => onOpenChange(false)

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderBottom: 'none' }}
        >
          <div className="mx-auto mt-3 mb-1 w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
          <div className="px-5 py-4 space-y-1" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
            <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase mb-3">// Menu</div>

            <Link href="/settings" onClick={close}
              className="flex items-center gap-3 px-3 py-3.5 rounded-md cursor-pointer transition-all"
              style={{ background: 'var(--surface2)' }}
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-[13px] text-text">Settings</span>
            </Link>

            <button onClick={() => { onToggleTheme(); close() }}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-md cursor-pointer transition-all"
              style={{ background: 'var(--surface2)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
              <span className="font-mono text-[13px] text-text">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button onClick={() => { onExport(); close() }}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-md cursor-pointer transition-all"
              style={{ background: 'var(--surface2)' }}
            >
              <Download className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-[13px] text-text">Export Data</span>
            </button>

            <button onClick={() => { onLogout(); close() }}
              className="w-full flex items-center gap-3 px-3 py-3.5 rounded-md cursor-pointer transition-all"
              style={{ background: 'var(--surface2)' }}
            >
              <LogOut className="w-4 h-4" style={{ color: 'var(--danger)' }} />
              <span className="font-mono text-[13px]" style={{ color: 'var(--danger)' }}>Sign Out</span>
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
