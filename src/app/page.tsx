'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoginPage } from '@/components/auth/LoginPage'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Dashboard Content */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                📊 Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Salom, {user.ism}! 👋 Biznesingizni boshqaring
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                ⚡ FastStore ERP v3.0
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Mahsulotlar', value: '156 tur', icon: '📦', color: 'blue' },
            { title: 'Sotuvlar', value: '2.4M so\'m', icon: '💰', color: 'green' },
            { title: 'Mijozlar', value: '89 ta', icon: '👥', color: 'purple' },
            { title: 'Buyurtmalar', value: '23 ta', icon: '📋', color: 'orange' },
          ].map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📈 So'nggi Sotuvlar
            </h3>
            <div className="space-y-3">
              {[
                { customer: 'Aliyev Bobur', amount: '1,250,000', time: '10 daqiqa oldin' },
                { customer: 'Karimova Dilnoza', amount: '850,000', time: '1 soat oldin' },
                { customer: 'Toshmatov Jasur', amount: '2,100,000', time: '2 soat oldin' },
              ].map((sale, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {sale.customer}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sale.time}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {sale.amount} so'm
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Oylik Statistika
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Bu oy sotuvlar', value: '24.8M so\'m', change: '+12%', positive: true },
                { label: 'Yangi mijozlar', value: '48 ta', change: '+8%', positive: true },
                { label: 'Buyurtmalar', value: '156 ta', change: '-3%', positive: false },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      stat.positive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role-specific content */}
        {user.rol === 'usta' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔧 Tamirlash Buyurtmalari
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { status: 'Yangi', count: 5, color: 'blue' },
                { status: 'Jarayonda', count: 8, color: 'yellow' },
                { status: 'Tayyor', count: 3, color: 'green' },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.count}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}