'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Mijoz { id: number; ism: string; telefon: string; shahar: string; created_at: string }

const KEY = 'faststore_usta_mijozlar'

export default function UstaMijozlarPage() {
  const { user } = useAuth()
  const [mijozlar, setMijozlar] = useState<Mijoz[]>([])
  const [modal, setModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ ism: '', telefon: '+998', shahar: '' })

  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setMijozlar(JSON.parse(s)) } catch {} }, [])
  const save = (list: Mijoz[]) => { setMijozlar(list); localStorage.setItem(KEY, JSON.stringify(list)) }

  const filtered = mijozlar.filter(m => (m.ism || '').toLowerCase().includes(search.toLowerCase()) || (m.telefon || '').includes(search))

  const addMijoz = () => {
    if (!form.ism || !form.telefon || form.telefon.length < 9) { alert('Ism va telefon kerak!'); return }
    save([{ id: Date.now(), ism: form.ism, telefon: form.telefon, shahar: form.shahar, created_at: new Date().toISOString().split('T')[0] }, ...mijozlar])
    setForm({ ism: '', telefon: '+998', shahar: '' }); setModal(false)
  }

  const deleteMijoz = (id: number) => { if (confirm("O'chirilsinmi?")) save(mijozlar.filter(m => m.id !== id)) }

  // Tamirlash buyurtmalari soni
  const getOrderCount = (id: number) => {
    try { const r = JSON.parse(localStorage.getItem('faststore_repairs') || '[]'); return r.filter((o: any) => o.mijoz_id === id).length } catch { return 0 }
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 min-h-full" style={{ background: '#f2f2f7' }}>
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Mijozlar</h1>
          <p className="text-[15px] text-gray-500 mt-0.5">{filtered.length} ta mijoz</p>
        </div>

        {/* Add button */}
        <button onClick={() => { setForm({ ism: '', telefon: '+998', shahar: '' }); setModal(true) }}
          className="w-full py-3.5 rounded-2xl font-semibold text-[15px] text-white mb-5 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all" style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)' }}>
          + Yangi mijoz
        </button>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all" />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-10 text-center border border-gray-200/60">
            <div className="text-4xl mb-3">👥</div>
            <div className="font-semibold text-gray-900">Mijoz topilmadi</div>
            <p className="text-sm text-gray-400 mt-1">Yangi mijoz qo'shing</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
            {filtered.map((m, i) => (
              <div key={m.id} className={`flex items-center px-4 py-3.5 ${i < filtered.length - 1 ? 'border-b border-gray-100' : ''} active:bg-gray-50 transition-colors`}>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md shadow-blue-500/20">
                  {(m.ism || '?')[0]}
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="font-semibold text-[15px] text-gray-900">{m.ism}</div>
                  <div className="text-[13px] text-gray-500">{m.telefon}{m.shahar ? ' · ' + m.shahar : ''}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[12px] text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{getOrderCount(m.id)} buyurtma</span>
                  <button onClick={() => deleteMijoz(m.id)} className="text-red-400 text-sm w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* iOS Sheet Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setModal(false)}>
            <div className="bg-white/90 backdrop-blur-2xl w-full max-w-md rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-gray-300" /></div>
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200/60">
                <button onClick={() => setModal(false)} className="text-[16px] text-blue-500 font-medium">Bekor</button>
                <span className="text-[16px] font-bold text-gray-900">Yangi Mijoz</span>
                <button onClick={addMijoz} className="text-[16px] text-blue-500 font-bold">Saqlash</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Ism</label>
                  <input type="text" value={form.ism} onChange={e => setForm(f => ({ ...f, ism: e.target.value }))} placeholder="Ism Familiya" autoFocus
                    className="w-full bg-gray-100/80 backdrop-blur border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Telefon</label>
                  <input type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+998901234567"
                    className="w-full bg-gray-100/80 backdrop-blur border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Qayerdan</label>
                  <input type="text" value={form.shahar} onChange={e => setForm(f => ({ ...f, shahar: e.target.value }))} placeholder="Toshkent"
                    className="w-full bg-gray-100/80 backdrop-blur border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}