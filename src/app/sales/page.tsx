'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SalesTable } from '@/components/sales/SalesTable'
import { SaleModal } from '@/components/sales/SaleModal'
import { SalesStats } from '@/components/sales/SalesStats'
import { SalesFilters } from '@/components/sales/SalesFilters'
import { ReceiptModal } from '@/components/sales/ReceiptModal'
import { LowStockTable } from '@/components/sales/LowStockTable'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { toast } from 'react-hot-toast'
import type { Sale, Customer, Product } from '@/types'

// Demo ma'lumotlar
const DEMO_SALES: Sale[] = [
  {
    id: 1,
    chek: 'CH-001',
    sana: '2024-01-15',
    xaridor_id: 1,
    mijoz: 'Aliyev Bobur',
    items: [
      { id: 1, mahsulot: 'Samsung Galaxy A54', miqdor: 2, narx_usd: 252, jami_usd: 504 }
    ],
    jami_usd: 504,
    tolov: 'naqd',
    holat: 'To\'langan',
    sotuvchi: 'jasur'
  },
  {
    id: 2,
    chek: 'CH-002', 
    sana: '2024-01-17',
    xaridor_id: 2,
    mijoz: 'Karimova Dilnoza',
    items: [
      { id: 2, mahsulot: 'USB-C Kabel 2m', miqdor: 5, narx_usd: 3.5, jami_usd: 17.5 }
    ],
    jami_usd: 17.5,
    tolov: 'karta',
    holat: 'To\'langan',
    sotuvchi: 'malika'
  },
  {
    id: 3,
    chek: 'CH-003',
    sana: '2024-01-20', 
    xaridor_id: 3,
    mijoz: 'Toshmatov Jasur',
    items: [
      { id: 3, mahsulot: 'iPhone 14 Pro', miqdor: 1, narx_usd: 935, jami_usd: 935 }
    ],
    jami_usd: 935,
    tolov: 'nasiya',
    holat: 'Qarz',
    sotuvchi: 'jasur'
  }
]

const DEMO_CUSTOMERS: Customer[] = [
  { id: 1, ism: 'Aliyev Bobur', telefon: '+998901234567', manzil: 'Toshkent, Yunusobod', izoh: 'Doimiy mijoz' },
  { id: 2, ism: 'Karimova Dilnoza', telefon: '+998932345678', manzil: 'Toshkent, Chilonzor', izoh: '' },
  { id: 3, ism: 'Toshmatov Jasur', telefon: '+998903456789', manzil: 'Samarqand', izoh: 'Ulgurji xaridor' }
]

// Kam qolgan mahsulotlar (miqdor < 10)
const DEMO_PRODUCTS: Product[] = [
  { id: 1, kod: 'SM-A54', nomi: 'Samsung Galaxy A54', kategoriya: 'Elektronika', birlik: 'dona', miqdor: 25, narx_usd: 252, chegirma: 0, rasm_url: null, created_at: '', updated_at: '' },
  { id: 2, kod: 'IP-14P', nomi: 'iPhone 14 Pro', kategoriya: 'Elektronika', birlik: 'dona', miqdor: 3, narx_usd: 984, chegirma: 5, rasm_url: null, created_at: '', updated_at: '' },
  { id: 3, kod: 'AK-001', nomi: 'USB-C Kabel 2m', kategoriya: 'Aksesuar', birlik: 'dona', miqdor: 150, narx_usd: 3.5, chegirma: 0, rasm_url: null, created_at: '', updated_at: '' },
  { id: 4, kod: 'AK-002', nomi: 'Qopqoq Samsung A54', kategoriya: 'Aksesuar', birlik: 'dona', miqdor: 4, narx_usd: 2.8, chegirma: 10, rasm_url: null, created_at: '', updated_at: '' },
  { id: 5, kod: 'ZP-001', nomi: 'Ekran Samsung A54', kategoriya: 'Zapchast', birlik: 'dona', miqdor: 2, narx_usd: 35, chegirma: 0, rasm_url: null, created_at: '', updated_at: '' },
  { id: 6, kod: 'KI-001', nomi: 'Nike Air Max', kategoriya: 'Kiyim', birlik: 'juft', miqdor: 30, narx_usd: 89, chegirma: 0, rasm_url: null, created_at: '', updated_at: '' },
  { id: 7, kod: 'OV-001', nomi: 'Lipton choy 100p', kategoriya: 'Oziq-ovqat', birlik: 'quti', miqdor: 200, narx_usd: 2.2, chegirma: 0, rasm_url: null, created_at: '', updated_at: '' },
  { id: 8, kod: 'EL-001', nomi: 'AirPods Pro 2', kategoriya: 'Elektronika', birlik: 'dona', miqdor: 5, narx_usd: 199, chegirma: 0, rasm_url: null, created_at: '', updated_at: '' },
  { id: 9, kod: 'KI-002', nomi: 'Adidas Yeezy 350', kategoriya: 'Kiyim', birlik: 'juft', miqdor: 1, narx_usd: 220, chegirma: 5, rasm_url: null, created_at: '', updated_at: '' },
]

