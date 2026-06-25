// ══════════════════════════════════════════════════════════════════
// FASTSTORE ERP - TYPE DEFINITIONS
// ══════════════════════════════════════════════════════════════════

export interface User {
  id: number
  ism: string
  login: string
  rol: 'superadmin' | 'admin' | 'sotuvchi' | 'usta'
  filial?: string
  kategoriya?: string | null
  telefon?: string
  avatar_url?: string
  activ?: boolean
  created_at?: string
}

export interface Product {
  id: number
  kod: string
  nomi: string
  kategoriya: string
  birlik: string
  miqdor: number
  narx_usd: number
  chegirma?: number
  rasm_url?: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  ism: string
  telefon: string
  manzil?: string
  izoh?: string
  created_at: string
}

export interface SaleItem {
  id: number
  mahsulot: string
  miqdor: number
  narx_usd: number
  jami_usd: number
}

export interface Sale {
  id: number
  chek: string
  sana: string
  xaridor_id: number
  mijoz: string
  items: SaleItem[]
  jami_usd: number
  tolov: 'naqd' | 'karta' | 'nasiya'
  holat: 'To\'langan' | 'Qarz'
  sotuvchi: string
}

export interface Purchase {
  id: number
  sana: string
  taminotchi: string
  mahsulot: string
  miqdor: number
  narx_usd: number
  jami_usd: number
  holat: 'Keldi' | 'Kutilmoqda' | 'Bekor qilindi'
}

export interface CashTransaction {
  id: number
  sana: string
  tur: 'Kirim' | 'Chiqim'
  sabab: string
  summa_usd: number
  izoh?: string
}

export interface Debt {
  id: number
  mijoz: string
  xaridor_id: number
  telefon: string
  sana: string
  jami_usd: number
  tolangan_usd: number
  chek: string
  izoh?: string
}

// ⭐ USTA UCHUN YANGI TIPLAR
export interface RepairOrder {
  id: number
  customer_id: number
  sana: string
  mijoz: string
  telefon: string
  qurilma: string
  muammo: string
  holat: 'qabul_qilindi' | 'diagnostika' | 'tamirlashda' | 'tayyor' | 'topshirildi' | 'bekor'
  narx_usd: number
  usta: string
  izoh?: string
}

export interface RepairStatus {
  value: string
  label: string
  color: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Auth Types
export interface LoginRequest {
  login: string
  parol: string
}

export interface LoginResponse {
  token: string
  user: User
}

// Form Types
export interface ProductForm {
  kod: string
  nomi: string
  kategoriya: string
  birlik: string
  miqdor: number
  narx_usd: number
  chegirma?: number
  rasm_url?: string | null
}

export interface CustomerForm {
  ism: string
  telefon: string
  manzil?: string
  izoh?: string
}

export interface SaleForm {
  xaridor_id: number
  items: SaleItem[]
  tolov: 'naqd' | 'karta' | 'nasiya'
  sana: string
}

export interface RepairOrderForm {
  customer_id: number
  qurilma: string
  muammo: string
  narx_usd?: number
  izoh?: string
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'uz' | 'ru' | 'en'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    marketing: boolean
  }
}

// Dashboard Stats Types
export interface DashboardStats {
  products: { count: number; value: string }
  sales: { count: number; value: string; change: string }
  customers: { count: number; value: string; change: string }
  orders: { count: number; value: string; change: string }
}

export interface RepairStats {
  jami: number
  qabul: number
  jarayonda: number
  tayyor: number
  topshirildi: number
  daromad: number
}

// UI Component Props Types
export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface TableColumn<T = any> {
  key: string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

// Filter Types
export interface ProductFilter {
  search: string
  kategoriya: string
}

export interface SaleFilter {
  search: string
  status: string
  dateRange: string
}

export interface CustomerFilter {
  search: string
}

export interface RepairFilter {
  search: string
  status: string
}

// Export/Import Types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'word'
  dateRange?: {
    start: string
    end: string
  }
  filters?: Record<string, any>
}

// Language/Translation Types
export interface Translation {
  [key: string]: string | Translation
}

export interface LanguageConfig {
  code: string
  name: string
  flag: string
  native: string
  translations: Translation
}

// Permission Types
export type Permission = 
  | 'dash' | 'mahsulot' | 'sotuv' | 'xarid' 
  | 'kassa' | 'qarz' | 'xaridorlar' | 'brak' 
  | 'tamirlash' | 'hisobot' | 'users' | 'sozlamalar'

export interface RolePermissions {
  [role: string]: Permission[]
}

// Utility Types
export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Generic CRUD Operations
export interface CrudOperations<T> {
  getAll: () => Promise<T[]>
  getById: (id: number) => Promise<T>
  create: (data: Partial<T>) => Promise<T>
  update: (id: number, data: Partial<T>) => Promise<T>
  delete: (id: number) => Promise<void>
}

// Webhook/Event Types (future)
export interface WebhookEvent {
  id: string
  event: string
  data: any
  timestamp: string
}

// Backup/Restore Types (future)
export interface BackupData {
  version: string
  timestamp: string
  data: {
    users: User[]
    products: Product[]
    customers: Customer[]
    sales: Sale[]
    // ... other entities
  }
}