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
    onSave({ kod: kod.trim(), nomi: nomi.trim(), kategoriya, birlik, miqdor: +miqdor || 0, narx_usd: +narx || 0, chegirma: +chegirma || 0, rasm_url: rasm })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-indigo-900/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(59,130,246,0.3)]" onClick={e => e.stopPropagation()}>

        {/* Gradient top line */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 flex-shrink-0" />

        {/* Header */}
        <div className="flex-shrink-0 px-7 py-5 bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-b border-blue-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/40">
                {isEdit ? '✏️' : '📦'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                </h3>
                <p className="text-xs text-blue-300/70">Barcha maydonlarni to'ldiring</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/30 hover:border-red-500/50 transition-all text-lg">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#0f172a] p-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

            {/* ─── LEFT COLUMN ─── */}
            <div className="space-y-5">

              {/* Rasm yuklash */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">📷 Mahsulot rasmi</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    dragOver ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]' : rasm ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-600 hover:border-blue-400 hover:bg-blue-500/5'
                  }`}
                >
                  {rasm ? (
                    <div className="relative">
                      <img src={rasm} alt="" className="w-full h-44 object-contain rounded-xl" />
                      <button onClick={e => { e.stopPropagation(); setRasm(null) }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white text-sm flex items-center justify-center shadow-xl hover:bg-red-600 transition-colors">✕</button>
                      <div className="absolute bottom-2 left-2 px-3 py-1 bg-green-500/90 text-white text-[10px] font-bold rounded-full">✓ Yuklandi</div>
                    </div>
                  ) : (
                    <div className="py-5">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-3xl">📷</div>
                      <div className="text-sm font-semibold text-blue-300">Rasm yuklash</div>
                      <div className="text-xs text-slate-500 mt-1">Bosing yoki shu yerga tashlang</div>
                      <div className="text-[10px] text-slate-600 mt-2">JPG, PNG, WEBP — 5MB gacha</div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0] || null)} />
              </div>

              {/* Kod */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">🏷️ Mahsulot kodi</label>
                <input type="text" value={kod} onChange={e => setKod(e.target.value)} placeholder="SM-A54, IP-15..."
                  className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-blue-100 font-mono placeholder-slate-600 outline-none focus:border-blue-500 focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all" />
              </div>

              {/* Nomi */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">📦 Mahsulot nomi</label>
                <input type="text" value={nomi} onChange={e => setNomi(e.target.value)} placeholder="Samsung Galaxy A54..."
                  className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-blue-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all" />
              </div>

              {/* Kategoriya + Birlik */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">📂 Kategoriya</label>
                  <select value={kategoriya} onChange={e => setKategoriya(e.target.value)}
                    className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-blue-100 outline-none focus:border-blue-500 transition-all">
                    {KATEGORIYALAR.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">📏 Birlik</label>
                  <select value={birlik} onChange={e => setBirlik(e.target.value)}
                    className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-blue-100 outline-none focus:border-blue-500 transition-all">
                    {BIRLIKLAR.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN ─── */}
            <div className="space-y-5">

              {/* Miqdor */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">📊 Miqdor (omborda)</label>
                <input type="number" value={miqdor} onChange={e => setMiqdor(e.target.value)} placeholder="0" min="0"
                  className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-blue-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all" />
              </div>

              {/* Narx USD */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">💲 Narx (USD)</label>
                <input type="number" value={narx} onChange={e => setNarx(e.target.value)} placeholder="0" min="0" step="0.01"
                  className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-blue-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all" />
                {+narx > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2">
                    <span>💱</span>
                    <span className="font-semibold">{narxSom.toLocaleString()} so'm</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-blue-300">${(+narx).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Chegirma */}
              <div>
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">🏷️ Chegirma (%)</label>
                <input type="number" value={chegirma} onChange={e => setChegirma(e.target.value)} placeholder="0" min="0" max="100"
                  className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-4 py-3 text-sm text-blue-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all" />
              </div>

              {/* Narx kalkulyator */}
              {(+narx > 0) && (
                <div className="rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/10">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5">
                    <div className="text-xs font-bold text-white uppercase tracking-widest">💰 Narx Kalkulyatori</div>
                  </div>
                  <div className="bg-slate-800/90 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Asl narx:</span>
                      <span className="text-sm font-bold text-blue-200">{Math.round((+narx) * RATE).toLocaleString()} <span className="text-blue-400/60 text-xs">so'm</span></span>
                    </div>
                    {+chegirma > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Chegirma:</span>
                          <span className="text-sm font-bold text-red-400">−{+chegirma}%</span>
                        </div>
                        <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                          <span className="text-xs text-slate-400">Yakuniy narx:</span>
                          <span className="text-xl font-black text-cyan-400">{Math.round(chegirmaliNarx * RATE).toLocaleString()} <span className="text-cyan-400/60 text-xs">so'm</span></span>
                        </div>
                      </>
                    )}
                    {+miqdor > 0 && (
                      <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                        <span className="text-xs text-slate-400">Umumiy ({miqdor} {birlik}):</span>
                        <span className="text-sm font-bold text-emerald-400">{Math.round(chegirmaliNarx * (+miqdor) * RATE).toLocaleString()} <span className="text-emerald-400/60 text-xs">so'm</span></span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-7 py-5 bg-[#0f172a] border-t border-slate-800 flex gap-4">
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60">
            {loading ? '⏳ Saqlanmoqda...' : isEdit ? '✅ Yangilash' : '➕ Mahsulot qo\'shish'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-3.5 bg-slate-800 border-2 border-slate-700 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-700 transition-all">
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  )
}