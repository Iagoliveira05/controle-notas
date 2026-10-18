import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { subscribeToAuth } from '../lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => subscribeToAuth((nextUser) => {
    setUser(nextUser)
    setReady(true)
  }), [])

  return { user, ready }
}
