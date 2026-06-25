'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Debt { id: number; mijoz: string; telefon: string; sana: string; jami: number; tolangan: number; izoh: string }

const STORAGE_KEY = 'faststore_debts'

export default function DebtsPage() {
  const { user } = useAuth()
  const [debts, setDebts] = useState<Debt[]>([])
  const [modal, setModal] = useState<null | 'add' | 'pay'>(null)
  const [payDebt, setPayDebt] = useState<Debt | null>(null)
  const [payAmount, setPayAmount] = useState(0)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ mijoz: '', telefon: '+998', jami: 0, izoh: '' })

  useEffect(() => { try { const s = localStorage.getItem(STORAGE_KEY); if (s) setDebts(JSON.parse(s)) } catch {} }, [])
  const save = (list: Debt[]) => { setDebts(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) }

  const totalQarz = debts.reduce((s, d) => s + (d.jami - d.tolangan), 0)
  const filtered = debts.filter(d => (d.mijoz || '').toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    if (!form.mijoz || !form.jami) { alert('Mijoz va summa majburiy!'); return }
    save([...debts, { id: Date.now(), mijoz: form.mijoz, telefon: form.telefon, sana: new Date().toISOString().split('T')[0], jami: +form.jami, tolangan: 0, izoh: form.izoh }])
    setModal(null); setForm({ mijoz: '', telefon: '+998', jami: 0, izoh: '' })
  }

  const handlePay = () => {
    if (!payDebt || payAmount <= 0) return
    save(debts.map(d => d.id === payDebt.id ? { ...d, tolangan: Math.min(d.jami, d.tolangan + payAmount) } : d))
    setModal(null); setPayDebt(null); setPayAmount(0)
  }

  const handleDelete = (id: number) => { if (confirm("O'chirilsinmi?")) save(debts.filter(d => d.id !== id)) }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Qarzdorlar</h1><p className="text-sm text-gray-500 mt-1">{debts.filter(d => d.jami > d.tolangan).length} ta qarzdor · Jami qarz: {Math.round(totalQarz * 12700).toLocaleString()} so'm</p></div>
          <button onClick={() => { setForm({ mijoz: '', telefon: '+998', jami: 0, izoh: '' }); setModal('add') }} className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/30 transition-all">➕ Yangi qarz</button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm border-t-4 border-t-red-500"><div className="text-xs text-gray-400 uppercase mb-1">💸 Jami qarz</div><div className="text-xl font-bold text-red-600">{Math.round(totalQarz * 12700).toLocaleString()} so'm</div></div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm border-t-4 border-t-orange-500"><div className="text-xs text-gray-400 uppercase mb-1">👥 Qarzdorlar</div><div className="text-xl font-bold text-orange-600">{debts.filter(d => d.jami > d.tolangan).length} ta</div></div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm border-t-4 border-t-green-500"><div className="text-xs text-gray-400 uppercase mb-1">✅ To'liq to'lagan</div><div className="text-xl font-bold text-green-600">{debts.filter(d => d.jami <= d.tolangan).length} ta</div></div>
        </div>

        <div className="mb-6 relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Mijoz nomi..." className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm" /></div>

        {filtered.length === 0 ? (
          <div className="card p-10 text-center"><div className="text-4xl mb-3">📋</div><p className="font-bold">Qarzdor topilmadi</p></div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 dark:bg-gray-700/50">{['Sana', 'Mijoz', 'Telefon', 'Jami', "To'langan", 'Qoldiq', 'Amal'].map(c => <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{c}</th>)}</tr></thead>
              <tbody>{filtered.map(d => { const qoldiq = d.jami - d.tolangan; return (
                <tr key={d.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400 text-xs">{d.sana}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{d.mijoz}</td>
                  <td className="px-4 py-3 text-blue-600 text-xs">{d.telefon}</td>
                  <td className="px-4 py-3 font-bold">{Math.round(d.jami * 12700).toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{Math.round(d.tolangan * 12700).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`font-bold ${qoldiq > 0 ? 'text-red-600' : 'text-green-600'}`}>{Math.round(qoldiq * 12700).toLocaleString()}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1.5">{qoldiq > 0 && <button onClick={() => { setPayDebt(d); setPayAmount(0); setModal('pay') }} className="text-xs px-2.5 py-1.5 bg-green-100 text-green-700 rounded-lg font-bold">💵 To'lov</button>}<button onClick={() => handleDelete(d.id)} className="w-7 h-7 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-xs">🗑️</button></div></td>
                </tr>
              )})}</tbody>
            </table>
          </div>
        )}

        {/* Add Modal */}
        {modal === 'add' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"><h3 className="text-lg font-bold">➕ Yangi qarz</h3><button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">✕</button></div>
              <div className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">👤 Mijoz</label><input type="text" value={form.mijoz} onChange={e => setForm(f => ({ ...f, mijoz: e.target.value }))} placeholder="Ism Familiya" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📞 Telefon</label><input type="tel" value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">💲 Qarz summasi (USD)</label><input type="number" value={form.jami || ''} onChange={e => setForm(f => ({ ...f, jami: +e.target.value }))} min="0" className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />{+form.jami > 0 && <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">= {Math.round((+form.jami) * 12700).toLocaleString()} so'm</div>}</div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">📝 Izoh</label><input type="text" value={form.izoh} onChange={e => setForm(f => ({ ...f, izoh: e.target.value }))} placeholder="Sabab..." className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" /></div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3"><button onClick={handleAdd} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold text-sm shadow-lg">💾 Saqlash</button><button onClick={() => setModal(null)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600">Bekor</button></div>
            </div>
          </div>
        )}

        {/* Pay Modal */}
        {modal === 'pay' && payDebt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700"><h3 className="text-lg font-bold">💵 To'lov — {payDebt.mijoz}</h3></div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Jami qarz:</span><span className="font-bold">{Math.round(payDebt.jami * 12700).toLocaleString()} so'm</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">To'langan:</span><span className="font-bold text-green-600">{Math.round(payDebt.tolangan * 12700).toLocaleString()} so'm</span></div>
                  <div className="flex justify-between border-t pt-2"><span className="text-gray-500">Qoldiq:</span><span className="font-bold text-red-600">{Math.round((payDebt.jami - payDebt.tolangan) * 12700).toLocaleString()} so'm</span></div>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">💲 To'lov summasi (USD)</label><input type="number" value={payAmount || ''} onChange={e => setPayAmount(+e.target.value)} min="0" max={payDebt.jami - payDebt.tolangan} className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white" />{payAmount > 0 && <div className="mt-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">= {Math.round(payAmount * 12700).toLocaleString()} so'm</div>}</div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3"><button onClick={handlePay} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg">✅ To'lovni qayd etish</button><button onClick={() => setModal(null)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-600">Bekor</button></div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}