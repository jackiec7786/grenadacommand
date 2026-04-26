"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, AlertTriangle, TrendingUp, Clock, Target, ChevronRight, Lightbulb, Flame } from 'lucide-react'
import { TASKS, PHASE_CHECKLISTS, PHASE_CONFIGS, PHASE_INCOME_TARGETS, type MoodEntry } from '@/lib/data'

interface SmartActionRecommenderProps {
  cash: number
  monthlyIncome: number
  currentPhase: number
  currentWeek: number
  mood: MoodEntry[]
  phaseChecks: Record<string, boolean>
  tasks: Record<string, Record<number, boolean>>
  streakDays: number
}

interface Recommendation {
  id: string
  priority: 'critical' | 'high' | 'medium'
  action: string
  reason: string
  category: string
  timeEstimate: string
  impact: string
}

export function SmartActionRecommender({
  cash, monthlyIncome, currentPhase, currentWeek, mood, phaseChecks, tasks, streakDays,
}: SmartActionRecommenderProps) {
  const weeksRunway = cash > 0 ? Math.floor((cash / 1300) * 4.33) : 0
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]
  const incomeTarget = PHASE_INCOME_TARGETS[currentPhase]
  const todayStr = new Date().toISOString().slice(0, 10)
  const recentMood = mood.find(m => m.date === todayStr)?.level || mood[mood.length - 1]?.level || 'yellow'
  const phaseTasks = TASKS[currentPhase] || []
  const completedTaskCount = Object.values(tasks[`p${currentPhase}`] || {}).filter(Boolean).length
  const incompleteTasks = phaseTasks.filter((_, i) => !tasks[`p${currentPhase}`]?.[i])
  const checklist = PHASE_CHECKLISTS[currentPhase] || []
  const incompleteChecks = checklist.filter(i => !phaseChecks[i.id])
  const incomeGapPct = Math.round((monthlyIncome / incomeTarget) * 100)

  const recs: Recommendation[] = []

  // ── CRITICAL: Cash crisis
  if (weeksRunway < 2) {
    recs.push({ id: 'crisis', priority: 'critical', action: 'Walk into businesses today — QR menus, Google profiles, SpiceClassifieds pitches only', reason: `Only ${weeksRunway} weeks of cash left.`, category: 'LOCAL', timeEstimate: '3hr', impact: 'Fastest cash available' })
  } else if (weeksRunway < 4 && currentPhase === 1) {
    recs.push({ id: 'urgent-cash', priority: 'high', action: 'Max walk-ins today + flood Respondent.io for research studies', reason: `Under 4 weeks runway. Income must start now.`, category: 'INCOME', timeEstimate: '3hr', impact: 'Build income fast' })
  }

  // ── PHASE 1 specific
  if (currentPhase === 1) {
    const paymentChecks = incompleteChecks.filter(i => i.category === 'PAYMENTS')
    if (paymentChecks.length > 0) {
      recs.push({ id: 'payments', priority: 'critical', action: paymentChecks[0].text, reason: 'Payment stack must be live before any client conversation.', category: 'PAYMENTS', timeEstimate: '30min', impact: 'Unlocks all income rails' })
    }
    if (!phaseChecks['p1s12'] && phaseChecks['p1s9']) {
      recs.push({ id: 'sponsor', priority: 'high', action: 'Walk into 2 businesses today — pitch SpiceClassifieds founding sponsor deal', reason: 'First sponsors not signed yet. Each prepaid 3-month deal is a large cash event.', category: 'SPICE', timeEstimate: '2hr', impact: '$450–1,350 cash per sponsor' })
    }
    const bridgeChecks = incompleteChecks.filter(i => i.category === 'BRIDGE')
    if (bridgeChecks.length > 0) {
      recs.push({ id: 'bridge', priority: 'high', action: bridgeChecks[0].text, reason: 'Bridge income starts clocking the moment you apply.', category: 'BRIDGE', timeEstimate: '20min', impact: '$50–160/hr once onboarded' })
    }
    if (monthlyIncome < 500 && recentMood !== 'red') {
      recs.push({ id: 'local-walk', priority: 'high', action: 'Walk Grand Anse corridor — pitch QR menu or Google profile to 3 businesses', reason: `$${monthlyIncome} earned so far. Local jobs close same day.`, category: 'LOCAL', timeEstimate: '2hr', impact: '$50–200 per job, closes fast' })
    }
    if (!phaseChecks['p1s8']) {
      recs.push({ id: 'spice-fix', priority: 'high', action: 'Confirm SpiceClassifieds payment bug is fixed — test end-to-end', reason: 'Cannot monetise without working payments.', category: 'SPICE', timeEstimate: '30min', impact: 'Unlocks all SpiceClassifieds revenue' })
    }
  }

  // ── PHASE 2 specific
  if (currentPhase === 2) {
    if (!phaseChecks['p2s6']) {
      recs.push({ id: 'ai-bot-demo', priority: 'high', action: 'Build SpiceClassifieds WhatsApp AI bot demo (3–5 hours) — sales tool for hotels', reason: 'Bot demo is the key to closing hotel clients. Build it once, use it forever.', category: 'AI-BIZ', timeEstimate: '3–5hr', impact: '$1,000–1,500/mo per hotel retainer' })
    }
    if (phaseChecks['p2s6'] && !phaseChecks['p2s7']) {
      recs.push({ id: 'hotel-pitch', priority: 'high', action: 'Walk into Grand Anse hotel today — show the live WhatsApp bot demo', reason: 'Demo is ready. First hotel pitch unlocks the retainer income tier.', category: 'AI-BIZ', timeEstimate: '1.5hr', impact: '$1,000–1,500/mo retainer' })
    }
    if (monthlyIncome < incomeTarget * 0.7) {
      recs.push({ id: 'n8n-proposals', priority: 'high', action: 'Send 5 targeted Upwork proposals (n8n/Make niche only — do not go generalist)', reason: `At $${monthlyIncome} vs $${incomeTarget} target. n8n retainer is the fastest ceiling raiser.`, category: 'AI-BIZ', timeEstimate: '45min', impact: '$500–1,500/month retainer' })
    }
    const bizChecks = incompleteChecks.filter(i => i.category === 'BUSINESS')
    if (bizChecks.length > 0) {
      recs.push({ id: 'llc', priority: 'medium', action: bizChecks[0].text, reason: 'Wyoming LLC + Mercury required before taking US AI clients at scale.', category: 'BUSINESS', timeEstimate: '30min', impact: 'Unlocks Phase 3' })
    }
    if (!phaseChecks['p2s12']) {
      recs.push({ id: 'cohost', priority: 'medium', action: 'Cold DM 5 underperforming Airbnb listings in Grenada (<30% occupancy)', reason: 'Co-hosting payment split must be agreed BEFORE starting. First property is the template.', category: 'COHOST', timeEstimate: '30min', impact: '$300–800/mo per property' })
    }
  }

  // ── PHASE 3 specific
  if (currentPhase === 3) {
    if (!phaseChecks['p3s2']) {
      recs.push({ id: 'ai-voice-demo', priority: 'high', action: 'Build AI voice agent demo (HVAC scenario) — 20–40 hours total', reason: 'Voice agent demo is the entry point to US clients. Nothing else unlocks this income tier.', category: 'AIVOICE', timeEstimate: '20–40hr total', impact: '$1,500–5,000 setup + retainer' })
    }
    if (phaseChecks['p3s2'] && !phaseChecks['p3s4']) {
      recs.push({ id: 'cold-email', priority: 'critical', action: 'Launch Smartlead/Instantly cold email campaign — 50+ sends per day', reason: 'Demo is ready. Cold email is the only path to US voice agent clients at scale.', category: 'AIVOICE', timeEstimate: '2hr setup', impact: 'Pipeline to $5k–12k/mo MRR' })
    }
    if (!phaseChecks['p3s8']) {
      recs.push({ id: 'spice-gate', priority: 'high', action: 'SpiceClassifieds: pitch 2 new businesses (car dealer or real estate focus)', reason: 'EC$10,000/mo gate not cleared — blocks IsleClassifieds expansion.', category: 'SPICE', timeEstimate: '1hr', impact: 'Clears expansion gate' })
    }
    if (phaseChecks['p3s8'] && !phaseChecks['p3s11']) {
      recs.push({ id: 'isle-research', priority: 'high', action: 'Research IsleClassifieds Dominica expansion — find local VA contact', reason: 'SpiceClassifieds gate cleared. Dominica/SVG research is the next unlock.', category: 'ISLE', timeEstimate: '1hr', impact: 'Doubles classifieds revenue' })
    }
  }

  // ── PHASE 4 specific
  if (currentPhase === 4) {
    if (!phaseChecks['p4s2']) {
      recs.push({ id: 'developer', priority: 'critical', action: 'Hire first offshore developer ($800–1,500/mo) — triples AI delivery capacity', reason: 'AI retainer book cannot scale past 3–4 clients without a developer.', category: 'AI-BIZ', timeEstimate: '1hr', impact: 'Unlocks $8k–12k/mo MRR' })
    }
    if (!phaseChecks['p4s4']) {
      recs.push({ id: 'isle-expand', priority: 'high', action: 'Launch IsleClassifieds St. Lucia + Antigua — same playbook as Grenada', reason: 'Multi-island expansion is the Phase 4 income multiplier.', category: 'ISLE', timeEstimate: '4hr', impact: 'EC$10k–20k/mo combined' })
    }
    if (!phaseChecks['p4s8']) {
      recs.push({ id: 'cbi-retainer', priority: 'medium', action: 'Reach out to CBI developer — pitch marketing retainer ($2,000/mo + referral)', reason: 'CBI developer retainer is the highest-value local relationship in Phase 4.', category: 'LOCAL', timeEstimate: '1hr', impact: '$2,000/mo + referral upside' })
    }
    recs.push({ id: 'highest-roi', priority: 'medium', action: 'Which stream gave highest income per hour this week? Put 60% of effort there.', reason: 'Phase 4 is about optimising allocation, not adding more streams.', category: 'STRATEGY', timeEstimate: '20min', impact: 'Focuses effort correctly' })
  }

  // ── UNIVERSAL
  if (recentMood === 'red') {
    recs.push({ id: 'mood-low', priority: 'high', action: 'Energy low — take 30 min walk, then do ONE small task only', reason: 'Do not make strategic decisions on red days.', category: 'ENERGY', timeEstimate: '45min', impact: 'Reset mental state' })
  }
  if (streakDays > 0 && !mood.find(m => m.date === todayStr)) {
    recs.push({ id: 'streak', priority: 'medium', action: `Log today to protect your ${streakDays}-day streak`, reason: 'Consistency compounds. Keep the momentum.', category: 'HABITS', timeEstimate: '2min', impact: `Protect ${streakDays}-day streak` })
  }
  if (incompleteTasks.length > 0 && recentMood === 'green') {
    const hardTask = incompleteTasks.find(t => t.time.includes('hr')) || incompleteTasks[0]
    recs.push({ id: 'leverage-energy', priority: 'medium', action: `Good energy — tackle: ${hardTask.label}`, reason: 'High energy days are for hard work.', category: hardTask.tag, timeEstimate: hardTask.time, impact: 'Maximum output' })
  }

  // Sort and limit
  const order = { critical: 0, high: 1, medium: 2 }
  recs.sort((a, b) => order[a.priority] - order[b.priority])
  const top = recs[0]
  const others = recs.slice(1, 4)

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wide text-text">
          <Zap className="h-4 w-4 text-warn" />
          SMART ACTION — {config.name.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {top && (
          <div className={`rounded-md p-4 border ${
            top.priority === 'critical' ? 'bg-danger/10 border-danger/50' :
            top.priority === 'high' ? 'bg-warn/10 border-warn/50' : 'bg-primary/10 border-primary/50'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-md ${
                top.priority === 'critical' ? 'bg-danger/20' : top.priority === 'high' ? 'bg-warn/20' : 'bg-primary/20'
              }`}>
                {top.priority === 'critical' ? <Flame className="h-5 w-5 text-danger" /> :
                 top.priority === 'high' ? <AlertTriangle className="h-5 w-5 text-warn" /> :
                 <Target className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded ${
                    top.priority === 'critical' ? 'bg-danger text-bg' :
                    top.priority === 'high' ? 'bg-warn text-bg' : 'bg-primary text-bg'
                  }`}>
                    {top.priority === 'critical' ? 'DO NOW' : top.priority === 'high' ? 'PRIORITY' : 'SUGGESTED'}
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground">{top.category}</span>
                </div>
                <div className="text-sm font-semibold text-text mb-1">{top.action}</div>
                <div className="text-[10px] font-mono text-muted-foreground mb-2">{top.reason}</div>
                <div className="flex items-center gap-4 text-[9px] font-mono">
                  <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />{top.timeEstimate}</span>
                  <span className="flex items-center gap-1 text-primary"><TrendingUp className="h-3 w-3" />{top.impact}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wide">Also Consider</div>
            {others.map(action => (
              <div key={action.id} className="flex items-center justify-between py-2 px-3 bg-surface2 rounded-md border border-border group hover:border-dim transition-colors">
                <div className="flex items-center gap-2">
                  <Lightbulb className={`h-3 w-3 ${action.priority === 'high' ? 'text-warn' : 'text-muted-foreground'}`} />
                  <div>
                    <div className="text-[11px] font-mono text-text line-clamp-1">{action.action}</div>
                    <div className="text-[9px] font-mono text-muted-foreground">{action.category} • {action.timeEstimate}</div>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <div className={`text-sm font-bold font-mono ${weeksRunway < 4 ? 'text-danger' : weeksRunway < 8 ? 'text-warn' : 'text-primary'}`}>
              {weeksRunway}w
            </div>
            <div className="text-[8px] font-mono text-muted-foreground">RUNWAY</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold font-mono" style={{ color: config.cssColor }}>
              {incomeGapPct}%
            </div>
            <div className="text-[8px] font-mono text-muted-foreground">OF GOAL</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold font-mono text-purple">{completedTaskCount}/{phaseTasks.length}</div>
            <div className="text-[8px] font-mono text-muted-foreground">TASKS</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
