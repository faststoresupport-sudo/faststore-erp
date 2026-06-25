'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProductsTable } from '@/components/products/ProductsTable'
import { ProductModal } from '@/components/products/ProductModal'
import { ProductFilters } from '@/components/products/ProductFilters'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { toast } from 'react-hot-toast'
import type { Product } from '@/types'

// Demo ma'lumotlar
const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    kod: 'SM-A54',
    nomi: 'Samsung Galaxy A54',
    kategoriya: 'Elektronika',
    birlik: 'dona',
    miqdor: 25,
    narx_usd: 252,
    chegirma: 0,
    rasm_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    kod: 'IP-14P',
    nomi: 'iPhone 14 Pro',
    kategoriya: 'Elektronika',
    birlik: 'dona',
    miqdor: 10,
    narx_usd: 984,
    chegirma: 5,
    rasm_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    kod: 'AK-001',
    nomi: 'USB-C Kabel 2m',
    kategoriya: 'Aksesuar',
    birlik: 'dona',
    miqdor: 150,
    narx_usd: 3.5,
    chegirma: 0,
    rasm_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    kod: 'ZP-001',
    nomi: 'Ekran Samsung A54',
    kategoriya: 'Zapchast',
    birlik: 'dona',
    miqdor: 8,
    narx_usd: 35,
    chegirma: 0,
    rasm_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const KATEGORIYALAR = ['Barchasi', 'Elektronika', 'Aksesuar', 'Zapchast', 'Kiyim', 'Oziq-ovqat', 'Boshqa']

export default function ProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKategoriya, setSelectedKategoriya] = useState('Barchasi')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Admin faqat o'z kategoriyasini ko'radi
  const userKategoriya = user?.rol === 'admin' && user?.kategoriya ? user.kategoriya : null
  
  const availableProducts = userKategoriya 
    ? products.filter(p => p.kategoriya === userKategoriya)
    : products

  // Filterlash
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.nomi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.kod.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesKategoriya = selectedKategoriya === 'Barchasi' || product.kategoriya === selectedKategoriya
    return matchesSearch && matchesKategoriya
  })

  const handleAddProduct = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Mahsulotni o\'chirmoqchimisiz?')) return

    try {
      setLoading(true)
      // API call
      // await productsAPI.delete(productId)
      
      // Demo uchun
      setProducts(prev => prev.filter(p => p.id !== productId))
      toast.success('Mahsulot o\'chirildi')
    } catch (error) {
      toast.error('Xatolik yuz berdi')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      setLoading(true)
      
      if (editingProduct) {
        // Update
        // const response = await productsAPI.update(editingProduct.id, productData)
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productData, updated_at: new Date().toISOString() }
            : p
        ))
        toast.success('Mahsulot yangilandi')
      } else {
        // Create
        // const response = await productsAPI.create(productData)
        const newProduct: Product = {
          ...productData as Product,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setProducts(prev => [newProduct, ...prev])
        toast.success('Yangi mahsulot qo\'shildi')
      }
      
      setModalOpen(false)
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              📦 Mahsulotlar
              {userKategoriya && (
                <span className="ml-3 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                  🏷 {userKategoriya} sohasi
                </span>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filteredProducts.length} ta mahsulot topildi
            </p>
          </div>
          <Button 
            onClick={handleAddProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            ➕ Yangi mahsulot
          </Button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Mahsulot nomi yoki kodi bo'yicha qidiring..."
              />
            </div>
            {!userKategoriya && (
              <ProductFilters
                kategoriyalar={KATEGORIYALAR}
                selectedKategoriya={selectedKategoriya}
                onKategoriyaChange={setSelectedKategoriya}
              />
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="card">
          <ProductsTable
            products={filteredProducts}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            userRole={user?.rol}
          />
        </div>

        {/* Product Modal */}
        {modalOpen && (
          <ProductModal
            product={editingProduct}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveProduct}
            loading={loading}
            kategoriyalar={userKategoriya ? [userKategoriya] : KATEGORIYALAR.slice(1)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}