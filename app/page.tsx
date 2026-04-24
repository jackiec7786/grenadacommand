"use client"

import { useMemo, useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { useServerState } from '@/hooks/use-server-state'
import { DEFAULT_STATE, PHASE_LABELS, MILESTONES, PHASE_CONFIGS, PHASE_INCOME_TARGETS, type AppState, type MoodEntry, type WeeklyReview, type Contact, type Decision, type CapitalEntry, type Goal } from '@/lib/data'
import Link from 'next/link'
import { RunwaySection } from '@/components/runway-section'
import { IncomeTracker } from '@/components/income-tracker'
import { WeeklyScorecard } from '@/components/weekly-scorecard'
import { TodaysTasks } from '@/components/todays-tasks'
import { ProgressDashboard } from '@/components/progress-dashboard'
import { NotesSection } from '@/components/notes-section'
import { CrisisBanner } from '@/components/crisis-banner'
import { SessionWarning } from '@/components/session-warning'
import { MonthlyHistory } from '@/components/monthly-history'
import { StreakCounter } from '@/components/streak-counter'
import { SpiceMetrics } from '@/components/spice-metrics'
import { SurvivalChecklist } from '@/components/survival-checklist'
import { MoodLog } from '@/components/mood-log'
import { PlanWeekTracker } from '@/components/plan-week-tracker'
import { DataBackup } from '@/components/data-backup'
import { WorldClocks } from '@/components/world-clocks'
import { WeatherWidget } from '@/components/weather-widget'
import { ExpenseTracker } from '@/components/expense-tracker'
import { SmartActionRecommender } from '@/components/smart-action-recommender'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import type { AmazonProduct, UpworkProposal, SpeedEntry } from '@/lib/data'
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
import { Settings } from 'lucide-react'
import { DailyIncomeGoal } from '@/components/daily-income-goal'
import { JobApplicationTracker } from '@/components/job-application-tracker'
import { DailyFocus } from '@/components/daily-focus'

const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics-dashboard').then(m => ({ default: m.AnalyticsDashboard })),
  { loading: () => <div className="h-64 bg-surface rounded-xl border border-border animate-pulse" /> }
)

type Tab = 'today' | 'finances' | 'progress' | 'business' | 'wellbeing' | 'tools'

const ALL_TABS: { id: Tab; label: string }[] = [
  { id: 'today',    label: 'Today'     },
  { id: 'finances', label: 'Finances'  },
  { id: 'progress', label: 'Progress'  },
  { id: 'business', label: 'Business'  },
  { id: 'wellbeing',label: 'Wellbeing' },
  { id: 'tools',    label: 'Tools'     },
]

const PHASE_TABS: Record<number, Tab[]> = {
  1: ['today', 'finances', 'progress'],
  2: ['today', 'finances', 'progress', 'business'],
  3: ['today', 'finances', 'progress', 'business', 'wellbeing'],
  4: ['today', 'finances', 'progress', 'business', 'wellbeing', 'tools'],
}

function getTodayStr() { return new Date().toISOString().slice(0, 10) }


