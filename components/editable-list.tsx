"use client"

import { useState } from 'react'

interface EditableListProps {
  items: string[]
  onAdd: (item: string) => void
  onRemove: (index: number) => void
  onRename: (index: number, value: string) => void
  placeholder?: string
  maxItems?: number
  className?: string
}

export function EditableList({
  items,
  onAdd,
  onRemove,
  onRename,
  placeholder = 'Add item...',
  maxItems,
  className = '',
}: EditableListProps) {
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')
  const [newItem, setNewItem] = useState('')

  const inp = 'bg-dim border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none focus:border-accent'

  const startEdit = (i: number) => {
    setEditIdx(i)
    setEditVal(items[i])
  }

  const commitEdit = () => {
    if (editIdx !== null && editVal.trim()) onRename(editIdx, editVal.trim())
    setEditIdx(null)
    setEditVal('')
  }

  const handleAdd = () => {
    if (!newItem.trim()) return
    if (maxItems && items.length >= maxItems) return
    onAdd(newItem.trim())
    setNewItem('')
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 p-1.5 rounded-sm bg-surface2 border border-border group">
          {editIdx === i ? (
            <input
              autoFocus
              className={`${inp} flex-1`}
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') setEditIdx(null)
              }}
            />
          ) : (
            <span
              className="flex-1 font-mono text-[11px] text-text cursor-pointer hover:text-primary truncate"
              onClick={() => startEdit(i)}
              title="Click to edit"
            >
              {item}
            </span>
          )}
          <button
            onClick={() => onRemove(i)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger text-[13px] font-mono px-1.5 cursor-pointer transition-all leading-none"
          >
            ×
          </button>
        </div>
      ))}
      {(!maxItems || items.length < maxItems) && (
        <div className="flex gap-2 mt-2">
          <input
            className={`${inp} flex-1`}
            placeholder={placeholder}
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
          />
          <button
            onClick={handleAdd}
            disabled={!newItem.trim()}
            className="font-mono text-[10px] px-2.5 py-1 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
