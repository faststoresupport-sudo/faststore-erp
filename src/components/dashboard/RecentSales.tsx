'use client'

export function RecentSales() {
  const sales = [
    { customer: 'Aliyev Bobur', amount: '504,000', time: '10 daqiqa oldin', status: 'paid' },
    { customer: 'Karimova Dilnoza', amount: '17,500', time: '1 soat oldin', status: 'paid' },
    { customer: 'Toshmatov Jasur', amount: '935,000', time: '2 soat oldin', status: 'debt' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📈 So'nggi Sotuvlar</h3>
      <div className="space-y-3">
        {sales.map((sale, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{sale.customer}</p>
              <p className="text-xs text-gray-500">{sale.time}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600 dark:text-green-400 text-sm">{sale.amount} so'm</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                sale.status === 'paid' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {sale.status === 'paid' ? 'To\'langan' : 'Qarz'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}