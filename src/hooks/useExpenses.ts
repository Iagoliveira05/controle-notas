import { useState } from 'react'
import type { Expense } from '../types/expense'
const KEY = 'expenses'
export function useExpenses() {
  const [items, setItems] = useState<Expense[]>(() => JSON.parse(localStorage.getItem(KEY) || '[]'))
  const persist = (next: Expense[]) => { setItems(next); localStorage.setItem(KEY, JSON.stringify(next)) }
  const add = (expense: Omit<Expense, 'id'>) => persist([{ ...expense, id: crypto.randomUUID() }, ...items])
  const remove = (id: string) => { if (confirm('Excluir este gasto?')) persist(items.filter(item => item.id !== id)) }
  return { items, add, remove }
}
