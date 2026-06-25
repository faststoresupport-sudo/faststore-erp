'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Customer {
  id: number
  ism: string
  telefon: string
  manzil: string
  izoh: string
  created_at: string
}

const STORAGE_KEY = 'faststore_customers'

export default function CustomersPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ ism: '', telefon: '+998', manzil: '', izoh: '' })

  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setCustomers(JSON.parse(s)) } catch {}
  }, [])

  const save = (list: Customer[]) => { setCustomers(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

  const filtered = customers.filter(c =>
    (c.ism || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.telefon || '').includes(search)
  )

  const openAdd = () => { setEditId(null); setForm({ ism: '', telefon: '+998', manzil: '', izoh: '' }); setModal(true) }
  const openEdit = (c: Customer) => { setEditId(c.id); setForm({ ism: c.ism, telefon: c.telefon, manzil: c.manzil, izoh: c.izoh }); setModal(true) }

  const handleSave = () => {
    if (!form.ism) { alert('Ism majburiy!'); return }
    if (editId) { save(customers.map(c => c.id === editId ? { ...c, ...form } : c)) }
    else { save([...customers, { id: Date.now(), ...form, created_at: new Date().toISOString().split('T')[0] }]) }
    setModal(false)
  }

  const handleDelete = (id: number) => { if (confirm("O'chirilsinmi?")) save(customers.filter(c => c.id !== id)) }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">👥 Sotuvchi Xaridorlari</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} ta xaridor</p>
          </div>
          <button onClick={openAdd} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all">➕ Yangi xaridor</button>
        </div>

        <div className="mb-6 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism yoki telefon..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm" />
        </div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center"><div className="text-4xl mb-3">👥</div><p className="font-bold text-gray-800 dark:text-white">Xaridor topilmadi</p><p className="text-gray-400 text-sm mt-2">Yangi qo'shish uchun tugmani bosing</p></div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 dark:bg-gray-700/50">{['Ism', 'Telefon', 'Manzil', 'Izoh', 'Sana', 'Amal'].map(c => <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{c}</th>)}</tr></thead>
              <tbody>{filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{c.ism}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium text-xs">{c.telefon}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.manzil || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[150px] truncate">{c.izoh || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{c.created_at}</td>
                  <td className="px-4 py-3"><div className="flex gap-1.5"><button onClick={() => openEdit(c)} className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs">✏️</button><button onClick={() => handleDelete(c.id)} className="w-7 h-7 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-xs">🗑️</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-bold">{editId ? '✏️ Tahrirlash' : '➕ Yangi xaridor'}</h3>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">👤 Ism Familiya</label><input type="text" value={form.ism} onChange={e => setForm(f => ({ ...f, ism: e.target.value }))} placeholder="To'liq ism" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📞 Telefon</label><input type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+998901234567" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📍 Manzil</label><input type="text" value={form.manzil} onChange={e => setForm(f => ({ ...f, manzil: e.target.value }))} placeholder="Shahar, tuman" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📝 Izoh</label><input type="text" value={form.izoh} onChange={e => setForm(f => ({ ...f, izoh: e.target.value }))} placeholder="Doimiy mijoz..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" /></div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg">💾 {editId ? 'Yangilash' : 'Saqlash'}</button>
                <button onClick={() => setModal(false)} className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600">Bekor</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}