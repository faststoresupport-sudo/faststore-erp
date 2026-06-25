'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoginPage } from '@/components/auth/LoginPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-blue-500/30" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>⚡</div>
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-blue-300/60 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  // Rol bo'yicha dashboard
  return (
    <DashboardLayout>
      <div className="p-6">
        {user.rol === 'usta' && <UstaDash user={user} />}
        {user.rol === 'sotuvchi' && <SotuvchiDash user={user} />}
        {(user.rol === 'admin' || user.rol === 'superadmin') && <AdminDash user={user} />}
      </div>
    </DashboardLayout>
  )
}

// ═══════════════════════════════════════════════════════════
// 🔧 USTA DASHBOARD
// ═══════════════════════════════════════════════════════════
function UstaDash({ user }: { user: any }) {
  const [repairs, setRepairs] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [mijozlar, setMijozlar] = useState<any[]>([])

  useEffect(() => {
    try {
      const r = localStorage.getItem('faststore_repairs'); if (r) setRepairs(JSON.parse(r))
      const a = localStorage.getItem('faststore_accounts'); if (a) setAccounts(JSON.parse(a))
      const m = localStorage.getItem('faststore_usta_customers'); if (m) setMijozlar(JSON.parse(m))
    } catch {}
  }, [])

  const jarayonda = repairs.filter(r => ['qabul', 'diagnostika', 'tamirlashda'].includes(r.holat)).length
  const tayyor = repairs.filter(r => r.holat === 'tayyor').length
  const topshirildi = repairs.filter(r => r.holat === 'topshirildi').length
  const daromad = repairs.filter(r => r.holat === 'topshirildi').reduce((s, r) => s + (r.narx || 0), 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔧 Usta Paneli</h1>
        <p className="text-gray-500 text-sm mt-1">Salom, {user.ism}! Bugungi ishlaringiz</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { l: 'Jami buyurtma', v: repairs.length, i: '📋', c: 'text-blue-600', b: 'border-t-blue-500' },
          { l: 'Jarayonda', v: jarayonda, i: '🔧', c: 'text-orange-500', b: 'border-t-orange-500' },
          { l: 'Tayyor', v: tayyor, i: '✅', c: 'text-green-500', b: 'border-t-green-500' },
          { l: 'Topshirildi', v: topshirildi, i: '🏁', c: 'text-purple-500', b: 'border-t-purple-500' },
          { l: 'Daromad', v: Math.round(daromad * 12700).toLocaleString() + " so'm", i: '💰', c: 'text-green-600', b: 'border-t-green-600' },
        ].map((s, i) => (
          <div key={i} className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm border-t-4 ${s.b}`}>
            <div className="text-xl mb-1">{s.i}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{s.l}</div>
            <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Faol buyurtmalar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">🔧 Faol Buyurtmalar</h3>
          <a href="/repair" className="text-xs text-blue-500 font-semibold hover:underline">Barchasini ko'rish →</a>
        </div>
        <div className="p-4">
          {repairs.filter(r => ['qabul', 'diagnostika', 'tamirlashda', 'tayyor'].includes(r.holat)).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Hozircha faol buyurtma yo'q</p>
          ) : (
            <div className="space-y-3">
              {repairs.filter(r => ['qabul', 'diagnostika', 'tamirlashda', 'tayyor'].includes(r.holat)).slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{r.qurilma}</div>
                    <div className="text-xs text-gray-500">👤 {r.mijoz} · {r.muammo}</div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    r.holat === 'tayyor' ? 'bg-green-100 text-green-700' :
                    r.holat === 'tamirlashda' ? 'bg-blue-100 text-blue-700' :
                    r.holat === 'diagnostika' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{r.holat === 'tayyor' ? '✅ Tayyor' : r.holat === 'tamirlashda' ? '🔧 Tamirlashda' : r.holat === 'diagnostika' ? '🔍 Diagnostika' : '📥 Qabul'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tez amallar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Yangi buyurtma', i: '➕', href: '/repair', c: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100' },
          { l: 'Mijozlarim', i: '👥', href: '/customers/usta', c: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' },
          { l: 'Akkountlar', i: '🔐', href: '/accounts', c: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100' },
          { l: 'Sozlamalar', i: '⚙️', href: '/settings', c: 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100' },
        ].map((a, i) => (
          <a key={i} href={a.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${a.c} font-medium text-sm transition-all`}>
            <span className="text-lg">{a.i}</span>{a.l}
          </a>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 🛒 SOTUVCHI DASHBOARD
// ═══════════════════════════════════════════════════════════
function SotuvchiDash({ user }: { user: any }) {
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🛒 Sotuvchi Paneli</h1>
        <p className="text-gray-500 text-sm mt-1">Salom, {user.ism}! Sotuvlar statistikasi</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: 'Jami sotuvlar', v: sales.length + ' ta', i: '🛒', c: 'text-blue-600', b: 'border-t-blue-500' },
          { l: 'Sotuv summasi', v: Math.round(jamiSotuv * 12700).toLocaleString() + " so'm", i: '💰', c: 'text-green-600', b: 'border-t-green-500' },
          { l: 'Xaridorlar', v: customers.length + ' ta', i: '👥', c: 'text-purple-600', b: 'border-t-purple-500' },
          { l: 'Qarzlar', v: Math.round(jamiQarz * 12700).toLocaleString() + " so'm", i: '📋', c: 'text-red-600', b: 'border-t-red-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm border-t-4 ${s.b}`}>
            <div className="text-xl mb-1">{s.i}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{s.l}</div>
            <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* So'nggi sotuvlar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">📈 So'nggi Sotuvlar</h3>
          <a href="/sales" className="text-xs text-blue-500 font-semibold hover:underline">Barchasini ko'rish →</a>
        </div>
        <div className="p-4">
          {sales.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Hali sotuv yo'q</p>
          ) : (
            <div className="space-y-3">
              {sales.slice(-5).reverse().map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{s.mijoz || 'Noma\'lum'}</div>
                    <div className="text-xs text-gray-500">{s.chek} · {s.sana}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-sm">{Math.round((s.jami_usd || 0) * 12700).toLocaleString()} so'm</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.holat === "To'langan" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.holat}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kam qolgan + Tez amallar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kam qolgan */}
        {kamQolgan.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-xl shadow-sm">
            <div className="px-5 py-3 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
              <h3 className="font-bold text-red-700 dark:text-red-300 text-sm">⚠️ Kam qolgan ({kamQolgan.length})</h3>
            </div>
            <div className="p-3 space-y-2">
              {kamQolgan.slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-red-50/30 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{p.nomi}</span>
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{p.miqdor} dona</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tez amallar */}
        <div className="space-y-3">
          {[
            { l: 'Yangi sotuv', i: '➕', href: '/sales', c: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' },
            { l: 'Xaridorlarim', i: '👥', href: '/customers', c: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { l: 'Qarzdorlar', i: '📋', href: '/debts', c: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' },
            { l: 'Sozlamalar', i: '⚙️', href: '/settings', c: 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100' },
          ].map((a, i) => (
            <a key={i} href={a.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${a.c} font-medium text-sm transition-all`}>
              <span className="text-lg">{a.i}</span>{a.l}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 👑 ADMIN / SUPERADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════
function AdminDash({ user }: { user: any }) {
  const [data, setData] = useState({ sales: 0, salesSum: 0, products: 0, customers: 0, repairs: 0, repairsActive: 0, kirim: 0, chiqim: 0, debts: 0, defects: 0, users: 0 })

  useEffect(() => {
    try {
      const sales = JSON.parse(localStorage.getItem('faststore_sales') || '[]')
      const products = JSON.parse(localStorage.getItem('faststore_products') || '[]')
      const customers = JSON.parse(localStorage.getItem('faststore_customers') || '[]')
      const repairs = JSON.parse(localStorage.getItem('faststore_repairs') || '[]')
      const cash = JSON.parse(localStorage.getItem('faststore_cash') || '[]')
      const debts = JSON.parse(localStorage.getItem('faststore_debts') || '[]')
      const defects = JSON.parse(localStorage.getItem('faststore_defects') || '[]')
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]')

      setData({
        sales: sales.length,
        salesSum: sales.reduce((s: number, r: any) => s + (r.jami_usd || 0), 0),
        products: products.length,
        customers: customers.length,
        repairs: repairs.length,
        repairsActive: repairs.filter((r: any) => ['qabul', 'diagnostika', 'tamirlashda'].includes(r.holat)).length,
        kirim: cash.filter((c: any) => c.tur === 'Kirim').reduce((s: number, c: any) => s + (c.summa || 0), 0),
        chiqim: cash.filter((c: any) => c.tur === 'Chiqim').reduce((s: number, c: any) => s + (c.summa || 0), 0),
        debts: debts.reduce((s: number, d: any) => s + ((d.jami || 0) - (d.tolangan || 0)), 0),
        defects: defects.length,
        users: users.length,
      })
    } catch {}
  }, [])

  const balans = data.kirim - data.chiqim

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">👑 {user.rol === 'superadmin' ? 'Superadmin' : 'Admin'} Paneli</h1>
        <p className="text-gray-500 text-sm mt-1">Salom, {user.ism}! Biznes umumiy ko'rinishi</p>
      </div>

      {/* KPI - ikkala tomon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: 'Sotuvlar', v: data.sales + ' ta', i: '🛒', c: 'text-blue-600', b: 'border-t-blue-500' },
          { l: 'Sotuv summasi', v: Math.round(data.salesSum * 12700).toLocaleString() + " so'm", i: '💰', c: 'text-green-600', b: 'border-t-green-500' },
          { l: 'Mahsulotlar', v: data.products + ' ta', i: '📦', c: 'text-indigo-600', b: 'border-t-indigo-500' },
          { l: 'Xaridorlar', v: data.customers + ' ta', i: '👥', c: 'text-purple-600', b: 'border-t-purple-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm border-t-4 ${s.b}`}>
            <div className="text-xl mb-1">{s.i}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{s.l}</div>
            <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Moliya + Tamirlash */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Moliya */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">💰 Moliya</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500">⬆️ Kirim</span><span className="font-bold text-green-600">{Math.round(data.kirim * 12700).toLocaleString()} so'm</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500">⬇️ Chiqim</span><span className="font-bold text-red-600">{Math.round(data.chiqim * 12700).toLocaleString()} so'm</span></div>
            <div className="border-t pt-3 flex justify-between items-center"><span className="text-sm font-medium text-gray-700 dark:text-gray-300">💼 Balans</span><span className={`text-lg font-bold ${balans >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(balans * 12700).toLocaleString()} so'm</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500">📋 Qarzlar</span><span className="font-bold text-red-500">{Math.round(data.debts * 12700).toLocaleString()} so'm</span></div>
          </div>
        </div>

        {/* Tamirlash */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">🔧 Tamirlash</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500">📋 Jami buyurtmalar</span><span className="font-bold text-blue-600">{data.repairs} ta</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500">🔧 Faol (jarayonda)</span><span className="font-bold text-orange-500">{data.repairsActive} ta</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500">🔴 Brak/Qaytarish</span><span className="font-bold text-red-500">{data.defects} ta</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-gray-500">🔑 Foydalanuvchilar</span><span className="font-bold text-purple-600">{data.users + 1} ta</span></div>
          </div>
        </div>
      </div>

      {/* Tez amallar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Yangi sotuv', i: '🛒', href: '/sales', c: 'border-green-200 bg-green-50 text-green-700' },
          { l: 'Mahsulotlar', i: '📦', href: '/products', c: 'border-blue-200 bg-blue-50 text-blue-700' },
          { l: 'Tamirlash', i: '🔧', href: '/repair', c: 'border-orange-200 bg-orange-50 text-orange-700' },
          { l: 'Hisobotlar', i: '📊', href: '/reports', c: 'border-purple-200 bg-purple-50 text-purple-700' },
          { l: 'Kassa', i: '💰', href: '/cash', c: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
          { l: 'Qarzdorlar', i: '📋', href: '/debts', c: 'border-red-200 bg-red-50 text-red-700' },
          { l: 'Foydalanuvchilar', i: '🔑', href: '/users', c: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
          { l: 'Sozlamalar', i: '⚙️', href: '/settings', c: 'border-gray-200 bg-gray-50 text-gray-700' },
        ].map((a, i) => (
          <a key={i} href={a.href} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${a.c} font-medium text-sm transition-all hover:shadow-sm`}>
            <span className="text-base">{a.i}</span>{a.l}
          </a>
        ))}
      </div>
    </div>
  )
}