import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import type { Expense } from '../types/expense'
import { createExpense, listExpenses, removeExpense, updateExpense } from '../services/expenseService'

const KEY = 'expenses'

export function useExpenses(user: User | null, firebaseConfigured: boolean) {
  const [items, setItems] = useState<Expense[]>(() => firebaseConfigured ? [] : JSON.parse(localStorage.getItem(KEY) || '[]'))
  const [loading, setLoading] = useState(firebaseConfigured && Boolean(user))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseConfigured || !user) {
      return
    }
    listExpenses(user).then(setItems).catch(() => setError('Não foi possível carregar seus gastos.')).finally(() => setLoading(false))
  }, [firebaseConfigured, user])

  async function add(expense: Omit<Expense, 'id'>) {
    setError(null)
    if (firebaseConfigured && user) {
      const created = await createExpense(user, expense)
      setItems((current) => [created, ...current])
      return
    }
    const next = [{ ...expense, id: crypto.randomUUID() }, ...items]
    setItems(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  async function remove(id: string) {
    if (!window.confirm('Excluir este gasto?')) return
    setError(null)
    if (firebaseConfigured && user) {
      await removeExpense(user, id)
      setItems((current) => current.filter((item) => item.id !== id))
      return
    }
    const next = items.filter((item) => item.id !== id)
    setItems(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  async function update(expense: Expense) {
    setError(null)
    if (firebaseConfigured && user) {
      await updateExpense(user, expense)
    } else {
      const next = items.map((item) => item.id === expense.id ? expense : item)
      setItems(next)
      localStorage.setItem(KEY, JSON.stringify(next))
      return
    }
    setItems((current) => current.map((item) => item.id === expense.id ? expense : item))
  }

  return { items, add, update, remove, loading, error }
}
