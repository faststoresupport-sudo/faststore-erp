'use client'
import type { Sale, Customer } from '@/types'
interface Props { sale?: Sale; customers: Customer[]; onClose: () => void; onSave: (d: Partial<Sale>) => void; loading: boolean }
export function SaleModal({ sale, customers, onClose, onSave, loading }: Props) {
  return <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg" onClick={e=>e.stopPropagation()}><h3 className="text-lg font-bold mb-4">{sale?'Tahrirlash':'Yangi sotuv'}</h3><p className="text-gray-500 text-sm">Modal tarkibi</p><div className="flex gap-3 mt-6"><button onClick={onClose} className="flex-1 py-2 border rounded-lg text-sm font-medium">Bekor</button><button onClick={()=>onSave({})} disabled={loading} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">Saqlash</button></div></div></div>
}