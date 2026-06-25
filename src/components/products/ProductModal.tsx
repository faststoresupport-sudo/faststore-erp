'use client'

import { useState, useRef } from 'react'
import type { Product } from '@/types'

const KATEGORIYALAR = ['Elektronika', 'Aksesuar', 'Zapchast', 'Kiyim', 'Oziq-ovqat', 'Boshqa']
const BIRLIKLAR = ['dona', 'juft', 'kg', 'litr', 'quti', 'metr']
const RATE = 12700

interface Props {
  product: Product | null
  onClose: () => void
  onSave: (data: Partial<Product>) => void
  loading: boolean
  kategoriyalar?: string[]
}

export function ProductModal({ product, onClose, onSave, loading }: Props) {
  const isEdit = !!product
  const fileRef = useRef<HTMLInputElement>(null)

  const [kod, setKod] = useState(product?.kod || '')
  const [nomi, setNomi] = useState(product?.nomi || '')
  const [kategoriya, setKategoriya] = useState(product?.kategoriya || 'Elektronika')
  const [birlik, setBirlik] = useState(product?.birlik || 'dona')
  const [miqdor, setMiqdor] = useState(String(product?.miqdor || 0))
  const [narx, setNarx] = useState(String(product?.narx_usd || 0))
  const [chegirma, setChegirma] = useState(String(product?.chegirma || 0))
  const [rasm, setRasm] = useState<string | null>(product?.rasm_url || null)
  const [dragOver, setDragOver] = useState(false)

  const narxSom = Math.round((+narx || 0) * RATE)
  const chegirmaliNarx = (+narx || 0) * (1 - (+chegirma || 0) / 100)

  function handleFile(file: File | null) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setRasm(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!kod.trim()) { alert('Kod majburiy!'); return }
    if (!nomi.trim()) { alert('Nomi majburiy!'); return }
    if (+narx <= 0) { alert('Narx kiriting!'); return }

    onSave({
      kod: kod.trim(),
      nomi: nomi.trim(),
      kategoriya,
      birlik,
      miqdor: +miqdor || 0,
      narx_usd: +narx || 0,
      chegirma: +chegirma || 0,
      rasm_url: rasm,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/30">
                {isEdit ? '✏️' : '📦'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                </h3>
                <p className="text-xs text-gray-500">Barcha maydonlarni to'ldiring</p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 transition-all">✕</button>
          </div>
        </div>

        {/* Body - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT COLUMN */}
            <div className="space-y-4">

              {/* Rasm yuklash */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📷 Mahsulot rasmi</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    dragOver ? 'border-blue-500 bg-blue-50' : rasm ? 'border-green-300 bg-green-50/30' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  {rasm ? (
                    <div className="relative">
                      <img src={rasm} alt="" className="w-full h-40 object-contain rounded-xl" />
                      <button onClick={e => { e.stopPropagation(); setRasm(null) }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-lg hover:bg-red-600">✕</button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="text-4xl mb-3">📷</div>
                      <div className="text-sm font-medium text-gray-600">Rasm yuklash</div>
                      <div className="text-xs text-gray-400 mt-1">Bosing yoki shu yerga tashlang</div>
                      <div className="text-[10px] text-gray-300 mt-2">JPG, PNG, WEBP — 5MB gacha</div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0] || null)} />
              </div>

              {/* Kod */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">🏷️ Mahsulot kodi</label>
                <input type="text" value={kod} onChange={e => setKod(e.target.value)} placeholder="SM-A54, IP-15..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-blue-500 transition-all" />
              </div>

              {/* Nomi */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📦 Mahsulot nomi</label>
                <input type="text" value={nomi} onChange={e => setNomi(e.target.value)} placeholder="Samsung Galaxy A54..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>

              {/* Kategoriya + Birlik */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📂 Kategoriya</label>
                  <select value={kategoriya} onChange={e => setKategoriya(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all">
                    {KATEGORIYALAR.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📏 Birlik</label>
                  <select value={birlik} onChange={e => setBirlik(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all">
                    {BIRLIKLAR.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">

              {/* Miqdor */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">📊 Miqdor (omborda)</label>
                <input type="number" value={miqdor} onChange={e => setMiqdor(e.target.value)} placeholder="0" min="0"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>

              {/* Narx USD */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">💲 Narx (USD)</label>
                <input type="number" value={narx} onChange={e => setNarx(e.target.value)} placeholder="0" min="0" step="0.01"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                {+narx > 0 && (
                  <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    💱 {narxSom.toLocaleString()} so'm <span className="text-gray-300">|</span> ${(+narx).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Chegirma */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">🏷️ Chegirma (%)</label>
                <input type="number" value={chegirma} onChange={e => setChegirma(e.target.value)} placeholder="0" min="0" max="100"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>

              {/* Narx summary */}
              {(+narx > 0) && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 rounded-2xl p-4 border border-blue-100 dark:border-gray-600">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">💰 Narx Kalkulyatori</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Asl narx:</span>
                      <span className="font-bold">{Math.round((+narx) * RATE).toLocaleString()} so'm</span>
                    </div>
                    {+chegirma > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Chegirma:</span>
                          <span className="font-bold text-red-500">-{+chegirma}%</span>
                        </div>
                        <div className="border-t border-blue-200 dark:border-gray-600 pt-2 flex justify-between text-sm">
                          <span className="text-gray-500">Yakuniy narx:</span>
                          <span className="font-black text-lg text-blue-600">{Math.round(chegirmaliNarx * RATE).toLocaleString()} so'm</span>
                        </div>
                      </>
                    )}
                    {+miqdor > 0 && (
                      <div className="border-t border-blue-200 dark:border-gray-600 pt-2 flex justify-between text-sm">
                        <span className="text-gray-500">Umumiy qiymati:</span>
                        <span className="font-bold text-green-600">{Math.round(chegirmaliNarx * (+miqdor) * RATE).toLocaleString()} so'm</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex gap-3">
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-60">
            {loading ? '⏳ Saqlanmoqda...' : isEdit ? '✅ Yangilash' : '➕ Mahsulot qo\'shish'}
          </button>
          <button onClick={onClose} className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            Bekor
          </button>
        </div>
      </div>
    </div>
  )
}