'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const HOLATLAR = [
  { val: 'qabul', label: '📥 Qabul qilindi', color: 'bg-gray-100 text-gray-700' },
  { val: 'diagnostika', label: '🔍 Diagnostika', color: 'bg-orange-100 text-orange-700' },
  { val: 'tamirlashda', label: '🔧 Tamirlashda', color: 'bg-blue-100 text-blue-700' },
  { val: 'tayyor', label: '✅ Tayyor', color: 'bg-green-100 text-green-700' },
  { val: 'topshirildi', label: '🏁 Topshirildi', color: 'bg-purple-100 text-purple-700' },
  { val: 'bekor', label: '❌ Bekor', color: 'bg-red-100 text-red-700' },
]

interface RepairOrder { id: number; mijoz: string; telefon: string; qurilma: string; muammo: string; holat: string; narx: number; izoh: string; sana: string }

const STORAGE_KEY = 'faststore_repairs'

export default function RepairPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<RepairOrder[]>([])
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('barchasi')
  const [form, setForm] = useState({ mijoz: '', telefon: '+998', qurilma: '', muammo: '', holat: 'qabul', narx: 0, izoh: '' })

  useEffect(() => { try { const s = localStorage.getItem(STORAGE_KEY); if (s) setOrders(JSON.parse(s)) } catch {} }, [])
  const save = (list: RepairOrder[]) => { setOrders(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

  const filtered = orders.filter(o => {
    const ms = (o.mijoz || '').toLowerCase().includes(search.toLowerCase()) || (o.qurilma || '').toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'barchasi' || o.holat === filter
    return ms && mf
  })

  const stats = { jami: orders.length, jarayonda: orders.filter(o => ['qabul', 'diagnostika', 'tamirlashda'].includes(o.holat)).length, tayyor: orders.filter(o => o.holat === 'tayyor').length, topshirildi: orders.filter(o => o.holat === 'topshirildi').length }

  const openAdd = () => { setEditId(null); setForm({ mijoz: '', telefon: '+998', qurilma: '', muammo: '', holat: 'qabul', narx: 0, izoh: '' }); setModal(true) }
  const openEdit = (o: RepairOrder) => { setEditId(o.id); setForm({ mijoz: o.mijoz, telefon: o.telefon, qurilma: o.qurilma, muammo: o.muammo, holat: o.holat, narx: o.narx, izoh: o.izoh }); setModal(true) }

  const handleSave = () => {
    if (!form.mijoz || !form.qurilma) { alert('Mijoz va qurilma majburiy!'); return }
    if (editId) { save(orders.map(o => o.id === editId ? { ...o, ...form, narx: +form.narx } : o)) }
    else { save([...orders, { id: Date.now(), ...form, narx: +form.narx, sana: new Date().toISOString().split('T')[0] }]) }
    setModal(false)
  }

  const changeHolat = (id: number, holat: string) => save(orders.map(o => o.id === id ? { ...o, holat } : o))
  const handleDelete = (id: number) => { if (confirm("O'chirilsinmi?")) save(orders.filter(o => o.id !== id)) }

  const getHolat = (val: string) => HOLATLAR.find(h => h.val === val) || HOLATLAR[0]

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔧 Tamirlash Buyurtmalari</h1><p className="text-sm text-gray-500 mt-1">{filtered.length} ta buyurtma</p></div>
          <button onClick={openAdd} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 transition-all">➕ Yangi buyurtma</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{ l: 'Jami', v: stats.jami, c: 'text-blue-600', i: '📋' }, { l: 'Jarayonda', v: stats.jarayonda, c: 'text-orange-500', i: '🔧' }, { l: 'Tayyor', v: stats.tayyor, c: 'text-green-500', i: '✅' }, { l: 'Topshirildi', v: stats.topshirildi, c: 'text-purple-500', i: '🏁' }].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm"><div className="text-xl mb-1">{s.i}</div><div className="text-xs text-gray-400 uppercase">{s.l}</div><div className={`text-xl font-bold ${s.c}`}>{s.v}</div></div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Mijoz yoki qurilma..." className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm" /></div>
          <div className="flex gap-2 flex-wrap">{[{ v: 'barchasi', l: 'Barchasi' }, ...HOLATLAR.map(h => ({ v: h.val, l: h.label }))].map(f => (<button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === f.v ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{f.l}</button>))}</div>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center"><div className="text-4xl mb-3">🔧</div><p className="font-bold">Buyurtma topilmadi</p></div>
        ) : (
          <div className="space-y-3">
            {filtered.map(o => { const h = getHolat(o.holat); return (
              <div key={o.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center text-lg flex-shrink-0">📱</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap"><span className="font-bold text-sm text-gray-900 dark:text-white">{o.qurilma}</span><span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${h.color}`}>{h.label}</span></div>
                    <div className="text-xs text-gray-500">👤 {o.mijoz} · 📞 {o.telefon} · 📅 {o.sana}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{o.muammo}</div>
                  </div>
                  <div className="text-right flex-shrink-0"><div className="font-bold text-green-600">{o.narx > 0 ? Math.round(o.narx * 12700).toLocaleString() + " so'm" : '—'}</div></div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-wrap">
                  <button onClick={() => openEdit(o)} className="text-xs px-3 py-1.5 bg-white dark:bg-gray-700 border rounded-lg font-medium">✏️ Tahrir</button>
                  <button onClick={() => handleDelete(o.id)} className="text-xs px-3 py-1.5 bg-white dark:bg-gray-700 border border-red-200 text-red-600 rounded-lg font-medium">🗑️</button>
                  <div className="flex-1" />
                  {o.holat === 'qabul' && <button onClick={() => changeHolat(o.id, 'diagnostika')} className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg font-bold">🔍 Diagnostika</button>}
                  {o.holat === 'diagnostika' && <button onClick={() => changeHolat(o.id, 'tamirlashda')} className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg font-bold">🔧 Tamirlash</button>}
                  {o.holat === 'tamirlashda' && <button onClick={() => changeHolat(o.id, 'tayyor')} className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg font-bold">✅ Tayyor</button>}
                  {o.holat === 'tayyor' && <button onClick={() => changeHolat(o.id, 'topshirildi')} className="text-xs px-3 py-1.5 bg-purple-500 text-white rounded-lg font-bold">🏁 Topshirildi</button>}
                </div>
              </div>
            )})}
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"><h3 className="text-lg font-bold">{editId ? '✏️ Tahrirlash' : '➕ Yangi buyurtma'}</h3><button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">✕</button></div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">👤 Mijoz</label><input type="text" value={form.mijoz} onChange={e => setForm(f => ({ ...f, mijoz: e.target.value }))} placeholder="Ism Familiya" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📞 Telefon</label><input type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+998..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📱 Qurilma</label><input type="text" value={form.qurilma} onChange={e => setForm(f => ({ ...f, qurilma: e.target.value }))} placeholder="Samsung Galaxy A54..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">🔍 Muammo</label><input type="text" value={form.muammo} onChange={e => setForm(f => ({ ...f, muammo: e.target.value }))} placeholder="Ekran singan..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">💰 Narx (USD)</label><input type="number" value={form.narx} onChange={e => setForm(f => ({ ...f, narx: +e.target.value }))} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📊 Holat</label><select value={form.holat} onChange={e => setForm(f => ({ ...f, holat: e.target.value }))} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white">{HOLATLAR.map(h => <option key={h.val} value={h.val}>{h.label}</option>)}</select></div>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📝 Izoh</label><input type="text" value={form.izoh} onChange={e => setForm(f => ({ ...f, izoh: e.target.value }))} placeholder="Izoh..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm shadow-lg">💾 {editId ? 'Yangilash' : 'Saqlash'}</button>
                <button onClick={() => setModal(false)} className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600">Bekor</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}