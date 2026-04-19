"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import type { PomodoroSession } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain,
  Flame,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react'

interface PomodoroTimerProps {
  sessions: PomodoroSession[]
  onSessionComplete: (session: Omit<PomodoroSession, 'id'>) => void
  todayDeepWorkMinutes: number
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const TIMER_SETTINGS = {
  work: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

export function PomodoroTimer({
  sessions,
  onSessionComplete,
  todayDeepWorkMinutes,
}: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [currentLabel, setCurrentLabel] = useState('')
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Calculate today's stats
  const todaySessions = sessions.filter(s => {
    const today = new Date().toISOString().slice(0, 10)
    return s.completedAt.startsWith(today)
  })
  const todayPomodoros = todaySessions.filter(s => s.type === 'work').length

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const totalTime = mode === 'work' 
    ? TIMER_SETTINGS.work 
    : mode === 'shortBreak' 
      ? TIMER_SETTINGS.shortBreak 
      : TIMER_SETTINGS.longBreak
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  // Play notification sound
  const playSound = useCallback(() => {
    if (soundEnabled && typeof window !== 'undefined') {
      // Create a simple beep using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (e) {
        // Audio not supported
      }
    }
  }, [soundEnabled])

  // Handle timer completion
  const handleComplete = useCallback(() => {
    playSound()
    setIsRunning(false)
    
    if (mode === 'work') {
      onSessionComplete({
        type: 'work',
        duration: TIMER_SETTINGS.work,
        completedAt: new Date().toISOString(),
        label: currentLabel || undefined,
      })
      
      const newCount = pomodorosCompleted + 1
      setPomodorosCompleted(newCount)
      
      // After 4 pomodoros, suggest long break
      if (newCount % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(TIMER_SETTINGS.longBreak)
      } else {
        setMode('shortBreak')
        setTimeLeft(TIMER_SETTINGS.shortBreak)
      }
    } else {
      onSessionComplete({
        type: 'break',
        duration: mode === 'shortBreak' ? TIMER_SETTINGS.shortBreak : TIMER_SETTINGS.longBreak,
        completedAt: new Date().toISOString(),
      })
      setMode('work')
      setTimeLeft(TIMER_SETTINGS.work)
    }
  }, [mode, pomodorosCompleted, playSound, onSessionComplete, currentLabel])

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, handleComplete])

  // Toggle timer
  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(
      mode === 'work' 
        ? TIMER_SETTINGS.work 
        : mode === 'shortBreak' 
          ? TIMER_SETTINGS.shortBreak 
          : TIMER_SETTINGS.longBreak
    )
  }

  // Switch mode
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(
      newMode === 'work' 
        ? TIMER_SETTINGS.work 
        : newMode === 'shortBreak' 
          ? TIMER_SETTINGS.shortBreak 
          : TIMER_SETTINGS.longBreak
    )
  }

  // Calculate hours for display
  const deepWorkHours = Math.floor(todayDeepWorkMinutes / 60)
  const deepWorkMins = todayDeepWorkMinutes % 60

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-mono tracking-wide text-text">
            <Timer className="h-4 w-4 text-purple" />
            POMODORO TIMER
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-7 w-7 p-0"
            >
              {soundEnabled ? (
                <Volume2 className="h-3 w-3 text-muted-foreground" />
              ) : (
                <VolumeX className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Tabs */}
        <div className="flex gap-1 p-1 bg-surface2 rounded-md">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10px] font-mono transition-colors ${
              mode === 'work' 
                ? 'bg-primary text-bg' 
                : 'text-muted-foreground hover:text-text'
            }`}
          >
            <Brain className="h-3 w-3" />
            FOCUS
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10px] font-mono transition-colors ${
              mode === 'shortBreak' 
                ? 'bg-accent2 text-bg' 
                : 'text-muted-foreground hover:text-text'
            }`}
          >
            <Coffee className="h-3 w-3" />
            SHORT
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[10px] font-mono transition-colors ${
              mode === 'longBreak' 
                ? 'bg-purple text-bg' 
                : 'text-muted-foreground hover:text-text'
            }`}
          >
            <Coffee className="h-3 w-3" />
            LONG
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative flex flex-col items-center py-6">
          {/* Circular Progress */}
          <div className="relative">
            <svg width="160" height="160" className="-rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--dim)"
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={
                  mode === 'work' 
                    ? 'var(--accent)' 
                    : mode === 'shortBreak' 
                      ? 'var(--accent2)' 
                      : 'var(--purple)'
                }
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 440} 440`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-mono text-text tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wide mt-1 ${
                mode === 'work' 
                  ? 'text-primary' 
                  : mode === 'shortBreak' 
                    ? 'text-accent2' 
                    : 'text-purple'
              }`}>
                {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
          </div>

          {/* Current Task Label */}
          {mode === 'work' && (
            <input
              type="text"
              placeholder="What are you working on?"
              value={currentLabel}
              onChange={(e) => setCurrentLabel(e.target.value)}
              className="mt-4 w-full max-w-[200px] bg-surface2 border border-border rounded-md px-3 py-1.5 text-xs font-mono text-text text-center placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTimer}
            className="h-10 w-10 p-0 rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleTimer}
            className={`h-14 w-14 rounded-full ${
              isRunning 
                ? 'bg-warn hover:bg-warn/90' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isRunning ? (
              <Pause className="h-6 w-6 text-bg" />
            ) : (
              <Play className="h-6 w-6 text-bg ml-0.5" />
            )}
          </Button>
          <div className="h-10 w-10" /> {/* Spacer for balance */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className="h-3 w-3 text-warn" />
              <span className="text-lg font-bold font-mono text-warn">{todayPomodoros}</span>
            </div>
            <div className="text-[8px] font-mono text-muted-foreground uppercase">Today</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-primary">
              {deepWorkHours}h {deepWorkMins}m
            </div>
            <div className="text-[8px] font-mono text-muted-foreground uppercase">Deep Work</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold font-mono text-purple">{pomodorosCompleted}</div>
            <div className="text-[8px] font-mono text-muted-foreground uppercase">Session</div>
          </div>
        </div>

        {/* Pomodoro Dots */}
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < (pomodorosCompleted % 4) 
                  ? 'bg-primary' 
                  : 'bg-dim'
              }`}
            />
          ))}
          <span className="text-[9px] font-mono text-muted-foreground ml-2">
            {4 - (pomodorosCompleted % 4)} until long break
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
