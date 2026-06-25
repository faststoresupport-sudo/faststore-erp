'use client'

export function QuickActions() {
  const actions = [
    { label: 'Yangi sotuv', icon: '🛒', href: '/sales', color: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Mahsulot qo\'shish', icon: '📦', href: '/products', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { label: 'Hisobotlar', icon: '📊', href: '/reports', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { label: 'Sozlamalar', icon: '⚙️', href: '/settings', color: 'bg-gray-50 border-gray-200 text-gray-700' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">⚡ Tez Amallar</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${action.color} hover:shadow-sm transition-all`}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="font-medium text-sm">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}