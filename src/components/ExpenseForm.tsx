import { useEffect, useRef, useState, type FormEvent } from 'react'
import { categories, paymentMethods } from '../data/categories'
import type { Expense } from '../types/expense'
import { validateExpense } from '../utils/validators'
import { analyzeReceiptWithGemini, type GeminiReceiptResult } from '../services/geminiService'
import './expense-form.css'
import './expense-form-spacing.css'

type Props = { onSave: (expense: Omit<Expense, 'id'>) => Promise<void>; onClose: () => void }
type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error'

export function ExpenseForm({ onSave, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [result, setResult] = useState<GeminiReceiptResult | null>(null)
  const [saving, setSaving] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl) }, [imageUrl])

  async function analyze(file: File) {
    setAnalysisStatus('loading')
    setAnalysisError(null)
    setResult(null)
    try { const analysis = await analyzeReceiptWithGemini(file); setResult(analysis); applyResult(analysis); setAnalysisStatus('success') }
    catch { setAnalysisStatus('error'); setAnalysisError('Não conseguimos reconhecer esta imagem. Confira a foto e preencha os campos manualmente.') }
  }

  function selectImage(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) { window.alert('Selecione um arquivo de imagem válido.'); return }
    setImageUrl((current) => { if (current) URL.revokeObjectURL(current); return URL.createObjectURL(file) })
    void analyze(file)
  }

  function applyResult(analysis?: GeminiReceiptResult | FormEvent<HTMLButtonElement> | null) {
    const data = analysis && 'currentTarget' in analysis ? result : analysis ?? result
    if (!data || !formRef.current) return
    const elements = formRef.current.elements
    if (data.description) (elements.namedItem('description') as HTMLInputElement).value = data.description
    if (data.amount !== null && data.amount !== undefined) (elements.namedItem('amount') as HTMLInputElement).value = data.amount.toFixed(2)
    const date = normalizeDate(data.purchaseDate)
    if (date) (elements.namedItem('date') as HTMLInputElement).value = date
    const category = findOption(categories, data.category)
    const payment = findPaymentOption(data.paymentMethod)
    if (category) (elements.namedItem('category') as HTMLSelectElement).value = category
    if (payment) (elements.namedItem('payment') as HTMLSelectElement).value = payment
  }

  function findOption(options: string[], suggestion?: string | null) {
    if (!suggestion) return undefined
    const normalized = suggestion.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return options.find((option) => {
      const candidate = option.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate)
    })
  }

  function findPaymentOption(suggestion?: string | null) {
    const value = suggestion?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() ?? ''
    if (value.includes('pix')) return 'Pix'
    if (value.includes('debit_card') || value.includes('debit card')) return paymentMethods[2]
    if (value.includes('credit_card') || value.includes('credit card')) return paymentMethods[1]
    if (value.includes('debito')) return 'Cartão de débito'
    if (value.includes('credito') || value.includes('cartao')) return 'Cartão de crédito'
    if (value.includes('dinheiro') || value.includes('especie')) return 'Dinheiro'
    return findOption(paymentMethods, suggestion)
  }

  function normalizeDate(value?: string | null) {
    if (!value) return undefined
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) value = value.replaceAll('/', '-')
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const match = value.match(/^(\d{2})[-/](\d{2})[-/](\d{2,4})$/)
    if (!match) return undefined
    const year = match[3].length === 2 ? `20${match[3]}` : match[3]
    const date = `${year}-${match[2]}-${match[1]}`
    const parsed = new Date(`${date}T12:00:00`)
    return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date ? undefined : date
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const data = new FormData(event.currentTarget)
    const draft = { description: String(data.get('description') ?? ''), amount: Number(data.get('amount')), date: String(data.get('date') ?? ''), category: String(data.get('category') ?? ''), payment: String(data.get('payment') ?? '') }
    const error = validateExpense(draft)
    if (error) { window.alert(error); return }
    setSaving(true)
    try {
      await onSave(draft)
      onClose()
    } catch {
      window.alert('NÃ£o foi possÃ­vel salvar este gasto. Verifique sua conexÃ£o e tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const recognized = result ? [{ label: 'Estabelecimento', value: result.description }, { label: 'Valor total', value: result.amount === null || result.amount === undefined ? null : result.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }, { label: 'Data da compra', value: result.purchaseDate }, { label: 'Categoria', value: result.category }, { label: 'Pagamento', value: result.paymentMethod }] : []
  const missing = recognized.filter((field) => !field.value).map((field) => field.label)

  return <div className="back"><form ref={formRef} onSubmit={submit}><div className="form-heading"><div><span className="eyebrow">NOVO LANÇAMENTO</span><h2>Registrar compra</h2><p>Tire uma foto e nós analisaremos o comprovante.</p></div><button type="button" className="close-button" onClick={onClose} aria-label="Fechar">×</button></div><label className="upload-area"><span className="upload-icon">＋</span><strong>{imageUrl ? 'Trocar comprovante' : 'Tirar foto ou escolher da galeria'}</strong><small>JPG, PNG ou HEIC · a análise começa automaticamente</small><input name="receipt" type="file" accept="image/*" capture="environment" onChange={(event) => selectImage(event.target.files?.[0])} /></label>{imageUrl && <div className="receipt-preview"><img src={imageUrl} alt="Prévia do comprovante" />{analysisStatus === 'loading' && <div className="analysis-loading"><span className="spinner" /><strong>Analisando comprovante...</strong><small>Identificando valores, data e estabelecimento</small></div>}</div>}{analysisStatus === 'error' && <div className="analysis-error" role="alert"><strong>Não foi possível reconhecer</strong><span>{analysisError}</span><small>Você pode preencher os campos manualmente ou escolher outra foto.</small></div>}{analysisStatus === 'success' && result && <section className="recognition-card"><div className="recognition-header"><div><span className="eyebrow">ANÁLISE CONCLUÍDA</span><h3>Confira o que encontramos</h3></div><span className="check">✓</span></div><div className="recognized-grid">{recognized.map((field) => <div className={field.value ? 'recognized-field' : 'recognized-field missing'} key={field.label}><small>{field.label}</small><strong>{field.value || 'Não identificado'}</strong></div>)}</div>{missing.length > 0 && <p className="missing-note">Não encontramos: {missing.join(', ')}. Preencha ou corrija abaixo.</p>}{result.warnings.map((warning) => <p className="warning-note" key={warning}>{warning}</p>)}<button type="button" className="suggestion-button" onClick={applyResult}>Usar sugestões no formulário</button></section>}<div className="manual-section"><div className="section-title"><span>Dados da compra</span><small>Você pode editar tudo antes de salvar</small></div><label>Estabelecimento ou descrição<input name="description" placeholder="Ex.: Mercado Central" required /></label><div className="two"><label>Valor total<input name="amount" type="number" step=".01" min=".01" placeholder="0,00" required /></label><label>Data da compra<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label></div><div className="two"><label>Categoria<select name="category">{categories.map(category => <option key={category}>{category}</option>)}</select></label><label>Forma de pagamento<select name="payment">{paymentMethods.map(method => <option key={method}>{method}</option>)}</select></label></div></div><p className="privacy-note">A imagem é enviada ao Gemini somente para esta análise e não é salva automaticamente.</p><div className="form-actions"><button type="button" onClick={onClose}>Cancelar</button><button className="primary" disabled={analysisStatus === 'loading'}>Salvar compra</button></div></form></div>
}