function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 space-y-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-16 bg-surface rounded-md border border-border animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function GrenadaCommandCenter() {
  const [state, setState, loading, usingFallback] = useServerState()
  const [activeTab, setActiveTab] = useState<Tab>('today')
  const [showAllTabs, setShowAllTabs] = useState(false)
  const [timerLabel, setTimerLabel] = useState('')

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/sign-in'
  }

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
    setState(prev => ({ ...prev, phaseChecks: { ...prev.phaseChecks, [id]: !prev.phaseChecks?.[id] } }))
  }, [setState])

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
  if (loading) return <LoadingSkeleton />

  return (
    <div className="relative z-[1] max-w-[1100px] mx-auto px-5 py-6">

      {/* Header */}
      <header className="flex items-start justify-between mb-6 pb-5 border-b border-border max-[700px]:flex-col max-[700px]:gap-4">
        <div>
          <h1 className="text-[11px] font-mono tracking-[0.25em] text-primary uppercase mb-1.5">
            // Grenada Command Center
          </h1>
          <h2 className="text-[28px] font-extrabold leading-none text-text">The Master Plan</h2>
        </div>
        <div className="text-right max-[700px]:text-left flex flex-col items-end max-[700px]:items-start gap-2">
          <div className="flex items-center gap-3">
            <div
              className="inline-block text-white text-[10px] font-bold font-mono tracking-[0.15em] px-2.5 py-1 rounded-sm uppercase"
              style={{ background: config.cssColor }}
            >
              {PHASE_LABELS[state.currentPhase]}
            </div>
            <Link
              href="/settings"
              className="text-muted-foreground hover:text-text transition-all p-1 rounded-sm border border-border hover:border-muted-foreground"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-[9px] font-mono text-muted-foreground hover:text-danger transition-all cursor-pointer border border-border px-2.5 py-1 rounded-sm hover:border-danger"
            >
              Sign out
            </button>
          </div>
          <div className="font-mono text-xs text-muted-foreground">{today}</div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-24 bg-dim rounded-sm overflow-hidden">
              <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${overallPct}%`, background: 'var(--purple)' }} />
            </div>
            <span className="font-mono text-[10px] text-purple">{overallPct}% complete</span>
          </div>
        </div>
      </header>

      {/* Daily focus overlay — shown once per day */}
      <DailyFocus
        cash={state.cash}
        income={state.income}
        streakDays={state.streakDays || 0}
        currentPhase={state.currentPhase}
        tasks={state.tasks}
        onLogToday={handleLogToday}
        onStartTimer={label => { setTimerLabel(label); setActiveTab('today') }}
        onDismiss={() => {}}
      />

      {/* Always-visible alerts */}
      <SessionWarning />
      {usingFallback && (
        <div className="mb-4 px-3 py-2 rounded-sm border font-mono text-[11px]" style={{ background: 'var(--warn)15', borderColor: 'var(--warn)40', color: 'var(--warn)' }}>
          ⚠ Redis unavailable — changes saved locally and will sync when reconnected.
        </div>
      )}
      <CrisisBanner cash={state.cash} />

      {/* Tab navigation */}
      <nav className="flex gap-1 mb-6 overflow-x-auto pb-1 flex-wrap">
        {(showAllTabs ? ALL_TABS : ALL_TABS.filter(t => (PHASE_TABS[state.currentPhase] ?? ALL_TABS.map(x => x.id)).includes(t.id))).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="shrink-0 px-4 py-2 rounded-sm font-mono text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer min-h-[40px]"
            style={activeTab === tab.id
              ? { background: 'var(--primary)', color: 'var(--bg)', fontWeight: 700 }
              : { background: 'transparent', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
            }
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setShowAllTabs(p => !p)}
          className="shrink-0 px-3 py-2 rounded-sm font-mono text-[9px] uppercase transition-all cursor-pointer min-h-[40px] text-muted-foreground hover:text-text"
          style={{ border: '1px dashed var(--border)' }}
          title={showAllTabs ? 'Show fewer tabs' : 'Show all tabs'}
        >
          {showAllTabs ? '← Less' : '⋯ All'}
        </button>
      </nav>

      {/* ── TODAY ─────────────────────────────────────────────────────────── */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          <MorningBrief
            state={state}
            totalIncome={totalIncome}
            onLogMood={handleLogMood}
            onLogToday={handleLogToday}
          />
          <RunwaySection
            cash={state.cash}
            onCashChange={v => set('cash', v)}
            monthlyIncome={totalIncome}
            onAddExpense={expense => setState(prev => ({ ...prev, expenses: [...(prev.expenses || []), { ...expense, id: `exp-${Date.now()}` }] }))}
          />

          <DailyIncomeGoal
            monthlyGoal={PHASE_INCOME_TARGETS[state.currentPhase as keyof typeof PHASE_INCOME_TARGETS] ?? 2500}
            totalIncome={totalIncome}
          />

          <WeatherWidget />

          <TwoCol>
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
          </TwoCol>

          <TwoCol>
            <TodaysTasks
              currentPhase={state.currentPhase}
              onPhaseChange={p => set('currentPhase', p)}
              tasks={state.tasks}
              onTaskToggle={(pk, i) =>
                setState(prev => ({ ...prev, tasks: { ...prev.tasks, [pk]: { ...prev.tasks[pk], [i]: !prev.tasks[pk]?.[i] } } }))
              }
              onStartTimer={label => { setTimerLabel(label); setActiveTab('today') }}
            />
            <PomodoroTimer
              sessions={state.pomodoroSessions || []}
              onSessionComplete={session => setState(prev => ({ ...prev, pomodoroSessions: [...(prev.pomodoroSessions || []), { ...session, id: `pom-${Date.now()}` }] }))}
              todayDeepWorkMinutes={todayDeepWorkMinutes}
              initialLabel={timerLabel || undefined}
            />
          </TwoCol>

          <TwoCol>
            <DailySchedule currentPhase={state.currentPhase} />
            <MoodLog mood={state.mood || []} onLogMood={handleLogMood} />
          </TwoCol>

          <TwoCol>
            <StreakCounter
              streakDays={state.streakDays || 0}
              lastActiveDate={state.lastActiveDate || ''}
              onLogToday={handleLogToday}
            />
            <PlanWeekTracker
              startDate={state.planStartDate || ''}
              onSetStartDate={date => setState(prev => ({ ...prev, planStartDate: date }))}
            />
          </TwoCol>
        </div>
      )}

      {/* ── FINANCES ──────────────────────────────────────────────────────── */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <TwoCol>
            <IncomeTracker
              income={state.income}
              currentPhase={state.currentPhase}
              onIncomeChange={(id, v) => setState(prev => ({ ...prev, income: { ...prev.income, [id]: v } }))}
            />
            <ExpenseTracker
              expenses={state.expenses || []}
              onAddExpense={expense => setState(prev => ({ ...prev, expenses: [...(prev.expenses || []), { ...expense, id: `exp-${Date.now()}` }] }))}
              onRemoveExpense={id => setState(prev => ({ ...prev, expenses: (prev.expenses || []).filter(e => e.id !== id) }))}
              monthlyIncome={totalIncome}
              cash={state.cash}
            />
          </TwoCol>

          <MonthlyHistory
            currentMonth={state.currentMonth || new Date().toISOString().slice(0, 7)}
            monthlyHistory={state.monthlyHistory || {}}
            currentIncome={state.income}
            onMonthChange={handleMonthChange}
          />

          <TwoCol>
            <CapitalTracker
              capitalHistory={state.capitalHistory || []}
              currentMonth={state.currentMonth || new Date().toISOString().slice(0, 7)}
              cash={state.cash}
              onSave={handleSaveCapital}
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
          </TwoCol>

          <TwoCol>
            <IncomeProjection
              income={state.income}
              currentPhase={state.currentPhase}
              planStartDate={state.planStartDate || ''}
              monthlyHistory={state.monthlyHistory || {}}
            />
            <ConcentrationMonitor income={state.income} />
          </TwoCol>
        </div>
      )}

      {/* ── PROGRESS ──────────────────────────────────────────────────────── */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <TwoCol>
            <SurvivalChecklist
              currentPhase={state.currentPhase}
              phaseChecks={allChecks}
              onToggle={handlePhaseCheckToggle}
              cash={state.cash}
            />
            <ProgressDashboard
              currentPhase={state.currentPhase}
              milestones={state.milestones}
              onMilestoneToggle={id => setState(prev => ({ ...prev, milestones: { ...prev.milestones, [id]: !prev.milestones[id] } }))}
            />
          </TwoCol>

          <TwoCol>
            <WeeklyScorecard
              currentPhase={state.currentPhase}
              currentWeek={state.currentWeek}
              onWeekChange={w => set('currentWeek', w)}
              scores={state.scores}
              onScoreToggle={(wk, i) =>
                setState(prev => ({ ...prev, scores: { ...prev.scores, [wk]: { ...prev.scores[wk], [i]: !prev.scores[wk]?.[i] } } }))
              }
            />
            <GoalTracker
              goals={state.goals || []}
              currentPhase={state.currentPhase}
              onAdd={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onRemove={handleRemoveGoal}
            />
          </TwoCol>

          <WeeklyReviewPanel
            reviews={state.weeklyReviews || []}
            currentPhase={state.currentPhase}
            cash={state.cash}
            monthlyIncome={totalIncome}
            planStartDate={state.planStartDate || ''}
            onSave={handleSaveReview}
          />

          <TwoCol>
            <TimelineView
              currentPhase={state.currentPhase}
              planStartDate={state.planStartDate || ''}
            />
            <DecisionLog
              decisions={state.decisions || []}
              currentPhase={state.currentPhase}
              onAdd={handleAddDecision}
              onUpdateOutcome={handleUpdateOutcome}
            />
          </TwoCol>
        </div>
      )}

      {/* ── BUSINESS ──────────────────────────────────────────────────────── */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <TwoCol>
            <SpiceMetrics
              spice={state.spice || { listings: 0, whatsapp: 0, subscriptions: 0 }}
              onUpdate={(field, value) => setState(prev => ({ ...prev, spice: { ...prev.spice, [field]: value } }))}
            />
            <SpiceRoadmap
              phaseChecks={allChecks}
              onToggle={handleToggleSpiceRoadmap}
              spice={state.spice || { listings: 0, whatsapp: 0, subscriptions: 0 }}
            />
          </TwoCol>

          <AmazonProductTracker
            products={state.amazonProducts || []}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            onRemove={handleRemoveProduct}
          />

          <TwoCol>
            <UpworkTracker
              proposals={state.upworkProposals || []}
              onAdd={handleAddProposal}
              onUpdate={handleUpdateProposal}
              onRemove={handleRemoveProposal}
            />
            <ContactTracker
              contacts={state.contacts || []}
              onAdd={handleAddContact}
              onUpdate={handleUpdateContact}
              onRemove={handleRemoveContact}
            />
          </TwoCol>

          <TwoCol>
            <EventCalendar
              eventChecks={state.eventChecks || {}}
              onToggleCheck={handleToggleEventCheck}
            />
            <NotesSection notes={state.notes} onNotesChange={n => set('notes', n)} />
          </TwoCol>

          <JobApplicationTracker />
        </div>
      )}

      {/* ── WELLBEING ─────────────────────────────────────────────────────── */}
      {activeTab === 'wellbeing' && (
        <div className="space-y-6">
          <PsychSupport
            mood={state.mood || []}
            streakDays={state.streakDays || 0}
            monthlyIncome={totalIncome}
            planStartDate={state.planStartDate || ''}
            cash={state.cash}
          />
          <TwoCol>
            <ResilienceScorecard
              resilience={state.resilience || {}}
              onToggle={handleToggleResilience}
            />
            <RiskPanel />
          </TwoCol>
        </div>
      )}

      {/* ── TOOLS ─────────────────────────────────────────────────────────── */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <TwoCol>
            <BusinessCalculator />
            <CurrencyConverter />
          </TwoCol>
          <TwoCol>
            <FreightCalculator />
            <InternetLog
              speedLog={state.speedLog || []}
              onAdd={handleAddSpeed}
              onRemove={handleRemoveSpeed}
            />
          </TwoCol>
          <CredentialsVault />
          <EmailReportButton />
          <DataBackup state={state} onImport={setState} />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-border flex justify-between items-center">
        <span className="font-mono text-[10px] text-muted-foreground tracking-[0.1em]">Data saved to your account</span>
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

function EmailReportButton() {
  const [loading, setLoading] = useState(false)

  const handleEmail = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/weekly-report')
      if (!res.ok) return
      const d = await res.json()
      const net = d.totalIncome - d.weeklyExpenses
      const body = [
        `Weekly Report — ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        '',
        `Phase: ${d.currentPhase}`,
        `Monthly Income: $${Number(d.totalIncome).toLocaleString()}`,
        `Weekly Expenses: $${Number(d.weeklyExpenses).toFixed(2)}`,
        `Net This Week: $${Number(net).toFixed(2)}`,
        `Cash on Hand: $${Number(d.netCash).toLocaleString()}`,
        `Streak: ${d.streakDays} days`,
        `Mood (7-day): ${d.moodLabel ?? 'N/A'}`,
        `Tasks Done: ${d.tasksCompleted} / ${d.tasksTotal}`,
        '',
        `Generated by Grenada Command Center`,
      ].join('\n')
      window.location.href = `mailto:?subject=Weekly+Report&body=${encodeURIComponent(body)}`
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-3">// Weekly Report</div>
      <p className="font-mono text-[11px] text-muted-foreground mb-4">
        Generate a summary of your income, expenses, streak, mood, and tasks for the week — ready to email.
      </p>
      <button
        onClick={handleEmail}
        disabled={loading}
        className="font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
        style={{ background: 'var(--accent)', color: 'var(--bg)' }}
      >
        {loading ? 'Generating...' : 'Email Report'}
      </button>
    </div>
  )
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
      {children}
    </div>
  )
}
