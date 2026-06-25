'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { RepairOrdersTable } from '@/components/repair/RepairOrdersTable'
import { RepairModal } from '@/components/repair/RepairModal'
import { RepairStats } from '@/components/repair/RepairStats'
import { RepairFilters } from '@/components/repair/RepairFilters'
import { RepairReceiptModal } from '@/components/repair/RepairReceiptModal'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { toast } from 'react-hot-toast'
import type { RepairOrder, Customer } from '@/types'

// Tamirlash holatlari
const REPAIR_STATUSES = [
  { value: 'qabul_qilindi', label: '📥 Qabul qilindi', color: 'gray' },
  { value: 'diagnostika', label: '🔍 Diagnostika', color: 'orange' },
  { value: 'tamirlashda', label: '🔧 Tamirlashda', color: 'blue' },
  { value: 'tayyor', label: '✅ Tayyor', color: 'green' },
  { value: 'topshirildi', label: '🏁 Topshirildi', color: 'purple' },
  { value: 'bekor', label: '❌ Bekor qilindi', color: 'red' },
]

// Demo ma'lumotlar
const DEMO_REPAIR_ORDERS: RepairOrder[] = [
  {
    id: 1,
    customer_id: 1,
    sana: '2024-01-18',
    mijoz: 'Aliyev Bobur',
    telefon: '+998901234567',
    qurilma: 'Samsung Galaxy A54',
    muammo: 'Ekran singan, touchscreen ishlamaydi',
    holat: 'tamirlashda',
    narx_usd: 35,
    usta: 'bobur',
    izoh: 'Ekran almashtirilmoqda'
  },
  {
    id: 2,
    customer_id: 2,
    sana: '2024-01-20',
    mijoz: 'Toshmatov Sanjar',
    telefon: '+998901112233',
    qurilma: 'iPhone 12',
    muammo: 'Batareya tez tugaydi, qizib ketadi',
    holat: 'diagnostika',
    narx_usd: 0,
    usta: 'bobur',
    izoh: ''
  },
  {
    id: 3,
    customer_id: 3,
    sana: '2024-01-21',
    mijoz: 'Karimova Nilufar',
    telefon: '+998907654321',
    qurilma: 'Samsung TV 55"',
    muammo: 'Ovoz chiqmayapti',
    holat: 'tayyor',
    narx_usd: 20,
    usta: 'bobur',
    izoh: 'Karnay almashtirildi'
  }
]

const DEMO_CUSTOMERS: Customer[] = [
  { id: 1, ism: 'Aliyev Bobur', telefon: '+998901234567', manzil: 'Toshkent', izoh: '' },
  { id: 2, ism: 'Toshmatov Sanjar', telefon: '+998901112233', manzil: 'Toshkent', izoh: '' },
  { id: 3, ism: 'Karimova Nilufar', telefon: '+998907654321', manzil: 'Toshkent', izoh: '' },
]

