'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Akkount turlari
const ACCOUNT_TYPES = [
  { id: 'google', name: 'Google', logo: '🔵', gradient: 'from-blue-500 to-red-500', bgColor: 'bg-gradient-to-br from-blue-600 via-red-500 to-yellow-400' },
  { id: 'icloud', name: 'iCloud', logo: '☁️', gradient: 'from-blue-400 to-blue-600', bgColor: 'bg-gradient-to-br from-gray-100 to-blue-200' },
  { id: 'samsung', name: 'Samsung', logo: '📱', gradient: 'from-blue-800 to-blue-900', bgColor: 'bg-gradient-to-br from-blue-900 to-indigo-900' },
  { id: 'telegram', name: 'Telegram', logo: '✈️', gradient: 'from-sky-400 to-blue-500', bgColor: 'bg-gradient-to-br from-sky-400 to-blue-600' },
  { id: 'instagram', name: 'Instagram', logo: '📸', gradient: 'from-purple-500 to-pink-500', bgColor: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' },
  { id: 'facebook', name: 'Facebook', logo: '👤', gradient: 'from-blue-600 to-blue-800', bgColor: 'bg-gradient-to-br from-blue-600 to-blue-800' },
  { id: 'xiaomi', name: 'Xiaomi (Mi)', logo: '🟠', gradient: 'from-orange-500 to-orange-600', bgColor: 'bg-gradient-to-br from-orange-500 to-red-500' },
  { id: 'huawei', name: 'Huawei', logo: '🔴', gradient: 'from-red-500 to-red-700', bgColor: 'bg-gradient-to-br from-red-600 to-red-800' },
  { id: 'microsoft', name: 'Microsoft', logo: '🪟', gradient: 'from-blue-500 to-green-500', bgColor: 'bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500' },
  { id: 'yandex', name: 'Yandex', logo: '🔍', gradient: 'from-red-500 to-yellow-500', bgColor: 'bg-gradient-to-br from-red-500 to-yellow-400' },
  { id: 'boshqa', name: 'Boshqa', logo: '🔑', gradient: 'from-gray-600 to-gray-800', bgColor: 'bg-gradient-to-br from-gray-700 to-gray-900' },
]

interface Account {
  id: number
  type: string
  email: string
  password: string
  owner_name: string
  owner_phone: string
  birth_date: string
  created_date: string
  notes?: string
}

// Demo ma'lumotlar
const DEMO_ACCOUNTS: Account[] = []

export default function AccountsPage() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>(DEMO_ACCOUNTS)
  const [showModal, setShowModal] = useState(false)
  const [editAccount, setEditAccount] = useState<Account | null>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('barchasi')

  // Form state
  const [form, setForm] = useState({
    type: 'google',
    email: '',
    password: '',
    owner_name: '',
    owner_phone: '+998',
    birth_date: '',
    created_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // Filter
  const filtered = accounts.filter(acc => {
    const matchSearch = acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       acc.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = filterType === 'barchasi' || acc.type === filterType
    return matchSearch && matchType
  })

  const getAccountType = (typeId: string) => ACCOUNT_TYPES.find(t => t.id === typeId) || ACCOUNT_TYPES[ACCOUNT_TYPES.length - 1]

  const togglePassword = (id: number) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const openAdd = () => {
    setEditAccount(null)
    setForm({ type: 'google', email: '', password: '', owner_name: '', owner_phone: '+998', birth_date: '', created_date: new Date().toISOString().split('T')[0], notes: '' })
    setShowModal(true)
  }

  const openEdit = (acc: Account) => {
    setEditAccount(acc)
    setForm({ type: acc.type, email: acc.email, password: acc.password, owner_name: acc.owner_name, owner_phone: acc.owner_phone, birth_date: acc.birth_date, created_date: acc.created_date, notes: acc.notes || '' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.email || !form.password || !form.owner_name) {
      alert('Email, parol va ism majburiy!')
      return
    }
    if (editAccount) {
      setAccounts(prev => prev.map(a => a.id === editAccount.id ? { ...a, ...form } : a))
    } else {
      setAccounts(prev => [...prev, { id: Date.now(), ...form }])
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('Akkountni o\'chirmoqchimisiz?')) {
      setAccounts(prev => prev.filter(a => a.id !== id))
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🔐 Akkountlar
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-bold">
                {accounts.length} ta
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Mijozlar akkountlarini xavfsiz saqlash va boshqarish
            </p>
          </div>
          <button onClick={openAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
            ➕ Yangi akkount
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Email yoki ism bo'yicha qidiring..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 outline-none focus:border-blue-500 transition-all" />
            </div>
            {/* Type filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button onClick={() => setFilterType('barchasi')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filterType === 'barchasi' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                Barchasi
              </button>
              {ACCOUNT_TYPES.slice(0, 6).map(t => (
                <button key={t.id} onClick={() => setFilterType(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filterType === t.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  {t.logo} {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">🔐</div>
            <div className="font-bold text-gray-900 dark:text-white text-lg">Akkount topilmadi</div>
            <p className="text-gray-400 text-sm mt-2">Yangi akkount qo'shish uchun yuqoridagi tugmani bosing</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(acc => {
              const accType = getAccountType(acc.type)
              const isExpanded = expandedCard === acc.id
              const isPassVisible = showPassword[acc.id]

              return (
                <div key={acc.id} className="group">
                  {/* Plastik Karta */}
                  <div className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${accType.bgColor} ${isExpanded ? 'ring-2 ring-white/50' : ''}`}
                    style={{ minHeight: '200px' }}>
                    
                    {/* Karta pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/30 rounded-full" />
                      <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/20 rounded-full" />
                      <div className="absolute bottom-4 left-4 w-20 h-20 border border-white/10 rounded-full" />
                    </div>

                    <div className="relative p-5 text-white h-full flex flex-col">
                      {/* Top: Logo + Type */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{accType.logo}</span>
                          <span className="font-bold text-sm opacity-90">{accType.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(acc)}
                            className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs hover:bg-white/30 transition-colors">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(acc.id)}
                            className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs hover:bg-red-500/50 transition-colors">
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="mb-3">
                        <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Akkount</div>
                        <div className="font-mono text-sm font-semibold tracking-wide">{acc.email}</div>
                      </div>

                      {/* Password */}
                      <div className="mb-4">
                        <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Parol</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold tracking-wider">
                            {isPassVisible ? acc.password : '••••••••••'}
                          </span>
                          <button onClick={() => togglePassword(acc.id)}
                            className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-xs hover:bg-white/30 transition-colors">
                            {isPassVisible ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      {/* Bottom: Owner */}
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest opacity-60">Egasi</div>
                          <div className="font-semibold text-sm">{acc.owner_name}</div>
                        </div>
                        <button onClick={() => setExpandedCard(isExpanded ? null : acc.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-[11px] font-bold hover:bg-white/30 transition-colors">
                          {isExpanded ? '▲ Yopish' : '▼ Batafsil'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-xl -mt-2 pt-4 pb-3 px-5 shadow-sm animate-fade-in">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ['👤 Ism Familiya', acc.owner_name],
                          ['📞 Telefon', acc.owner_phone],
                          ['🎂 Tug\'ilgan sana', acc.birth_date || '—'],
                          ['📅 Ochilgan sana', acc.created_date || '—'],
                        ].map(([label, value]) => (
                          <div key={label as string} className="py-2">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
                          </div>
                        ))}
                      </div>
                      {acc.notes && (
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">📝 Izoh</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{acc.notes}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ══════ MODAL ══════ */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editAccount ? '✏️ Akkountni tahrirlash' : '➕ Yangi akkount qo\'shish'}
                </h3>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors">
                  ✕
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-4">
                {/* Akkount turi */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Akkount turi</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {ACCOUNT_TYPES.map(t => (
                      <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          form.type === t.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}>
                        <div className="text-xl mb-1">{t.logo}</div>
                        <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">{t.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email/Login */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📧 Email / Login</label>
                  <input type="text" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-gray-700 transition-all" />
                </div>

                {/* Parol */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">🔒 Parol</label>
                  <input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Parolni kiriting"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-gray-700 font-mono transition-all" />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 font-medium">Egasi haqida</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Ism Familiya */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">👤 Ism Familiya</label>
                  <input type="text" value={form.owner_name} onChange={e => setForm(f => ({ ...f, owner_name: e.target.value }))}
                    placeholder="To'liq ism"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-gray-700 transition-all" />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📞 Telefon raqam</label>
                  <input type="tel" value={form.owner_phone} onChange={e => setForm(f => ({ ...f, owner_phone: e.target.value }))}
                    placeholder="+998901234567"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-gray-700 transition-all" />
                </div>

                {/* Sanalar */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">🎂 Tug'ilgan sana</label>
                    <input type="date" value={form.birth_date} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-gray-700 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📅 Ochilgan sana</label>
                    <input type="date" value={form.created_date} onChange={e => setForm(f => ({ ...f, created_date: e.target.value }))}
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-gray-700 transition-all" />
                  </div>
                </div>

                {/* Izoh */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📝 Izoh (ixtiyoriy)</label>
                  <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Qaysi qurilma uchun..."
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 dark:bg-gray-700 transition-all" />
                </div>
              </div>

              {/* Modal footer */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <button onClick={handleSave}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
                  💾 {editAccount ? 'Yangilash' : 'Saqlash'}
                </button>
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
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