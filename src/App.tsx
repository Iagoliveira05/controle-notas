import { useMemo, useState } from "react";
import "./App.css";
import "./auth.css";
import "./layout-fixes.css";
import { categories, paymentMethods } from "./data/categories";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";
import { Sidebar } from "./components/Sidebar";
import { useExpenses } from "./hooks/useExpenses";
import { formatCurrency } from "./utils/format";
import { firebaseConfigured } from "./lib/firebase";
import { useAuth } from "./hooks/useAuth";
import { AuthForm } from "./components/AuthForm";
import { logOut } from "./lib/auth";
import type { Expense } from "./types/expense";
import { useCards } from "./hooks/useCards";
import { CardsPanel } from "./components/CardsPanel";
export default function App() {
  const { user, ready } = useAuth();
  const { items, add, update, remove, loading, error } = useExpenses(user, firebaseConfigured);
  const cards = useCards(user, firebaseConfigured);
  const [tab, setTab] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [payment, setPayment] = useState("Todas");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const filtered = useMemo(
    () =>
      items
        .filter(
          (item) =>
            (category === "Todas" || item.category === category) &&
            (payment === "Todas" || item.payment === payment) &&
            (!dateFrom || item.date >= dateFrom) &&
            (!dateTo || item.date <= dateTo) &&
            item.description.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [items, category, payment, dateFrom, dateTo, query],
  );
  const total = filtered.reduce((sum, item) => sum + item.amount, 0);
  if (!ready || loading) return <main className="loading-page">Carregando...</main>;
  if (firebaseConfigured && !user) return <AuthForm />;
  return (
    <div className="app">
      <Sidebar tab={tab} onTabChange={setTab} />
      <main>
        <header>
          <div>
            <p>RESUMO FINANCEIRO</p>
            <h1>
              {tab === "dashboard"
                ? "Olá, vamos organizar?"
                : tab === "history"
                  ? "Histórico de gastos"
                  : "Seus cartões"}
            </h1>
          </div>
          <button className="primary" onClick={() => setOpen(true)}>
            ＋ Novo gasto
          </button>
          {user && <button type="button" onClick={() => void logOut()}>Sair</button>}
        </header>
        {error && <p className="form-error" role="alert">{error}</p>}
        {tab === "dashboard" && (
          <>
            <section className="hero">
              <p>RESUMO DO MÊS</p>
              <h2>{formatCurrency(total)}</h2>
              <span>total neste mês</span>
            </section>
            <div className="stats">
              <div>
                <small>Gastos registrados</small>
                <b>{items.length}</b>
              </div>
              <div>
                <small>Ticket médio</small>
                <b>{formatCurrency(items.length ? total / items.length : 0)}</b>
              </div>
              <div>
                <small>Categoria recente</small>
                <b>{filtered[0]?.category || "—"}</b>
              </div>
            </div>
          </>
        )}
        {tab !== "cards" && (
          <>
            <div className="filters">
              <input
                placeholder="Buscar estabelecimento..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Todas</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={payment} onChange={(event) => setPayment(event.target.value)}>
                <option>Todas</option>
                {paymentMethods.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input type="date" aria-label="Data inicial" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
              <input type="date" aria-label="Data final" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
            </div>
            <ExpenseList
              items={filtered}
              tab={tab}
              onRemove={remove}
              onEdit={(expense) => { setEditing(expense); setOpen(true) }}
              onOpenForm={() => { setEditing(null); setOpen(true) }}
            />
          </>
        )}
        {tab === "legacy-cards" && (
          <section className="panel empty">
            <b>▣</b>
            <h3>Cartões</h3>
            <p>
              O cadastro de cartões será conectado ao ciclo de faturas na
              próxima etapa.
            </p>
          </section>
        )}
        {tab === "cards" && <CardsPanel items={cards.items} onAdd={cards.add} onUpdate={cards.update} onRemove={cards.remove} />}
        <footer>
          Conta Certa · <span>{firebaseConfigured ? "Firebase configurado" : "Modo local: Firebase não configurado"}</span>
        </footer>
      </main>
      {open && <ExpenseForm initialExpense={editing ?? undefined} onSave={async (expense) => { if (editing) await update({ ...expense, id: editing.id }); else await add(expense) }} onClose={() => { setOpen(false); setEditing(null) }} />}
    </div>
  );
}
