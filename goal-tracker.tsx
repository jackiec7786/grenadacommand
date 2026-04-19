"use client"

import { useState } from 'react'
import { type Goal, type GoalSubTask, PHASE_CONFIGS } from '@/lib/data'
import { Plus, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface GoalTrackerProps {
  goals: Goal[]
  currentPhase: number
  onAdd: (goal: Goal) => void
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void
  onRemove: (id: string) => void
}

const STATUS_STYLES: Record<Goal['status'], { color: string; label: string }> = {
  'not-started': { color: 'var(--muted)',   label: 'Not started' },
  'in-progress':  { color: 'var(--warn)',    label: 'In progress' },
  'complete':     { color: 'var(--accent)',  label: 'Complete' },
  'blocked':      { color: 'var(--danger)',  label: 'Blocked' },
}

export function GoalTracker({ goals, currentPhase, onAdd, onUpdateGoal, onRemove }: GoalTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newSubTask, setNewSubTask] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ title: '', phase: currentPhase, targetDate: '', status: 'not-started' as Goal['status'], notes: '' })

  const handleAdd = () => {
    if (!form.title.trim()) return
    onAdd({
      id: `goal-${Date.now()}`,
      title: form.title,
      phase: form.phase,
      targetDate: form.targetDate,
      status: form.status,
      subTasks: [],
      notes: form.notes,
    })
    setForm({ title: '', phase: currentPhase, targetDate: '', status: 'not-started', notes: '' })
    setShowForm(false)
  }

  const addSubTask = (goalId: string) => {
    const text = newSubTask[goalId]?.trim()
    if (!text) return
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    const subTask: GoalSubTask = { id: `st-${Date.now()}`, text, done: false }
    onUpdateGoal(goalId, { subTasks: [...goal.subTasks, subTask] })
    setNewSubTask(s => ({ ...s, [goalId]: '' }))
  }

  const toggleSubTask = (goalId: string, subId: string) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    const updated = goal.subTasks.map(st => st.id === subId ? { ...st, done: !st.done } : st)
    const allDone = updated.every(st => st.done)
    onUpdateGoal(goalId, { subTasks: updated, status: allDone && updated.length > 0 ? 'complete' : goal.status })
  }

  const phaseGoals = goals.filter(g => g.phase === currentPhase)
  const otherGoals = goals.filter(g => g.phase !== currentPhase)
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]

  const renderGoal = (goal: Goal) => {
    const isExpanded = expandedId === goal.id
    const statusStyle = STATUS_STYLES[goal.status]
    const doneSubs = goal.subTasks.filter(s => s.done).length
    const subPct = goal.subTasks.length > 0 ? Math.round((doneSubs / goal.subTasks.length) * 100) : 0

    return (
      <div key={goal.id} className="border border-border rounded-sm overflow-hidden">
        <div
          className="flex items-start gap-2.5 p-2.5 cursor-pointer hover:bg-surface2 transition-all"
          onClick={() => setExpandedId(isExpanded ? null : goal.id)}
        >
          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: statusStyle.color }} />
          <div className="flex-1 min-w-0">
            <div className={`font-mono text-[12px] leading-snug ${goal.status === 'complete' ? 'line-through text-muted-foreground' : 'text-text'}`}>
              {goal.title}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[9px]" style={{ color: statusStyle.color }}>{statusStyle.label}</span>
              {goal.targetDate && <span className="font-mono text-[9px] text-muted-foreground">→ {goal.targetDate}</span>}
              {goal.subTasks.length > 0 && <span className="font-mono text-[9px] text-muted-foreground">{doneSubs}/{goal.subTasks.length} steps</span>}
            </div>
            {goal.subTasks.length > 0 && (
              <div className="mt-1.5 h-1 bg-dim rounded-sm overflow-hidden">
                <div className="h-full rounded-sm transition-all duration-300" style={{ width: `${subPct}%`, background: statusStyle.color }} />
              </div>
            )}
          </div>
          {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />}
        </div>

        {isExpanded && (
          <div className="px-3 pb-3 pt-2 bg-surface2 border-t border-border space-y-3">
            {/* Status + Date */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Status</div>
                <select
                  className="bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm w-full focus:outline-none"
                  value={goal.status}
                  onChange={e => onUpdateGoal(goal.id, { status: e.target.value as Goal['status'] })}
                >
                  {Object.entries(STATUS_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Target Date</div>
                <input type="date" className="bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm w-full focus:outline-none" value={goal.targetDate} onChange={e => onUpdateGoal(goal.id, { targetDate: e.target.value })} />
              </div>
            </div>

            {/* Sub-tasks */}
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">Steps</div>
              <div className="flex flex-col gap-1.5 mb-2">
                {goal.subTasks.map(st => (
                  <div key={st.id} className="flex items-center gap-2">
                    <div
                      onClick={() => toggleSubTask(goal.id, st.id)}
                      className="w-4 h-4 border-2 rounded-sm shrink-0 flex items-center justify-center cursor-pointer transition-all"
                      style={st.done ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : { borderColor: 'var(--muted)' }}
                    >
                      {st.done && <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />}
                    </div>
                    <span className={`text-[12px] flex-1 ${st.done ? 'line-through text-muted-foreground' : 'text-text'}`}>{st.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none"
                  placeholder="Add a step..."
                  value={newSubTask[goal.id] || ''}
                  onChange={e => setNewSubTask(s => ({ ...s, [goal.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addSubTask(goal.id)}
                />
                <button onClick={() => addSubTask(goal.id)} className="px-3 py-1.5 rounded-sm font-mono text-[10px] cursor-pointer" style={{ background: 'var(--dim)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                  Add
                </button>
              </div>
            </div>

            {goal.notes && (
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-0.5">Notes</div>
                <div className="text-[11px] text-text">{goal.notes}</div>
              </div>
            )}

            <button onClick={() => { onRemove(goal.id); setExpandedId(null) }} className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-danger transition-all cursor-pointer">
              <Trash2 className="w-3 h-3" /> Remove goal
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: config.cssColor }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Goals & Sub-tasks</div>
          <div className="font-mono text-[11px] text-muted-foreground mt-0.5">{goals.filter(g => g.status === 'complete').length}/{goals.length} complete</div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all tracking-[0.1em] uppercase"
          style={showForm
            ? { background: config.cssColor, color: 'var(--bg)', borderColor: config.cssColor }
            : { borderColor: config.cssColor, color: config.cssColor }
          }
        >
          <Plus className="w-3 h-3" /> Add Goal
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-md border bg-surface2 space-y-2" style={{ borderColor: config.cssColor + '40' }}>
          <input className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none" placeholder="Goal title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground mb-1">Phase</div>
              <select className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm" value={form.phase} onChange={e => setForm(f => ({ ...f, phase: Number(e.target.value) }))}>
                {[1, 2, 3, 4].map(p => <option key={p} value={p}>Phase {p} — {PHASE_CONFIGS[p as keyof typeof PHASE_CONFIGS].name}</option>)}
              </select>
            </div>
            <div>
              <div className="text-[9px] font-mono text-muted-foreground mb-1">Target Date</div>
              <input type="date" className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
            </div>
          </div>
          <input className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.title.trim()} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer disabled:opacity-40" style={{ background: config.cssColor, color: 'var(--bg)' }}>Save Goal</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* Current phase goals */}
      {phaseGoals.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">Phase {currentPhase} Goals</div>
          {phaseGoals.map(renderGoal)}
        </div>
      )}

      {/* Other phase goals collapsed */}
      {otherGoals.length > 0 && (
        <div className="flex flex-col gap-1.5 opacity-60">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">Other Phases</div>
          {otherGoals.map(renderGoal)}
        </div>
      )}

      {goals.length === 0 && !showForm && (
        <div className="text-center py-6 text-[11px] font-mono text-muted-foreground">
          Add goals with sub-steps. Break big milestones into 3–5 concrete actions.
        </div>
      )}
    </div>
  )
}
