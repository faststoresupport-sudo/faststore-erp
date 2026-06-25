'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// ══════════════════════════════════════════════════════════
// BRAND STILLARI
// ══════════════════════════════════════════════════════════
const BRAND_STYLES: Record<string, { bg: string; text: string; name: string }> = {
  google: { bg: 'bg-gradient-to-br from-blue-600 to-blue-800', text: 'text-white', name: 'Google Account' },
  icloud: { bg: 'bg-gradient-to-br from-slate-700 to-slate-900', text: 'text-white', name: 'iCloud' },
  mi: { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', text: 'text-white', name: 'Mi Account' },
  samsung: { bg: 'bg-gradient-to-br from-blue-900 to-indigo-950', text: 'text-white', name: 'Samsung Account' },
  huawei: { bg: 'bg-gradient-to-br from-red-600 to-red-800', text: 'text-white', name: 'Huawei ID' },
  instagram: { bg: 'bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600', text: 'text-white', name: 'Instagram' },
  telegram: { bg: 'bg-gradient-to-br from-sky-400 to-blue-600', text: 'text-white', name: 'Telegram' },
  facebook: { bg: 'bg-gradient-to-br from-blue-600 to-blue-800', text: 'text-white', name: 'Facebook' },
  microsoft: { bg: 'bg-gradient-to-br from-gray-700 to-gray-900', text: 'text-white', name: 'Microsoft' },
  yandex: { bg: 'bg-gradient-to-br from-red-500 to-yellow-500', text: 'text-white', name: 'Yandex' },
  boshqa: { bg: 'bg-gradient-to-br from-gray-600 to-gray-800', text: 'text-white', name: 'Boshqa' },
}

const BRAND_LIST = Object.keys(BRAND_STYLES)

interface Account {
  id: number
  type: string
  login: string
  password: string
  firstName: string
  lastName: string
  phone: string
  birthYear: string
  createdDate: string
  note: string
}

export default function AccountsPage() {
  const { user } = useAuth()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({})
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  // Form state
  const [form, setForm] = useState({
    type: 'google', login: '', password: '', firstName: '', lastName: '',
    phone: '+998', birthYear: '', createdDate: new Date().toISOString().split('T')[0], note: ''
  })

  // Parolni ko'rsatish/yashirish
  const togglePassword = (id: number) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Akkauntni o'chirish
  const deleteAccount = (id: number) => {
    if (window.confirm("Haqiqatdan ham bu akkauntni o'chirmoqchimisiz?")) {
      setAccounts(prev => prev.filter(acc => acc.id !== id))
    }
  }

  // Yangi qo'shish
  const openAdd = () => {
    setEditingId(null)
    setForm({ type: 'google', login: '', password: '', firstName: '', lastName: '', phone: '+998', birthYear: '', createdDate: new Date().toISOString().split('T')[0], note: '' })
    setShowForm(true)
  }

  // Tahrirlash
  const openEdit = (acc: Account) => {
    setEditingId(acc.id)
    setForm({ type: acc.type, login: acc.login, password: acc.password, firstName: acc.firstName, lastName: acc.lastName, phone: acc.phone, birthYear: acc.birthYear, createdDate: acc.createdDate, note: acc.note })
    setShowForm(true)
  }

  // Saqlash
  const handleSave = () => {
    if (!form.login || !form.password) { alert('Login va parol majburiy!'); return }
    if (!form.firstName) { alert('Ism majburiy!'); return }

    if (editingId) {
      setAccounts(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a))
    } else {
      setAccounts(prev => [...prev, { id: Date.now(), ...form }])
    }
    setShowForm(false)
  }

  // Filter
  const filtered = accounts.filter(a =>
    (a.login || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.lastName || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-full">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">🔐 Akkauntlar Bo'limi</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mijozlar akkauntlarini xavfsiz saqlash — {filtered.length} ta</p>
            </div>
            <button onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/50 transition-all font-semibold text-sm">
              ➕ Yangi qo'shish
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Login, ism yoki familiya bo'yicha qidiring..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm" />
            </div>
          </div>

          {/* Kartalar bo'sh bo'lsa */}
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-5xl mb-4">🔐</div>
              <div className="font-bold text-gray-800 dark:text-white text-lg">Akkaunt topilmadi</div>
              <p className="text-gray-400 text-sm mt-2">Yangi akkaunt qo'shish uchun yuqoridagi tugmani bosing</p>
            </div>
          )}

          {/* ═══ PLASTIK KARTALAR SETKASI ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((acc) => {
              const style = BRAND_STYLES[acc.type] || BRAND_STYLES.boshqa
              const isPassVisible = visiblePasswords[acc.id]

              return (
                <div key={acc.id} className={`${style.bg} ${style.text} p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between h-56 transform hover:scale-[1.02] transition-all duration-300`}>

                  {/* Karta tepasi: Logotip va Turi */}
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="text-xs opacity-75 uppercase tracking-widest">FastStore Card</p>
                      <h3 className="text-xl font-bold mt-1">{style.name}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                      {acc.type.toUpperCase()}
                    </div>
                  </div>

                  {/* Karta o'rtasi: Login va Parol */}
                  <div className="my-4 z-10">
                    <p className="text-xs opacity-75">Login / Email</p>
                    <p className="text-sm font-mono truncate mb-2">{acc.login}</p>

                    <p className="text-xs opacity-75">Parol</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono flex-1 truncate">
                        {isPassVisible ? acc.password : '••••••••••••'}
                      </span>
                      <button onClick={() => togglePassword(acc.id)} className="hover:opacity-80 transition text-sm bg-white/20 rounded-md w-7 h-7 flex items-center justify-center">
                        {isPassVisible ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Karta pasti: Amal tugmalari */}
                  <div className="flex justify-between items-center border-t border-white/20 pt-3 z-10">
                    <button onClick={() => setSelectedAccount(acc)}
                      className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition font-medium">
                      ℹ️ Batafsil
                    </button>

                    <div className="flex gap-2">
                      <button onClick={() => openEdit(acc)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition" title="Tahrirlash">
                        ✏️
                      </button>
                      <button onClick={() => deleteAccount(acc.id)}
                        className="p-1.5 bg-red-500/30 hover:bg-red-500/50 rounded-md transition text-red-200" title="O'chirish">
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Bezak doira */}
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none"></div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ═══ BATAFSIL MODAL ═══ */}
        {selectedAccount && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedAccount(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>

              {/* Yopish */}
              <button onClick={() => setSelectedAccount(null)}
                className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                ✕
              </button>

              {/* Sarlavha */}
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className={`w-4 h-4 rounded-full ${(BRAND_STYLES[selectedAccount.type] || BRAND_STYLES.boshqa).bg}`}></div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {(BRAND_STYLES[selectedAccount.type] || BRAND_STYLES.boshqa).name} Tafsilotlari
                </h2>
              </div>

              {/* Ma'lumotlar */}
              <div className="space-y-3 text-sm">
                {[
                  ['Ism', selectedAccount.firstName],
                  ['Familiya', selectedAccount.lastName],
                  ['Telefon', selectedAccount.phone],
                  ['Tug\'ilgan yil', selectedAccount.birthYear],
                  ['Ochilgan sana', selectedAccount.createdDate],
                  ['Login', selectedAccount.login],
                ].map(([label, value]) => (
                  <div key={label as string} className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">{label}:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{value || '—'}</span>
                  </div>
                ))}
                {selectedAccount.note && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="font-semibold text-gray-500 dark:text-gray-400 block mb-1">Izoh:</span>
                    <p className="text-gray-700 dark:text-gray-300 italic bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-600">
                      {selectedAccount.note}
                    </p>
                  </div>
                )}
              </div>

              <button onClick={() => setSelectedAccount(null)}
                className="w-full mt-5 bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white py-2.5 rounded-xl font-medium transition">
                Yopish
              </button>
            </div>
          </div>
        )}

        {/* ═══ YANGI QO'SHISH / TAHRIRLASH MODAL ═══ */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {editingId ? '✏️ Akkauntni tahrirlash' : '➕ Yangi akkaunt qo\'shish'}
                </h3>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-red-500 transition">✕</button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Akkaunt turi */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Akkaunt turi</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {BRAND_LIST.map(type => {
                      const s = BRAND_STYLES[type]
                      return (
                        <button key={type} onClick={() => setForm(f => ({ ...f, type }))}
                          className={`p-2.5 rounded-xl border-2 text-center text-xs font-semibold transition-all ${
                            form.type === type
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                          }`}>
                          {s.name.split(' ')[0]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Login */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📧 Login / Email</label>
                  <input type="text" value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))} placeholder="email@example.com"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                </div>

                {/* Parol */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🔒 Parol</label>
                  <input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Parolni kiriting"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                </div>

                {/* Ism Familiya */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">👤 Ism</label>
                    <input type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Ism"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">👤 Familiya</label>
                    <input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Familiya"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📞 Telefon</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998 90 123 45 67"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                </div>

                {/* Tug'ilgan yil + Ochilgan sana */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🎂 Tug'ilgan yil</label>
                    <input type="text" value={form.birthYear} onChange={e => setForm(f => ({ ...f, birthYear: e.target.value }))} placeholder="1995"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📅 Ochilgan sana</label>
                    <input type="date" value={form.createdDate} onChange={e => setForm(f => ({ ...f, createdDate: e.target.value }))}
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                </div>

                {/* Izoh */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📝 Izoh</label>
                  <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Qaysi qurilma uchun, izoh..."
                    rows={3}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none transition-all" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-800">
                <button onClick={handleSave}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                  💾 {editingId ? 'Yangilash' : 'Saqlash'}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  Bekor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}