import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFirebaseApp } from '../lib/firebase'
import type { Card } from '../types/card'

function cardsCollection(user: User) {
  const app = getFirebaseApp()
  if (!app) throw new Error('Firebase nao esta configurado.')
  return collection(getFirestore(app), 'users', user.uid, 'cards')
}
export async function listCards(user: User) { const snapshot = await getDocs(cardsCollection(user)); return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Card, 'id'>) })) }
export async function createCard(user: User, card: Omit<Card, 'id'>) { const ref = await addDoc(cardsCollection(user), { ...card, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); return { ...card, id: ref.id } }
export async function updateCard(user: User, card: Card) { await updateDoc(doc(cardsCollection(user), card.id), { name: card.name, closingDay: card.closingDay, dueDay: card.dueDay, institution: card.institution ?? '', updatedAt: serverTimestamp() }) }
export async function removeCard(user: User, id: string) { await deleteDoc(doc(cardsCollection(user), id)) }
