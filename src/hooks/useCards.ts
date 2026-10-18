import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import type { Card } from '../types/card'
import { createCard, listCards, removeCard, updateCard } from '../services/cardService'

const KEY = 'cards'
export function useCards(user: User | null, firebaseConfigured: boolean) {
  const [items, setItems] = useState<Card[]>(() => firebaseConfigured ? [] : JSON.parse(localStorage.getItem(KEY) || '[]'))
  const [loading, setLoading] = useState(firebaseConfigured && Boolean(user))
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { if (!firebaseConfigured || !user) return; listCards(user).then(setItems).catch(() => setError('Nao foi possivel carregar seus cartoes.')).finally(() => setLoading(false)) }, [firebaseConfigured, user])
  async function add(card: Omit<Card, 'id'>) { const created = firebaseConfigured && user ? await createCard(user, card) : { ...card, id: crypto.randomUUID() }; setItems((current) => [created, ...current]); if (!firebaseConfigured || !user) localStorage.setItem(KEY, JSON.stringify([created, ...items])) }
  async function update(card: Card) { if (firebaseConfigured && user) await updateCard(user, card); const next = items.map((item) => item.id === card.id ? card : item); setItems(next); if (!firebaseConfigured || !user) localStorage.setItem(KEY, JSON.stringify(next)) }
  async function remove(id: string) { if (!window.confirm('Excluir este cartao?')) return; if (firebaseConfigured && user) await removeCard(user, id); const next = items.filter((item) => item.id !== id); setItems(next); if (!firebaseConfigured || !user) localStorage.setItem(KEY, JSON.stringify(next)) }
  return { items, add, update, remove, loading, error }
}
