'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function ReportsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('umumiy')

  // localStorage dan ma'lumotlarni olish
  const [data, setData] = useState({ products: 0, customers: 0, repairs: 0, purchases: 0, cash_kirim: 0, cash_chiqim: 0, debts: 0, defects: 0 })

  useEffect(() => {
    try {
      const products = JSON.parse(localStorage.getItem('faststore_products') || '[]')
      const customers = JSON.parse(localStorage.getItem('faststore_customers') || '[]')
      const repairs = JSON.parse(localStorage.getItem('faststore_repairs') || '[]')
      const purchases = JSON.parse(localStorage.getItem('faststore_purchases') || '[]')
      const cash = JSON.parse(localStorage.getItem('faststore_cash') || '[]')
      const debts = JSON.parse(localStorage.getItem('faststore_debts') || '[]')
      const defects = JSON.parse(localStorage.getItem('faststore_defects') || '[]')

      setData({
        products: products.length,
        customers: customers.length,
        repairs: repairs.length,
        purchases: purchases.length,
        cash_kirim: cash.filter((c: any) => c.tur === 'Kirim').reduce((s: number, c: any) => s + (c.summa || 0), 0),
        cash_chiqim: cash.filter((c: any) => c.tur === 'Chiqim').reduce((s: number, c: any) => s + (c.summa || 0), 0),
        debts: debts.reduce((s: number, d: any) => s + ((d.jami || 0) - (d.tolangan || 0)), 0),
        defects: defects.length,
      })
    } catch {}
  }, [])

  const RATE = 12700
  const balans = data.cash_kirim - data.cash_chiqim

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Hisobotlar</h1><p className="text-sm text-gray-500 mt-1">Biznes tahlili va statistika</p></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 w-fit shadow-sm">
          {[{ k: 'umumiy', l: '📊 Umumiy' }, { k: 'moliya', l: '💰 Moliya' }, { k: 'ombor', l: '📦 Ombor' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === t.k ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>{t.l}</button>
          ))}
        </div>

        {/* Umumiy */}
        {tab === 'umumiy' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { l: 'Mahsulotlar', v: data.products + ' ta', c: 'text-blue-600', i: '📦', border: 'border-t-blue-500' },
                { l: 'Xaridorlar', v: data.customers + ' ta', c: 'text-purple-600', i: '👥', border: 'border-t-purple-500' },
                { l: 'Tamirlash', v: data.repairs + ' ta', c: 'text-orange-600', i: '🔧', border: 'border-t-orange-500' },
                { l: 'Xaridlar', v: data.purchases + ' ta', c: 'text-green-600', i: '📥', border: 'border-t-green-500' },
                { l: 'Kirim', v: Math.round(data.cash_kirim * RATE).toLocaleString() + " so'm", c: 'text-green-600', i: '⬆️', border: 'border-t-green-500' },
                { l: 'Chiqim', v: Math.round(data.cash_chiqim * RATE).toLocaleString() + " so'm", c: 'text-red-600', i: '⬇️', border: 'border-t-red-500' },
                { l: 'Qarzlar', v: Math.round(data.debts * RATE).toLocaleString() + " so'm", c: 'text-red-600', i: '📋', border: 'border-t-red-500' },
                { l: 'Braklar', v: data.defects + ' ta', c: 'text-orange-600', i: '🔴', border: 'border-t-orange-500' },
              ].map((s, i) => (
                <div key={i} className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm border-t-4 ${s.border}`}>
                  <div className="text-xl mb-2">{s.i}</div>
                  <div className="text-xs text-gray-400 uppercase mb-1">{s.l}</div>
                  <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moliya */}
        {tab === 'moliya' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm border-t-4 border-t-green-500">
                <div className="text-xs text-gray-400 uppercase mb-2">⬆️ Jami Kirim</div>
                <div className="text-2xl font-bold text-green-600">{Math.round(data.cash_kirim * RATE).toLocaleString()} so'm</div>
                <div className="text-xs text-gray-400 mt-1">${data.cash_kirim.toFixed(2)}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm border-t-4 border-t-red-500">
                <div className="text-xs text-gray-400 uppercase mb-2">⬇️ Jami Chiqim</div>
                <div className="text-2xl font-bold text-red-600">{Math.round(data.cash_chiqim * RATE).toLocaleString()} so'm</div>
                <div className="text-xs text-gray-400 mt-1">${data.cash_chiqim.toFixed(2)}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm border-t-4 border-t-blue-500">
                <div className="text-xs text-gray-400 uppercase mb-2">💼 Sof Foyda</div>
                <div className={`text-2xl font-bold ${balans >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(balans * RATE).toLocaleString()} so'm</div>
                <div className="text-xs text-gray-400 mt-1">${balans.toFixed(2)}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">📋 Qarz holati</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="text-xs text-red-500 uppercase mb-1">Jami qarz</div>
                  <div className="text-xl font-bold text-red-600">{Math.round(data.debts * RATE).toLocaleString()} so'm</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ombor */}
        {tab === 'ombor' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm border-t-4 border-t-blue-500">
                <div className="text-xs text-gray-400 uppercase mb-2">📦 Mahsulot turlari</div>
                <div className="text-2xl font-bold text-blue-600">{data.products} ta</div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm border-t-4 border-t-green-500">
                <div className="text-xs text-gray-400 uppercase mb-2">📥 Kirim (xaridlar)</div>
                <div className="text-2xl font-bold text-green-600">{data.purchases} ta</div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm border-t-4 border-t-red-500">
                <div className="text-xs text-gray-400 uppercase mb-2">🔴 Brak / Qaytarish</div>
                <div className="text-2xl font-bold text-red-600">{data.defects} ta</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">💡 Tavsiya</h3>
              <p className="text-sm text-gray-500">Barcha ma'lumotlar localStorage'da saqlanmoqda. Real backend ulanganda bu sahifa avtomatik yangilanadi.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}