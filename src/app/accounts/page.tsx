'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const BRAND_STYLES: Record<string, { bg: string; name: string }> = {
  google: { bg: 'from-blue-600 to-blue-800', name: 'Google' },
  icloud: { bg: 'from-slate-600 to-slate-900', name: 'iCloud' },
  mi: { bg: 'from-orange-500 to-orange-600', name: 'Mi Account' },
  samsung: { bg: 'from-blue-900 to-indigo-950', name: 'Samsung' },
  huawei: { bg: 'from-red-600 to-red-800', name: 'Huawei' },
  instagram: { bg: 'from-yellow-500 via-red-500 to-purple-600', name: 'Instagram' },
  telegram: { bg: 'from-sky-400 to-blue-600', name: 'Telegram' },
  facebook: { bg: 'from-blue-600 to-blue-800', name: 'Facebook' },
  microsoft: { bg: 'from-gray-600 to-gray-800', name: 'Microsoft' },
  yandex: { bg: 'from-red-500 to-yellow-500', name: 'Yandex' },
  boshqa: { bg: 'from-gray-500 to-gray-700', name: 'Boshqa' },
}
const BRAND_LIST = Object.keys(BRAND_STYLES)

interface Account { id: number; type: string; login: string; password: string; firstName: string; lastName: string; phone: string; birthYear: string; createdDate: string; note: string }
const KEY = 'faststore_accounts_data'

