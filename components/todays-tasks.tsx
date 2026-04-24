"use client"

import { useState, useEffect } from 'react'
import { TASKS, PHASE_CONFIGS } from '@/lib/data'
import { Check, Pencil, Timer } from 'lucide-react'

type Task = { label: string; tag: string; time: string }
type TaskLists = Record<number, Task[]>

const VISIBLE_DEFAULT = 3

interface TodaysTasksProps {
  currentPhase: number
  onPhaseChange: (phase: number) => void
  tasks: Record<string, Record<number, boolean>>
  onTaskToggle: (phaseKey: string, index: number) => void
  onStartTimer?: (label: string) => void
}

export function TodaysTasks({ currentPhase, onPhaseChange, tasks, onTaskToggle, onStartTimer }: TodaysTasksProps) {
  const phaseKey = `p${currentPhase}`
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]

  const [customLists, setCustomLists] = useState<TaskLists | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d?.customTaskLists) setCustomLists(d.customTaskLists)
    }).catch(() => {})
  }, [])

  const phaseTasks: Task[] = (customLists?.[currentPhase] ?? TASKS[currentPhase]) || []
  const phaseDone = tasks[phaseKey] || {}
  const doneCount = Object.values(phaseDone).filter(Boolean).length

  const getLists = (): TaskLists => {
    const base: TaskLists = {}
    for (const p of [1, 2, 3, 4]) base[p] = customLists?.[p] ?? TASKS[p].map(t => ({ ...t }))
    return base
  }

  const saveCustom = async (next: TaskLists) => {
    setSaving(true)
    await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customTaskLists: next }) }).catch(() => {})
    setCustomLists(next)
    setSaving(false)
  }

  const removeTask = (i: number) => {
    const next = getLists()
    next[currentPhase] = next[currentPhase].filter((_, idx) => idx !== i)
    saveCustom(next)
  }

  const commitEdit = () => {
    if (editIdx !== null && editLabel.trim()) {
      const next = getLists()
      next[currentPhase] = next[currentPhase].map((t, i) => i === editIdx ? { ...t, label: editLabel.trim() } : t)
      saveCustom(next)
    }
    setEditIdx(null)
  }

  const addTask = () => {
    if (!newLabel.trim()) return
    const next = getLists()
    next[currentPhase] = [...next[currentPhase], { label: newLabel.trim(), tag: 'TASK', time: 'varies' }]
    saveCustom(next)
    setNewLabel('')
  }

  const visibleTasks = expanded || editMode ? phaseTasks : phaseTasks.slice(0, VISIBLE_DEFAULT)
  const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent flex-1'

  return (
    <div className="bg-surface border border-border rounded-md p-5 animate-fade-slide-in" style={{ borderTopWidth: 2, borderTopColor: config.cssColor, animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">{"// Today's Focus"}</div>
        <button onClick={() => setEditMode(e => !e)} title="Edit tasks" className="cursor-pointer text-muted-foreground hover:text-text transition-all min-h-[36px] px-1">
          <Pencil className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-1.5 mb-2 flex-wrap">
        {[1, 2, 3, 4].map(p => {
          const cfg = PHASE_CONFIGS[p as keyof typeof PHASE_CONFIGS]
          return (
            <button key={p} onClick={() => onPhaseChange(p)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-sm border cursor-pointer transition-all tracking-[0.1em] min-h-[36px]"
              style={currentPhase === p ? { background: cfg.cssColor, color: 'var(--bg)', borderColor: cfg.cssColor, fontWeight: 600 } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
              {cfg.name}
            </button>
          )
        })}
      </div>

      <div className="text-[10px] font-mono text-muted-foreground mb-3 leading-relaxed">{config.focus}</div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1 bg-dim rounded-sm overflow-hidden">
          <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${phaseTasks.length > 0 ? (doneCount / phaseTasks.length) * 100 : 0}%`, background: config.cssColor }} />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground shrink-0">{doneCount}/{phaseTasks.length}</span>
      </div>

      {phaseTasks.length === 0 ? (
        <div className="text-center py-6 text-[11px] font-mono text-muted-foreground">
          No tasks for this phase yet.
          <button onClick={() => setEditMode(true)} className="block mx-auto mt-2 text-accent hover:underline cursor-pointer">Add your first task →</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleTasks.map((task, i) => {
            const isDone = !!phaseDone[i]
            return (
              <div key={i} className="flex items-start gap-3 p-2.5 px-3 rounded border transition-all bg-surface2 border-border group min-h-[44px]">
                {editMode ? (
                  <>
                    {editIdx === i ? (
                      <input autoFocus className={inp} value={editLabel} onChange={e => setEditLabel(e.target.value)}
                        onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditIdx(null) }} />
                    ) : (
                      <span className="flex-1 font-mono text-[12px] text-text cursor-text hover:text-primary" onClick={() => { setEditIdx(i); setEditLabel(task.label) }}>
                        {task.label}
                      </span>
                    )}
                    <button onClick={() => removeTask(i)} className="text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer shrink-0 min-w-[24px]">×</button>
                  </>
                ) : (
                  <>
                    <div onClick={() => onTaskToggle(phaseKey, i)}
                      className="w-[18px] h-[18px] border-2 rounded-sm shrink-0 flex items-center justify-center transition-all mt-0.5 cursor-pointer"
                      style={isDone ? { background: config.cssColor, borderColor: config.cssColor } : { borderColor: 'var(--muted)' }}>
                      {isDone && <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />}
                    </div>
                    <span onClick={() => onTaskToggle(phaseKey, i)}
                      className={`text-[13px] leading-relaxed flex-1 cursor-pointer ${isDone ? 'text-muted-foreground line-through' : 'text-text'}`}>
                      {task.label}
                    </span>
                    <div className="flex flex-col items-end gap-1 ml-auto shrink-0">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-dim text-muted-foreground tracking-[0.1em]">{task.tag}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">{task.time}</span>
                    </div>
                    {onStartTimer && !isDone && (
                      <button onClick={() => onStartTimer(task.label)} title="Start timer"
                        className="opacity-0 group-hover:opacity-100 ml-1 text-muted-foreground hover:text-accent transition-all cursor-pointer min-w-[24px] shrink-0 flex items-center justify-center">
                        <Timer className="w-3 h-3" />
                      </button>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!editMode && phaseTasks.length > VISIBLE_DEFAULT && (
        <button onClick={() => setExpanded(p => !p)}
          className="mt-2 text-[10px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all min-h-[36px] flex items-center gap-1">
          {expanded ? '▲ Show less' : `▼ Show ${phaseTasks.length - VISIBLE_DEFAULT} more`}
        </button>
      )}

      {editMode && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <input className={inp} placeholder="New task label..." value={newLabel} onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask() }} />
          <button onClick={addTask} disabled={!newLabel.trim() || saving}
            className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40 min-h-[36px]"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            {saving ? '...' : 'Add'}
          </button>
        </div>
      )}
    </div>
  )
}
