import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import type { Expense } from '../types/expense'
import { getFirebaseApp } from '../lib/firebase'

type FirestoreExpense = Omit<Expense, 'id' | 'amount'> & { amountCents: number; createdAt?: unknown; updatedAt?: unknown }

function expensesCollection(user: User) {
  const app = getFirebaseApp()
  if (!app) throw new Error('Firebase não está configurado.')
  return collection(getFirestore(app), 'users', user.uid, 'expenses')
}

function fromFirestore(id: string, data: FirestoreExpense): Expense {
  return { id, description: data.description, amount: data.amountCents / 100, date: data.date, category: data.category, payment: data.payment }
}

export async function listExpenses(user: User) {
  const snapshot = await getDocs(query(expensesCollection(user), orderBy('date', 'desc')))
  return snapshot.docs.map((item) => fromFirestore(item.id, item.data() as FirestoreExpense))
}

export async function createExpense(user: User, expense: Omit<Expense, 'id'>) {
  const { amount, ...withoutAmount } = expense
  const reference = await addDoc(expensesCollection(user), { ...withoutAmount, amountCents: Math.round(amount * 100), createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return { ...expense, id: reference.id }
}

export async function removeExpense(user: User, id: string) {
  await deleteDoc(doc(expensesCollection(user), id))
}

export async function updateExpense(user: User, expense: Expense) {
  await updateDoc(doc(expensesCollection(user), expense.id), { description: expense.description, amountCents: Math.round(expense.amount * 100), date: expense.date, category: expense.category, payment: expense.payment, updatedAt: serverTimestamp() })
}