export default function AccountsPage() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [visiblePw, setVisiblePw] = useState<Record<number, boolean>>({})
  const [detail, setDetail] = useState<Account | null>(null)
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ type: 'google', login: '', password: '', firstName: '', lastName: '', phone: '+998', birthYear: '', createdDate: new Date().toISOString().split('T')[0], note: '' })

  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setAccounts(JSON.parse(s)) } catch {} }, [])
  const save = (list: Account[]) => { setAccounts(list); localStorage.setItem(KEY, JSON.stringify(list)) }

  const filtered = accounts.filter(a => (a.login || '').toLowerCase().includes(search.toLowerCase()) || (a.firstName || '').toLowerCase().includes(search.toLowerCase()))

  const openAdd = () => { setEditId(null); setForm({ type: 'google', login: '', password: '', firstName: '', lastName: '', phone: '+998', birthYear: '', createdDate: new Date().toISOString().split('T')[0], note: '' }); setModal(true) }
  const openEdit = (a: Account) => { setEditId(a.id); setForm({ type: a.type, login: a.login, password: a.password, firstName: a.firstName, lastName: a.lastName, phone: a.phone, birthYear: a.birthYear, createdDate: a.createdDate, note: a.note }); setModal(true) }

  const handleSave = () => {
    if (!form.login || !form.password || !form.firstName) { alert('Login, parol va ism kerak!'); return }
    if (editId) { save(accounts.map(a => a.id === editId ? { ...a, ...form } : a)) }
    else { save([{ id: Date.now(), ...form }, ...accounts]) }
    setModal(false)
  }

  const deleteAcc = (id: number) => { if (confirm("O'chirilsinmi?")) save(accounts.filter(a => a.id !== id)) }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 min-h-full" style={{ background: '#f2f2f7' }}>
        <div className="mb-5">
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Akkountlar</h1>
          <p className="text-[15px] text-gray-500 mt-0.5">{filtered.length} ta akkount</p>
        </div>

        <button onClick={openAdd}
          className="w-full py-3.5 rounded-2xl font-semibold text-[15px] text-white mb-5 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all" style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)' }}>
          + Yangi akkount
        </button>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all" />
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-10 text-center border border-gray-200/60">
            <div className="text-4xl mb-3">🔐</div>
            <div className="font-semibold text-gray-900">Akkount topilmadi</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(acc => {
              const style = BRAND_STYLES[acc.type] || BRAND_STYLES.boshqa
              const isPwVisible = visiblePw[acc.id]
              return (
                <div key={acc.id} className={`bg-gradient-to-br ${style.bg} text-white p-5 rounded-2xl shadow-lg relative overflow-hidden min-h-[190px] flex flex-col justify-between active:scale-[0.98] transition-all`}>
                  {/* Shaffof bezak */}
                  <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute -left-6 -top-6 w-20 h-20 bg-white/5 rounded-full blur-lg" />

                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="text-[10px] opacity-60 uppercase tracking-widest">FastStore</p>
                      <h3 className="text-[15px] font-bold mt-0.5">{style.name}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-semibold">{acc.type.toUpperCase()}</div>
                  </div>

                  <div className="my-3 z-10">
                    <p className="text-[10px] opacity-60">Login</p>
                    <p className="text-[13px] font-mono truncate">{acc.login}</p>
                    <p className="text-[10px] opacity-60 mt-1.5">Parol</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-mono flex-1 truncate">{isPwVisible ? acc.password : '••••••••'}</span>
                      <button onClick={() => setVisiblePw(p => ({ ...p, [acc.id]: !p[acc.id] }))} className="w-6 h-6 bg-white/20 backdrop-blur rounded-md flex items-center justify-center text-[10px]">
                        {isPwVisible ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/20 pt-2 z-10">
                    <button onClick={() => setDetail(acc)} className="text-[11px] bg-white/20 backdrop-blur hover:bg-white/30 px-2.5 py-1.5 rounded-lg font-medium transition">ℹ️ Batafsil</button>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(acc)} className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center text-[11px]">✏️</button>
                      <button onClick={() => deleteAcc(acc.id)} className="w-7 h-7 bg-red-500/30 rounded-md flex items-center justify-center text-[11px]">🗑️</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Detail Modal */}
        {detail && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setDetail(null)}>
            <div className="bg-white/90 backdrop-blur-2xl w-full max-w-md rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-gray-300" /></div>
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200/60">
                <button onClick={() => setDetail(null)} className="text-[16px] text-blue-500 font-medium">Yopish</button>
                <span className="text-[16px] font-bold text-gray-900">{(BRAND_STYLES[detail.type] || BRAND_STYLES.boshqa).name}</span>
                <div className="w-12" />
              </div>
              <div className="p-6">
                <div className="bg-gray-100/80 backdrop-blur rounded-2xl overflow-hidden">
                  {[['Ism', detail.firstName], ['Familiya', detail.lastName], ['Telefon', detail.phone], ["Tug'ilgan yil", detail.birthYear], ['Ochilgan', detail.createdDate], ['Login', detail.login]].map(([k, v], i, arr) => (
                    <div key={k as string} className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? 'border-b border-gray-200/60' : ''}`}>
                      <span className="text-[14px] text-gray-500">{k}</span>
                      <span className="text-[14px] font-medium text-gray-900">{v || '—'}</span>
                    </div>
                  ))}
                </div>
                {detail.note && <div className="mt-4 bg-gray-100/80 backdrop-blur rounded-2xl px-4 py-3"><p className="text-[13px] text-gray-500 mb-1">Izoh:</p><p className="text-[14px] text-gray-700">{detail.note}</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={() => setModal(false)}>
            <div className="bg-white/90 backdrop-blur-2xl w-full max-w-md rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1 rounded-full bg-gray-300" /></div>
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200/60 flex-shrink-0">
                <button onClick={() => setModal(false)} className="text-[16px] text-blue-500 font-medium">Bekor</button>
                <span className="text-[16px] font-bold text-gray-900">{editId ? 'Tahrirlash' : 'Yangi Akkount'}</span>
                <button onClick={handleSave} className="text-[16px] text-blue-500 font-bold">Saqlash</button>
              </div>
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                {/* Type select */}
                <div>
                  <label className="block text-[13px] font-semibold text-blue-500 mb-2">Tur</label>
                  <div className="grid grid-cols-4 gap-2">
                    {BRAND_LIST.map(type => (
                      <button key={type} onClick={() => setForm(f => ({ ...f, type }))}
                        className={`py-2 rounded-xl text-[11px] font-semibold transition-all ${form.type === type ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100/80 text-gray-600'}`}>
                        {(BRAND_STYLES[type] || BRAND_STYLES.boshqa).name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Login / Email</label><input type="text" value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))} placeholder="email@example.com" className="w-full bg-gray-100/80 backdrop-blur border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
                <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Parol</label><input type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Parol" className="w-full bg-gray-100/80 backdrop-blur border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 font-mono outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Ism</label><input type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Ism" className="w-full bg-gray-100/80 border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
                  <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Familiya</label><input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Familiya" className="w-full bg-gray-100/80 border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
                </div>
                <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Telefon</label><input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998..." className="w-full bg-gray-100/80 border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Tug'ilgan yil</label><input type="text" value={form.birthYear} onChange={e => setForm(f => ({ ...f, birthYear: e.target.value }))} placeholder="1995" className="w-full bg-gray-100/80 border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
                  <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Ochilgan sana</label><input type="date" value={form.createdDate} onChange={e => setForm(f => ({ ...f, createdDate: e.target.value }))} className="w-full bg-gray-100/80 border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
                </div>
                <div><label className="block text-[13px] font-semibold text-blue-500 mb-1.5">Izoh</label><input type="text" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Qaysi qurilma uchun..." className="w-full bg-gray-100/80 border-0 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30" /></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}