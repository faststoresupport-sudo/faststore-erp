'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import type { User } from '@/types'

// ═══════════════════════════════════════════════════════
// HAQIQIY FOYDALANUVCHILAR (demo emas!)
// Faqat 1 ta superadmin - qolganlari registratsiya orqali
// ═══════════════════════════════════════════════════════
const SYSTEM_USERS: (User & { parol: string })[] = [
  {
    id: 1,
    ism: 'Super Admin',
    login: 'superadmin',
    parol: 'admin123',
    rol: 'superadmin',
    filial: 'Asosiy',
    kategoriya: null,
    telefon: '',
  },
]

interface LoginRequest {
  login: string
  parol: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<User>
  loginWithGoogle: (token: string) => Promise<User>
  loginWithPhone: (phone: string, code: string) => Promise<User>
  sendSmsCode: (phone: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<User>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  hasPermission: (permission: string) => boolean
  allUsers: User[]
  addUser: (user: User & { parol: string }) => void
}

interface RegisterData {
  ism: string
  login: string
  parol: string
  rol: 'admin' | 'sotuvchi' | 'usta'
  telefon?: string
  kategoriya?: string
}

// Role permissions
const PERMISSIONS: Record<string, string[]> = {
  superadmin: ['dash', 'mahsulot', 'sotuv', 'xarid', 'kassa', 'qarz', 'xaridorlar', 'brak', 'tamirlash', 'akkountlar', 'hisobot', 'users', 'sozlamalar'],
  admin: ['dash', 'mahsulot', 'sotuv', 'xarid', 'kassa', 'qarz', 'xaridorlar', 'brak', 'tamirlash', 'hisobot', 'sozlamalar'],
  sotuvchi: ['dash', 'sotuv', 'qarz', 'xaridorlar', 'brak', 'sozlamalar'],
  usta: ['dash', 'tamirlash', 'brak', 'xaridorlar', 'akkountlar', 'sozlamalar'],
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [registeredUsers, setRegisteredUsers] = useState<(User & { parol: string })[]>([])

  useEffect(() => {
    checkAuth()
    // localStorage dan registratsiya qilingan userlarni yuklash
    const saved = localStorage.getItem('registered_users')
    if (saved) {
      try { setRegisteredUsers(JSON.parse(saved)) } catch {}
    }
  }, [])

  // Barcha userlar (system + registered)
  const allUsers: (User & { parol: string })[] = [...SYSTEM_USERS, ...registeredUsers]

  const checkAuth = async () => {
    try {
      const token = Cookies.get('auth_token')
      const userData = localStorage.getItem('user_data')
      if (token && userData) {
        setUser(JSON.parse(userData))
      }
    } catch {
      Cookies.remove('auth_token')
      localStorage.removeItem('user_data')
    } finally {
      setLoading(false)
    }
  }

  // ═══ LOGIN/PAROL ═══
  const login = async (credentials: LoginRequest): Promise<User> => {
    setLoading(true)
    try {
      // TODO: Real API call
      // const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })

      const foundUser = allUsers.find(u =>
        u.login === credentials.login && u.parol === credentials.parol
      )

      if (!foundUser) {
        throw new Error('Login yoki parol noto\'g\'ri!')
      }

      const { parol, ...userData } = foundUser
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).slice(2)
      Cookies.set('auth_token', token, { expires: 7 })
      localStorage.setItem('user_data', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Xush kelibsiz, ${userData.ism}!`)
      return userData
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ═══ GOOGLE AUTH ═══
  const loginWithGoogle = async (googleToken: string): Promise<User> => {
    setLoading(true)
    try {
      // TODO: Real Google OAuth verification
      // const response = await fetch('/api/auth/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: googleToken })
      // })
      // const data = await response.json()
      // if (!response.ok) throw new Error(data.error)
      // return data.user

      throw new Error('Google OAuth hali ulanmagan. Backend serverda /api/auth/google endpoint yarating.')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ═══ SMS CODE YUBORISH ═══
  const sendSmsCode = async (phone: string): Promise<boolean> => {
    try {
      // TODO: Real SMS API (Eskiz.uz)
      // const response = await fetch('/api/auth/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone })
      // })
      // const data = await response.json()
      // if (!response.ok) throw new Error(data.error)
      // return true

      throw new Error('SMS xizmati hali ulanmagan. Backend serverda Eskiz.uz API ni ulang.')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  // ═══ PHONE AUTH ═══
  const loginWithPhone = async (phone: string, code: string): Promise<User> => {
    setLoading(true)
    try {
      // TODO: Real SMS verification
      // const response = await fetch('/api/auth/verify-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone, code })
      // })
      // const data = await response.json()
      // if (!response.ok) throw new Error(data.error)

      throw new Error('SMS tasdiqlash hali ulanmagan. Backend serverda /api/auth/verify-sms endpoint yarating.')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ═══ REGISTER ═══
  const register = async (data: RegisterData): Promise<User> => {
    try {
      // Tekshirish
      if (!data.ism || !data.login || !data.parol) {
        throw new Error('Ism, login va parol majburiy!')
      }
      if (data.parol.length < 6) {
        throw new Error('Parol kamida 6 ta belgi bo\'lishi kerak!')
      }
      if (allUsers.find(u => u.login === data.login)) {
        throw new Error('Bu login band! Boshqa login tanlang.')
      }

      // TODO: Real API call
      // const response = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })

      const newUser: User & { parol: string } = {
        id: Date.now(),
        ism: data.ism,
        login: data.login,
        parol: data.parol,
        rol: data.rol,
        telefon: data.telefon || '',
        kategoriya: data.kategoriya || null,
        filial: 'Asosiy',
      }

      const updated = [...registeredUsers, newUser]
      setRegisteredUsers(updated)
      localStorage.setItem('registered_users', JSON.stringify(updated))

      toast.success('Ro\'yxatdan o\'tdingiz! Endi login qiling.')
      return newUser
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  // ═══ LOGOUT ═══
  const logout = () => {
    Cookies.remove('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    toast.success('Tizimdan chiqdingiz')
  }

  // ═══ UPDATE PROFILE ═══
  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('User not found')
    const updated = { ...user, ...data }
    localStorage.setItem('user_data', JSON.stringify(updated))
    setUser(updated)
    toast.success('Profil yangilandi')
  }

  // ═══ PERMISSION CHECK ═══
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return (PERMISSIONS[user.rol] || []).includes(permission)
  }

  // ═══ ADD USER (superadmin uchun) ═══
  const addUser = (newUser: User & { parol: string }) => {
    const updated = [...registeredUsers, newUser]
    setRegisteredUsers(updated)
    localStorage.setItem('registered_users', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, loginWithGoogle, loginWithPhone, sendSmsCode,
      register, logout, updateProfile, hasPermission, allUsers, addUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}