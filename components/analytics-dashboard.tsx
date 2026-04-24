"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react'
import type { MoodEntry } from '@/lib/data'
import type { Expense } from '@/lib/data'

interface AnalyticsDashboardProps {
  monthlyHistory: Record<string, Record<string, number>>
  currentIncome: Record<string, number>
  currentMonth: string
  mood: MoodEntry[]
  expenses: Expense[]
  milestones: Record<string, boolean>
  totalMilestones: number
  incomeTarget?: number
}

const CHART_COLORS = {
  primary: '#2dff6e',
  accent2: '#00c4a0',
  warn: '#ff8c42',
  danger: '#ff4457',
  purple: '#a78bfa',
  dim: '#2a3d2e',
}

export function AnalyticsDashboard({
  monthlyHistory,
  currentIncome,
  currentMonth,
  mood,
  expenses,
  milestones,
  totalMilestones,
  incomeTarget = 2500,
}: AnalyticsDashboardProps) {
  // Prepare income trend data
  const allMonths = { ...monthlyHistory, [currentMonth]: currentIncome }
  const sortedMonths = Object.keys(allMonths).sort()
  
  const incomeData = sortedMonths.slice(-6).map(month => {
    const incomeMap = allMonths[month] || {}
    const total = Object.values(incomeMap).reduce((sum, v) => sum + (v || 0), 0)
    return {
      month: month.slice(5), // Just MM
      income: total,
      target: incomeTarget,
    }
  })

  // Prepare mood data for last 14 days
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    return date.toISOString().slice(0, 10)
  })

  const moodData = last14Days.map(date => {
    const entry = mood.find(m => m.date === date)
    return {
      date: date.slice(5),
      value: entry ? (entry.level === 'green' ? 3 : entry.level === 'yellow' ? 2 : 1) : 0,
      level: entry?.level || 'none',
    }
  })

  // Expense breakdown by category
  const expenseByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  const expensePieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Milestone completion progress
  const completedMilestones = Object.values(milestones).filter(Boolean).length
  const milestoneProgress = [
    { name: 'Done', value: completedMilestones },
    { name: 'Remaining', value: totalMilestones - completedMilestones },
  ]

  // Current month total
  const currentTotal = Object.values(currentIncome).reduce((sum, v) => sum + (v || 0), 0)
  const targetProgress = Math.min(100, Math.round((currentTotal / incomeTarget) * 100))

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wide text-text">
          <BarChart3 className="h-4 w-4 text-accent2" />
          ANALYTICS DASHBOARD
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Income Target Progress */}
        <div className="bg-surface2 rounded-md p-3 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Monthly Target</span>
            </div>
            <span className="text-xs font-mono text-text">
              ${currentTotal.toLocaleString()} / ${incomeTarget.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-dim rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${targetProgress}%`,
                background: targetProgress >= 100 
                  ? CHART_COLORS.primary 
                  : targetProgress >= 50 
                    ? CHART_COLORS.accent2 
                    : CHART_COLORS.warn
              }}
            />
          </div>
          <div className="text-[9px] font-mono text-muted-foreground mt-1 text-right">
            {targetProgress}% of target
          </div>
        </div>

        {/* Income Trend Chart */}
        <div className="bg-surface2 rounded-md p-3 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Income Trend</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 9, fill: '#5a7a62' }}
                  axisLine={{ stroke: '#1e2e22' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#5a7a62' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#111815', 
                    border: '1px solid #1e2e22',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono'
                  }}
                  labelStyle={{ color: '#e8f5ec' }}
                  formatter={(value: number) => [`$${value}`, 'Income']}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke={CHART_COLORS.purple}
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood & Energy Chart */}
        <div className="bg-surface2 rounded-md p-3 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-3 w-3 text-warn" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Mood (14 Days)</span>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 8, fill: '#5a7a62' }}
                  axisLine={{ stroke: '#1e2e22' }}
                  tickLine={false}
                  interval={1}
                />
                <YAxis 
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 3]}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#111815', 
                    border: '1px solid #1e2e22',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono'
                  }}
                  formatter={(_value, _name, props) => {
                    const level = (props as { payload?: { level?: string } })?.payload?.level
                    return [!level || level === 'none' ? 'No data' : level.toUpperCase(), 'Mood' as const]
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[2, 2, 0, 0]}
                >
                  {moodData.map((entry, index) => (
                    <Cell 
                      key={index}
                      fill={
                        entry.level === 'green' ? CHART_COLORS.primary :
                        entry.level === 'yellow' ? CHART_COLORS.warn :
                        entry.level === 'red' ? CHART_COLORS.danger :
                        CHART_COLORS.dim
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[8px] font-mono text-muted-foreground">Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-warn" />
              <span className="text-[8px] font-mono text-muted-foreground">OK</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-danger" />
              <span className="text-[8px] font-mono text-muted-foreground">Low</span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Expenses + Milestones */}
        <div className="grid grid-cols-2 gap-3">
          {/* Expense Breakdown */}
          <div className="bg-surface2 rounded-md p-3 border border-border">
            <span className="text-[9px] font-mono text-muted-foreground uppercase block mb-2">Expenses</span>
            {expensePieData.length > 0 ? (
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={35}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expensePieData.map((_, index) => (
                        <Cell 
                          key={index}
                          fill={[CHART_COLORS.danger, CHART_COLORS.warn, CHART_COLORS.purple, CHART_COLORS.accent2][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: '#111815', 
                        border: '1px solid #1e2e22',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'JetBrains Mono'
                      }}
                      formatter={(value: number) => [`$${value}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                No expenses
              </div>
            )}
          </div>

          {/* Milestone Progress */}
          <div className="bg-surface2 rounded-md p-3 border border-border">
            <span className="text-[9px] font-mono text-muted-foreground uppercase block mb-2">Milestones</span>
            <div className="h-20 flex items-center justify-center">
              <div className="relative">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke={CHART_COLORS.dim}
                    strokeWidth="6"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke={CHART_COLORS.purple}
                    strokeWidth="6"
                    strokeDasharray={`${(completedMilestones / totalMilestones) * 157} 157`}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold font-mono text-purple">
                    {completedMilestones}/{totalMilestones}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
