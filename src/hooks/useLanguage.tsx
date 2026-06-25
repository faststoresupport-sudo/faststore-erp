'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'uz' | 'ru' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: {
    // Navigation
    dashboard: 'Dashboard',
    mahsulotlar: 'Mahsulotlar',
    sotuvlar: 'Sotuvlar',
    xaridlar: 'Xaridlar',
    kassa: 'Kassa',
    qarzdorlar: 'Qarzdorlar',
    xaridorlar: 'Xaridorlar',
    brak: 'Brak / Qaytarishlar',
    tamirlash: 'Tamirlash',
    hisobotlar: 'Hisobotlar',
    foydalanuvchilar: 'Foydalanuvchilar',
    sozlamalar: 'Sozlamalar',

    // Common
    yangi: 'Yangi',
    saqlash: 'Saqlash',
    bekor: 'Bekor',
    ochirish: 'O\'chirish',
    tahrir: 'Tahrir',
    qidirish: 'Qidirish...',
    loading: 'Yuklanmoqda...',
    
    // Status
    tolangan: 'To\'langan',
    qarz: 'Qarz',
    kutilmoqda: 'Kutilmoqda',
    keldi: 'Keldi',
    
    // Forms
    ism: 'Ism',
    telefon: 'Telefon',
    manzil: 'Manzil',
    sana: 'Sana',
    narx: 'Narx',
    miqdor: 'Miqdor',
    
    // Auth
    login: 'Login',
    parol: 'Parol',
    kirish: 'Kirish',
    chiqish: 'Chiqish',
    
    // Currency
    som: 'so\'m',
    dollar: '$',
  },
  
  ru: {
    // Navigation
    dashboard: 'Главная',
    mahsulotlar: 'Товары',
    sotuvlar: 'Продажи',
    xaridlar: 'Закупки',
    kassa: 'Касса',
    qarzdorlar: 'Должники',
    xaridorlar: 'Покупатели',
    brak: 'Брак / Возврат',
    tamirlash: 'Ремонт',
    hisobotlar: 'Отчёты',
    foydalanuvchilar: 'Пользователи',
    sozlamalar: 'Настройки',

    // Common
    yangi: 'Новый',
    saqlash: 'Сохранить',
    bekor: 'Отмена',
    ochirish: 'Удалить',
    tahrir: 'Изменить',
    qidirish: 'Поиск...',
    loading: 'Загрузка...',
    
    // Status
    tolangan: 'Оплачено',
    qarz: 'Долг',
    kutilmoqda: 'Ожидает',
    keldi: 'Получено',
    
    // Forms
    ism: 'Имя',
    telefon: 'Телефон',
    manzil: 'Адрес',
    sana: 'Дата',
    narx: 'Цена',
    miqdor: 'Количество',
    
    // Auth
    login: 'Логин',
    parol: 'Пароль',
    kirish: 'Войти',
    chiqish: 'Выйти',
    
    // Currency
    som: 'сум',
    dollar: '$',
  },
  
  en: {
    // Navigation
    dashboard: 'Dashboard',
    mahsulotlar: 'Products',
    sotuvlar: 'Sales',
    xaridlar: 'Purchases',
    kassa: 'Cash',
    qarzdorlar: 'Debtors',
    xaridorlar: 'Customers',
    brak: 'Defects / Returns',
    tamirlash: 'Repair',
    hisobotlar: 'Reports',
    foydalanuvchilar: 'Users',
    sozlamalar: 'Settings',

    // Common
    yangi: 'New',
    saqlash: 'Save',
    bekor: 'Cancel',
    ochirish: 'Delete',
    tahrir: 'Edit',
    qidirish: 'Search...',
    loading: 'Loading...',
    
    // Status
    tolangan: 'Paid',
    qarz: 'Debt',
    kutilmoqda: 'Pending',
    keldi: 'Arrived',
    
    // Forms
    ism: 'Name',
    telefon: 'Phone',
    manzil: 'Address',
    sana: 'Date',
    narx: 'Price',
    miqdor: 'Quantity',
    
    // Auth
    login: 'Login',
    parol: 'Password',
    kirish: 'Sign in',
    chiqish: 'Sign out',
    
    // Currency
    som: 'sum',
    dollar: '$',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uz')

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['uz', 'ru', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Default to Uzbek
      setLanguageState('uz')
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    
    // Update document lang attribute
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    
    // Fallback to key if translation not found
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Helper hook for formatting currency
export function useCurrency() {
  const { language } = useLanguage()
  
  const formatUZS = (amount: number) => {
    const formatted = Math.round(amount).toLocaleString('uz-UZ')
    return `${formatted} so'm`
  }
  
  const formatUSD = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }
  
  const formatRate = () => {
    const rate = 12700
    return rate.toLocaleString('uz-UZ')
  }
  
  return {
    formatUZS,
    formatUSD,
    formatRate,
    currency: language === 'en' ? '$' : language === 'ru' ? 'руб' : 'so\'m'
  }
}