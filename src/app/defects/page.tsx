'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const BRAK_TURLARI = ['Xaridordan qaytgan', 'Ombordan brak']
const BRAK_HOLATLARI = [
  { val: 'kutilmoqda', label: '⏳ Kutilmoqda', color: 'bg-orange-100 text-orange-700' },
  { val: 'almashtirildi', label: '🔄 Almashtirildi', color: 'bg-green-100 text-green-700' },
  { val: 'hisobdan_chiqarildi', label: '🗑 Hisobdan chiqarildi', color: 'bg-red-100 text-red-700' },
]
const SABAB_LIST = ['Nuqsonli / ishlamaydi', 'Singan', "Noto'g'ri tovar", "Muddati o'tgan", 'Boshqa']

interface BrakItem { id: number; sana: string; tur: string; mahsulot: string; miqdor: number; sabab: string; holat: string; izoh: string }

const STORAGE_KEY = 'faststore_defects'

export default function DefectsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<BrakItem[]>([])
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('barchasi')
  const [form, setForm] = useState({ tur: BRAK_TURLARI[0], mahsulot: '', miqdor: 1, sabab: SABAB_LIST[0], izoh: '' })

  useEffect(() => { try { const s = localStorage.getItem(STORAGE_KEY); if (s) setItems(JSON.parse(s)) } catch {} }, [])
  const save = (list: BrakItem[]) => { setItems(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

  const filtered = filter === 'barchasi' ? items : items.filter(i => i.holat === filter)

  const handleSave = () => {
    if (!form.mahsulot) { alert('Mahsulot majburiy!'); return }
    save([...items, { id: Date.now(), sana: new Date().toISOString().split('T')[0], tur: form.tur, mahsulot: form.mahsulot, miqdor: +form.miqdor || 1, sabab: form.sabab, holat: 'kutilmoqda', izoh: form.izoh }])
    setModal(false); setForm({ tur: BRAK_TURLARI[0], mahsulot: '', miqdor: 1, sabab: SABAB_LIST[0], izoh: '' })
  }

  const changeHolat = (id: number, holat: string) => save(items.map(i => i.id === id ? { ...i, holat } : i))
  const handleDelete = (id: number) => { if (confirm("O'chirilsinmi?")) save(items.filter(i => i.id !== id)) }

  const getHolat = (val: string) => BRAK_HOLATLARI.find(h => h.val === val) || BRAK_HOLATLARI[0]

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔴 Brak / Qaytarishlar</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta brak qayd etilgan</p></div>
          <button onClick={() => setModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/30 transition-all">➕ Yangi brak</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{ l: 'Jami', v: items.length, c: 'text-red-600', i: '🔴' }, { l: 'Kutilmoqda', v: items.filter(i => i.holat === 'kutilmoqda').length, c: 'text-orange-500', i: '⏳' }, { l: 'Almashtirildi', v: items.filter(i => i.holat === 'almashtirildi').length, c: 'text-green-500', i: '🔄' }, { l: 'Hisobdan chiq.', v: items.filter(i => i.holat === 'hisobdan_chiqarildi').length, c: 'text-red-500', i: '🗑' }].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm"><div className="text-xl mb-1">{s.i}</div><div className="text-xs text-gray-400 uppercase">{s.l}</div><div className={`text-xl font-bold ${s.c}`}>{s.v}</div></div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">{[{ v: 'barchasi', l: 'Barchasi' }, ...BRAK_HOLATLARI.map(h => ({ v: h.val, l: h.label }))].map(f => (<button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f.v ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{f.l}</button>))}</div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center"><div className="text-4xl mb-3">🔴</div><p className="font-bold">Brak topilmadi</p></div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 dark:bg-gray-700/50">{['Sana', 'Tur', 'Mahsulot', 'Miqdor', 'Sabab', 'Holat', 'Amal'].map(c => <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{c}</th>)}</tr></thead>
              <tbody>{filtered.map(item => { const h = getHolat(item.holat); return (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400 text-xs">{item.sana}</td>
                  <td className="px-4 py-3 text-xs">{item.tur === 'Xaridordan qaytgan' ? '👤' : '📦'} {item.tur}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{item.mahsulot}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">{item.miqdor} dona</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.sabab}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${h.color}`}>{h.label}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1 flex-wrap">
                    {item.holat === 'kutilmoqda' && <><button onClick={() => changeHolat(item.id, 'almashtirildi')} className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded font-bold">🔄</button><button onClick={() => changeHolat(item.id, 'hisobdan_chiqarildi')} className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded font-bold">🗑</button></>}
                    <button onClick={() => handleDelete(item.id)} className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded">✕</button>
                  </div></td>
                </tr>
              )})}</tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"><h3 className="text-lg font-bold">➕ Yangi brak qayd etish</h3><button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">✕</button></div>
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📋 Tur</label><select value={form.tur} onChange={e => setForm(f => ({ ...f, tur: e.target.value }))} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white">{BRAK_TURLARI.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📦 Mahsulot</label><input type="text" value={form.mahsulot} onChange={e => setForm(f => ({ ...f, mahsulot: e.target.value }))} placeholder="Mahsulot nomi" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📊 Miqdor</label><input type="number" value={form.miqdor} onChange={e => setForm(f => ({ ...f, miqdor: +e.target.value }))} min="1" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">❓ Sabab</label><select value={form.sabab} onChange={e => setForm(f => ({ ...f, sabab: e.target.value }))} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white">{SABAB_LIST.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📝 Izoh</label><input type="text" value={form.izoh} onChange={e => setForm(f => ({ ...f, izoh: e.target.value }))} placeholder="Batafsil..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3"><button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg">🔴 Qayd etish</button><button onClick={() => setModal(false)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600">Bekor</button></div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}