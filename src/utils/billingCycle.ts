export type BillingCycle = { start: string; end: string; dueDate: string }

function daysInMonth(year: number, month: number) { return new Date(Date.UTC(year, month + 1, 0)).getUTCDate() }
function dateString(year: number, month: number, day: number) { return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` }

export function getBillingCycle(purchaseDate: string, closingDay: number, dueDay: number): BillingCycle {
  const [year, month, day] = purchaseDate.split('-').map(Number)
  const endMonth = day <= closingDay ? month : month + 1
  const endYear = year + Math.floor(endMonth / 12)
  const normalizedEndMonth = endMonth % 12
  const end = dateString(endYear, normalizedEndMonth, Math.min(closingDay, daysInMonth(endYear, normalizedEndMonth)))
  const previousMonth = normalizedEndMonth === 0 ? 11 : normalizedEndMonth - 1
  const previousYear = normalizedEndMonth === 0 ? endYear - 1 : endYear
  const previousClosing = Math.min(closingDay, daysInMonth(previousYear, previousMonth))
  const startDate = new Date(Date.UTC(previousYear, previousMonth, previousClosing + 1))
  const start = dateString(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
  const dueMonth = normalizedEndMonth + (dueDay <= closingDay ? 1 : 0)
  const dueYear = endYear + Math.floor(dueMonth / 12)
  const normalizedDueMonth = dueMonth % 12
  const dueDate = dateString(dueYear, normalizedDueMonth, Math.min(dueDay, daysInMonth(dueYear, normalizedDueMonth)))
  return { start, end, dueDate }
}
