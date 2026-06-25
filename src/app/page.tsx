'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoginPage } from '@/components/auth/LoginPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useCurrency } from '@/hooks/useCurrency'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f2f2f7' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30" style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)' }}>⚡</div>
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 min-h-full" style={{ background: '#f2f2f7' }}>
        {user.rol === 'usta' && <UstaDash user={user} />}
        {user.rol === 'sotuvchi' && <SotuvchiDash user={user} />}
        {(user.rol === 'admin' || user.rol === 'superadmin') && <AdminDash user={user} />}
      </div>
    </DashboardLayout>
  )
}

// ═══════════════════════════════════════════════════════════
// 🔧 USTA DASHBOARD - iOS
// ═══════════════════════════════════════════════════════════
function UstaDash({ user }: { user: any }) {
  const { formatSom } = useCurrency()
  const [repairs, setRepairs] = useState<any[]>([])

  useEffect(() => {
    try { const r = localStorage.getItem('faststore_repairs'); if (r) setRepairs(JSON.parse(r)) } catch {}
  }, [])

  const jarayonda = repairs.filter(r => ['qabul', 'diagnostika', 'tamirlashda'].includes(r.holat)).length
  const tayyor = repairs.filter(r => r.holat === 'tayyor').length
  const topshirildi = repairs.filter(r => r.holat === 'topshirildi').length
  const daromad = repairs.filter(r => r.holat === 'topshirildi').reduce((s, r) => s + (r.narx || 0), 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Salom, {(user.ism || '').split(' ')[0]}! 👋</h1>
        <p className="text-[15px] text-gray-500 mt-0.5">Tamirlash buyurtmalari</p>
      </div>

      {/* Stats - iOS cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { l: 'Jami', v: repairs.length, i: '📋', c: '#007AFF' },
          { l: 'Jarayonda', v: jarayonda, i: '🔧', c: '#FF9500' },
          { l: 'Tayyor', v: tayyor, i: '✅', c: '#34C759' },
          { l: 'Daromad', v: formatSom(daromad), i: '💰', c: '#34C759' },
        ].map((s, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.i}</span>
              <span className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold">{s.l}</span>
            </div>
            <div className="text-[22px] font-bold" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Faol buyurtmalar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Faol buyurtmalar</span>
          <a href="/repair" className="text-[13px] text-blue-500 font-semibold">Barchasi →</a>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
          {repairs.filter(r => ['qabul', 'diagnostika', 'tamirlashda', 'tayyor'].includes(r.holat)).length === 0 ? (
            <div className="p-8 text-center"><p className="text-gray-400 text-[14px]">Hozircha faol buyurtma yo'q</p></div>
          ) : (
            repairs.filter(r => ['qabul', 'diagnostika', 'tamirlashda', 'tayyor'].includes(r.holat)).slice(0, 5).map((r, i, arr) => (
              <div key={r.id} className={`px-4 py-3.5 flex items-center gap-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''} active:bg-gray-50 transition-colors`}>
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-lg flex-shrink-0">📱</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-gray-900 truncate">{r.qurilma}</div>
                  <div className="text-[13px] text-gray-500">{r.mijoz}</div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-white ${
                  r.holat === 'tayyor' ? 'bg-green-500' : r.holat === 'tamirlashda' ? 'bg-blue-500' : r.holat === 'diagnostika' ? 'bg-orange-500' : 'bg-gray-500'
                }`}>{r.holat === 'tayyor' ? '✅' : r.holat === 'tamirlashda' ? '🔧' : r.holat === 'diagnostika' ? '🔍' : '📥'}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tez amallar */}
      <div className="mb-2 px-1">
        <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Tez amallar</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { l: 'Yangi buyurtma', i: '➕', href: '/repair', bg: 'from-blue-500 to-indigo-600' },
          { l: 'Mijozlarim', i: '👥', href: '/customers/usta', bg: 'from-purple-500 to-pink-600' },
          { l: 'Akkountlar', i: '🔐', href: '/accounts', bg: 'from-orange-500 to-red-500' },
          { l: 'Sozlamalar', i: '⚙️', href: '/settings', bg: 'from-gray-500 to-gray-700' },
        ].map((a, i) => (
          <a key={i} href={a.href} className={`bg-gradient-to-br ${a.bg} rounded-2xl p-4 text-white shadow-lg active:scale-[0.97] transition-all`}>
            <span className="text-2xl block mb-2">{a.i}</span>
            <span className="text-[14px] font-semibold">{a.l}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🛒 SOTUVCHI DASHBOARD - iOS
// ═══════════════════════════════════════════════════════════
function SotuvchiDash({ user }: { user: any }) {
  const { formatSom } = useCurrency()
  const [sales, setSales] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [debts, setDebts] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    try {
      const s = localStorage.getItem('faststore_sales'); if (s) setSales(JSON.parse(s))
      const c = localStorage.getItem('faststore_customers'); if (c) setCustomers(JSON.parse(c))
      const d = localStorage.getItem('faststore_debts'); if (d) setDebts(JSON.parse(d))
      const p = localStorage.getItem('faststore_products'); if (p) setProducts(JSON.parse(p))
    } catch {}
  }, [])

  const jamiSotuv = sales.reduce((s, r) => s + (r.jami_usd || 0), 0)
  const jamiQarz = debts.reduce((s, d) => s + ((d.jami || 0) - (d.tolangan || 0)), 0)
  const kamQolgan = products.filter(p => (p.miqdor || 0) < 10)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Salom, {(user.ism || '').split(' ')[0]}! 👋</h1>
        <p className="text-[15px] text-gray-500 mt-0.5">Sotuvlar statistikasi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { l: 'Sotuvlar', v: sales.length + ' ta', i: '🛒', c: '#007AFF' },
          { l: 'Daromad', v: formatSom(jamiSotuv), i: '💰', c: '#34C759' },
          { l: 'Xaridorlar', v: customers.length + ' ta', i: '👥', c: '#5856D6' },
          { l: 'Qarzlar', v: formatSom(jamiQarz), i: '📋', c: '#FF3B30' },
        ].map((s, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.i}</span>
              <span className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold">{s.l}</span>
            </div>
            <div className="text-[22px] font-bold" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* So'nggi sotuvlar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">So'nggi sotuvlar</span>
          <a href="/sales" className="text-[13px] text-blue-500 font-semibold">Barchasi →</a>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
          {sales.length === 0 ? (
            <div className="p-8 text-center"><p className="text-gray-400 text-[14px]">Hali sotuv yo'q</p></div>
          ) : (
            sales.slice(-5).reverse().map((s: any, i: number, arr: any[]) => (
              <div key={s.id} className={`px-4 py-3.5 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div>
                  <div className="text-[15px] font-semibold text-gray-900">{s.mijoz || 'Noma\'lum'}</div>
                  <div className="text-[13px] text-gray-500">{s.chek} · {s.sana}</div>
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-bold text-green-600">{formatSom(s.jami_usd || 0)}</div>
                  <span className={`text-[11px] font-bold ${(s.holat || '') === "To'langan" ? 'text-green-500' : 'text-red-500'}`}>{s.holat}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Kam qolgan */}
      {kamQolgan.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 px-1">
            <span className="text-[13px] font-semibold text-red-500 uppercase tracking-wider">⚠️ Kam qolgan ({kamQolgan.length})</span>
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-red-200/60 shadow-sm">
            {kamQolgan.slice(0, 4).map((p: any, i: number, arr: any[]) => (
              <div key={p.id} className={`px-4 py-3 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-[14px] font-medium text-gray-900">{p.nomi}</span>
                <span className="text-[13px] font-bold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full">{p.miqdor} dona</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tez amallar */}
      <div className="mb-2 px-1">
        <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Tez amallar</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { l: 'Yangi sotuv', i: '➕', href: '/sales', bg: 'from-green-500 to-emerald-600' },
          { l: 'Xaridorlarim', i: '👥', href: '/customers', bg: 'from-blue-500 to-indigo-600' },
          { l: 'Qarzdorlar', i: '📋', href: '/debts', bg: 'from-red-500 to-pink-600' },
          { l: 'Sozlamalar', i: '⚙️', href: '/settings', bg: 'from-gray-500 to-gray-700' },
        ].map((a, i) => (
          <a key={i} href={a.href} className={`bg-gradient-to-br ${a.bg} rounded-2xl p-4 text-white shadow-lg active:scale-[0.97] transition-all`}>
            <span className="text-2xl block mb-2">{a.i}</span>
            <span className="text-[14px] font-semibold">{a.l}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 👑 ADMIN / SUPERADMIN DASHBOARD - iOS
// ═══════════════════════════════════════════════════════════
function AdminDash({ user }: { user: any }) {
  const { formatSom } = useCurrency()
  const [data, setData] = useState({ sales: 0, salesSum: 0, products: 0, customers: 0, repairs: 0, repairsActive: 0, kirim: 0, chiqim: 0, debts: 0, users: 0 })

  useEffect(() => {
    try {
      const sales = JSON.parse(localStorage.getItem('faststore_sales') || '[]')
      const products = JSON.parse(localStorage.getItem('faststore_products') || '[]')
      const customers = JSON.parse(localStorage.getItem('faststore_customers') || '[]')
      const repairs = JSON.parse(localStorage.getItem('faststore_repairs') || '[]')
      const cash = JSON.parse(localStorage.getItem('faststore_cash') || '[]')
      const debts = JSON.parse(localStorage.getItem('faststore_debts') || '[]')
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]')
      setData({
        sales: sales.length, salesSum: sales.reduce((s: number, r: any) => s + (r.jami_usd || 0), 0),
        products: products.length, customers: customers.length,
        repairs: repairs.length, repairsActive: repairs.filter((r: any) => ['qabul', 'diagnostika', 'tamirlashda'].includes(r.holat)).length,
        kirim: cash.filter((c: any) => c.tur === 'Kirim').reduce((s: number, c: any) => s + (c.summa || 0), 0),
        chiqim: cash.filter((c: any) => c.tur === 'Chiqim').reduce((s: number, c: any) => s + (c.summa || 0), 0),
        debts: debts.reduce((s: number, d: any) => s + ((d.jami || 0) - (d.tolangan || 0)), 0),
        users: users.length,
      })
    } catch {}
  }, [])

  const balans = data.kirim - data.chiqim

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Salom, {(user.ism || '').split(' ')[0]}! 👋</h1>
        <p className="text-[15px] text-gray-500 mt-0.5">Biznes umumiy ko'rinishi</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { l: 'Sotuvlar', v: data.sales + ' ta', i: '🛒', c: '#007AFF' },
          { l: 'Daromad', v: formatSom(data.salesSum), i: '💰', c: '#34C759' },
          { l: 'Mahsulotlar', v: data.products + ' ta', i: '📦', c: '#5856D6' },
          { l: 'Mijozlar', v: data.customers + ' ta', i: '👥', c: '#FF9500' },
        ].map((s, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.i}</span>
              <span className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold">{s.l}</span>
            </div>
            <div className="text-[22px] font-bold" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Moliya */}
      <div className="mb-5">
        <div className="mb-2 px-1"><span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Moliya</span></div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
          {[
            { l: '⬆️ Kirim', v: formatSom(data.kirim), c: 'text-green-600' },
            { l: '⬇️ Chiqim', v: formatSom(data.chiqim), c: 'text-red-600' },
            { l: '💼 Balans', v: formatSom(balans), c: balans >= 0 ? 'text-green-600' : 'text-red-600', bold: true },
            { l: '📋 Qarzlar', v: formatSom(data.debts), c: 'text-red-500' },
          ].map((item, i, arr) => (
            <div key={i} className={`px-4 py-3.5 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <span className="text-[15px] text-gray-600">{item.l}</span>
              <span className={`text-[15px] font-bold ${item.c}`}>{item.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tamirlash */}
      <div className="mb-5">
        <div className="mb-2 px-1"><span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Tamirlash & Tizim</span></div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
          {[
            { l: '🔧 Jami buyurtmalar', v: data.repairs + ' ta' },
            { l: '⚡ Faol (jarayonda)', v: data.repairsActive + ' ta' },
            { l: '🔑 Foydalanuvchilar', v: (data.users + 1) + ' ta' },
          ].map((item, i, arr) => (
            <div key={i} className={`px-4 py-3.5 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <span className="text-[15px] text-gray-600">{item.l}</span>
              <span className="text-[15px] font-semibold text-gray-900">{item.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tez amallar */}
      <div className="mb-2 px-1">
        <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Tez amallar</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { l: 'Yangi sotuv', i: '🛒', href: '/sales', bg: 'from-green-500 to-emerald-600' },
          { l: 'Mahsulotlar', i: '📦', href: '/products', bg: 'from-blue-500 to-indigo-600' },
          { l: 'Tamirlash', i: '🔧', href: '/repair', bg: 'from-orange-500 to-red-500' },
          { l: 'Hisobotlar', i: '📊', href: '/reports', bg: 'from-purple-500 to-pink-600' },
          { l: 'Kassa', i: '💰', href: '/cash', bg: 'from-emerald-500 to-teal-600' },
          { l: 'Foydalanuvchilar', i: '🔑', href: '/users', bg: 'from-indigo-500 to-blue-600' },
        ].map((a, i) => (
          <a key={i} href={a.href} className={`bg-gradient-to-br ${a.bg} rounded-2xl p-4 text-white shadow-lg active:scale-[0.97] transition-all`}>
            <span className="text-2xl block mb-2">{a.i}</span>
            <span className="text-[14px] font-semibold">{a.l}</span>
          </a>
        ))}
      </div>
    </div>
  )
}