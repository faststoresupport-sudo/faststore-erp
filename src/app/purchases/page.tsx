'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Purchase { id: number; sana: string; taminotchi: string; mahsulot: string; miqdor: number; narx: number; jami: number; holat: string }

const HOLATLAR = ['Keldi', 'Kutilmoqda', 'Bekor qilindi']
const STORAGE_KEY = 'faststore_purchases'

export default function PurchasesPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Purchase[]>([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ taminotchi: '', mahsulot: '', miqdor: 1, narx: 0, holat: 'Keldi' })

  useEffect(() => { try { const s = localStorage.getItem(STORAGE_KEY); if (s) setItems(JSON.parse(s)) } catch {} }, [])
  const save = (list: Purchase[]) => { setItems(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

  const filtered = items.filter(p => (p.taminotchi || '').toLowerCase().includes(search.toLowerCase()) || (p.mahsulot || '').toLowerCase().includes(search.toLowerCase()))

  const totalXarajat = items.filter(p => p.holat === 'Keldi').reduce((s, p) => s + p.jami, 0)

  const openAdd = () => { setEditId(null); setForm({ taminotchi: '', mahsulot: '', miqdor: 1, narx: 0, holat: 'Keldi' }); setModal(true) }
  const openEdit = (p: Purchase) => { setEditId(p.id); setForm({ taminotchi: p.taminotchi, mahsulot: p.mahsulot, miqdor: p.miqdor, narx: p.narx, holat: p.holat }); setModal(true) }

  const handleSave = () => {
    if (!form.taminotchi || !form.mahsulot) { alert("Ta'minotchi va mahsulot majburiy!"); return }
    const jami = (+form.miqdor || 0) * (+form.narx || 0)
    if (editId) { save(items.map(p => p.id === editId ? { ...p, ...form, miqdor: +form.miqdor, narx: +form.narx, jami } : p)) }
    else { save([...items, { id: Date.now(), ...form, miqdor: +form.miqdor, narx: +form.narx, jami, sana: new Date().toISOString().split('T')[0] }]) }
    setModal(false)
  }

  const handleDelete = (id: number) => { if (confirm("O'chirilsinmi?")) save(items.filter(p => p.id !== id)) }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">📥 Xaridlar (Kirim)</h1><p className="text-sm text-gray-500 mt-1">{filtered.length} ta xarid · Jami xarajat: {Math.round(totalXarajat * 12700).toLocaleString()} so'm</p></div>
          <button onClick={openAdd} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all">➕ Yangi xarid</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[{ l: 'Jami', v: items.length, c: 'text-blue-600', i: '📦' }, { l: 'Keldi', v: items.filter(p => p.holat === 'Keldi').length, c: 'text-green-600', i: '✅' }, { l: 'Xarajat', v: Math.round(totalXarajat * 12700).toLocaleString() + " so'm", c: 'text-orange-600', i: '💸' }].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm"><div className="text-xl mb-1">{s.i}</div><div className="text-xs text-gray-400 uppercase">{s.l}</div><div className={`text-lg font-bold ${s.c}`}>{s.v}</div></div>
          ))}
        </div>

        <div className="mb-6 relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ta'minotchi yoki mahsulot..." className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm" /></div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center"><div className="text-4xl mb-3">📥</div><p className="font-bold text-gray-800 dark:text-white">Xarid topilmadi</p></div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 dark:bg-gray-700/50">{['Sana', "Ta'minotchi", 'Mahsulot', 'Miqdor', 'Narx', 'Jami', 'Holat', 'Amal'].map(c => <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{c}</th>)}</tr></thead>
              <tbody>{filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.sana}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{p.taminotchi}</td>
                  <td className="px-4 py-3">{p.mahsulot}</td>
                  <td className="px-4 py-3 font-medium">{p.miqdor}</td>
                  <td className="px-4 py-3 text-xs">{Math.round(p.narx * 12700).toLocaleString()} so'm</td>
                  <td className="px-4 py-3 font-bold text-orange-600">{Math.round(p.jami * 12700).toLocaleString()} so'm</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${p.holat === 'Keldi' ? 'bg-green-100 text-green-700' : p.holat === 'Kutilmoqda' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{p.holat}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1.5"><button onClick={() => openEdit(p)} className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs">✏️</button><button onClick={() => handleDelete(p.id)} className="w-7 h-7 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-xs">🗑️</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"><h3 className="text-lg font-bold">{editId ? '✏️ Tahrirlash' : '➕ Yangi xarid'}</h3><button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">✕</button></div>
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">🏢 Ta'minotchi</label><input type="text" value={form.taminotchi} onChange={e => setForm(f => ({ ...f, taminotchi: e.target.value }))} placeholder="Kompaniya nomi" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📦 Mahsulot</label><input type="text" value={form.mahsulot} onChange={e => setForm(f => ({ ...f, mahsulot: e.target.value }))} placeholder="Mahsulot nomi" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📊 Miqdor</label><input type="number" value={form.miqdor} onChange={e => setForm(f => ({ ...f, miqdor: +e.target.value }))} min="1" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">💲 Narx (USD)</label><input type="number" value={form.narx} onChange={e => setForm(f => ({ ...f, narx: +e.target.value }))} min="0" step="0.01" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                </div>
                {(+form.narx > 0 && +form.miqdor > 0) && <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-sm"><span className="text-gray-500">Jami: </span><span className="font-bold text-blue-600">{Math.round((+form.miqdor) * (+form.narx) * 12700).toLocaleString()} so'm</span></div>}
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📊 Holat</label><select value={form.holat} onChange={e => setForm(f => ({ ...f, holat: e.target.value }))} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white">{HOLATLAR.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
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