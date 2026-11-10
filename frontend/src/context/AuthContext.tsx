import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getMe,
  loginApi,
  logoutApi,
  registerApi,
  type Profile,
  type RegisterPayload,
} from '../lib/api'
import { tokenStore } from '../lib/auth'

interface AuthContextValue {
  user: Profile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    if (!tokenStore.getAccess()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      setUser(await getMe())
    } catch {
      tokenStore.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  async function login(email: string, password: string) {
    const tokens = await loginApi(email, password)
    tokenStore.set(tokens.accessToken, tokens.refreshToken)
    setUser(await getMe())
  }

  async function register(payload: RegisterPayload) {
    const tokens = await registerApi(payload)
    tokenStore.set(tokens.accessToken, tokens.refreshToken)
    setUser(await getMe())
  }

  async function logout() {
    const refresh = tokenStore.getRefresh()
    if (refresh) {
      try {
        await logoutApi(refresh)
      } catch {
        /* best-effort revoke */
      }
    }
    tokenStore.clear()
    setUser(null)
  }

  async function refreshUser() {
    setUser(await getMe())
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
