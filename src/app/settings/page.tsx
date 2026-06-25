'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { useCurrency } from '@/hooks/useCurrency'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme, setTheme, isDark } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { rate, lastUpdated, fetchRate, loading: rateLoading } = useCurrency()

  const IOSSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{title}</div>
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">{children}</div>
    </div>
  )

  const IOSRow = ({ left, right, last, onClick }: { left: React.ReactNode; right?: React.ReactNode; last?: boolean; onClick?: () => void }) => (
    <div onClick={onClick} className={`flex items-center justify-between px-4 py-3.5 ${!last ? 'border-b border-gray-100' : ''} ${onClick ? 'active:bg-gray-50 cursor-pointer' : ''} transition-colors`}>
      <div className="flex-1">{left}</div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 min-h-full" style={{ background: '#f2f2f7' }}>
        <div className="max-w-lg mx-auto">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-6">Sozlamalar</h1>

          {/* Profil */}
          <IOSSection title="Profil">
            <IOSRow
              left={
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">{(user?.ism || '?')[0]}</div>
                  <div>
                    <div className="font-semibold text-[16px] text-gray-900">{user?.ism}</div>
                    <div className="text-[13px] text-gray-500">{user?.rol === 'superadmin' ? '👑 Superadmin' : user?.rol === 'admin' ? '🔑 Admin' : user?.rol === 'usta' ? '🔧 Usta' : '🛒 Sotuvchi'}</div>
                  </div>
                </div>
              }
              last
            />
          </IOSSection>

          {/* Valyuta */}
          <IOSSection title="Valyuta kursi">
            <IOSRow
              left={<div><div className="text-[15px] font-medium text-gray-900">1 USD = {rate.toLocaleString()} so'm</div>{lastUpdated && <div className="text-[12px] text-gray-400 mt-0.5">Yangilangan: {lastUpdated}</div>}</div>}
              right={<button onClick={fetchRate} className="text-[14px] text-blue-500 font-semibold">{rateLoading ? '⏳' : '🔄 Yangilash'}</button>}
              last
            />
          </IOSSection>

          {/* Til */}
          <IOSSection title="Interfeys tili">
            {[{ code: 'uz', flag: '🇺🇿', name: "O'zbekcha" }, { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'en', flag: '🇬🇧', name: 'English' }].map((l, i, arr) => (
              <IOSRow key={l.code} last={i === arr.length - 1}
                onClick={() => setLanguage(l.code as any)}
                left={<div className="flex items-center gap-3"><span className="text-xl">{l.flag}</span><span className="text-[15px] text-gray-900">{l.name}</span></div>}
                right={language === l.code ? <span className="text-blue-500 text-lg">✓</span> : null}
              />
            ))}
          </IOSSection>

          {/* Tema */}
          <IOSSection title="Ko'rinish">
            {[{ val: 'light', label: '☀️ Kunduz', desc: "Yorug' rejim" }, { val: 'dark', label: '🌙 Tungi', desc: "Qorong'u rejim" }].map((t, i, arr) => (
              <IOSRow key={t.val} last={i === arr.length - 1}
                onClick={() => setTheme(t.val as any)}
                left={<div><div className="text-[15px] text-gray-900">{t.label}</div><div className="text-[12px] text-gray-400">{t.desc}</div></div>}
                right={theme === t.val ? <span className="text-blue-500 text-lg">✓</span> : null}
              />
            ))}
          </IOSSection>

          {/* Tizim haqida */}
          <IOSSection title="Tizim haqida">
            {[['Dastur', '⚡ FastStore ERP'], ['Versiya', 'v3.0.0'], ['Texnologiya', 'Next.js 14'], ['Kurs manba', 'CBU.uz (real)']].map(([k, v], i, arr) => (
              <IOSRow key={k} last={i === arr.length - 1}
                left={<span className="text-[15px] text-gray-500">{k}</span>}
                right={<span className="text-[14px] font-medium text-gray-900">{v}</span>}
              />
            ))}
          </IOSSection>

          {/* Chiqish */}
          <button onClick={logout}
            className="w-full py-3.5 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 text-[16px] text-red-500 font-semibold text-center shadow-sm active:bg-red-50 transition-colors">
            Tizimdan chiqish
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}