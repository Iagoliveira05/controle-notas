import { useEffect, useRef, useState, type FormEvent } from 'react'
import { categories, paymentMethods } from '../data/categories'
import type { Expense } from '../types/expense'
import { validateExpense } from '../utils/validators'
import { recognizeReceipt } from '../services/ocrService'
import { parseReceiptText, type ReceiptSuggestions } from '../services/receiptParser'
import { analyzeReceiptWithGemini, type GeminiReceiptResult } from '../services/geminiService'
import './expense-form.css'

type Props = { onSave: (expense: Omit<Expense, 'id'>) => void; onClose: () => void }

export function ExpenseForm({ onSave, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [ocrText, setOcrText] = useState('')
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'running' | 'error'>('idle')
  const [ocrProgress, setOcrProgress] = useState(0)
  const [suggestions, setSuggestions] = useState<ReceiptSuggestions>({})
  const [geminiResult, setGeminiResult] = useState<GeminiReceiptResult | null>(null)
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'running' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl) }, [imageUrl])

  function selectImage(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) { window.alert('Selecione um arquivo de imagem válido.'); return }
    setImageUrl((current) => { if (current) URL.revokeObjectURL(current); return URL.createObjectURL(file) })
    setImageFile(file); setOcrText(''); setSuggestions({}); setGeminiResult(null); setOcrStatus('idle'); setGeminiStatus('idle')
  }

  async function runOcr() {
    if (!imageFile) return
    setOcrStatus('running'); setOcrProgress(0)
    try { const text = await recognizeReceipt(imageFile, setOcrProgress); setOcrText(text); setSuggestions(parseReceiptText(text)); setOcrStatus('idle') } catch { setOcrStatus('error') }
  }

  async function runGemini() {
    if (!imageFile) return
    setGeminiStatus('running')
    try { const result = await analyzeReceiptWithGemini(imageFile); setGeminiResult(result); setSuggestions({ description: result.description ?? undefined, amount: result.amount ?? undefined, date: result.purchaseDate ?? undefined }); setGeminiStatus('idle') } catch { setGeminiStatus('error') }
  }

  function applySuggestions() {
    const form = formRef.current
    if (!form) return
    if (suggestions.description) (form.elements.namedItem('description') as HTMLInputElement).value = suggestions.description
    if (suggestions.amount) (form.elements.namedItem('amount') as HTMLInputElement).value = suggestions.amount.toFixed(2)
    if (suggestions.date) (form.elements.namedItem('date') as HTMLInputElement).value = suggestions.date
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const draft = { description: String(data.get('description') ?? ''), amount: Number(data.get('amount')), date: String(data.get('date') ?? ''), category: String(data.get('category') ?? ''), payment: String(data.get('payment') ?? '') }
    const error = validateExpense(draft)
    if (error) { window.alert(error); return }
    onSave(draft); onClose()
  }

  return <div className="back"><form ref={formRef} onSubmit={submit}><h2>Novo gasto</h2><label>Foto do comprovante <span className="hint">opcional</span><input name="receipt" type="file" accept="image/*" capture="environment" onChange={(event) => selectImage(event.target.files?.[0])} /></label>{imageUrl && <div className="receipt-preview"><img src={imageUrl} alt="Prévia do comprovante selecionado" /><button type="button" onClick={() => setImageUrl(null)}>Remover foto</button><button type="button" onClick={() => void runOcr()} disabled={ocrStatus === 'running'}>{ocrStatus === 'running' ? `OCR ${Math.round(ocrProgress * 100)}%` : 'Ler localmente'}</button><button type="button" onClick={() => void runGemini()} disabled={geminiStatus === 'running'}>{geminiStatus === 'running' ? 'Analisando...' : 'Analisar com Gemini'}</button></div>}{ocrStatus === 'error' && <p className="form-error">OCR local não conseguiu ler esta imagem.</p>}{geminiStatus === 'error' && <p className="form-error">Gemini não disponível ou não conseguiu interpretar a imagem. Tente o OCR local.</p>}{ocrText && <label>Texto reconhecido — revise<textarea value={ocrText} onChange={(event) => setOcrText(event.target.value)} rows={5} /></label>}{geminiResult?.warnings.map((warning) => <p className="form-error" key={warning}>Atenção: {warning}</p>)}{(suggestions.description || suggestions.amount || suggestions.date) && <div className="suggestions"><p>Sugestões encontradas — confira antes de aplicar:</p><ul><li>Estabelecimento: {suggestions.description ?? 'não identificado'}</li><li>Valor: {suggestions.amount ? suggestions.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'não identificado'}</li><li>Data: {suggestions.date ?? 'não identificada'}</li></ul><button type="button" onClick={applySuggestions}>Aplicar sugestões ao formulário</button></div>}<label>Descrição<input name="description" required /></label><div className="two"><label>Valor<input name="amount" type="number" step=".01" min=".01" required /></label><label>Data<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label></div><label>Categoria<select name="category">{categories.map(category => <option key={category}>{category}</option>)}</select></label><label>Pagamento<select name="payment">{paymentMethods.map(method => <option key={method}>{method}</option>)}</select></label><p className="form-note">O Gemini envia a imagem ao Google através do Firebase AI Logic. Use apenas se concordar com esse envio. A resposta é uma sugestão revisável.</p><button className="primary">Salvar gasto</button><button type="button" onClick={onClose}>Cancelar</button></form></div>
}
