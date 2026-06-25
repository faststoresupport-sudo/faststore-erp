'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

const DEMO_USERS = [
  { ism: 'Sardor Aliyev', login: 'sardor', parol: '1234', rol: 'superadmin', emoji: '👑' },
  { ism: 'Malika Yusupova', login: 'malika', parol: '1234', rol: 'admin', emoji: '🔑' },
  { ism: 'Jasur Toshmatov', login: 'jasur', parol: '1234', rol: 'sotuvchi', emoji: '🛒' },
  { ism: 'Bobur Karimov', login: 'bobur', parol: '1234', rol: 'usta', emoji: '🔧' },
]

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

  const handleDemoLogin = (user: typeof DEMO_USERS[0]) => {
    setLoginVal(user.login)
    setParolVal(user.parol)
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

        {/* Demo accounts */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Demo hisoblar (bosib kirish)
          </p>
          <div className="space-y-2">
            {DEMO_USERS.map((user) => (
              <div
                key={user.login}
                onClick={() => handleDemoLogin(user)}
                className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.ism[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{user.ism}</div>
                    <div className="text-[10px] text-gray-400">{user.emoji} {user.rol}</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                  {user.login}/{user.parol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}