"use client"

import { Drawer } from 'vaul'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}

export function BottomSheet({ open, onOpenChange, title, children }: Props) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl outline-none max-h-[90vh] flex flex-col"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderBottom: 'none' }}
        >
          <div className="mx-auto mt-3 mb-1 w-10 h-1 rounded-full shrink-0" style={{ background: 'var(--border)' }} />
          <div className="px-5 pt-2 pb-2 shrink-0">
            <div className="text-[9px] font-mono tracking-[0.2em] text-primary uppercase mb-0.5">// Form</div>
            <h2 className="font-mono text-[15px] font-bold text-text">{title}</h2>
          </div>
          <div className="overflow-y-auto flex-1 px-5 pb-6" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
