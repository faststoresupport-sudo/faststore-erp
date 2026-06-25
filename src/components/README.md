# 📂 Components Tuzilishi

Bu katalogda barcha React komponentlar joylashgan.

## 📁 Katalog tuzilmasi

```
components/
├── ui/                 # Asosiy UI komponentlar
│   ├── Button.tsx     # Tugmalar
│   ├── Input.tsx      # Inputlar  
│   ├── Modal.tsx      # Modal oynalar
│   ├── Table.tsx      # Jadvallar
│   ├── Card.tsx       # Kartalar
│   └── ...
├── layout/            # Layout komponentlar
│   ├── DashboardLayout.tsx  # Asosiy layout
│   ├── Sidebar.tsx          # Yon panel
│   └── Header.tsx           # Yuqori panel
├── auth/              # Autentifikatsiya
│   ├── LoginPage.tsx        # Login sahifa
│   └── ProtectedRoute.tsx   # Himoyalangan marshrut
├── dashboard/         # Dashboard komponentlar
│   ├── StatsCard.tsx       # Statistika kartalari
│   ├── RecentSales.tsx     # So'nggi sotuvlar
│   └── UstaDashboard.tsx   # Usta dashboard'i
├── products/          # Mahsulotlar moduli
│   ├── ProductsTable.tsx   # Mahsulotlar jadvali
│   ├── ProductModal.tsx    # Mahsulot modali
│   └── ProductDrawer.tsx   # Mahsulot tanlash
├── sales/             # Sotuvlar moduli
│   ├── SalesTable.tsx      # Sotuvlar jadvali
│   ├── SaleModal.tsx       # Sotuv modali
│   └── ReceiptModal.tsx    # Chek modal
├── customers/         # Mijozlar moduli
│   ├── CustomersTable.tsx    # Mijozlar jadvali
│   ├── CustomerModal.tsx     # Mijoz modali
│   ├── CustomerHistory.tsx   # Mijoz tarixi
│   └── UstaMijozlar.tsx      # Usta mijozlari ⭐
├── repair/            # Tamirlash moduli ⭐
│   ├── RepairOrdersTable.tsx # Buyurtmalar jadvali
│   ├── RepairModal.tsx       # Tamirlash modali
│   ├── RepairStats.tsx       # Statistika
│   └── RepairFilters.tsx     # Filterlar
└── providers.tsx      # Context providerlar
```

## 🎯 Komponentlar turi

### 1. **UI Komponentlar** (`ui/`)
- Qayta ishlatiluvchi asosiy komponentlar
- Dizayn tizimi asoslari
- Props orqali moslashuvchan

### 2. **Layout Komponentlar** (`layout/`)
- Sahifa tuzilmasi
- Navigatsiya
- Sidebar va Header

### 3. **Feature Komponentlar** (modullar bo'yicha)
- Biznes logikasi bilan
- Ma'lum modul uchun maxsus
- API bilan integratsiya

### 4. **Usta Moduli** ⭐
Yangi qo'shilgan komponetlar:
- `UstaDashboard.tsx` - Usta uchun maxsus dashboard
- `UstaMijozlar.tsx` - Usta mijozlari ro'yxati
- `repair/` katalogi - To'liq tamirlash moduli

## 🔧 Ishlatish

Har bir komponent TypeScript bilan yozilgan va to'liq type safety ta'minlangan:

```tsx
import { Button } from '@/components/ui/Button'
import { ProductModal } from '@/components/products/ProductModal'
```

## 📱 Responziv Dizayn

Barcha komponentlar Tailwind CSS yordamida responziv:
- Mobile: `sm:` (640px+)  
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Large: `xl:` (1280px+)

## 🎨 Tema Qo'llab-quvvatlash

Barcha komponentlar light/dark temani qo'llab-quvvatlaydi:
```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## 🌍 Xalqarolashtirish

Komponentlar `useLanguage` hook'i bilan ko'p tilni qo'llab-quvvatlaydi:
```tsx
const { t } = useLanguage()
return <h1>{t('dashboard')}</h1>
```

---

**Keyingi Qadamlar:**
1. UI komponentlar kutubxonasini to'ldirish
2. Storybook qo'shish (komponent hujjatlari)
3. Unit testlar yozish
4. Accessibility (a11y) yaxshilash