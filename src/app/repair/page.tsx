'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// ═══════════════════════════════════════════════════════════
// 🔧 TAMIRLASH - iOS STYLE
// ═══════════════════════════════════════════════════════════

const HOLATLAR = [
  { val: 'qabul', label: 'Qabul qilindi', icon: '📥', color: 'bg-gray-500' },
  { val: 'diagnostika', label: 'Diagnostika', icon: '🔍', color: 'bg-orange-500' },
  { val: 'tamirlashda', label: 'Tamirlashda', icon: '🔧', color: 'bg-blue-500' },
  { val: 'tayyor', label: 'Tayyor', icon: '✅', color: 'bg-green-500' },
  { val: 'topshirildi', label: 'Topshirildi', icon: '🏁', color: 'bg-purple-500' },
]

interface Order {
  id: number
  mijoz_id: number
  mijoz: string
  telefon: string
  shahar: string
  qurilma: string
  muammo: string
  holat: string
  narx: number
  izoh: string
  sana: string
  ishlar: string[] // Qilingan ishlar tarixi
}

interface Mijoz {
  id: number
  ism: string
  telefon: string
  shahar: string
}

const REPAIRS_KEY = 'faststore_repairs'
const MIJOZLAR_KEY = 'faststore_usta_mijozlar'

