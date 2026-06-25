'use client'
interface Props { statusFilter: string; onStatusChange: (v: string) => void; dateFilter: string; onDateChange: (v: string) => void }
export function SalesFilters({ statusFilter, onStatusChange }: Props) {
  return <div className="flex gap-2">{['Barchasi','To\'langan','Qarz'].map(f=><button key={f} onClick={()=>onStatusChange(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${statusFilter===f?'bg-blue-500 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{f}</button>)}</div>
}