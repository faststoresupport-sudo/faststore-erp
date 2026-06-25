'use client'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  userRole?: string
}

export function ProductsTable({ products, loading, onEdit, onDelete, userRole }: Props) {
  if (loading) return <div className="p-8 text-center text-gray-400">⏳ Yuklanmoqda...</div>

  if (products.length === 0) return (
    <div className="p-8 text-center text-gray-400">
      <div className="text-4xl mb-3">📦</div>
      <div className="font-medium">Mahsulot topilmadi</div>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50">
            {['Kod', 'Nomi', 'Kategoriya', 'Miqdor', 'Narx', 'Amallar'].map(col => (
              <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <td className="px-4 py-3 font-mono text-blue-600 font-bold text-xs">{product.kod}</td>
              <td className="px-4 py-3 font-semibold">{product.nomi}</td>
              <td className="px-4 py-3 text-gray-500">{product.kategoriya}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.miqdor < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {product.miqdor} {product.birlik}
                </span>
              </td>
              <td className="px-4 py-3 font-bold">{Math.round(product.narx_usd * 12700).toLocaleString()} so'm</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(product)} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200">✏️</button>
                  {(userRole === 'superadmin' || userRole === 'admin') && (
                    <button onClick={() => onDelete(product.id)} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200">🗑️</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}