'use client'

import { useState, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'

// Navigatsiya elementlari
const NAV_ITEMS = [
  { key: 'dash', label: 'Dashboard', icon: '🏠', href: '/' },
  { key: 'mahsulot', label: 'Mahsulotlar', icon: '📦', href: '/products' },
  { key: 'sotuv', label: 'Sotuvlar', icon: '🛒', href: '/sales' },
  { key: 'xarid', label: 'Xaridlar', icon: '📥', href: '/purchases' },
  { key: 'kassa', label: 'Kassa', icon: '💰', href: '/cash' },
  { key: 'qarz', label: 'Qarzdorlar', icon: '📋', href: '/debts' },
  { key: 'xaridorlar', label: 'Sotuvchi xaridorlari', icon: '👥', href: '/customers' },
  { key: 'usta_mijozlar', label: 'Usta mijozlari', icon: '🔧👥', href: '/customers/usta' },
  { key: 'brak', label: 'Brak / Qaytarish', icon: '🔴', href: '/defects' },
  { key: 'tamirlash', label: 'Tamirlash', icon: '🔧', href: '/repair' },
  { key: 'akkountlar', label: 'Akkountlar', icon: '🔐', href: '/accounts' },
  { key: 'hisobot', label: 'Hisobotlar', icon: '📊', href: '/reports' },
  { key: 'users', label: 'Foydalanuvchilar', icon: '🔑', href: '/users' },
  { key: 'sozlamalar', label: 'Sozlamalar', icon: '⚙️', href: '/settings' },
]

// Rol bo'yicha ruxsatlar
const PERMISSIONS: Record<string, string[]> = {
  superadmin: ['dash', 'mahsulot', 'sotuv', 'xarid', 'kassa', 'qarz', 'xaridorlar', 'usta_mijozlar', 'brak', 'tamirlash', 'akkountlar', 'hisobot', 'users', 'sozlamalar'],
  admin: ['dash', 'mahsulot', 'sotuv', 'xarid', 'kassa', 'qarz', 'xaridorlar', 'usta_mijozlar', 'brak', 'tamirlash', 'hisobot', 'sozlamalar'],
  sotuvchi: ['dash', 'sotuv', 'qarz', 'xaridorlar', 'brak', 'sozlamalar'],
  usta: ['dash', 'tamirlash', 'brak', 'usta_mijozlar', 'akkountlar', 'sozlamalar'],
}

const ROL_COLORS: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  sotuvchi: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  usta: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
}

const ROL_LABELS: Record<string, string> = {
  superadmin: '👑 Superadmin',
  admin: '🔑 Admin',
  sotuvchi: '🛒 Sotuvchi',
  usta: '🔧 Usta',
}

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme, isDark } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPath, setCurrentPath] = useState('/')

  if (!user) return null

  const userPermissions = PERMISSIONS[user.rol] || []
  const allowedNav = NAV_ITEMS.filter(item => userPermissions.includes(item.key))

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    setCurrentPath(item.href)
    // Next.js router bilan almashtirish mumkin
    window.location.href = item.href
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200 flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg shadow-md shadow-blue-500/30 flex-shrink-0">
              ⚡
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-black text-sm">FastStore</div>
                <div className="text-[10px] text-gray-400">ERP v3.0</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {sidebarOpen && (
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
              MENYU
            </div>
          )}
          {allowedNav.map((item) => {
            const isActive = currentPath === item.href
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-500'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />
                )}
              </button>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.ism[0]}
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{user.ism}</div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${ROL_COLORS[user.rol] || ''}`}>
                    {ROL_LABELS[user.rol] || user.rol}
                  </span>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={logout}
                className="w-full text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg py-1.5 hover:border-red-300 hover:text-red-500 transition-all"
              >
                🚪 Chiqish
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ☰
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              FastStore ERP
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Rate */}
            <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-300 rounded-full text-xs font-medium">
              💱 1 USD = 12,700 so'm
            </div>

            {/* Language */}
            <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-700 rounded-full p-0.5">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    language === lang
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Date */}
            <div className="text-xs text-gray-400 hidden md:block">
              {new Date().toLocaleDateString('uz-UZ', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}