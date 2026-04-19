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

  // ── CRITICAL: Cash crisis (always phase 1 priority)
  if (weeksRunway < 2) {
    recs.push({ id: 'crisis', priority: 'critical', action: 'Run Cambly sessions 4+ hours TODAY — nothing else', reason: `Only ${weeksRunway} weeks of cash left.`, category: 'INCOME', timeEstimate: '4hr', impact: 'Earn $40–60 immediately' })
  } else if (weeksRunway < 4 && currentPhase === 1) {
    recs.push({ id: 'urgent-cash', priority: 'high', action: 'Max Cambly hours + flood Respondent for studies', reason: `Under 4 weeks runway. Income must start now.`, category: 'INCOME', timeEstimate: '3hr', impact: 'Build income fast' })
  }

  // ── PHASE 1 specific
  if (currentPhase === 1) {
    if (monthlyIncome < 500 && recentMood !== 'red') {
      recs.push({ id: 'research-studies', priority: 'high', action: 'Apply to research studies on Respondent.io right now', reason: `$${monthlyIncome} earned so far. Studies pay $50–400 each.`, category: 'INCOME', timeEstimate: '20min', impact: 'Fastest money available' })
    }
    const internetChecks = incompleteChecks.filter(i => i.category === 'INTERNET')
    if (internetChecks.length > 0) {
      recs.push({ id: 'internet', priority: 'high', action: internetChecks[0].text, reason: 'Wired internet is your lifeline for all income streams.', category: 'INFRA', timeEstimate: '30min', impact: 'Unlocks everything' })
    }
    if (incomeGapPct < 60 && recentMood !== 'red') {
      recs.push({ id: 'call-center', priority: 'high', action: 'Follow up all call center applications today — one email each', reason: 'Call center income is your fastest path to a stable floor.', category: 'JOBS', timeEstimate: '20min', impact: '$1,200–1,800/month once hired' })
    }
  }

  // ── PHASE 2 specific
  if (currentPhase === 2) {
    if (monthlyIncome < incomeTarget * 0.7) {
      recs.push({ id: 'agency-pitch', priority: 'high', action: 'Send 2 agency pitches to Caribbean hospitality businesses today', reason: `At $${monthlyIncome} vs $${incomeTarget} target. Agency is the fastest ceiling raiser.`, category: 'AGENCY', timeEstimate: '45min', impact: '$1,500–4,500/month per client' })
    }
    const bizChecks = incompleteChecks.filter(i => i.category === 'BUSINESS')
    if (bizChecks.length > 0) {
      recs.push({ id: 'corp', priority: 'medium', action: bizChecks[0].text, reason: 'C-Corp and Mercury account are required before Amazon FBA.', category: 'BUSINESS', timeEstimate: '30min', impact: 'Unlocks Phase 3' })
    }
    if (!phaseChecks['p2s3']) {
      recs.push({ id: 'upwork-client', priority: 'high', action: 'Send 5 targeted Upwork proposals today — OBM, AI automation, project manager roles', reason: 'First Upwork client not landed yet. This is the key Phase 2 milestone.', category: 'UPWORK', timeEstimate: '45min', impact: '$500–2,500/month retainer' })
    }
  }

  // ── PHASE 3 specific
  if (currentPhase === 3) {
    if (!phaseChecks['p3s11']) {
      recs.push({ id: 'capital', priority: 'high', action: 'Check capital level — PO cannot be placed until $15,000+', reason: 'Do not place the private label PO before this threshold.', category: 'CAPITAL', timeEstimate: '10min', impact: 'Protects from undercapitalised launch' })
    }
    if (phaseChecks['p3s11'] && !phaseChecks['p3s12']) {
      recs.push({ id: 'po', priority: 'critical', action: 'Capital is ready — contact supplier and confirm private label PO today', reason: 'Capital threshold met. Every week of delay costs sales velocity.', category: 'AMAZON', timeEstimate: '1hr', impact: 'Starts the FBA clock' })
    }
    if (!phaseChecks['p3s15']) {
      recs.push({ id: 'tiktok-followers', priority: 'medium', action: 'Post one TikTok today — Caribbean lifestyle or remote work angle', reason: 'Need 1,000 followers before TikTok Shop affiliate access.', category: 'TIKTOK', timeEstimate: '30min', impact: 'Compounds daily if started now' })
    }
  }

  // ── PHASE 4 specific
  if (currentPhase === 4) {
    if (!phaseChecks['p4s3']) {
      recs.push({ id: 'ppc', priority: 'critical', action: 'Launch Amazon PPC campaign at $40/day budget', reason: 'FBA listing live but no PPC = no organic rank velocity.', category: 'AMAZON', timeEstimate: '1hr', impact: 'Drives first reviews and rank' })
    }
    if (phaseChecks['p4s5'] && !phaseChecks['p4s6']) {
      recs.push({ id: 'tiktok-shop', priority: 'high', action: 'Apply for TikTok Shop seller account today', reason: 'FBA is profitable. The sequencing gate is cleared.', category: 'TIKTOK', timeEstimate: '30min', impact: '$500–2,000/month additional' })
    }
    recs.push({ id: 'highest-roi', priority: 'medium', action: 'Identify which stream gave highest income per hour this week — document it', reason: 'Phase 4 is about optimising effort allocation, not adding more.', category: 'STRATEGY', timeEstimate: '20min', impact: 'Focuses Year 2 correctly' })
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