export default function RepairPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<RepairOrder[]>(DEMO_REPAIR_ORDERS)
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('barchasi')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<RepairOrder | null>(null)
  const [receiptModal, setReceiptModal] = useState<{ open: boolean; order?: RepairOrder }>({ open: false })

  // Faqat usta uchun
  if (user?.rol !== 'usta') {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ruxsat yo'q
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Bu sahifaga faqat usta roli bilan kirish mumkin.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Filterlash
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.mijoz.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.qurilma.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toString().includes(searchQuery)
    const matchesStatus = statusFilter === 'barchasi' || order.holat === statusFilter
    return matchesSearch && matchesStatus
  })

  // Statistika
  const stats = {
    jami: orders.length,
    qabul: orders.filter(o => o.holat === 'qabul_qilindi').length,
    jarayonda: orders.filter(o => ['diagnostika', 'tamirlashda'].includes(o.holat)).length,
    tayyor: orders.filter(o => o.holat === 'tayyor').length,
    topshirildi: orders.filter(o => o.holat === 'topshirildi').length,
    daromad: orders.filter(o => o.holat === 'topshirildi').reduce((sum, o) => sum + o.narx_usd, 0)
  }

  const handleNewOrder = () => {
    setEditingOrder(null)
    setModalOpen(true)
  }

  const handleEditOrder = (order: RepairOrder) => {
    setEditingOrder(order)
    setModalOpen(true)
  }

  const handleChangeStatus = async (orderId: number, newStatus: string) => {
    try {
      setLoading(true)
      // API call
      // await repairAPI.updateStatus(orderId, newStatus)
      
      // Demo uchun
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, holat: newStatus } : o
      ))
      
      const statusLabel = REPAIR_STATUSES.find(s => s.value === newStatus)?.label || newStatus
      toast.success(`Holat ${statusLabel} ga o'zgartirildi`)
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOrder = async (orderData: Partial<RepairOrder>) => {
    try {
      setLoading(true)
      
      if (editingOrder) {
        // Update
        setOrders(prev => prev.map(o => 
          o.id === editingOrder.id 
            ? { ...o, ...orderData }
            : o
        ))
        toast.success('Buyurtma yangilandi')
      } else {
        // Create
        const newOrder: RepairOrder = {
          ...orderData as RepairOrder,
          id: Date.now(),
          sana: new Date().toISOString().split('T')[0],
          usta: user.login,
          holat: 'qabul_qilindi',
          narx_usd: 0,
          izoh: ''
        }
        setOrders(prev => [newOrder, ...prev])
        toast.success('Yangi buyurtma yaratildi')
      }
      
      setModalOpen(false)
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrintReceipt = (order: RepairOrder) => {
    const statusLabel = REPAIR_STATUSES.find(s => s.value === order.holat)?.label || order.holat
    
    const printWindow = window.open('', '_blank', 'width=380,height=500')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Tamirlash #${order.id}</title>
        <style>
          body { font-family: 'Courier New', monospace; font-size: 12px; padding: 16px; max-width: 280px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #333; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; margin: 3px 0; }
        </style>
      </head>
      <body>
        <div class="center bold" style="font-size: 16px">🔧 FastStore Servis</div>
        <div class="center">Tamirlash xizmati</div>
        <div class="line"></div>
        <div class="row"><span>Buyurtma #:</span><span class="bold">${order.id}</span></div>
        <div class="row"><span>Sana:</span><span>${order.sana}</span></div>
        <div class="row"><span>Mijoz:</span><span>${order.mijoz}</span></div>
        <div class="row"><span>Tel:</span><span>${order.telefon}</span></div>
        <div class="line"></div>
        <div class="row"><span>Qurilma:</span><span class="bold">${order.qurilma}</span></div>
        <div style="margin: 4px 0">Muammo: ${order.muammo}</div>
        ${order.izoh ? '<div style="margin: 4px 0">Izoh: ' + order.izoh + '</div>' : ''}
        <div class="line"></div>
        <div class="row"><span>Holat:</span><span class="bold">${statusLabel}</span></div>
        <div class="row">
          <span>Narx:</span>
          <span class="bold">${order.narx_usd > 0 ? (order.narx_usd * 12700).toLocaleString() + ' so\'m' : 'Aniqlanmagan'}</span>
        </div>
        <div class="line"></div>
        <div class="center">Xizmatimizdan foydalanganingiz uchun rahmat!</div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              🔧 Tamirlash Buyurtmalari
              <span className="ml-3 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                👤 {user.ism} — Usta
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filteredOrders.length} ta buyurtma topildi
            </p>
          </div>
          <Button 
            onClick={handleNewOrder}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            ➕ Yangi buyurtma
          </Button>
        </div>

        {/* Stats */}
        <RepairStats stats={stats} />

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Mijoz, qurilma yoki buyurtma raqami bo'yicha qidiring..."
              />
            </div>
            <RepairFilters
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              statuses={REPAIR_STATUSES}
            />
          </div>
        </div>

        {/* Orders Table/Cards */}
        <RepairOrdersTable
          orders={filteredOrders}
          loading={loading}
          onEdit={handleEditOrder}
          onChangeStatus={handleChangeStatus}
          onPrintReceipt={handlePrintReceipt}
          onViewReceipt={(order) => setReceiptModal({ open: true, order })}
          statuses={REPAIR_STATUSES}
        />

        {/* Repair Modal */}
        {modalOpen && (
          <RepairModal
            order={editingOrder}
            customers={customers}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveOrder}
            loading={loading}
          />
        )}

        {/* Receipt Modal */}
        {receiptModal.open && receiptModal.order && (
          <RepairReceiptModal
            order={receiptModal.order}
            onClose={() => setReceiptModal({ open: false })}
            onPrint={() => handlePrintReceipt(receiptModal.order!)}
            statuses={REPAIR_STATUSES}
          />
        )}
      </div>
    </DashboardLayout>
  )
}