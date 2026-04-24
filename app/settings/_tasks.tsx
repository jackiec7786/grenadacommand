"use client"

import { useState } from 'react'
import { TASKS, PHASE_CONFIGS } from '@/lib/data'

type Task = { label: string; tag: string; time: string }
type TaskLists = Record<number, Task[]>

interface Props {
  customTaskLists: TaskLists | null
  onSave: (data: { customTaskLists: TaskLists | null }) => Promise<void>
}

export function TasksTab({ customTaskLists, onSave }: Props) {
  const [phase, setPhase] = useState(1)
  const [lists, setLists] = useState<TaskLists>(() => {
    if (customTaskLists) return customTaskLists
    const copy: TaskLists = {}
    for (const p of [1, 2, 3, 4]) copy[p] = TASKS[p].map(t => ({ ...t }))
    return copy
  })
  const [newLabel, setNewLabel] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newTime, setNewTime] = useState('')
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent'
  const phaseTasks = lists[phase] ?? []

  const removeTask = (i: number) => setLists(prev => ({ ...prev, [phase]: prev[phase].filter((_, idx) => idx !== i) }))
  const addTask = () => {
    if (!newLabel.trim()) return
    setLists(prev => ({ ...prev, [phase]: [...(prev[phase] ?? []), { label: newLabel.trim(), tag: newTag.trim() || 'TASK', time: newTime.trim() || 'varies' }] }))
    setNewLabel(''); setNewTag(''); setNewTime('')
  }
  const startEdit = (i: number) => { setEditIdx(i); setEditLabel(phaseTasks[i].label) }
  const commitEdit = () => {
    if (editIdx !== null && editLabel.trim()) {
      setLists(prev => ({ ...prev, [phase]: prev[phase].map((t, i) => i === editIdx ? { ...t, label: editLabel.trim() } : t) }))
    }
    setEditIdx(null)
  }
  const handleSave = async () => {
    setSaving(true)
    await onSave({ customTaskLists: lists })
    setSaving(false)
  }
  const resetPhase = () => setLists(prev => ({ ...prev, [phase]: TASKS[phase].map(t => ({ ...t })) }))
  const resetAll = () => {
    const copy: TaskLists = {}
    for (const p of [1, 2, 3, 4]) copy[p] = TASKS[p].map(t => ({ ...t }))
    setLists(copy)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-wrap">
        {([1, 2, 3, 4] as const).map(p => {
          const cfg = PHASE_CONFIGS[p]
          return (
            <button key={p} onClick={() => setPhase(p)} className="px-3 py-1.5 rounded-sm font-mono text-[10px] cursor-pointer border transition-all"
              style={phase === p ? { background: cfg.cssColor, color: 'var(--bg)', borderColor: cfg.cssColor } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {cfg.name}
            </button>
          )
        })}
      </div>

      <div className="bg-surface2 border border-border rounded-md p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Phase {phase} Tasks</div>
          <button onClick={resetPhase} className="text-[9px] font-mono text-muted-foreground hover:text-danger cursor-pointer">Reset phase</button>
        </div>

        {phaseTasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-sm bg-surface border border-border group">
            {editIdx === i ? (
              <input autoFocus className={`${inp} flex-1`} value={editLabel} onChange={e => setEditLabel(e.target.value)}
                onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditIdx(null) }} />
            ) : (
              <span className="flex-1 font-mono text-[11px] text-text cursor-pointer hover:text-primary" onClick={() => startEdit(i)}>
                {task.label}
              </span>
            )}
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-dim text-muted-foreground shrink-0">{task.tag}</span>
            <span className="text-[9px] font-mono text-muted-foreground shrink-0 w-12 text-right">{task.time}</span>
            <button onClick={() => removeTask(i)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all">×</button>
          </div>
        ))}

        <div className="pt-2 space-y-2 border-t border-border mt-2">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Add task</div>
          <input className={`${inp} w-full`} placeholder="Task label *" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inp} placeholder="Tag (e.g. UPWORK)" value={newTag} onChange={e => setNewTag(e.target.value)} />
            <input className={inp} placeholder="Time (e.g. 30min)" value={newTime} onChange={e => setNewTime(e.target.value)} />
          </div>
          <button onClick={addTask} disabled={!newLabel.trim()} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            Add Task
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save All Tasks'}
        </button>
        <button onClick={resetAll} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset All Phases
        </button>
      </div>
    </div>
  )
}
