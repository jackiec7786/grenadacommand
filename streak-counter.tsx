"use client"

interface StreakCounterProps {
  streakDays: number
  lastActiveDate: string
  onLogToday: () => void
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function StreakCounter({ streakDays, lastActiveDate, onLogToday }: StreakCounterProps) {
  const today = getTodayStr()
  const loggedToday = lastActiveDate === today

  const flames = Math.min(streakDays, 7)
  const flameRow = Array.from({ length: 7 }, (_, i) => i < flames)

  let status = ''
  let statusColor = 'text-muted-foreground'
  if (streakDays === 0) {
    status = 'Start your streak today.'
  } else if (streakDays < 3) {
    status = 'Building momentum.'
  } else if (streakDays < 7) {
    status = 'Consistency is compounding.'
    statusColor = 'text-warn'
  } else if (streakDays < 14) {
    status = 'One week solid. Keep going.'
    statusColor = 'text-warn'
  } else if (streakDays < 30) {
    status = 'Two weeks. This is a habit now.'
    statusColor = 'text-primary'
  } else {
    status = 'A month in. You are doing this.'
    statusColor = 'text-primary'
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5 border-t-2 border-t-warn">
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">
        // Active Streak
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div>
          <div className="text-[52px] font-extrabold font-mono leading-none text-warn">
            {streakDays}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em] mt-1">
            consecutive days
          </div>
        </div>
        <div className="flex gap-1.5 pb-3">
          {flameRow.map((lit, i) => (
            <div
              key={i}
              className="text-[18px] transition-all duration-300"
              style={{ opacity: lit ? 1 : 0.2, filter: lit ? 'none' : 'grayscale(1)' }}
            >
              🔥
            </div>
          ))}
        </div>
      </div>

      <div className={`text-[12px] font-mono mb-4 ${statusColor}`}>{status}</div>

      {/* Log today button */}
      <button
        onClick={onLogToday}
        disabled={loggedToday}
        className={`w-full py-2.5 rounded-sm font-mono text-[11px] tracking-[0.15em] uppercase font-semibold transition-all border ${
          loggedToday
            ? 'bg-primary/10 border-primary text-primary cursor-default'
            : 'bg-warn text-bg border-warn hover:bg-warn/90 cursor-pointer'
        }`}
      >
        {loggedToday ? '✓ Logged today' : 'Log today as active'}
      </button>

      {!loggedToday && streakDays > 0 && (
        <div className="mt-2 text-[10px] font-mono text-muted-foreground text-center">
          Log before midnight to keep your streak
        </div>
      )}
    </div>
  )
}
