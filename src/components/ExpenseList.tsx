import type { Expense } from '../types/expense'
import { formatCurrency, formatDate } from '../utils/format'

type Props = { items: Expense[]; tab: string; onRemove: (id: string) => void; onEdit: (expense: Expense) => void; onOpenForm: () => void }

export function ExpenseList({ items, tab, onRemove, onEdit, onOpenForm }: Props) {
  return <section className="panel"><div className="panel-head"><div><h2>{tab === 'dashboard' ? 'Ultimos gastos' : 'Todos os gastos'}</h2><small>{items.length} registros encontrados</small></div></div>{items.length ? items.slice(0, tab === 'dashboard' ? 5 : 99).map((item) => <article className="row" key={item.id}><i>{item.category[0]}</i><div><b>{item.description}</b><small>{item.category} · {formatDate(item.date)}</small></div><strong>{formatCurrency(item.amount)}</strong><button type="button" onClick={() => onEdit(item)} aria-label={`Editar ${item.description}`}>Editar</button><button type="button" onClick={() => onRemove(item.id)} aria-label={`Excluir ${item.description}`}>×</button></article>) : <div className="empty"><b>＋</b><h3>Seu historico comeca aqui</h3><p>Registre sua primeira compra para acompanhar seus gastos.</p><button className="primary" onClick={onOpenForm}>Registrar gasto</button></div>}</section>
}
