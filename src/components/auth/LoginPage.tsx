'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const { login, loading } = useAuth()
  const [loginVal, setLoginVal] = useState('')
  const [parolVal, setParolVal] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login({ login: loginVal, parol: parolVal })
    } catch (err: any) {
      setError(err.message || 'Login yoki parol noto\'g\'ri!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-white/5" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-white/5" />
      <div className="absolute top-[30%] left-[5%] w-[200px] h-[200px] rounded-full bg-white/[0.03]" />

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-8 w-full max-w-[420px] shadow-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30">
            ⚡
          </div>
          <h1 className="text-2xl font-black text-gray-900">FastStore</h1>
          <p className="text-gray-500 text-sm mt-1">Do'kon Boshqaruv Tizimi</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Login
            </label>
            <input
              type="text"
              value={loginVal}
              onChange={(e) => setLoginVal(e.target.value)}
              placeholder="Loginni kiriting"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Parol
            </label>
            <input
              type="password"
              value={parolVal}
              onChange={(e) => setParolVal(e.target.value)}
              placeholder="Parolni kiriting"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all disabled:opacity-60"
          >
            {loading ? '⏳ Kirish...' : 'Kirish →'}
          </button>
        </form>
      </div>
    </div>
  )
}