export default function SalesPage() {
  const { user } = useAuth()
  const [sales, setSalesState] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // localStorage dan yuklash
  useEffect(() => {
    try {
      const savedSales = localStorage.getItem('faststore_sales')
      if (savedSales) setSalesState(JSON.parse(savedSales))
      const savedCustomers = localStorage.getItem('faststore_customers')
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers))
      const savedProducts = localStorage.getItem('faststore_products')
      if (savedProducts) setProducts(JSON.parse(savedProducts))
    } catch {}
  }, [])

  // Sales saqlash wrapper
  const setSales = (updater: any) => {
    setSalesState((prev: Sale[]) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('faststore_sales', JSON.stringify(updated))
      return updated
    })
  }
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Barchasi')
  const [dateFilter, setDateFilter] = useState('Bugun')
  const [saleModal, setSaleModal] = useState<{ open: boolean; sale?: Sale }>({ open: false })
  const [receiptModal, setReceiptModal] = useState<{ open: boolean; sale?: Sale }>({ open: false })

  // Filterlash
  const filteredSales = sales.filter(sale => {
    const matchesSearch = (sale.mijoz || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (sale.chek || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Barchasi' || sale.holat === statusFilter
    return matchesSearch && matchesStatus
  })

  // Statistika
  const stats = {
    jami: sales.length,
    tolangan: sales.filter(s => s.holat === 'To\'langan').length,
    qarz: sales.filter(s => s.holat === 'Qarz').length,
    jamiSumma: sales.reduce((sum, s) => sum + s.jami_usd, 0),
    tolanganSumma: sales.filter(s => s.holat === 'To\'langan').reduce((sum, s) => sum + s.jami_usd, 0),
    qarzSumma: sales.filter(s => s.holat === 'Qarz').reduce((sum, s) => sum + s.jami_usd, 0)
  }

  const handleNewSale = () => {
    setSaleModal({ open: true })
  }

  const handleEditSale = (sale: Sale) => {
    setSaleModal({ open: true, sale })
  }

  const handleViewReceipt = (sale: Sale) => {
    setReceiptModal({ open: true, sale })
  }

  const handlePrintReceipt = (sale: Sale) => {
    // Print logic
    const printWindow = window.open('', '_blank', 'width=380,height=620')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Chek ${sale.chek}</title>
        <style>
          body { font-family: 'Courier New', monospace; font-size: 13px; margin: 0; padding: 20px; max-width: 300px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #333; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; margin: 3px 0; }
          .big { font-size: 17px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="center big">⚡ FastStore</div>
        <div class="center">faststore.uz · +998 90 123 45 67</div>
        <div class="line"></div>
        <div class="row"><span>Chek:</span><span class="bold">${sale.chek}</span></div>
        <div class="row"><span>Sana:</span><span>${sale.sana}</span></div>
        <div class="row"><span>Sotuvchi:</span><span>${sale.sotuvchi}</span></div>
        <div class="row"><span>Mijoz:</span><span>${sale.mijoz}</span></div>
        <div class="line"></div>
        ${sale.items.map(item => `
          <div style="margin: 5px 0">
            <div class="bold">${item.mahsulot}</div>
            <div class="row">
              <span>${item.miqdor} × ${(item.narx_usd * 12700).toLocaleString()} so'm</span>
              <span class="bold">${(item.jami_usd * 12700).toLocaleString()} so'm</span>
            </div>
          </div>
        `).join('')}
        <div class="line"></div>
        <div class="row big">
          <span>JAMI:</span>
          <span>${(sale.jami_usd * 12700).toLocaleString()} so'm</span>
        </div>
        <div class="row">
          <span>To'lov:</span>
          <span>${sale.tolov === 'naqd' ? '💵 Naqd' : sale.tolov === 'karta' ? '💳 Karta' : '📋 Nasiya'}</span>
        </div>
        <div class="line"></div>
        <div class="center">Xaridingiz uchun rahmat! 🙏</div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleSaveSale = async (saleData: Partial<Sale>) => {
    try {
      setLoading(true)

      if (saleModal.sale) {
        // Update existing sale
        setSales(prev => prev.map(s => 
          s.id === saleModal.sale?.id 
            ? { ...s, ...saleData } as Sale
            : s
        ))
        toast.success('Sotuv yangilandi')
      } else {
        // Create new sale
        const newSale: Sale = {
          ...saleData as Sale,
          id: Date.now(),
          chek: `CH-${String(sales.length + 1).padStart(3, '0')}`,
          sotuvchi: user?.login || 'admin'
        }
        setSales(prev => [newSale, ...prev])
        toast.success('Yangi sotuv yaratildi')
      }

      setSaleModal({ open: false })
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🛒 Sotuvlar
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filteredSales.length} ta sotuv topildi
            </p>
          </div>
          <Button 
            onClick={handleNewSale}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            ➕ Yangi sotuv
          </Button>
        </div>

        {/* Stats */}
        <SalesStats stats={stats} />

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Mijoz nomi yoki chek raqami bo'yicha qidiring..."
              />
            </div>
            <SalesFilters
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
            />
          </div>
        </div>

        {/* Sales Table */}
        <div className="card mb-6">
          <SalesTable
            sales={filteredSales}
            loading={loading}
            onEdit={handleEditSale}
            onViewReceipt={handleViewReceipt}
            onPrintReceipt={handlePrintReceipt}
          />
        </div>

        {/* ⚠️ Kam Qolgan Mahsulotlar */}
        <LowStockTable products={products} />

        {/* Sale Modal */}
        {saleModal.open && (
          <SaleModal
            sale={saleModal.sale}
            customers={customers}
            onClose={() => setSaleModal({ open: false })}
            onSave={handleSaveSale}
            loading={loading}
          />
        )}

        {/* Receipt Modal */}
        {receiptModal.open && receiptModal.sale && (
          <ReceiptModal
            sale={receiptModal.sale}
            onClose={() => setReceiptModal({ open: false })}
            onPrint={() => handlePrintReceipt(receiptModal.sale!)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}