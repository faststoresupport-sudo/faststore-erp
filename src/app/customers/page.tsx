'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CustomersTable } from '@/components/customers/CustomersTable'
import { CustomerModal } from '@/components/customers/CustomerModal'
import { CustomerHistory } from '@/components/customers/CustomerHistory'
import { UstaMijozlar } from '@/components/customers/UstaMijozlar' // Usta uchun maxsus komponent
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { toast } from 'react-hot-toast'
import type { Customer, Sale, RepairOrder } from '@/types'

// Demo ma'lumotlar
const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 1,
    ism: 'Aliyev Bobur',
    telefon: '+998901234567',
    manzil: 'Toshkent, Yunusobod',
    izoh: 'Doimiy mijoz',
    created_at: '2024-01-10'
  },
  {
    id: 2,
    ism: 'Karimova Dilnoza',
    telefon: '+998932345678',
    manzil: 'Toshkent, Chilonzor', 
    izoh: '',
    created_at: '2024-01-12'
  },
  {
    id: 3,
    ism: 'Toshmatov Jasur',
    telefon: '+998903456789',
    manzil: 'Samarqand',
    izoh: 'Ulgurji xaridor',
    created_at: '2024-01-15'
  },
  {
    id: 4,
    ism: 'Rahimova Madina', // Usta mijozi
    telefon: '+998901112233',
    manzil: 'Toshkent, Mirobod',
    izoh: 'Telefon tamirlash mijozi',
    created_at: '2024-01-20'
  }
]

const DEMO_SALES: Sale[] = [
  {
    id: 1,
    chek: 'CH-001',
    sana: '2024-01-15',
    xaridor_id: 1,
    mijoz: 'Aliyev Bobur',
    items: [{ id: 1, mahsulot: 'Samsung Galaxy A54', miqdor: 2, narx_usd: 252, jami_usd: 504 }],
    jami_usd: 504,
    tolov: 'naqd',
    holat: 'To\'langan',
    sotuvchi: 'jasur'
  }
]

// Usta uchun tamirlash buyurtmalari
const DEMO_REPAIR_ORDERS: RepairOrder[] = [
  {
    id: 1,
    customer_id: 4,
    sana: '2024-01-20',
    qurilma: 'Samsung Galaxy A54',
    muammo: 'Ekran singan',
    holat: 'tamirlashda',
    narx_usd: 35,
    usta: 'bobur',
    izoh: 'Ekran almashtirilmoqda'
  },
  {
    id: 2,
    customer_id: 1,
    sana: '2024-01-18',
    qurilma: 'iPhone 12',
    muammo: 'Batareya tez tugaydi',
    holat: 'tayyor',
    narx_usd: 25,
    usta: 'bobur',
    izoh: 'Batareya almashtirildi'
  }
]

export default function CustomersPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS)
  const [sales, setSales] = useState<Sale[]>(DEMO_SALES)
  const [repairOrders, setRepairOrders] = useState<RepairOrder[]>(DEMO_REPAIR_ORDERS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [historyModal, setHistoryModal] = useState<{ open: boolean; customer?: Customer }>({ open: false })

  // Usta rolini tekshirish
  const isUsta = user?.rol === 'usta'

  // Usta uchun faqat tamirlash mijozlari
  const availableCustomers = isUsta 
    ? customers.filter(c => repairOrders.some(r => r.customer_id === c.id))
    : customers

  // Filterlash
  const filteredCustomers = availableCustomers.filter(customer =>
    customer.ism.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.telefon.includes(searchQuery)
  )

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setModalOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setModalOpen(true)
  }

  const handleDeleteCustomer = async (customerId: number) => {
    if (!window.confirm('Mijozni o\'chirmoqchimisiz?')) return

    try {
      setLoading(true)
      // API call
      // await customersAPI.delete(customerId)
      
      // Demo uchun
      setCustomers(prev => prev.filter(c => c.id !== customerId))
      toast.success('Mijoz o\'chirildi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCustomer = async (customerData: Partial<Customer>) => {
    try {
      setLoading(true)
      
      if (editingCustomer) {
        // Update
        setCustomers(prev => prev.map(c => 
          c.id === editingCustomer.id 
            ? { ...c, ...customerData }
            : c
        ))
        toast.success('Mijoz ma\'lumotlari yangilandi')
      } else {
        // Create
        const newCustomer: Customer = {
          ...customerData as Customer,
          id: Date.now(),
          created_at: new Date().toISOString()
        }
        setCustomers(prev => [newCustomer, ...prev])
        toast.success('Yangi mijoz qo\'shildi')
      }
      
      setModalOpen(false)
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewHistory = (customer: Customer) => {
    setHistoryModal({ open: true, customer })
  }

  // Usta uchun alohida interfeys
  if (isUsta) {
    return (
      <DashboardLayout>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                👥 Mijozlarim
                <span className="ml-3 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                  🔧 Usta mijozlari
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {filteredCustomers.length} ta mijoz topildi
              </p>
            </div>
            <Button 
              onClick={handleAddCustomer}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              ➕ Yangi mijoz
            </Button>
          </div>

          {/* Search */}
          <div className="card p-4 mb-6">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Mijoz nomi yoki telefon raqami bo'yicha qidiring..."
            />
          </div>

          {/* Usta mijozlar komponenti */}
          <UstaMijozlar
            customers={filteredCustomers}
            repairOrders={repairOrders}
            onAddRepair={(customerId) => {
              // Tamirlash buyurtma modali
              console.log('Add repair for customer:', customerId)
            }}
            onViewHistory={handleViewHistory}
            onEditCustomer={handleEditCustomer}
          />

          {/* Customer Modal */}
          {modalOpen && (
            <CustomerModal
              customer={editingCustomer}
              onClose={() => setModalOpen(false)}
              onSave={handleSaveCustomer}
              loading={loading}
            />
          )}

          {/* History Modal */}
          {historyModal.open && historyModal.customer && (
            <CustomerHistory
              customer={historyModal.customer}
              sales={sales.filter(s => s.xaridor_id === historyModal.customer?.id)}
              repairOrders={repairOrders.filter(r => r.customer_id === historyModal.customer?.id)}
              onClose={() => setHistoryModal({ open: false })}
              isUsta={true}
            />
          )}
        </div>
      </DashboardLayout>
    )
  }

  // Oddiy xaridorlar sahifasi (sotuvchi, admin, superadmin uchun)
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              👥 Xaridorlar
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filteredCustomers.length} ta xaridor topildi
            </p>
          </div>
          <Button 
            onClick={handleAddCustomer}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            ➕ Yangi xaridor
          </Button>
        </div>

        {/* Search */}
        <div className="card p-4 mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Xaridor nomi yoki telefon raqami bo'yicha qidiring..."
          />
        </div>

        {/* Customers Table */}
        <div className="card">
          <CustomersTable
            customers={filteredCustomers}
            sales={sales}
            loading={loading}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onViewHistory={handleViewHistory}
          />
        </div>

        {/* Customer Modal */}
        {modalOpen && (
          <CustomerModal
            customer={editingCustomer}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveCustomer}
            loading={loading}
          />
        )}

        {/* History Modal */}
        {historyModal.open && historyModal.customer && (
          <CustomerHistory
            customer={historyModal.customer}
            sales={sales.filter(s => s.xaridor_id === historyModal.customer?.id)}
            repairOrders={[]} // Oddiy xaridorlar uchun tamirlash yo'q
            onClose={() => setHistoryModal({ open: false })}
            isUsta={false}
          />
        )}
      </div>
    </DashboardLayout>
  )
}