'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import type { User } from '@/types'

// Faqat 1 ta superadmin
const SYSTEM_USERS: (User & { parol: string })[] = [
  { id: 1, ism: 'Super Admin', login: 'superadmin', parol: 'admin123', rol: 'superadmin', filial: 'Asosiy', kategoriya: null, telefon: '' },
]

interface LoginRequest { login: string; parol: string }
interface RegisterData { ism: string; login: string; parol: string; rol: 'admin' | 'sotuvchi' | 'usta'; telefon?: string; kategoriya?: string }

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (c: LoginRequest) => Promise<User>
  loginWithGoogle: (token: string) => Promise<User>
  loginWithPhone: (phone: string, code: string) => Promise<User>
  sendSmsCode: (phone: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<User>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  hasPermission: (p: string) => boolean
}

const PERMISSIONS: Record<string, string[]> = {
  superadmin: ['dash','mahsulot','sotuv','xarid','kassa','qarz','xaridorlar','brak','tamirlash','akkountlar','hisobot','users','sozlamalar'],
  admin: ['dash','mahsulot','sotuv','xarid','kassa','qarz','xaridorlar','brak','tamirlash','hisobot','sozlamalar'],
  sotuvchi: ['dash','sotuv','qarz','xaridorlar','brak','sozlamalar'],
  usta: ['dash','tamirlash','usta_mijozlar','akkountlar','sozlamalar'],
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const usersRef = useRef<(User & { parol: string })[]>([])

  useEffect(() => {
    // Load registered users
    try {
      const saved = localStorage.getItem('registered_users')
      if (saved) usersRef.current = JSON.parse(saved)
    } catch {}
    // Check auth
    try {
      const token = Cookies.get('auth_token')
      const data = localStorage.getItem('user_data')
      if (token && data) setUser(JSON.parse(data))
    } catch {}
    setLoading(false)
  }, [])

  const getAllUsers = useCallback(() => [...SYSTEM_USERS, ...usersRef.current], [])

  const login = useCallback(async (credentials: LoginRequest): Promise<User> => {
    const all = getAllUsers()
    const found = all.find(u => u.login === credentials.login && u.parol === credentials.parol)
    if (!found) throw new Error('Login yoki parol noto\'g\'ri!')
    const { parol, ...userData } = found
    Cookies.set('auth_token', 'tk_' + Date.now(), { expires: 7 })
    localStorage.setItem('user_data', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Xush kelibsiz, ${userData.ism}!`)
    return userData
  }, [getAllUsers])

  const loginWithGoogle = useCallback(async (token: string): Promise<User> => {
    // TODO: Real Google OAuth - backend kerak
    throw new Error('Google OAuth ulash uchun backend server kerak. /api/auth/google endpoint yarating.')
  }, [])

  const sendSmsCode = useCallback(async (phone: string): Promise<boolean> => {
    // TODO: Real Eskiz.uz SMS API - backend kerak
    throw new Error('SMS xizmati ulash uchun backend server kerak. Eskiz.uz API ni ulang.')
  }, [])

  const loginWithPhone = useCallback(async (phone: string, code: string): Promise<User> => {
    // TODO: Real SMS verification - backend kerak
    throw new Error('SMS tasdiqlash uchun backend server kerak.')
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<User> => {
    if (!data.ism || !data.login || !data.parol) throw new Error('Ism, login va parol majburiy!')
    if (data.parol.length < 6) throw new Error('Parol kamida 6 ta belgi!')
    const all = getAllUsers()
    if (all.find(u => u.login === data.login)) throw new Error('Bu login band!')

    const newUser: User & { parol: string } = {
      id: Date.now(), ism: data.ism, login: data.login, parol: data.parol,
      rol: data.rol, telefon: data.telefon || '', kategoriya: data.kategoriya || null, filial: 'Asosiy',
    }
    usersRef.current = [...usersRef.current, newUser]
    localStorage.setItem('registered_users', JSON.stringify(usersRef.current))
    toast.success('Ro\'yxatdan o\'tdingiz!')
    return newUser
  }, [getAllUsers])

  const logout = useCallback(() => {
    Cookies.remove('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    toast.success('Chiqildi')
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...data }
      localStorage.setItem('user_data', JSON.stringify(updated))
      return updated
    })
  }, [])

  const hasPermission = useCallback((p: string): boolean => {
    if (!user) return false
    return (PERMISSIONS[user.rol] || []).includes(p)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, loginWithPhone, sendSmsCode, register, logout, updateProfile, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}