export default function RepairPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [mijozlar, setMijozlar] = useState<Mijoz[]>([])
  const [tab, setTab] = useState<'orders' | 'clients'>('orders')
  const [orderModal, setOrderModal] = useState(false)
  const [clientModal, setClientModal] = useState(false)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState('barchasi')
  const [search, setSearch] = useState('')

  // Form
  const [oForm, setOForm] = useState({ mijoz_id: 0, qurilma: '', muammo: '', narx: 0, izoh: '' })
  const [cForm, setCForm] = useState({ ism: '', telefon: '+998', shahar: '' })
  const [editOrderId, setEditOrderId] = useState<number | null>(null)

  useEffect(() => {
    try {
      const o = localStorage.getItem(REPAIRS_KEY); if (o) setOrders(JSON.parse(o))
      const m = localStorage.getItem(MIJOZLAR_KEY); if (m) setMijozlar(JSON.parse(m))
    } catch {}
  }, [])

  const saveOrders = (list: Order[]) => { setOrders(list); localStorage.setItem(REPAIRS_KEY, JSON.stringify(list)) }
  const saveMijozlar = (list: Mijoz[]) => { setMijozlar(list); localStorage.setItem(MIJOZLAR_KEY, JSON.stringify(list)) }

  const filteredOrders = orders.filter(o => {
    const ms = (o.mijoz || '').toLowerCase().includes(search.toLowerCase()) || (o.qurilma || '').toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'barchasi' || o.holat === filter
    return ms && mf
  })

  const stats = {
    jami: orders.length,
    jarayonda: orders.filter(o => ['qabul', 'diagnostika', 'tamirlashda'].includes(o.holat)).length,
    tayyor: orders.filter(o => o.holat === 'tayyor').length,
    topshirildi: orders.filter(o => o.holat === 'topshirildi').length,
  }

  // ─── MIJOZ QO'SHISH ───
  const addClient = () => {
    if (!cForm.ism || !cForm.telefon || cForm.telefon.length < 9) { alert('Ism va telefon kerak!'); return }
    const newClient: Mijoz = { id: Date.now(), ism: cForm.ism, telefon: cForm.telefon, shahar: cForm.shahar }
    saveMijozlar([...mijozlar, newClient])
    setCForm({ ism: '', telefon: '+998', shahar: '' })
    setClientModal(false)
  }

  // ─── BUYURTMA QO'SHISH ───
  const addOrder = () => {
    if (!oForm.mijoz_id || !oForm.qurilma) { alert('Mijoz va qurilma kerak!'); return }
    const mijoz = mijozlar.find(m => m.id === oForm.mijoz_id)
    if (!mijoz) { alert('Mijozni tanlang!'); return }

    if (editOrderId) {
      saveOrders(orders.map(o => o.id === editOrderId ? { ...o, qurilma: oForm.qurilma, muammo: oForm.muammo, narx: +oForm.narx, izoh: oForm.izoh } : o))
    } else {
      const newOrder: Order = {
        id: Date.now(), mijoz_id: mijoz.id, mijoz: mijoz.ism, telefon: mijoz.telefon,
        shahar: mijoz.shahar, qurilma: oForm.qurilma, muammo: oForm.muammo,
        holat: 'qabul', narx: +oForm.narx || 0, izoh: oForm.izoh,
        sana: new Date().toISOString().split('T')[0], ishlar: []
      }
      saveOrders([newOrder, ...orders])
    }
    setOrderModal(false); setEditOrderId(null)
    setOForm({ mijoz_id: 0, qurilma: '', muammo: '', narx: 0, izoh: '' })
  }

  const changeHolat = (id: number, holat: string) => saveOrders(orders.map(o => o.id === id ? { ...o, holat } : o))
  const deleteOrder = (id: number) => { if (confirm("O'chirilsinmi?")) saveOrders(orders.filter(o => o.id !== id)) }
  const deleteClient = (id: number) => { if (confirm("Mijoz o'chirilsinmi?")) saveMijozlar(mijozlar.filter(m => m.id !== id)) }

  const getHolat = (val: string) => HOLATLAR.find(h => h.val === val) || HOLATLAR[0]

  // ─── CHEK PRINT ───
  const printChek = (o: Order) => {
    const w = window.open('', '_blank', 'width=380,height=550')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Chek #${o.id}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;padding:20px;max-width:280px;margin:0 auto}.c{text-align:center}.b{font-weight:700}.line{border-top:1px dashed #ccc;margin:10px 0}.row{display:flex;justify-content:space-between;margin:4px 0}</style></head><body><div class="c b" style="font-size:16px">🔧 FastStore Servis</div><div class="c" style="color:#888;font-size:11px">Tamirlash xizmati</div><div class="line"></div><div class="row"><span>Buyurtma:</span><span class="b">#${o.id}</span></div><div class="row"><span>Sana:</span><span>${o.sana}</span></div><div class="row"><span>Mijoz:</span><span class="b">${o.mijoz}</span></div><div class="row"><span>Tel:</span><span>${o.telefon}</span></div><div class="line"></div><div class="row"><span>Qurilma:</span><span class="b">${o.qurilma}</span></div><div style="margin:6px 0;color:#555">Muammo: ${o.muammo}</div>${o.izoh ? '<div style="color:#555">Izoh: ' + o.izoh + '</div>' : ''}<div class="line"></div><div class="row"><span>Holat:</span><span class="b">${getHolat(o.holat).label}</span></div><div class="row"><span>Narx:</span><span class="b">${o.narx > 0 ? Math.round(o.narx * 12700).toLocaleString() + " so'm" : 'Kelishiladi'}</span></div>${o.ishlar && o.ishlar.length > 0 ? '<div class="line"></div><div style="font-size:11px;color:#555"><b>Qilingan ishlar:</b></div>' + o.ishlar.map(i => '<div>• ' + i + '</div>').join('') : ''}<div class="line"></div><div class="c" style="font-size:11px;color:#888">Xizmatimizdan foydalanganingiz uchun rahmat!</div></body></html>`)
    w.document.close(); w.print()
  }

  // ─── iOS STYLE COMPONENTS ───
  const IOSSection = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        {action}
      </div>
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-sm border border-gray-200/60 dark:border-gray-700/60">
        {children}
      </div>
    </div>
  )

  const IOSRow = ({ left, right, last, onClick }: { left: React.ReactNode; right?: React.ReactNode; last?: boolean; onClick?: () => void }) => (
    <div onClick={onClick} className={`flex items-center justify-between px-4 py-3.5 ${!last ? 'border-b border-gray-100 dark:border-gray-700/50' : ''} ${onClick ? 'active:bg-gray-50 dark:active:bg-gray-800 cursor-pointer' : ''}`}>
      <div className="flex-1 min-w-0">{left}</div>
      {right && <div className="flex-shrink-0 ml-3">{right}</div>}
      {onClick && <span className="text-gray-300 dark:text-gray-600 ml-2 text-lg">›</span>}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 bg-[#f2f2f7] dark:bg-[#000000] min-h-full">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">Tamirlash</h1>
          <p className="text-[15px] text-gray-500 mt-0.5">{stats.jami} ta buyurtma · {stats.jarayonda} ta jarayonda</p>
        </div>

        {/* iOS Segmented Control */}
        <div className="bg-gray-200/80 dark:bg-[#2c2c2e] rounded-xl p-1 flex mb-5">
          {[{ k: 'orders', l: '🔧 Buyurtmalar' }, { k: 'clients', l: '👥 Mijozlar' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as any)}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${tab === t.k ? 'bg-white dark:bg-[#3a3a3c] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
              {t.l}
            </button>
          ))}
        </div>

        {/* ═══ BUYURTMALAR TAB ═══ */}
        {tab === 'orders' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { l: 'Jami', v: stats.jami, c: 'text-blue-600' },
                { l: 'Jarayonda', v: stats.jarayonda, c: 'text-orange-500' },
                { l: 'Tayyor', v: stats.tayyor, c: 'text-green-500' },
                { l: 'Topshirildi', v: stats.topshirildi, c: 'text-purple-500' },
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-3 text-center shadow-sm border border-gray-200/60 dark:border-gray-700/60">
                  <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                  <div className="text-[10px] text-gray-400 uppercase mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Add button */}
            <button onClick={() => { setEditOrderId(null); setOForm({ mijoz_id: 0, qurilma: '', muammo: '', narx: 0, izoh: '' }); setOrderModal(true) }}
              className="w-full py-3.5 rounded-2xl font-semibold text-[15px] text-white mb-5 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)' }}>
              + Yangi buyurtma
            </button>

            {/* Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {[{ v: 'barchasi', l: 'Barchasi' }, ...HOLATLAR.map(h => ({ v: h.val, l: h.icon + ' ' + h.label }))].map(f => (
                <button key={f.v} onClick={() => setFilter(f.v)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${filter === f.v ? 'bg-blue-500 text-white' : 'bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
                  {f.l}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1c1c1e] border border-gray-200/60 dark:border-gray-700/60 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all" />
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-10 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="text-4xl mb-3">🔧</div>
                <div className="font-semibold text-gray-900 dark:text-white">Buyurtma yo'q</div>
                <p className="text-sm text-gray-400 mt-1">Yangi buyurtma qo'shing</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(o => {
                  const h = getHolat(o.holat)
                  return (
                    <div key={o.id} className="bg-white dark:bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-sm border border-gray-200/60 dark:border-gray-700/60 active:scale-[0.99] transition-transform">
                      <div className="p-4" onClick={() => setDetailOrder(o)}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[15px] text-gray-900 dark:text-white">{o.qurilma}</span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full text-white ${h.color}`}>{h.icon} {h.label}</span>
                          </div>
                          <span className="text-[12px] text-gray-400">#{o.id.toString().slice(-4)}</span>
                        </div>
                        <div className="text-[13px] text-gray-500 mb-1">👤 {o.mijoz} · 📞 {o.telefon}</div>
                        <div className="text-[13px] text-gray-600 dark:text-gray-400">{o.muammo}</div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[12px] text-gray-400">📅 {o.sana}{o.shahar ? ' · 📍 ' + o.shahar : ''}</span>
                          <span className="font-bold text-[14px] text-green-600">{o.narx > 0 ? Math.round(o.narx * 12700).toLocaleString() + " so'm" : ''}</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#2c2c2e] border-t border-gray-100 dark:border-gray-700/50 flex gap-2">
                        {o.holat === 'qabul' && <button onClick={() => changeHolat(o.id, 'diagnostika')} className="text-[12px] px-3 py-1.5 bg-orange-500 text-white rounded-full font-semibold">🔍 Diagnostika</button>}
                        {o.holat === 'diagnostika' && <button onClick={() => changeHolat(o.id, 'tamirlashda')} className="text-[12px] px-3 py-1.5 bg-blue-500 text-white rounded-full font-semibold">🔧 Tamirlash</button>}
                        {o.holat === 'tamirlashda' && <button onClick={() => changeHolat(o.id, 'tayyor')} className="text-[12px] px-3 py-1.5 bg-green-500 text-white rounded-full font-semibold">✅ Tayyor</button>}
                        {o.holat === 'tayyor' && <button onClick={() => changeHolat(o.id, 'topshirildi')} className="text-[12px] px-3 py-1.5 bg-purple-500 text-white rounded-full font-semibold">🏁 Topshirish</button>}
                        <button onClick={() => printChek(o)} className="text-[12px] px-3 py-1.5 bg-white dark:bg-[#3a3a3c] border border-gray-200 dark:border-gray-600 rounded-full font-medium text-gray-600 dark:text-gray-300">🖨️ Chek</button>
                        <div className="flex-1" />
                        <button onClick={() => deleteOrder(o.id)} className="text-[12px] px-2.5 py-1.5 text-red-500 font-medium">O'chirish</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ═══ MIJOZLAR TAB ═══ */}
        {tab === 'clients' && (
          <>
            <button onClick={() => { setCForm({ ism: '', telefon: '+998', shahar: '' }); setClientModal(true) }}
              className="w-full py-3.5 rounded-2xl font-semibold text-[15px] text-white mb-5 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)' }}>
              + Yangi mijoz
            </button>

            {mijozlar.length === 0 ? (
              <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-10 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="text-4xl mb-3">👥</div>
                <div className="font-semibold text-gray-900 dark:text-white">Mijoz yo'q</div>
              </div>
            ) : (
              <IOSSection title={`${mijozlar.length} ta mijoz`}>
                {mijozlar.map((m, i) => {
                  const orderCount = orders.filter(o => o.mijoz_id === m.id).length
                  return (
                    <IOSRow key={m.id} last={i === mijozlar.length - 1}
                      left={
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{(m.ism || '?')[0]}</div>
                          <div>
                            <div className="font-semibold text-[15px] text-gray-900 dark:text-white">{m.ism}</div>
                            <div className="text-[13px] text-gray-500">{m.telefon}{m.shahar ? ' · ' + m.shahar : ''}</div>
                          </div>
                        </div>
                      }
                      right={
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-blue-500 font-medium">{orderCount} buyurtma</span>
                          <button onClick={() => deleteClient(m.id)} className="text-red-400 text-sm">✕</button>
                        </div>
                      }
                    />
                  )
                })}
              </IOSSection>
            )}
          </>
        )}

        {/* ═══ MIJOZ QO'SHISH MODAL (iOS Sheet) ═══ */}
        {clientModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setClientModal(false)}>
            <div className="bg-white dark:bg-[#1c1c1e] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /></div>
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50">
                <button onClick={() => setClientModal(false)} className="text-[16px] text-blue-500 font-medium">Bekor</button>
                <span className="text-[16px] font-bold text-gray-900 dark:text-white">Yangi Mijoz</span>
                <button onClick={addClient} className="text-[16px] text-blue-500 font-bold">Saqlash</button>
              </div>
              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Ism</label>
                  <input type="text" value={cForm.ism} onChange={e => setCForm(f => ({ ...f, ism: e.target.value }))} placeholder="Ism Familiya" autoFocus
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Telefon</label>
                  <input type="tel" value={cForm.telefon} onChange={e => setCForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+998901234567"
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Qayerdan (shahar)</label>
                  <input type="text" value={cForm.shahar} onChange={e => setCForm(f => ({ ...f, shahar: e.target.value }))} placeholder="Toshkent"
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ BUYURTMA QO'SHISH MODAL ═══ */}
        {orderModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setOrderModal(false)}>
            <div className="bg-white dark:bg-[#1c1c1e] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /></div>
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 flex-shrink-0">
                <button onClick={() => setOrderModal(false)} className="text-[16px] text-blue-500 font-medium">Bekor</button>
                <span className="text-[16px] font-bold text-gray-900 dark:text-white">{editOrderId ? 'Tahrirlash' : 'Yangi Buyurtma'}</span>
                <button onClick={addOrder} className="text-[16px] text-blue-500 font-bold">Saqlash</button>
              </div>
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Mijoz</label>
                  <select value={oForm.mijoz_id} onChange={e => setOForm(f => ({ ...f, mijoz_id: +e.target.value }))}
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all">
                    <option value={0}>— Mijozni tanlang —</option>
                    {mijozlar.map(m => <option key={m.id} value={m.id}>{m.ism} · {m.telefon}</option>)}
                  </select>
                  <button onClick={() => { setOrderModal(false); setClientModal(true) }} className="text-[13px] text-blue-500 font-medium mt-2">+ Yangi mijoz qo'shish</button>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Qurilma</label>
                  <input type="text" value={oForm.qurilma} onChange={e => setOForm(f => ({ ...f, qurilma: e.target.value }))} placeholder="iPhone 14 Pro, Samsung A54..."
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Muammo</label>
                  <input type="text" value={oForm.muammo} onChange={e => setOForm(f => ({ ...f, muammo: e.target.value }))} placeholder="Ekran singan, batareya..."
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Narx (so'm)</label>
                  <input type="number" value={oForm.narx ? Math.round(oForm.narx * 12700) : ''} onChange={e => setOForm(f => ({ ...f, narx: Math.round((+e.target.value || 0) / 12700 * 100) / 100 }))} placeholder="0"
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Izoh</label>
                  <input type="text" value={oForm.izoh} onChange={e => setOForm(f => ({ ...f, izoh: e.target.value }))} placeholder="Qo'shimcha ma'lumot..."
                    className="w-full bg-gray-100 dark:bg-[#2c2c2e] border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DETAIL MODAL ═══ */}
        {detailOrder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setDetailOrder(null)}>
            <div className="bg-white dark:bg-[#1c1c1e] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /></div>
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 flex-shrink-0">
                <button onClick={() => setDetailOrder(null)} className="text-[16px] text-blue-500 font-medium">Yopish</button>
                <span className="text-[16px] font-bold text-gray-900 dark:text-white">Buyurtma #{detailOrder.id.toString().slice(-4)}</span>
                <button onClick={() => printChek(detailOrder)} className="text-[16px] text-blue-500 font-medium">Chek</button>
              </div>
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                {/* Holat */}
                <div className="text-center">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[14px] font-semibold ${getHolat(detailOrder.holat).color}`}>
                    {getHolat(detailOrder.holat).icon} {getHolat(detailOrder.holat).label}
                  </span>
                </div>

                {/* Info */}
                <IOSSection title="Ma'lumotlar">
                  {[
                    ['Qurilma', detailOrder.qurilma],
                    ['Mijoz', detailOrder.mijoz],
                    ['Telefon', detailOrder.telefon],
                    ['Shahar', detailOrder.shahar || '—'],
                    ['Muammo', detailOrder.muammo],
                    ['Sana', detailOrder.sana],
                    ['Narx', detailOrder.narx > 0 ? Math.round(detailOrder.narx * 12700).toLocaleString() + " so'm" : 'Kelishiladi'],
                  ].map(([k, v], i, arr) => (
                    <IOSRow key={k as string} last={i === arr.length - 1}
                      left={<span className="text-[14px] text-gray-500">{k}</span>}
                      right={<span className="text-[14px] font-medium text-gray-900 dark:text-white">{v}</span>} />
                  ))}
                </IOSSection>

                {detailOrder.izoh && (
                  <IOSSection title="Izoh">
                    <div className="px-4 py-3 text-[14px] text-gray-700 dark:text-gray-300">{detailOrder.izoh}</div>
                  </IOSSection>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {detailOrder.holat === 'qabul' && <button onClick={() => { changeHolat(detailOrder.id, 'diagnostika'); setDetailOrder(null) }} className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold text-[15px]">🔍 Diagnostikaga o'tkazish</button>}
                  {detailOrder.holat === 'diagnostika' && <button onClick={() => { changeHolat(detailOrder.id, 'tamirlashda'); setDetailOrder(null) }} className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-[15px]">🔧 Tamirlashga olish</button>}
                  {detailOrder.holat === 'tamirlashda' && <button onClick={() => { changeHolat(detailOrder.id, 'tayyor'); setDetailOrder(null) }} className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold text-[15px]">✅ Tayyor deb belgilash</button>}
                  {detailOrder.holat === 'tayyor' && <button onClick={() => { changeHolat(detailOrder.id, 'topshirildi'); setDetailOrder(null) }} className="w-full py-3 rounded-xl bg-purple-500 text-white font-semibold text-[15px]">🏁 Topshirildi</button>}
                  <button onClick={() => { printChek(detailOrder); }} className="w-full py-3 rounded-xl bg-gray-100 dark:bg-[#2c2c2e] text-gray-700 dark:text-gray-300 font-semibold text-[15px] border border-gray-200 dark:border-gray-700">🖨️ Chek chiqarish</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}