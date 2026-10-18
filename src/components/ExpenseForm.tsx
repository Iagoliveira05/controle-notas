import { useEffect, useState, type FormEvent } from 'react'
import { categories, paymentMethods } from '../data/categories'
import type { Expense } from '../types/expense'
import { validateExpense } from '../utils/validators'
import { recognizeReceipt } from '../services/ocrService'
type Props = { onSave: (expense: Omit<Expense, 'id'>) => void; onClose: () => void }
export function ExpenseForm({ onSave, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [ocrText, setOcrText] = useState('')
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [ocrProgress, setOcrProgress] = useState(0)

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  function selectImage(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      window.alert('Selecione um arquivo de imagem válido.')
      return
    }
    setImageUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
    setImageFile(file)
    setOcrText('')
    setOcrStatus('idle')
  }

  async function runOcr() {
    if (!imageFile) return
    setOcrStatus('running')
    setOcrProgress(0)
    try {
      setOcrText(await recognizeReceipt(imageFile, setOcrProgress))
      setOcrStatus('done')
    } catch {
      setOcrStatus('error')
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const draft = {
      description: String(data.get('description') ?? ''),
      amount: Number(data.get('amount')),
      date: String(data.get('date') ?? ''),
      category: String(data.get('category') ?? ''),
      payment: String(data.get('payment') ?? ''),
    }
    const error = validateExpense(draft)
    if (error) {
      window.alert(error)
      return
    }
    onSave(draft)
    onClose()
  }

  return <div className="back"><form onSubmit={submit}><h2>Novo gasto</h2><label>Foto do comprovante <span className="hint">opcional</span><input name="receipt" type="file" accept="image/*" capture="environment" onChange={(event) => selectImage(event.target.files?.[0])} /></label>{imageUrl && <div className="receipt-preview"><img src={imageUrl} alt="Prévia do comprovante selecionado" /><button type="button" onClick={() => setImageUrl(null)}>Remover foto</button><button type="button" onClick={() => void runOcr()} disabled={ocrStatus === 'running'}>{ocrStatus === 'running' ? `Lendo ${Math.round(ocrProgress * 100)}%` : 'Ler texto localmente'}</button></div>}{ocrStatus === 'error' && <p className="form-error">Não foi possível ler esta imagem. Você pode preencher os campos manualmente.</p>}{ocrText && <label>Texto reconhecido — revise antes de usar<textarea value={ocrText} onChange={(event) => setOcrText(event.target.value)} rows={5} /></label>}<label>Descrição<input name="description" required /></label><div className="two"><label>Valor<input name="amount" type="number" step=".01" min=".01" required /></label><label>Data<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label></div><label>Categoria<select name="category">{categories.map(category => <option key={category}>{category}</option>)}</select></label><label>Pagamento<select name="payment">{paymentMethods.map(method => <option key={method}>{method}</option>)}</select></label><p className="form-note">O OCR roda localmente no navegador. O texto é apenas uma sugestão revisável e não preenche nem salva campos automaticamente.</p><button className="primary">Salvar gasto</button><button type="button" onClick={onClose}>Cancelar</button></form></div>
}
