'use client'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  icon: string
  color: string
  trend?: { value: string; positive: boolean }
}

export function StatsCard({ title, value, subtitle, icon, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.positive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>{trend.value}</span>
          )}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}