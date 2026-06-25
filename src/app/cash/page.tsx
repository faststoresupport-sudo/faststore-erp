'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface CashItem { id: number; sana: string; tur: 'Kirim' | 'Chiqim'; sabab: string; summa: number; izoh: string }

const STORAGE_KEY = 'faststore_cash'

export default function CashPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<CashItem[]>([])
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('Barchasi')
  const [form, setForm] = useState({ tur: 'Kirim' as 'Kirim' | 'Chiqim', sabab: '', summa: 0, izoh: '' })

  useEffect(() => { try { const s = localStorage.getItem(STORAGE_KEY); if (s) setItems(JSON.parse(s)) } catch {} }, [])
  const save = (list: CashItem[]) => { setItems(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

  const kirim = items.filter(i => i.tur === 'Kirim').reduce((s, i) => s + i.summa, 0)
  const chiqim = items.filter(i => i.tur === 'Chiqim').reduce((s, i) => s + i.summa, 0)
  const balans = kirim - chiqim

  const filtered = filter === 'Barchasi' ? items : items.filter(i => i.tur === filter)

  const handleSave = () => {
    if (!form.sabab || !form.summa) { alert('Sabab va summa majburiy!'); return }
    save([...items, { id: Date.now(), sana: new Date().toISOString().split('T')[0], tur: form.tur, sabab: form.sabab, summa: +form.summa, izoh: form.izoh }])
    setModal(false); setForm({ tur: 'Kirim', sabab: '', summa: 0, izoh: '' })
  }

  const handleDelete = (id: number) => { if (confirm("O'chirilsinmi?")) save(items.filter(i => i.id !== id)) }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Kassa</h1><p className="text-sm text-gray-500 mt-1">Moliyaviy operatsiyalar</p></div>
          <button onClick={() => { setForm({ tur: 'Kirim', sabab: '', summa: 0, izoh: '' }); setModal(true) }} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 transition-all">➕ Yangi operatsiya</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm border-t-4 border-t-green-500"><div className="text-xs text-gray-400 uppercase mb-1">⬆️ Kirim</div><div className="text-xl font-bold text-green-600">{Math.round(kirim * 12700).toLocaleString()} so'm</div></div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm border-t-4 border-t-red-500"><div className="text-xs text-gray-400 uppercase mb-1">⬇️ Chiqim</div><div className="text-xl font-bold text-red-600">{Math.round(chiqim * 12700).toLocaleString()} so'm</div></div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm border-t-4 border-t-blue-500"><div className="text-xs text-gray-400 uppercase mb-1">💼 Balans</div><div className={`text-xl font-bold ${balans >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(balans * 12700).toLocaleString()} so'm</div></div>
        </div>

        <div className="flex gap-2 mb-6">{['Barchasi', 'Kirim', 'Chiqim'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{f === 'Kirim' ? '⬆️ ' : f === 'Chiqim' ? '⬇️ ' : ''}{f}</button>))}</div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center"><div className="text-4xl mb-3">💰</div><p className="font-bold text-gray-800 dark:text-white">Operatsiya topilmadi</p></div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 dark:bg-gray-700/50">{['Sana', 'Tur', 'Sabab', 'Summa', 'Izoh', 'Amal'].map(c => <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{c}</th>)}</tr></thead>
              <tbody>{filtered.map(item => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400 text-xs">{item.sana}</td>
                  <td className="px-4 py-3"><span className={`font-bold ${item.tur === 'Kirim' ? 'text-green-600' : 'text-red-600'}`}>{item.tur === 'Kirim' ? '⬆️' : '⬇️'} {item.tur}</span></td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{item.sabab}</td>
                  <td className="px-4 py-3"><span className={`font-bold ${item.tur === 'Kirim' ? 'text-green-600' : 'text-red-600'}`}>{Math.round(item.summa * 12700).toLocaleString()} so'm</span></td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[150px] truncate">{item.izoh || '—'}</td>
                  <td className="px-4 py-3"><button onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-xs">🗑️</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"><h3 className="text-lg font-bold">➕ Yangi operatsiya</h3><button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">✕</button></div>
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📊 Tur</label><div className="grid grid-cols-2 gap-3">{(['Kirim', 'Chiqim'] as const).map(t => (<button key={t} onClick={() => setForm(f => ({ ...f, tur: t }))} className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${form.tur === t ? (t === 'Kirim' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700') : 'border-gray-200 text-gray-500'}`}>{t === 'Kirim' ? '⬆️ Kirim' : '⬇️ Chiqim'}</button>))}</div></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📝 Sabab</label><input type="text" value={form.sabab} onChange={e => setForm(f => ({ ...f, sabab: e.target.value }))} placeholder="Sotuv, xarajat, oylik..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">💲 Summa (USD)</label><input type="number" value={form.summa || ''} onChange={e => setForm(f => ({ ...f, summa: +e.target.value }))} min="0" step="0.01" placeholder="0" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />{+form.summa > 0 && <div className="mt-2 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">= {Math.round((+form.summa) * 12700).toLocaleString()} so'm</div>}</div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📝 Izoh</label><input type="text" value={form.izoh} onChange={e => setForm(f => ({ ...f, izoh: e.target.value }))} placeholder="Qo'shimcha izoh..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <button onClick={handleSave} className={`flex-1 py-3 text-white rounded-xl font-bold text-sm shadow-lg ${form.tur === 'Kirim' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>💾 Saqlash</button>
                <button onClick={() => setModal(false)} className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600">Bekor</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}