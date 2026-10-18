export type ExpenseDraft = {
  description: string
  amount: number
  date: string
  category: string
  payment: string
}

export function validateExpense(draft: ExpenseDraft): string | null {
  if (!draft.description.trim()) return 'Informe o estabelecimento ou a descrição.'
  if (!Number.isFinite(draft.amount) || draft.amount <= 0) return 'Informe um valor maior que zero.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return 'Informe uma data válida.'
  return null
}
