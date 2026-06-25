'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import type { User, LoginRequest } from '@/types'

// Demo users
const DEMO_USERS: User[] = [
  { 
    id: 1, 
    ism: 'Sardor Aliyev', 
    login: 'sardor', 
    rol: 'superadmin', 
    filial: 'Asosiy', 
    kategoriya: null,
    telefon: '+998901234567'
  },
  { 
    id: 2, 
    ism: 'Malika Yusupova', 
    login: 'malika', 
    rol: 'admin', 
    filial: 'Asosiy', 
    kategoriya: 'Elektronika',
    telefon: '+998902345678'
  },
  { 
    id: 3, 
    ism: 'Jasur Toshmatov', 
    login: 'jasur', 
    rol: 'sotuvchi', 
    filial: 'Asosiy', 
    kategoriya: null,
    telefon: '+998903456789'
  },
  { 
    id: 4, 
    ism: 'Bobur Karimov', 
    login: 'bobur', 
    rol: 'usta', 
    filial: 'Asosiy', 
    kategoriya: null,
    telefon: '+998904567890'
  },
]

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<User>
  loginWithGoogle: (account: any) => Promise<User>
  loginWithPhone: (phone: string, code: string) => Promise<User>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Role permissions
const PERMISSIONS = {
  superadmin: ['dash', 'mahsulot', 'sotuv', 'xarid', 'kassa', 'qarz', 'xaridorlar', 'brak', 'tamirlash', 'hisobot', 'users', 'sozlamalar'],
  admin: ['dash', 'mahsulot', 'sotuv', 'xarid', 'kassa', 'qarz', 'xaridorlar', 'brak', 'tamirlash', 'hisobot', 'sozlamalar'],
  sotuvchi: ['dash', 'sotuv', 'qarz', 'xaridorlar', 'brak', 'sozlamalar'],
  usta: ['dash', 'tamirlash', 'brak', 'xaridorlar', 'sozlamalar'], // ⭐ Usta uchun xaridorlar qo'shildi
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('auth_token')
      localStorage.removeItem('user_data')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginRequest): Promise<User> => {
    try {
      setLoading(true)

      // Demo uchun - haqiqiy API call o'rniga
      const user = DEMO_USERS.find(u => 
        u.login === credentials.login && 
        credentials.parol === '1234' // Demo parol
      )

      if (!user) {
        throw new Error('Login yoki parol noto\'g\'ri!')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Save auth data
      const token = 'demo_token_' + Date.now()
      Cookies.set('auth_token', token, { expires: 7 })
      localStorage.setItem('user_data', JSON.stringify(user))
      
      setUser(user)
      toast.success(`Xush kelibsiz, ${user.ism}!`)
      
      return user
    } catch (error: any) {
      toast.error(error.message || 'Kirish jarayonida xatolik')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (account: any): Promise<User> => {
    try {
      setLoading(true)

      // Demo Google accounts
      const googleAccounts = [
        { email: 'sardor.aliyev@gmail.com', user: DEMO_USERS[0] },
        { email: 'malika.yusupova@gmail.com', user: DEMO_USERS[1] },
        { email: 'jasur.toshmatov@gmail.com', user: DEMO_USERS[2] },
        { email: 'bobur.karimov@gmail.com', user: DEMO_USERS[3] },
      ]

      const matchedAccount = googleAccounts.find(acc => acc.email === account.email)
      if (!matchedAccount) {
        throw new Error('Bu Google hisob tizimga ro\'yxatdan o\'tmagan!')
      }

      await new Promise(resolve => setTimeout(resolve, 1200))

      const token = 'google_token_' + Date.now()
      Cookies.set('auth_token', token, { expires: 7 })
      localStorage.setItem('user_data', JSON.stringify(matchedAccount.user))
      
      setUser(matchedAccount.user)
      toast.success(`Google orqali muvaffaqiyatli kirdingiz!`)
      
      return matchedAccount.user
    } catch (error: any) {
      toast.error(error.message || 'Google login xatolik')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithPhone = async (phone: string, code: string): Promise<User> => {
    try {
      setLoading(true)

      // Demo SMS verification
      if (code !== '1234') { // Demo kod
        throw new Error('SMS kod noto\'g\'ri!')
      }

      // Phone'ga mos user topish yoki yangi user yaratish
      const existingUser = DEMO_USERS.find(u => u.telefon === phone)
      const user = existingUser || {
        id: Date.now(),
        ism: 'Telefon foydalanuvchisi',
        login: phone,
        rol: 'sotuvchi' as const,
        telefon: phone,
        filial: 'Asosiy'
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      const token = 'sms_token_' + Date.now()
      Cookies.set('auth_token', token, { expires: 7 })
      localStorage.setItem('user_data', JSON.stringify(user))
      
      setUser(user)
      toast.success('SMS orqali muvaffaqiyatli kirdingiz!')
      
      return user
    } catch (error: any) {
      toast.error(error.message || 'SMS login xatolik')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    router.push('/')
    toast.success('Tizimdan chiqildi')
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('User not found')

      // Demo update - haqiqiy API call o'rniga
      const updatedUser = { ...user, ...data }
      
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast.success('Profil yangilandi')
    } catch (error: any) {
      toast.error(error.message || 'Profil yangilanmadi')
      throw error
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    const userPermissions = PERMISSIONS[user.rol] || []
    return userPermissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle,
      loginWithPhone,
      logout,
      updateProfile,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}