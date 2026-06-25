'use client'

import { useState, useEffect, useCallback } from 'react'

const RATE_KEY = 'faststore_usd_rate'
const RATE_UPDATED_KEY = 'faststore_rate_updated'
const DEFAULT_RATE = 12700

export function useCurrency() {
  const [rate, setRate] = useState(DEFAULT_RATE)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Yuklanishda localStorage'dan olish
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RATE_KEY)
      const savedDate = localStorage.getItem(RATE_UPDATED_KEY)
      if (saved) setRate(+saved)
      if (savedDate) setLastUpdated(savedDate)
    } catch {}
    // Sahifa ochilganda yangilash
    fetchRate()
  }, [])

  // CBU.uz API dan kurs olish
  const fetchRate = useCallback(async () => {
    setLoading(true)
    try {
      // CBU.uz real API
      const response = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/')
      if (response.ok) {
        const data = await response.json()
        if (data && data[0] && data[0].Rate) {
          const newRate = Math.round(+data[0].Rate)
          setRate(newRate)
          const now = new Date().toLocaleString('uz-UZ')
          setLastUpdated(now)
          localStorage.setItem(RATE_KEY, String(newRate))
          localStorage.setItem(RATE_UPDATED_KEY, now)
        }
      }
    } catch (err) {
      // Agar API ishlamasa — oxirgi saqlangan yoki default
      console.log('Kurs olishda xatolik, oxirgi saqlangan ishlatiladi')
    } finally {
      setLoading(false)
    }
  }, [])

  // Formatlash funksiyalari
  const toSom = useCallback((usd: number) => Math.round(usd * rate), [rate])
  const formatSom = useCallback((usd: number) => Math.round(usd * rate).toLocaleString() + " so'm", [rate])
  const formatUSD = useCallback((usd: number) => '$' + usd.toFixed(2), [])
  const formatRate = useCallback(() => rate.toLocaleString() + " so'm", [rate])

  return { rate, lastUpdated, loading, fetchRate, toSom, formatSom, formatUSD, formatRate }
}