import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { getFirebaseApp } from './firebase'

export function subscribeToAuth(callback: (user: User | null) => void) {
  const app = getFirebaseApp()
  if (!app) {
    callback(null)
    return () => undefined
  }
  return onAuthStateChanged(getAuth(app), callback)
}

export async function signIn(email: string, password: string) {
  const app = getFirebaseApp()
  if (!app) throw new Error('Firebase não está configurado.')
  return signInWithEmailAndPassword(getAuth(app), email, password)
}

export async function signUp(email: string, password: string) {
  const app = getFirebaseApp()
  if (!app) throw new Error('Firebase não está configurado.')
  return createUserWithEmailAndPassword(getAuth(app), email, password)
}

export async function logOut() {
  const app = getFirebaseApp()
  if (app) await signOut(getAuth(app))
}
