'use client'

import type { Product } from '@/types'

interface Props {
  products: Product[]
}

export function LowStockTable({ products }: Props) {
  // Miqdori 10 dan kam bo'lgan mahsulotlar
  const lowStock = products
    .filter(p => p.miqdor < 10)
    .sort((a, b) => a.miqdor - b.miqdor)

  if (lowStock.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg">
            ⚠️
          </div>
          <div>
            <h3 className="text-base font-bold text-red-800 dark:text-red-300">
              Kam Qolgan Mahsulotlar
            </h3>
            <p className="text-xs text-red-600/70 dark:text-red-400/70">
              Miqdori 10 tadan kam — tezda to'ldirish kerak!
            </p>
          </div>
        </div>
        <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full text-xs font-bold">
          {lowStock.length} ta mahsulot
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kod
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mahsulot nomi
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategoriya
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Qoldiq
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Narxi
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Holat
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {lowStock.map(product => {
              const isKritik = product.miqdor <= 3
              const isBitgan = product.miqdor === 0
              return (
                <tr key={product.id} className={`transition-colors ${
                  isBitgan ? 'bg-red-50/50 dark:bg-red-900/10' :
                  isKritik ? 'bg-orange-50/30 dark:bg-orange-900/5' :
                  'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      {product.kod}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {product.nomi}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {product.kategoriya}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-black ${
                        isBitgan ? 'text-red-600' :
                        isKritik ? 'text-orange-500' :
                        'text-yellow-600'
                      }`}>
                        {product.miqdor}
                      </span>
                      <span className="text-gray-400 text-xs">{product.birlik}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mt-1.5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        isBitgan ? 'bg-red-500 w-[5%]' :
                        isKritik ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`} style={{ width: `${Math.min(product.miqdor * 10, 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(product.narx_usd * 12700).toLocaleString()} <span className="text-xs text-gray-400">so'm</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isBitgan ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      isKritik ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {isBitgan ? '🚫 Tugagan' : isKritik ? '🔴 Kritik' : '⚠️ Kam'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Ombor to'ldirilmasa sotuvga ta'sir qiladi
        </p>
        <a href="/products" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          📦 Omborga o'tish →
        </a>
      </div>
    </div>
  )
}