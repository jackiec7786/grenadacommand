"use client"

import { useState } from 'react'
import type { Expense } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Receipt, 
  Plus, 
  Trash2, 
  TrendingDown, 
  TrendingUp,
  Wallet,
  AlertTriangle
} from 'lucide-react'

interface ExpenseTrackerProps {
  expenses: Expense[]
  onAddExpense: (expense: Omit<Expense, 'id'>) => void
  onRemoveExpense: (id: string) => void
  monthlyIncome: number
  cash: number
}

const EXPENSE_CATEGORIES = [
  { id: 'rent', name: 'Rent/Housing', icon: '🏠' },
  { id: 'food', name: 'Food/Groceries', icon: '🍲' },
  { id: 'utilities', name: 'Utilities', icon: '⚡' },
  { id: 'internet', name: 'Internet/Phone', icon: '📶' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'health', name: 'Health', icon: '💊' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱' },
  { id: 'other', name: 'Other', icon: '📦' },
]

export function ExpenseTracker({
  expenses,
  onAddExpense,
  onRemoveExpense,
  monthlyIncome,
  cash,
}: ExpenseTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: 'food',
    amount: '',
    description: '',
    isRecurring: false,
  })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const recurringExpenses = expenses
    .filter(e => e.isRecurring)
    .reduce((sum, e) => sum + e.amount, 0)
  const netSavings = monthlyIncome - totalExpenses
  const burnRate = totalExpenses / 30 // Daily burn rate
  const runwayDays = burnRate > 0 ? Math.floor(cash / burnRate) : Infinity
  const runwayWeeks = Math.floor(runwayDays / 7)

  const expensesByCategory = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter(c => c.total > 0)

  const handleSubmit = () => {
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) return
    
    onAddExpense({
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date().toISOString().slice(0, 10),
      isRecurring: newExpense.isRecurring,
    })
    
    setNewExpense({ category: 'food', amount: '', description: '', isRecurring: false })
    setShowForm(false)
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-mono tracking-wide text-text">
            <Receipt className="h-4 w-4 text-warn" />
            EXPENSE TRACKER
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="h-7 px-2 text-xs font-mono"
          >
            <Plus className="h-3 w-3 mr-1" />
            ADD
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface2 rounded-md p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="h-3 w-3 text-danger" />
              <span className="text-[9px] font-mono text-muted-foreground uppercase">Total Expenses</span>
            </div>
            <div className="text-lg font-bold font-mono text-danger">
              ${totalExpenses.toLocaleString()}
            </div>
            <div className="text-[9px] font-mono text-muted-foreground">
              ${recurringExpenses.toLocaleString()} recurring
            </div>
          </div>
          
          <div className={`rounded-md p-3 border ${
            netSavings >= 0 
              ? 'bg-primary/10 border-primary/30' 
              : 'bg-danger/10 border-danger/30'
          }`}>
            <div className="flex items-center gap-1.5 mb-1">
              {netSavings >= 0 
                ? <TrendingUp className="h-3 w-3 text-primary" />
                : <AlertTriangle className="h-3 w-3 text-danger" />
              }
              <span className="text-[9px] font-mono text-muted-foreground uppercase">Net Savings</span>
            </div>
            <div className={`text-lg font-bold font-mono ${
              netSavings >= 0 ? 'text-primary' : 'text-danger'
            }`}>
              ${Math.abs(netSavings).toLocaleString()}
              {netSavings < 0 && ' deficit'}
            </div>
            <div className="text-[9px] font-mono text-muted-foreground">
              per month
            </div>
          </div>
        </div>

        {/* Burn Rate & Runway */}
        <div className="bg-dim/30 rounded-md p-3 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-3 w-3 text-purple" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Burn Rate Analysis</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-sm font-bold font-mono text-warn">${burnRate.toFixed(0)}</div>
              <div className="text-[8px] font-mono text-muted-foreground">PER DAY</div>
            </div>
            <div>
              <div className="text-sm font-bold font-mono text-text">{runwayDays === Infinity ? '∞' : runwayDays}</div>
              <div className="text-[8px] font-mono text-muted-foreground">DAYS LEFT</div>
            </div>
            <div>
              <div className={`text-sm font-bold font-mono ${
                runwayWeeks < 4 ? 'text-danger' : runwayWeeks < 8 ? 'text-warn' : 'text-primary'
              }`}>
                {runwayDays === Infinity ? '∞' : runwayWeeks}
              </div>
              <div className="text-[8px] font-mono text-muted-foreground">WEEKS LEFT</div>
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-surface2 rounded-md p-3 border border-primary/30 space-y-3">
            <div className="text-[10px] font-mono text-primary uppercase tracking-wide">New Expense</div>
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newExpense.category}
                onChange={e => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                className="bg-surface border border-border rounded-md px-2 py-1.5 text-xs font-mono text-text focus:outline-none focus:border-primary"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <Input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={e => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="h-8 text-xs font-mono"
              />
            </div>
            
            <Input
              placeholder="Description (optional)"
              value={newExpense.description}
              onChange={e => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              className="h-8 text-xs font-mono"
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newExpense.isRecurring}
                  onChange={e => setNewExpense(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-[10px] font-mono text-muted-foreground">Recurring monthly</span>
              </label>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="h-7 px-2 text-xs font-mono"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  className="h-7 px-3 text-xs font-mono bg-primary text-bg hover:bg-primary/90"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Expense Breakdown by Category */}
        {expensesByCategory.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wide">By Category</div>
            {expensesByCategory.map(cat => (
              <div key={cat.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs font-mono text-text">{cat.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-warn">${cat.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recent Expenses List */}
        {expenses.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wide">Recent</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {expenses.slice(-5).reverse().map(expense => (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between py-1.5 px-2 bg-surface2/50 rounded-sm group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{EXPENSE_CATEGORIES.find(c => c.id === expense.category)?.icon}</span>
                    <div>
                      <div className="text-[10px] font-mono text-text">
                        {expense.description || EXPENSE_CATEGORIES.find(c => c.id === expense.category)?.name}
                      </div>
                      <div className="text-[8px] font-mono text-muted-foreground">
                        {expense.date} {expense.isRecurring && '• Recurring'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-warn">${expense.amount}</span>
                    <button
                      onClick={() => onRemoveExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-danger transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expenses.length === 0 && !showForm && (
          <div className="text-center py-4 text-xs font-mono text-muted-foreground">
            No expenses tracked yet. Click ADD to start.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
