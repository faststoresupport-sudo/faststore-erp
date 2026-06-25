'use client'

interface Props { kategoriyalar: string[]; selectedKategoriya: string; onKategoriyaChange: (v: string) => void }

export function ProductFilters({ kategoriyalar, selectedKategoriya, onKategoriyaChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {kategoriyalar.map(kat => (
        <button key={kat} onClick={() => onKategoriyaChange(kat)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedKategoriya === kat ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'}`}>
          {kat}
        </button>
      ))}
    </div>
  )
}