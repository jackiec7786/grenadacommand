"use client"

import { useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { DEFAULT_STATE, PHASE_LABELS, MILESTONES, PHASE_CONFIGS, PHASE_INCOME_TARGETS, type AppState, type MoodEntry, type WeeklyReview, type Contact, type Decision, type CapitalEntry, type Goal } from '@/lib/data'
import { RunwaySection } from '@/components/runway-section'
import { IncomeTracker } from '@/components/income-tracker'
import { WeeklyScorecard } from '@/components/weekly-scorecard'
import { TodaysTasks } from '@/components/todays-tasks'
import { ProgressDashboard } from '@/components/progress-dashboard'
import { NotesSection } from '@/components/notes-section'
import { CrisisBanner } from '@/components/crisis-banner'
import { MonthlyHistory } from '@/components/monthly-history'
import { StreakCounter } from '@/components/streak-counter'
import { SpiceMetrics } from '@/components/spice-metrics'
import { SurvivalChecklist } from '@/components/survival-checklist'
import { MoodLog } from '@/components/mood-log'
import { PlanWeekTracker } from '@/components/plan-week-tracker'
import { DataBackup } from '@/components/data-backup'
import { WorldClocks } from '@/components/world-clocks'
import { ExpenseTracker } from '@/components/expense-tracker'
import { SmartActionRecommender } from '@/components/smart-action-recommender'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import type { Expense, PomodoroSession, AmazonProduct, UpworkProposal, SpeedEntry } from '@/lib/data'
import { WeeklyReviewPanel } from '@/components/weekly-review'
import { ContactTracker } from '@/components/contact-tracker'
import { DecisionLog } from '@/components/decision-log'
import { CapitalTracker } from '@/components/capital-tracker'
import { DailySchedule } from '@/components/daily-schedule'
import { GoalTracker } from '@/components/goal-tracker'
import { IncomeProjection } from '@/components/income-projection'
import { EventCalendar } from '@/components/event-calendar'
import { TimelineView } from '@/components/timeline-view'
import { RiskPanel } from '@/components/risk-panel'
import { ConcentrationMonitor } from '@/components/concentration-monitor'
import { SpiceRoadmap } from '@/components/spice-roadmap'
import { AmazonProductTracker } from '@/components/amazon-product-tracker'
import { ResilienceScorecard } from '@/components/resilience-scorecard'
import { PsychSupport } from '@/components/psych-support'
import { MorningBrief } from '@/components/morning-brief'
import { BusinessCalculator } from '@/components/business-calculator'
import { CurrencyConverter } from '@/components/currency-converter'
import { UpworkTracker } from '@/components/upwork-tracker'
import { CredentialsVault } from '@/components/credentials-vault'
import { FreightCalculator } from '@/components/freight-calculator'
import { InternetLog } from '@/components/internet-log'

// Dynamically import the recharts-heavy analytics dashboard to keep the initial bundle lean
const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics-dashboard').then(m => ({ default: m.AnalyticsDashboard })),
  { loading: () => <div className="h-64 bg-surface rounded-xl border border-border animate-pulse" /> }
)

function getTodayStr() { return new Date().toISOString().slice(0, 10) }

