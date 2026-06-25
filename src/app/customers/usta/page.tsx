'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface UstaMijoz {
  id: number
  ism: string
  telefon: string
  manzil: string
  qurilma: string
  muammo: string
  izoh: string
  created_at: string
}

export default function UstaMijozlarPage() {
  const { user } = useAuth()
  const [mijozlar, setMijozlar] = useState<UstaMijoz[]>([])
  const [modal, setModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ ism: '', telefon: '+998', manzil: '', qurilma: '', muammo: '', izoh: '' })
  const [editId, setEditId] = useState<number | null>(null)

  const filtered = mijozlar.filter(m =>
    (m.ism || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.telefon || '').includes(search)
  )

  const handleSave = () => {
    if (!form.ism || !form.telefon) { alert('Ism va telefon majburiy!'); return }
    if (editId) {
      setMijozlar(prev => prev.map(m => m.id === editId ? { ...m, ...form } : m))
    } else {
      setMijozlar(prev => [...prev, { id: Date.now(), ...form, created_at: new Date().toISOString().split('T')[0] }])
    }
    setModal(false)
    setForm({ ism: '', telefon: '+998', manzil: '', qurilma: '', muammo: '', izoh: '' })
    setEditId(null)
  }

  const handleEdit = (m: UstaMijoz) => {
    setForm({ ism: m.ism, telefon: m.telefon, manzil: m.manzil, qurilma: m.qurilma, muammo: m.muammo, izoh: m.izoh })
    setEditId(m.id)
    setModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("O'chirilsinmi?")) setMijozlar(prev => prev.filter(m => m.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔧👥 Usta Mijozlari</h1>
            <p className="text-gray-500 text-sm mt-1">Tamirlash xizmati mijozlari — {filtered.length} ta</p>
          </div>
          <button onClick={() => { setEditId(null); setForm({ ism: '', telefon: '+998', manzil: '', qurilma: '', muammo: '', izoh: '' }); setModal(true) }}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
            ➕ Yangi mijoz
          </button>
        </div>

        {/* Search */}
        <div className="card p-4 mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism yoki telefon bo'yicha qidiring..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🔧👥</div>
            <div className="font-bold text-gray-900 dark:text-white text-lg">Mijoz topilmadi</div>
            <p className="text-gray-400 text-sm mt-2">Yangi mijoz qo'shish uchun tugmani bosing</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  {['Ism', 'Telefon', 'Manzil', 'Qurilma', 'Muammo', 'Sana', 'Amal'].map(c => (
                    <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-semibold">{m.ism}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">{m.telefon}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{m.manzil || '—'}</td>
                    <td className="px-4 py-3 font-medium">{m.qurilma || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{m.muammo || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{m.created_at}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(m)} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">✏️</button>
                        <button onClick={() => handleDelete(m.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">🗑️</button>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-bold">{editId ? '✏️ Tahrirlash' : '➕ Yangi mijoz'}</h3>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
              </div>
              <div className="p-6 space-y-3">
                <input type="text" value={form.ism} onChange={e => setForm(f => ({ ...f, ism: e.target.value }))} placeholder="Ism Familiya"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                <input type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+998901234567"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                <input type="text" value={form.manzil} onChange={e => setForm(f => ({ ...f, manzil: e.target.value }))} placeholder="Manzil"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                <input type="text" value={form.qurilma} onChange={e => setForm(f => ({ ...f, qurilma: e.target.value }))} placeholder="Qurilma nomi (Samsung A54...)"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                <input type="text" value={form.muammo} onChange={e => setForm(f => ({ ...f, muammo: e.target.value }))} placeholder="Muammo"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                <input type="text" value={form.izoh} onChange={e => setForm(f => ({ ...f, izoh: e.target.value }))} placeholder="Izoh (ixtiyoriy)"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <button onClick={handleSave} className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm">
                  💾 {editId ? 'Yangilash' : 'Saqlash'}
                </button>
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600">Bekor</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}