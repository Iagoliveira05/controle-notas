import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { getFirebaseApp } from '../lib/firebase'
import type { ReceiptSuggestions } from './receiptParser'

export type GeminiReceiptResult = ReceiptSuggestions & {
  purchaseDate?: string | null
  category?: string
  paymentMethod?: string
  items: { description: string; amount: number | null }[]
  confidence: Record<string, number | null>
  warnings: string[]
}

function isResult(value: unknown): value is GeminiReceiptResult {
  if (!value || typeof value !== 'object') return false
  const result = value as Record<string, unknown>
  return (result.description === null || typeof result.description === 'string' || result.description === undefined) && (result.amount === null || typeof result.amount === 'number' || result.amount === undefined) && (result.purchaseDate === null || typeof result.purchaseDate === 'string' || result.purchaseDate === undefined) && Array.isArray(result.items) && Array.isArray(result.warnings) && typeof result.confidence === 'object'
}

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('Nao foi possivel preparar a imagem.'))
    reader.readAsDataURL(file)
  })
}

export async function analyzeReceiptWithGemini(file: File): Promise<GeminiReceiptResult> {
  const app = getFirebaseApp()
  if (!app) throw new Error('Firebase nao esta configurado.')
  const image = await toBase64(file)
  const ai = getAI(app, { backend: new GoogleAIBackend() })
  const model = getGenerativeModel(ai, { model: 'gemini-3.8-flash', generationConfig: { responseMimeType: 'application/json' }, systemInstruction: 'Analise comprovantes financeiros em portugues do Brasil. Extraia somente o que estiver visivel. Diferencie total de subtotal, desconto, troco, pagamento e parcelas. Se houver duvida, use null e explique em warnings. Nunca invente dados. Escreva category, paymentMethod e warnings em portugues do Brasil. Para paymentMethod, use somente Pix, Cartao de credito, Cartao de debito, Dinheiro ou Outro. Responda somente JSON valido.' })
  const response = await model.generateContent([{ type: 'text', text: 'Retorne exatamente este esquema JSON. purchaseDate deve ser a data da compra em YYYY-MM-DD, mesmo que a imagem use DD/MM/AAAA ou YYYY/MM/DD. Nao use YYYY/MM/DD na resposta. paymentMethod deve usar os rotulos em portugues, nunca credit_card ou debit_card: {"description":string|null,"amount":number|null,"purchaseDate":"YYYY-MM-DD"|null,"category":string|null,"paymentMethod":string|null,"items":[{"description":string,"amount":number|null}],"confidence":{"description":number|null,"amount":number|null,"purchaseDate":number|null},"warnings":[string]}' }, { type: 'inlineData', inlineData: { mimeType: file.type, data: image } }])
  const parsed: unknown = JSON.parse(response.response.text())
  if (!isResult(parsed)) throw new Error('A resposta da IA nao segue o formato esperado.')
  return parsed
}