export default function GrenadaCommandCenter() {
  const [state, setState] = useLocalStorage<AppState>('grenada_state', DEFAULT_STATE)

  const totalIncome = useMemo(
    () => Object.values(state.income).reduce((s, v) => s + (v || 0), 0),
    [state.income]
  )

  const overallPct = useMemo(() => {
    const done = Object.values(state.milestones).filter(Boolean).length
    return Math.round((done / MILESTONES.length) * 100)
  }, [state.milestones])

  const config = useMemo(
    () => PHASE_CONFIGS[state.currentPhase as keyof typeof PHASE_CONFIGS],
    [state.currentPhase]
  )

  const allChecks = useMemo(
    () => ({ ...state.survivalChecks, ...state.phaseChecks }),
    [state.survivalChecks, state.phaseChecks]
  )

  const todayDeepWorkMinutes = useMemo(() => {
    const todayStr = getTodayStr()
    return (state.pomodoroSessions || [])
      .filter(s => s.completedAt.startsWith(todayStr) && s.type === 'work')
      .reduce((sum, s) => sum + Math.floor(s.duration / 60), 0)
  }, [state.pomodoroSessions])

  const today = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
    []
  )

  // ── Handlers ────────────────────────────────────────────────────────────
  const set = useCallback(<K extends keyof AppState>(key: K, value: AppState[K]) =>
    setState(prev => ({ ...prev, [key]: value })), [setState])

  const handleLogToday = useCallback(() => {
    const todayStr = getTodayStr()
    setState(prev => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().slice(0, 10)
      const newStreak = prev.lastActiveDate === yesterdayStr
        ? (prev.streakDays || 0) + 1
        : prev.lastActiveDate === todayStr ? prev.streakDays : 1
      return { ...prev, streakDays: newStreak, lastActiveDate: todayStr }
    })
  }, [setState])

  const handleLogMood = useCallback((level: MoodEntry['level']) => {
    const todayStr = getTodayStr()
    setState(prev => ({ ...prev, mood: [...prev.mood.filter(m => m.date !== todayStr), { date: todayStr, level }] }))
  }, [setState])

  const handleMonthChange = useCallback((month: string) => {
    setState(prev => {
      if (month === prev.currentMonth) return prev
      return {
        ...prev,
        monthlyHistory: { ...prev.monthlyHistory, [prev.currentMonth]: { ...prev.income } },
        currentMonth: month,
        income: prev.monthlyHistory[month] || {},
      }
    })
  }, [setState])

  const handlePhaseCheckToggle = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      phaseChecks: { ...prev.phaseChecks, [id]: !prev.phaseChecks?.[id] },
    }))
  }, [setState])

  // ── v6 utility handlers ─────────────────────────────────────────────────
  const handleAddProposal = useCallback((p: UpworkProposal) =>
    setState(prev => ({ ...prev, upworkProposals: [...(prev.upworkProposals || []), p] })), [setState])

  const handleUpdateProposal = useCallback((id: string, updates: Partial<UpworkProposal>) =>
    setState(prev => ({ ...prev, upworkProposals: (prev.upworkProposals || []).map(p => p.id === id ? { ...p, ...updates } : p) })), [setState])

  const handleRemoveProposal = useCallback((id: string) =>
    setState(prev => ({ ...prev, upworkProposals: (prev.upworkProposals || []).filter(p => p.id !== id) })), [setState])

  const handleAddSpeed = useCallback((entry: SpeedEntry) =>
    setState(prev => ({ ...prev, speedLog: [...(prev.speedLog || []), entry] })), [setState])

  const handleRemoveSpeed = useCallback((id: string) =>
    setState(prev => ({ ...prev, speedLog: (prev.speedLog || []).filter(e => e.id !== id) })), [setState])

  // ── v5 handlers ────────────────────────────────────────────────────────
  const handleToggleResilience = useCallback((id: string) => {
    setState(prev => ({ ...prev, resilience: { ...prev.resilience, [id]: !prev.resilience?.[id] } }))
  }, [setState])

  const handleAddProduct = useCallback((p: AmazonProduct) => {
    setState(prev => ({ ...prev, amazonProducts: [...(prev.amazonProducts || []), p] }))
  }, [setState])

  const handleUpdateProduct = useCallback((id: string, updates: Partial<AmazonProduct>) => {
    setState(prev => ({ ...prev, amazonProducts: (prev.amazonProducts || []).map(p => p.id === id ? { ...p, ...updates } : p) }))
  }, [setState])

  const handleRemoveProduct = useCallback((id: string) => {
    setState(prev => ({ ...prev, amazonProducts: (prev.amazonProducts || []).filter(p => p.id !== id) }))
  }, [setState])

  const handleToggleEventCheck = useCallback((id: string) => {
    setState(prev => ({ ...prev, eventChecks: { ...prev.eventChecks, [id]: !prev.eventChecks?.[id] } }))
  }, [setState])

  const handleToggleSpiceRoadmap = useCallback((id: string) => {
    setState(prev => ({ ...prev, phaseChecks: { ...prev.phaseChecks, [id]: !prev.phaseChecks?.[id] } }))
  }, [setState])

  // ── New feature handlers ────────────────────────────────────────────────
  const handleSaveReview = useCallback((review: WeeklyReview) => {
    setState(prev => ({ ...prev, weeklyReviews: [...(prev.weeklyReviews || []), review] }))
  }, [setState])

  const handleAddContact = useCallback((contact: Contact) => {
    setState(prev => ({ ...prev, contacts: [...(prev.contacts || []), contact] }))
  }, [setState])

  const handleUpdateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setState(prev => ({ ...prev, contacts: (prev.contacts || []).map(c => c.id === id ? { ...c, ...updates } : c) }))
  }, [setState])

  const handleRemoveContact = useCallback((id: string) => {
    setState(prev => ({ ...prev, contacts: (prev.contacts || []).filter(c => c.id !== id) }))
  }, [setState])

  const handleAddDecision = useCallback((decision: Decision) => {
    setState(prev => ({ ...prev, decisions: [...(prev.decisions || []), decision] }))
  }, [setState])

  const handleUpdateOutcome = useCallback((id: string, outcome: string) => {
    setState(prev => ({ ...prev, decisions: (prev.decisions || []).map(d => d.id === id ? { ...d, outcome } : d) }))
  }, [setState])

  const handleSaveCapital = useCallback((entry: CapitalEntry) => {
    setState(prev => {
      const filtered = (prev.capitalHistory || []).filter(e => e.month !== entry.month)
      return { ...prev, capitalHistory: [...filtered, entry] }
    })
  }, [setState])

  const handleAddGoal = useCallback((goal: Goal) => {
    setState(prev => ({ ...prev, goals: [...(prev.goals || []), goal] }))
  }, [setState])

  const handleUpdateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setState(prev => ({ ...prev, goals: (prev.goals || []).map(g => g.id === id ? { ...g, ...updates } : g) }))
  }, [setState])

  const handleRemoveGoal = useCallback((id: string) => {
    setState(prev => ({ ...prev, goals: (prev.goals || []).filter(g => g.id !== id) }))
  }, [setState])

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="relative z-[1] max-w-[1100px] mx-auto px-5 py-6">

      {/* Header */}
      <header className="flex items-start justify-between mb-8 pb-6 border-b border-border max-[700px]:flex-col max-[700px]:gap-4">
        <div>
          <h1 className="text-[11px] font-mono tracking-[0.25em] text-primary uppercase mb-1.5">
            // Grenada Command Center
          </h1>
          <h2 className="text-[28px] font-extrabold leading-none text-text">The Master Plan</h2>
        </div>
        <div className="text-right max-[700px]:text-left flex flex-col items-end max-[700px]:items-start gap-2">
          <div
            className="inline-block text-bg text-[10px] font-bold font-mono tracking-[0.15em] px-2.5 py-1 rounded-sm uppercase"
            style={{ background: config.cssColor }}
          >
            {PHASE_LABELS[state.currentPhase]}
          </div>
          <div className="font-mono text-xs text-muted-foreground">{today}</div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-24 bg-dim rounded-sm overflow-hidden">
              <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${overallPct}%`, background: 'var(--purple)' }} />
            </div>
            <span className="font-mono text-[10px] text-purple">{overallPct}% of plan complete</span>
          </div>
        </div>
      </header>

      {/* Morning Brief */}
      <MorningBrief
        state={state}
        totalIncome={totalIncome}
        onLogMood={handleLogMood}
        onLogToday={handleLogToday}
      />

      <CrisisBanner cash={state.cash} />

      <PsychSupport
        mood={state.mood || []}
        streakDays={state.streakDays || 0}
        monthlyIncome={totalIncome}
        planStartDate={state.planStartDate || ''}
        cash={state.cash}
      />

      {/* Runway */}
      <RunwaySection cash={state.cash} onCashChange={v => set('cash', v)} monthlyIncome={totalIncome} />

      {/* Command Center */}
      <SectionLabel>Command Center</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <WorldClocks />
        <SmartActionRecommender
          cash={state.cash}
          monthlyIncome={totalIncome}
          currentPhase={state.currentPhase}
          currentWeek={state.currentWeek}
          mood={state.mood || []}
          phaseChecks={allChecks}
          tasks={state.tasks}
          streakDays={state.streakDays || 0}
        />
      </div>

      {/* Phase Setup + Timeline */}
      <SectionLabel>Phase {state.currentPhase} Setup — {config.name}</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <SurvivalChecklist
          currentPhase={state.currentPhase}
          phaseChecks={allChecks}
          onToggle={handlePhaseCheckToggle}
          cash={state.cash}
        />
        <div className="flex flex-col gap-4">
          <PlanWeekTracker
            startDate={state.planStartDate || ''}
            onSetStartDate={date => setState(prev => ({ ...prev, planStartDate: date }))}
          />
          <StreakCounter
            streakDays={state.streakDays || 0}
            lastActiveDate={state.lastActiveDate || ''}
            onLogToday={handleLogToday}
          />
        </div>
      </div>

      {/* Finances */}
      <SectionLabel>Finances & Analytics</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <ExpenseTracker
          expenses={state.expenses || []}
          onAddExpense={expense => setState(prev => ({ ...prev, expenses: [...(prev.expenses || []), { ...expense, id: `exp-${Date.now()}` }] }))}
          onRemoveExpense={id => setState(prev => ({ ...prev, expenses: (prev.expenses || []).filter(e => e.id !== id) }))}
          monthlyIncome={totalIncome}
          cash={state.cash}
        />
        <AnalyticsDashboard
          monthlyHistory={state.monthlyHistory || {}}
          currentIncome={state.income}
          currentMonth={state.currentMonth || new Date().toISOString().slice(0, 7)}
          mood={state.mood || []}
          expenses={state.expenses || []}
          milestones={state.milestones}
          totalMilestones={MILESTONES.length}
          incomeTarget={PHASE_INCOME_TARGETS[state.currentPhase]}
        />
      </div>

      {/* Focus & Productivity */}
      <SectionLabel>Focus & Productivity</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <PomodoroTimer
          sessions={state.pomodoroSessions || []}
          onSessionComplete={session => setState(prev => ({ ...prev, pomodoroSessions: [...(prev.pomodoroSessions || []), { ...session, id: `pom-${Date.now()}` }] }))}
          todayDeepWorkMinutes={todayDeepWorkMinutes}
        />
        <MoodLog mood={state.mood || []} onLogMood={handleLogMood} />
      </div>

      {/* Income & Score */}
      <SectionLabel>Income & Weekly Score</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <IncomeTracker
          income={state.income}
          currentPhase={state.currentPhase}
          onIncomeChange={(id, v) => setState(prev => ({ ...prev, income: { ...prev.income, [id]: v } }))}
        />
        <WeeklyScorecard
          currentPhase={state.currentPhase}
          currentWeek={state.currentWeek}
          onWeekChange={w => set('currentWeek', w)}
          scores={state.scores}
          onScoreToggle={(wk, i) =>
            setState(prev => ({ ...prev, scores: { ...prev.scores, [wk]: { ...prev.scores[wk], [i]: !prev.scores[wk]?.[i] } } }))
          }
        />
      </div>

      {/* History & Mood */}
      <SectionLabel>Income History</SectionLabel>
      <div className="mb-6">
        <MonthlyHistory
          currentMonth={state.currentMonth || new Date().toISOString().slice(0, 7)}
          monthlyHistory={state.monthlyHistory || {}}
          currentIncome={state.income}
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* Tasks & Progress */}
      <SectionLabel>Tasks & Progress</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <TodaysTasks
          currentPhase={state.currentPhase}
          onPhaseChange={p => set('currentPhase', p)}
          tasks={state.tasks}
          onTaskToggle={(pk, i) =>
            setState(prev => ({ ...prev, tasks: { ...prev.tasks, [pk]: { ...prev.tasks[pk], [i]: !prev.tasks[pk]?.[i] } } }))
          }
        />
        <ProgressDashboard
          currentPhase={state.currentPhase}
          milestones={state.milestones}
          onMilestoneToggle={id => setState(prev => ({ ...prev, milestones: { ...prev.milestones, [id]: !prev.milestones[id] } }))}
        />
      </div>

      {/* Daily Schedule */}
      <SectionLabel>Daily Schedule — Phase {state.currentPhase}</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <DailySchedule currentPhase={state.currentPhase} />
        <IncomeProjection
          income={state.income}
          currentPhase={state.currentPhase}
          planStartDate={state.planStartDate || ''}
          monthlyHistory={state.monthlyHistory || {}}
        />
      </div>

      {/* Goals */}
      <SectionLabel>Goals & Decisions</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <GoalTracker
          goals={state.goals || []}
          currentPhase={state.currentPhase}
          onAdd={handleAddGoal}
          onUpdateGoal={handleUpdateGoal}
          onRemove={handleRemoveGoal}
        />
        <DecisionLog
          decisions={state.decisions || []}
          currentPhase={state.currentPhase}
          onAdd={handleAddDecision}
          onUpdateOutcome={handleUpdateOutcome}
        />
      </div>

      {/* Contacts + Capital */}
      <SectionLabel>Contacts & Capital</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <ContactTracker
          contacts={state.contacts || []}
          onAdd={handleAddContact}
          onUpdate={handleUpdateContact}
          onRemove={handleRemoveContact}
        />
        <CapitalTracker
          capitalHistory={state.capitalHistory || []}
          currentMonth={state.currentMonth || new Date().toISOString().slice(0, 7)}
          cash={state.cash}
          onSave={handleSaveCapital}
        />
      </div>

      {/* Weekly Review */}
      <SectionLabel>Weekly Review</SectionLabel>
      <div className="mb-6">
        <WeeklyReviewPanel
          reviews={state.weeklyReviews || []}
          currentPhase={state.currentPhase}
          cash={state.cash}
          monthlyIncome={totalIncome}
          planStartDate={state.planStartDate || ''}
          onSave={handleSaveReview}
        />
      </div>

      {/* Events */}
      <SectionLabel>Grenada Event Calendar</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <EventCalendar
          eventChecks={state.eventChecks || {}}
          onToggleCheck={handleToggleEventCheck}
        />
        <TimelineView
          currentPhase={state.currentPhase}
          planStartDate={state.planStartDate || ''}
        />
      </div>

      {/* SpiceClassifieds */}
      <SectionLabel>SpiceClassifieds</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <SpiceMetrics
          spice={state.spice || { listings: 0, whatsapp: 0, subscriptions: 0 }}
          onUpdate={(field, value) => setState(prev => ({ ...prev, spice: { ...prev.spice, [field]: value } }))}
        />
        <SpiceRoadmap
          phaseChecks={allChecks}
          onToggle={handleToggleSpiceRoadmap}
          spice={state.spice || { listings: 0, whatsapp: 0, subscriptions: 0 }}
        />
      </div>

      {/* Amazon */}
      <SectionLabel>Amazon FBA</SectionLabel>
      <div className="mb-6">
        <AmazonProductTracker
          products={state.amazonProducts || []}
          onAdd={handleAddProduct}
          onUpdate={handleUpdateProduct}
          onRemove={handleRemoveProduct}
        />
      </div>

      {/* Notes */}
      <SectionLabel>Notes</SectionLabel>
      <div className="mb-6">
        <NotesSection notes={state.notes} onNotesChange={n => set('notes', n)} />
      </div>

      {/* Risk & Resilience */}
      <SectionLabel>Risk & Resilience</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <RiskPanel />
        <ResilienceScorecard
          resilience={state.resilience || {}}
          onToggle={handleToggleResilience}
        />
      </div>

      {/* Concentration */}
      <SectionLabel>Revenue Concentration</SectionLabel>
      <div className="mb-6">
        <ConcentrationMonitor income={state.income} />
      </div>

      {/* Utilities */}
      <SectionLabel>Utilities</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <BusinessCalculator />
        <CurrencyConverter />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <FreightCalculator />
        <InternetLog
          speedLog={state.speedLog || []}
          onAdd={handleAddSpeed}
          onRemove={handleRemoveSpeed}
        />
      </div>

      {/* Upwork + Credentials */}
      <SectionLabel>Upwork & Credentials</SectionLabel>
      <div className="grid grid-cols-2 gap-4 mb-6 max-[700px]:grid-cols-1">
        <UpworkTracker
          proposals={state.upworkProposals || []}
          onAdd={handleAddProposal}
          onUpdate={handleUpdateProposal}
          onRemove={handleRemoveProposal}
        />
        <CredentialsVault />
      </div>

      {/* Backup */}
      <SectionLabel>Data Backup</SectionLabel>
      <div className="mb-6">
        <DataBackup state={state} onImport={setState} />
      </div>

      {/* Footer */}
      <footer className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <span className="font-mono text-[10px] text-muted-foreground tracking-[0.1em]">All data saved locally in your browser</span>
        <button
          onClick={() => { if (confirm('Reset all data? This cannot be undone.')) setState(DEFAULT_STATE) }}
          className="bg-transparent border border-border text-muted-foreground font-mono text-[9px] tracking-[0.15em] px-2.5 py-1.5 rounded-sm cursor-pointer uppercase transition-all hover:border-danger hover:text-danger"
        >
          Reset All Data
        </button>
      </footer>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-mono tracking-[0.3em] text-muted-foreground uppercase mb-3 flex items-center gap-3">
      {children}
      <span className="flex-1 h-px bg-border" />
    </div>
  )
}
