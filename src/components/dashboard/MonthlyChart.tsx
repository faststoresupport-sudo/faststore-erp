'use client'

export function MonthlyChart() {
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn']
  const values = [32, 55, 28, 76, 48, 92]
  const max = Math.max(...values)

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">📊 Oylik Sotuvlar</h3>
      <p className="text-xs text-gray-400 mb-6">So'nggi 6 oy</p>
      <div className="flex items-end gap-3 h-[140px]">
        {months.map((month, i) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-[10px] text-gray-400">{values[i]}</div>
            <div
              className={`w-full rounded-t-md transition-all ${
                i === months.length - 1 
                  ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/30' 
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}
              style={{ height: `${(values[i] / max) * 100}%` }}
            />
            <div className={`text-[10px] ${i === months.length - 1 ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>
              {month}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}