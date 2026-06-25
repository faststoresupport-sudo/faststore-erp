'use client'
interface Props { statusFilter: string; onStatusChange: (v: string) => void; statuses: any[] }
export function RepairFilters({ statusFilter, onStatusChange, statuses }: Props) {
  return <div className="flex gap-2 flex-wrap"><button onClick={()=>onStatusChange('barchasi')} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusFilter==='barchasi'?'bg-blue-500 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>Barchasi</button>{statuses.map(s=><button key={s.value} onClick={()=>onStatusChange(s.value)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusFilter===s.value?'bg-blue-500 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{s.label}</button>)}</div>
}