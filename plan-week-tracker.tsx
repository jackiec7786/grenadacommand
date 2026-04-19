"use client"

interface PlanWeekTrackerProps {
  startDate: string // YYYY-MM-DD, the day the plan started
  onSetStartDate: (date: string) => void
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(a: string, b: string) {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

export function PlanWeekTracker({ startDate, onSetStartDate }: PlanWeekTrackerProps) {
  const today = getTodayStr()
  const hasStart = !!startDate && startDate <= today

  const daysIn  = hasStart ? Math.max(0, daysBetween(startDate, today)) + 1 : 0
  const weekNum  = hasStart ? Math.ceil(daysIn / 7) : 0
  const monthNum = hasStart ? Math.ceil(daysIn / 30) : 0
  const dayOfWeek = hasStart ? ((daysIn - 1) % 7) + 1 : 0

  // Phase based on month
  const phase = monthNum <= 3 ? 1 : monthNum <= 5 ? 2 : monthNum <= 9 ? 3 : 4
  const phaseNames = ['', 'Survival', 'Stability', 'Build', 'Scale']
  const phaseColors = ['', 'var(--danger)', 'var(--warn)', 'var(--accent2)', 'var(--accent)']

  const dayBlocks = Array.from({ length: 7 }, (_, i) => i + 1)

  return (
    <div className="bg-surface border border-border rounded-md p-5 border-t-2 border-t-purple">
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">
        // Plan Timeline
      </div>

      {!hasStart ? (
        <div>
          <div className="text-[12px] text-muted-foreground font-mono mb-3">
            Set your plan start date to track exactly where you are.
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-mono text-muted-foreground">Start date:</label>
            <input
              type="date"
              className="bg-dim border border-border text-text font-mono text-[12px] px-2 py-1.5 rounded-sm focus:outline-none focus:border-purple"
              max={today}
              onChange={(e) => e.target.value && onSetStartDate(e.target.value)}
            />
          </div>
          <button
            onClick={() => onSetStartDate(today)}
            className="mt-2 text-[10px] font-mono text-purple border border-purple/40 px-3 py-1.5 rounded-sm cursor-pointer hover:bg-purple/10 transition-all tracking-[0.1em] uppercase"
          >
            Start today
          </button>
        </div>
      ) : (
        <>
          {/* Big numbers */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-[36px] font-extrabold font-mono leading-none" style={{ color: 'var(--purple)' }}>
                {weekNum}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] mt-1">Week</div>
            </div>
            <div className="text-center">
              <div className="text-[36px] font-extrabold font-mono leading-none" style={{ color: phaseColors[phase] }}>
                {monthNum}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] mt-1">Month</div>
            </div>
            <div className="text-center">
              <div className="text-[36px] font-extrabold font-mono leading-none text-muted-foreground">
                {daysIn}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] mt-1">Day</div>
            </div>
          </div>

          {/* Phase indicator */}
          <div
            className="text-center py-2 rounded-sm mb-4 font-mono text-[11px] font-semibold tracking-[0.1em] uppercase"
            style={{ background: phaseColors[phase] + '15', color: phaseColors[phase], border: `1px solid ${phaseColors[phase]}40` }}
          >
            Phase {phase} — {phaseNames[phase]}
          </div>

          {/* Week progress dots */}
          <div className="mb-4">
            <div className="text-[9px] font-mono text-muted-foreground mb-2 tracking-[0.1em] uppercase">
              This week — day {dayOfWeek} of 7
            </div>
            <div className="flex gap-2">
              {dayBlocks.map(d => (
                <div
                  key={d}
                  className="flex-1 h-2 rounded-sm transition-all"
                  style={{
                    background: d < dayOfWeek
                      ? 'var(--purple)'
                      : d === dayOfWeek
                      ? 'var(--accent)'
                      : 'var(--dim)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => onSetStartDate('')}
            className="text-[9px] font-mono text-muted-foreground hover:text-danger transition-all tracking-[0.1em] uppercase"
          >
            Reset start date
          </button>
        </>
      )}
    </div>
  )
}
