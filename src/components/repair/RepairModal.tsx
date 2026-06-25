'use client'
import type { RepairOrder, Customer } from '@/types'
interface Props { order: RepairOrder | null; customers: Customer[]; onClose: () => void; onSave: (d: Partial<RepairOrder>) => void; loading: boolean }
export function RepairModal({ order, onClose, onSave, loading }: Props) {
  return <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md" onClick={e=>e.stopPropagation()}><h3 className="text-lg font-bold mb-4">{order?'Buyurtmani tahrirlash':'Yangi buyurtma'}</h3><p className="text-gray-500 text-sm">Modal tarkibi (to'ldiriladi)</p><div className="flex gap-3 mt-6"><button onClick={onClose} className="flex-1 py-2 border rounded-lg text-sm font-medium">Bekor</button><button onClick={()=>onSave({})} disabled={loading} className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold">Saqlash</button></div></div></div>
}