import { useEffect, useState, type FormEvent } from 'react'
import { categories, paymentMethods } from '../data/categories'
import type { Expense } from '../types/expense'
import { validateExpense } from '../utils/validators'
type Props = { onSave: (expense: Omit<Expense, 'id'>) => void; onClose: () => void }
export function ExpenseForm({ onSave, onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

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

  return <div className="back"><form onSubmit={submit}><h2>Novo gasto</h2><label>Foto do comprovante <span className="hint">opcional</span><input name="receipt" type="file" accept="image/*" capture="environment" onChange={(event) => selectImage(event.target.files?.[0])} /></label>{imageUrl && <div className="receipt-preview"><img src={imageUrl} alt="Prévia do comprovante selecionado" /><button type="button" onClick={() => setImageUrl(null)}>Remover foto</button></div>}<label>Descrição<input name="description" required /></label><div className="two"><label>Valor<input name="amount" type="number" step=".01" min=".01" required /></label><label>Data<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label></div><label>Categoria<select name="category">{categories.map(category => <option key={category}>{category}</option>)}</select></label><label>Pagamento<select name="payment">{paymentMethods.map(method => <option key={method}>{method}</option>)}</select></label><p className="form-note">A foto fica apenas nesta tela por enquanto. O OCR local e o salvamento da imagem serão implementados em etapas posteriores.</p><button className="primary">Salvar gasto</button><button type="button" onClick={onClose}>Cancelar</button></form></div>
}
