'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Card } from '@/components/ui/Card'
import { toast } from 'react-hot-toast'

const LANGUAGES = [
  { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿', native: 'O\'zbekcha' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', native: 'Русский' },
  { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
]

const THEMES = [
  { value: 'light', label: '☀️ Kunduz', description: 'Yorug\', tozalangan ko\'rinish' },
  { value: 'dark', label: '🌙 Tun', description: 'Qorong\'u, ko\'zni himoya qiluvchi' },
  { value: 'auto', label: '🔄 Avtomatik', description: 'Tizim sozlamalariga qarab' },
]

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    ism: user?.ism || '',
    telefon: user?.telefon || '',
    manzil: user?.manzil || '',
  })
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  })

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      await updateProfile(profileData)
      toast.success('Profil ma\'lumotlari saqlandi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
    toast.success(`Til ${LANGUAGES.find(l => l.code === langCode)?.native} ga o'zgartirildi`)
  }

  const handleThemeChange = (themeValue: string) => {
    setTheme(themeValue as 'light' | 'dark' | 'auto')
    toast.success(`Tema ${THEMES.find(t => t.value === themeValue)?.label} ga o'zgartirildi`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⚙️ Sozlamalar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Hisobingiz va dastur sozlamalarini boshqaring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: '👤 Profil', icon: '👤' },
                  { id: 'appearance', label: '🎨 Ko\'rinish', icon: '🎨' },
                  { id: 'language', label: '🌐 Til', icon: '🌐' },
                  { id: 'notifications', label: '🔔 Bildirishnomalar', icon: '🔔' },
                  { id: 'security', label: '🔒 Xavfsizlik', icon: '🔒' },
                  { id: 'system', label: 'ℹ️ Tizim haqida', icon: 'ℹ️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {user?.ism?.[0] || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    👤 Profil Ma'lumotlari
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Shaxsiy ma'lumotlaringizni tahrirlang
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To'liq ism
                  </label>
                  <input
                    type="text"
                    value={profileData.ism}
                    onChange={(e) => setProfileData(prev => ({ ...prev, ism: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={profileData.telefon}
                    onChange={(e) => setProfileData(prev => ({ ...prev, telefon: e.target.value }))}
                    className="input"
                    placeholder="+998..."
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manzil
                </label>
                <input
                  type="text"
                  value={profileData.manzil}
                  onChange={(e) => setProfileData(prev => ({ ...prev, manzil: e.target.value }))}
                  className="input"
                  placeholder="Shahar, tuman..."
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Rol</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Sizning tizimda rolingiz
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.rol === 'superadmin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' :
                    user?.rol === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                    user?.rol === 'usta' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                  }`}>
                    {user?.rol === 'superadmin' ? '👑 Superadmin' :
                     user?.rol === 'admin' ? '🔑 Admin' :
                     user?.rol === 'usta' ? '🔧 Usta' : '🛒 Sotuvchi'}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveProfile}
                loading={loading}
                className="w-full"
              >
                💾 Saqlash
              </Button>
            </Card>

            {/* Language Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🌐 Interfeys Tili
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Dastur interfeysi tilini tanlang
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      language === lang.code
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{lang.flag}</span>
                      {language === lang.code && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {lang.native}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {lang.name}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Theme Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🎨 Ko'rinish Rejimi
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Sizga qulay bo'lgan temani tanlang
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THEMES.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      theme === themeOption.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{themeOption.label.split(' ')[0]}</span>
                      {theme === themeOption.value && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {themeOption.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {themeOption.description}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔔 Bildirishnomalar
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Qaysi bildirishnomalarni olishni xohlaysiz
              </p>

              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email bildirishnomalar', desc: 'Muhim yangiliklar va hisobotlar' },
                  { key: 'sms', label: 'SMS bildirishnomalar', desc: 'Tezkor xabarlar va ogohlantirishlar' },
                  { key: 'push', label: 'Push bildirishnomalar', desc: 'Brauzer orqali bildirishnomalar' },
                  { key: 'marketing', label: 'Marketing xabarlar', desc: 'Yangi imkoniyatlar va aksiyalar haqida' },
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {notification.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.desc}
                      </div>
                    </div>
                    <Switch
                      checked={notifications[notification.key as keyof typeof notifications]}
                      onChange={(checked) => setNotifications(prev => ({
                        ...prev,
                        [notification.key]: checked
                      }))}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* System Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ℹ️ Tizim Haqida
              </h2>
              
              <div className="space-y-3">
                {[
                  ['Dastur nomi', '⚡ FastStore ERP'],
                  ['Versiya', 'v3.0.0'],
                  ['Texnologiya', 'Next.js 14 + TypeScript'],
                  ['Joriy til', LANGUAGES.find(l => l.code === language)?.native || 'O\'zbekcha'],
                  ['Ko\'rinish', theme === 'dark' ? '🌙 Tun rejimi' : theme === 'light' ? '☀️ Kunduz rejimi' : '🔄 Avtomatik'],
                  ['Foydalanuvchi', user?.ism || 'Noma\'lum'],
                  ['Build sana', new Date().toLocaleDateString('uz-UZ')],
                ].map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{key}</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}