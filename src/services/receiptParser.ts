export type ReceiptSuggestions = { description?: string; amount?: number; date?: string }

function parseAmount(value: string) {
  const amount = Number(value.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(amount) && amount > 0 ? amount : undefined
}

export function parseReceiptText(text: string): ReceiptSuggestions {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const dateMatch = text.match(/\b(\d{2})[-/](\d{2})[-/](\d{2,4})\b/)
  const date = dateMatch ? `${dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}` : undefined
  const moneyPattern = /(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2}|\d+\.\d{2})/g
  const totalLine = lines.find((line) => /total|valor a pagar|total pago/i.test(line))
  const amountMatch = totalLine?.match(moneyPattern) ?? text.match(moneyPattern)
  const amount = amountMatch ? parseAmount(amountMatch[amountMatch.length - 1]) : undefined
  const description = lines.find((line) => line.length >= 3 && !/\d{2}[-/]\d{2}[-/]\d{2,4}/.test(line) && !/total|subtotal|troco|cpf|cnpj|cupom|nota fiscal/i.test(line) && !/\d{1,3}(?:\.\d{3})*,\d{2}/.test(line))
  return { description, amount, date }
}
