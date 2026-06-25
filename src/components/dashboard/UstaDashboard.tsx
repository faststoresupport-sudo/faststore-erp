'use client'

export function UstaDashboard() {
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: '📋', label: 'Jami', value: '16 ta', color: 'text-blue-600' },
          { icon: '📥', label: 'Yangi', value: '5 ta', color: 'text-gray-600' },
          { icon: '🔧', label: 'Jarayonda', value: '8 ta', color: 'text-orange-500' },
          { icon: '✅', label: 'Tayyor', value: '3 ta', color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xs text-gray-400 uppercase">{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Repairs */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔧 Faol Buyurtmalar</h3>
        <div className="space-y-3">
          {[
            { device: 'Samsung Galaxy A54', issue: 'Ekran singan', status: 'tamirlashda', customer: 'Aliyev Bobur' },
            { device: 'iPhone 12', issue: 'Batareya muammo', status: 'diagnostika', customer: 'Toshmatov Sanjar' },
            { device: 'Samsung TV 55"', issue: 'Ovoz yo\'q', status: 'tayyor', customer: 'Karimova Nilufar' },
          ].map((repair, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{repair.device}</div>
                <div className="text-xs text-gray-500">{repair.customer} · {repair.issue}</div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                repair.status === 'tayyor' ? 'bg-green-100 text-green-700' :
                repair.status === 'tamirlashda' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {repair.status === 'tayyor' ? '✅ Tayyor' :
                 repair.status === 'tamirlashda' ? '🔧 Tamirlashda' : '🔍 Diagnostika'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}