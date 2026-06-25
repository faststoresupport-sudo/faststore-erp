'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const ROLLAR: Record<string, { label: string; color: string }> = {
  superadmin: { label: '👑 Superadmin', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  admin: { label: '🔑 Admin', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  sotuvchi: { label: '🛒 Sotuvchi', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  usta: { label: '🔧 Usta', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
}

interface UserItem {
  id: number
  ism: string
  login: string
  parol: string
  rol: string
  telefon: string
  filial: string
  kategoriya: string
  active: boolean
  created_at: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserItem[]>([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ ism: '', login: '', parol: '', rol: 'sotuvchi', telefon: '', filial: 'Asosiy', kategoriya: '' })

  // localStorage dan yuklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem('registered_users')
      if (saved) {
        const parsed = JSON.parse(saved)
        setUsers(parsed.map((u: any, i: number) => ({
          id: u.id || i + 1,
          ism: u.ism || '',
          login: u.login || '',
          parol: u.parol || '',
          rol: u.rol || 'sotuvchi',
          telefon: u.telefon || '',
          filial: u.filial || 'Asosiy',
          kategoriya: u.kategoriya || '',
          active: true,
          created_at: u.created_at || new Date().toISOString().split('T')[0]
        })))
      }
    } catch {}
  }, [])

  // Saqlash
  const saveToStorage = (list: UserItem[]) => {
    localStorage.setItem('registered_users', JSON.stringify(list))
  }

  const filtered = users.filter(u =>
    (u.ism || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.login || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.rol || '').toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditId(null)
    setForm({ ism: '', login: '', parol: '', rol: 'sotuvchi', telefon: '', filial: 'Asosiy', kategoriya: '' })
    setModal(true)
  }

  const openEdit = (u: UserItem) => {
    setEditId(u.id)
    setForm({ ism: u.ism, login: u.login, parol: u.parol, rol: u.rol, telefon: u.telefon, filial: u.filial, kategoriya: u.kategoriya })
    setModal(true)
  }

  const handleSave = () => {
    if (!form.ism || !form.login || !form.parol) { alert('Ism, login va parol majburiy!'); return }
    if (form.parol.length < 4) { alert('Parol kamida 4 ta belgi!'); return }

    let updated: UserItem[]
    if (editId) {
      updated = users.map(u => u.id === editId ? { ...u, ...form } : u)
    } else {
      if (users.find(u => u.login === form.login)) { alert('Bu login band!'); return }
      updated = [...users, { id: Date.now(), ...form, active: true, created_at: new Date().toISOString().split('T')[0] }]
    }
    setUsers(updated)
    saveToStorage(updated)
    setModal(false)
  }

  const handleDelete = (id: number) => {
    if (!confirm("Foydalanuvchini o'chirmoqchimisiz?")) return
    const updated = users.filter(u => u.id !== id)
    setUsers(updated)
    saveToStorage(updated)
  }

  const toggleActive = (id: number) => {
    const updated = users.map(u => u.id === id ? { ...u, active: !u.active } : u)
    setUsers(updated)
    saveToStorage(updated)
  }

  // Faqat superadmin va admin ko'radi
  if (user?.rol !== 'superadmin' && user?.rol !== 'admin') {
    return <DashboardLayout><div className="p-6"><div className="card p-8 text-center"><div className="text-5xl mb-4">🔒</div><h2 className="text-xl font-bold">Ruxsat yo'q</h2><p className="text-gray-500 mt-2">Bu sahifaga faqat admin yoki superadmin kirishi mumkin.</p></div></div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔑 Foydalanuvchilar</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} ta foydalanuvchi · Tizimga kirish huquqlari</p>
          </div>
          <button onClick={openAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
            ➕ Yangi foydalanuvchi
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Jami', value: users.length, icon: '👥', color: 'text-blue-600' },
            { label: 'Adminlar', value: users.filter(u => u.rol === 'admin').length, icon: '🔑', color: 'text-blue-600' },
            { label: 'Sotuvchilar', value: users.filter(u => u.rol === 'sotuvchi').length, icon: '🛒', color: 'text-green-600' },
            { label: 'Ustalar', value: users.filter(u => u.rol === 'usta').length, icon: '🔧', color: 'text-orange-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xs text-gray-400 uppercase">{s.label}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism, login yoki rol bo'yicha qidiring..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm" />
          </div>
        </div>

        {/* Superadmin */}
        <div className="card p-4 mb-4 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">S</div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Super Admin</div>
                <div className="text-xs text-gray-500">superadmin · Tizim egasi</div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${ROLLAR.superadmin.color}`}>{ROLLAR.superadmin.label}</span>
          </div>
        </div>

        {/* Users Table */}
        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">👥</div>
            <div className="font-bold text-gray-800 dark:text-white">Foydalanuvchi topilmadi</div>
            <p className="text-gray-400 text-sm mt-2">Yangi foydalanuvchi qo'shish uchun tugmani bosing</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  {['Foydalanuvchi', 'Login', 'Rol', 'Telefon', 'Filial', 'Holat', 'Amallar'].map(c => (
                    <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(u.ism || '?')[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{u.ism}</div>
                          <div className="text-xs text-gray-400">{u.created_at}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">{u.login}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${(ROLLAR[u.rol] || ROLLAR.sotuvchi).color}`}>
                        {(ROLLAR[u.rol] || ROLLAR.sotuvchi).label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.telefon || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.filial || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(u.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.active ? '✅ Faol' : '❌ Nofaol'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(u)} className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center justify-center text-xs hover:bg-blue-200 transition">✏️</button>
                        <button onClick={() => handleDelete(u.id)} className="w-7 h-7 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center justify-center text-xs hover:bg-red-200 transition">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editId ? '✏️ Tahrirlash' : '➕ Yangi foydalanuvchi'}</h3>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-red-500 transition">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">👤 To'liq ism</label>
                  <input type="text" value={form.ism} onChange={e => setForm(f => ({ ...f, ism: e.target.value }))} placeholder="Ism Familiya"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">🔑 Login</label>
                    <input type="text" value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))} placeholder="login"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">🔒 Parol</label>
                    <input type="text" value={form.parol} onChange={e => setForm(f => ({ ...f, parol: e.target.value }))} placeholder="parol"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">🎭 Rol</label>
                  <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all">
                    <option value="admin">🔑 Admin</option>
                    <option value="sotuvchi">🛒 Sotuvchi</option>
                    <option value="usta">🔧 Usta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">📞 Telefon</label>
                  <input type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+998901234567"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">🏢 Filial</label>
                    <input type="text" value={form.filial} onChange={e => setForm(f => ({ ...f, filial: e.target.value }))} placeholder="Asosiy"
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">📂 Soha</label>
                    <input type="text" value={form.kategoriya} onChange={e => setForm(f => ({ ...f, kategoriya: e.target.value }))} placeholder="Elektronika..."
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all">
                  💾 {editId ? 'Yangilash' : 'Saqlash'}
                </button>
                <button onClick={() => setModal(false)} className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 transition-all">Bekor</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}