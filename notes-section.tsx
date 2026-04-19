"use client"

import { useState, useEffect, useRef } from 'react'

interface NotesSectionProps {
  notes: string
  onNotesChange: (notes: string) => void
}

export function NotesSection({ notes, onNotesChange }: NotesSectionProps) {
  const [localNotes, setLocalNotes] = useState(notes)
  const [saved, setSaved] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  const handleChange = (value: string) => {
    setLocalNotes(value)
    setSaved(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onNotesChange(value)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 800)
  }

  const handleSave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    onNotesChange(localNotes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5 border-t-2 border-t-muted-foreground">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">
          {"// Today's Notes"}
        </div>
        {saved && (
          <span className="font-mono text-[10px] text-primary tracking-[0.1em]">auto-saved ✓</span>
        )}
      </div>
      <textarea
        className="w-full bg-surface2 border border-border text-text font-mono text-xs p-3 rounded-sm resize-y min-h-[80px] leading-relaxed focus:outline-none focus:border-muted-foreground"
        placeholder="What happened today. What to fix tomorrow. One honest sentence."
        value={localNotes}
        onChange={(e) => handleChange(e.target.value)}
      />
      <button
        onClick={handleSave}
        className={`mt-2 bg-dim border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.15em] rounded-sm cursor-pointer uppercase transition-all ${
          saved
            ? 'text-primary border-primary'
            : 'text-muted-foreground border-border hover:border-primary hover:text-primary'
        }`}
      >
        {saved ? 'Saved ✓' : 'Save Notes'}
      </button>
    </div>
  )
}
