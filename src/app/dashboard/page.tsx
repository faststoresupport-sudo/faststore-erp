'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentSales } from '@/components/dashboard/RecentSales'
import { MonthlyChart } from '@/components/dashboard/MonthlyChart'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { UstaDashboard } from '@/components/dashboard/UstaDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    products: { count: 156, value: '24.8M' },
    sales: { count: 89, value: '12.4M', change: '+12%' },
    customers: { count: 234, value: '89 ta', change: '+8%' },
    orders: { count: 45, value: '23 ta', change: '-3%' },
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Demo ma'lumotlarni yuklash
    const loadDashboardData = async () => {
      try {
        // API dan ma'lumotlar olish
        // const response = await dashboardAPI.getStats()
        // setStats(response.data)
        
        // Demo uchun setTimeout
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Dashboard ma\'lumotlari yuklanmadi:', error)
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                📊 Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Salom, {user?.ism}! Biznesingizni boshqaring 👋
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg">
                ⚡ FastStore ERP v3.0
              </div>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm">
                {new Date().toLocaleDateString('uz-UZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific dashboard */}
        {user?.rol === 'usta' ? (
          <UstaDashboard />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Mahsulotlar"
                value={stats.products.count.toString() + ' tur'}
                subtitle={`Qiymati: ${stats.products.value} so'm`}
                icon="📦"
                color="blue"
                trend={{ value: '+5%', positive: true }}
              />
              <StatsCard
                title="Bu oy sotuvlar"
                value={stats.sales.value + ' so\'m'}
                subtitle="O'tgan oyga nisbatan"
                icon="💰"
                color="green"
                trend={{ value: stats.sales.change, positive: true }}
              />
              <StatsCard
                title="Mijozlar"
                value={stats.customers.value}
                subtitle="Yangi mijozlar"
                icon="👥"
                color="purple"
                trend={{ value: stats.customers.change, positive: true }}
              />
              <StatsCard
                title="Buyurtmalar"
                value={stats.orders.value}
                subtitle="Faol buyurtmalar"
                icon="📋"
                color="orange"
                trend={{ value: stats.orders.change, positive: false }}
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent Sales - 2 columns */}
              <div className="lg:col-span-2">
                <RecentSales />
              </div>
              
              {/* Quick Actions - 1 column */}
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyChart />
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎯 Bugungi Maqsadlar
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Sotuv maqsadi', current: 85, target: 100, unit: '%' },
                    { label: 'Yangi mijozlar', current: 12, target: 15, unit: 'ta' },
                    { label: 'Buyurtmalar', current: 23, target: 30, unit: 'ta' },
                  ].map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {goal.label}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(goal.current / goal.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}