'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type Screen = 'main' | 'login' | 'google' | 'phone' | 'sms'

export function LoginPage() {
  const { login, loginWithGoogle, loginWithPhone, loading } = useAuth()
  const [screen, setScreen] = useState<Screen>('main')
  const [loginVal, setLoginVal] = useState('')
  const [parolVal, setParolVal] = useState('')
  const [phone, setPhone] = useState('+998')
  const [smsCode, setSmsCode] = useState('')
  const [fakeSms, setFakeSms] = useState('')
  const [error, setError] = useState('')

  // Google demo accounts
  const googleAccounts = [
    { email: 'sardor.aliyev@gmail.com', ism: 'Sardor Aliyev', avatar: 'SA', rol: 'superadmin' },
    { email: 'malika.yusupova@gmail.com', ism: 'Malika Yusupova', avatar: 'MY', rol: 'admin' },
    { email: 'jasur.toshmatov@gmail.com', ism: 'Jasur Toshmatov', avatar: 'JT', rol: 'sotuvchi' },
    { email: 'bobur.karimov@gmail.com', ism: 'Bobur Karimov', avatar: 'BK', rol: 'usta' },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login({ login: loginVal, parol: parolVal })
    } catch (err: any) {
      setError(err.message || 'Login yoki parol noto\'g\'ri!')
    }
  }

  const handleGoogle = async (acc: typeof googleAccounts[0]) => {
    setError('')
    try {
      await loginWithGoogle(acc)
    } catch (err: any) {
      setError(err.message || 'Google kirish xatolik!')
    }
  }

  const handleSendSms = () => {
    if (phone.length < 13) { setError('Telefon raqamni to\'liq kiriting!'); return }
    const code = String(Math.floor(1000 + Math.random() * 9000))
    setFakeSms(code)
    setError('')
    setScreen('sms')
  }

  const handleVerifySms = async () => {
    if (smsCode !== fakeSms) { setError('Kod noto\'g\'ri! To\'g\'ri kod: ' + fakeSms); return }
    try {
      await loginWithPhone(phone, smsCode)
    } catch (err: any) {
      setError(err.message || 'SMS kirish xatolik!')
    }
  }

  // ─── WRAPPER ───────────────────────────────────────────
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.04] animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/[0.04]" />
        <div className="absolute top-[40%] left-[10%] w-[250px] h-[250px] rounded-full bg-white/[0.03]" />
        <div className="absolute top-[20%] right-[20%] w-[150px] h-[150px] rounded-full bg-blue-400/10" />
      </div>
      {/* Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 w-full max-w-[440px] overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="p-8">{children}</div>
      </div>
    </div>
  )

  // ─── LOGO ──────────────────────────────────────────────
  const Logo = () => (
    <div className="text-center mb-8">
      <div className="w-[72px] h-[72px] mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30 transform hover:scale-105 transition-transform">
        ⚡
      </div>
      <h1 className="text-[28px] font-black text-gray-900 tracking-tight">FastStore</h1>
      <p className="text-gray-400 text-sm mt-1 font-medium">Do'kon Boshqaruv Tizimi</p>
    </div>
  )

  // ─── BACK BUTTON ───────────────────────────────────────
  const BackBtn = () => (
    <button onClick={() => { setScreen('main'); setError('') }}
      className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 group">
      <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors text-sm">←</span>
      <span className="text-sm font-medium">Orqaga</span>
    </button>
  )

  // ═══════════════════════════════════════════════════════
  // MAIN SCREEN
  // ═══════════════════════════════════════════════════════
  if (screen === 'main') return (
    <Wrapper>
      <Logo />

      {/* Google Button */}
      <button onClick={() => setScreen('google')}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-md hover:shadow-gray-200/50 transition-all mb-3 group">
        <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google bilan kirish
      </button>

      {/* Phone Button */}
      <button onClick={() => setScreen('phone')}
        className="w-full flex items-center justify-center gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-200/50 transition-all mb-4 group">
        <span className="text-lg group-hover:scale-110 transition-transform">📱</span>
        Telefon raqam bilan ro'yxatdan o'tish
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">yoki</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Login/Parol Button */}
      <button onClick={() => setScreen('login')}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all">
        🔑 Login / Parol bilan kirish
      </button>
    </Wrapper>
  )

  // ═══════════════════════════════════════════════════════
  // LOGIN/PAROL SCREEN
  // ═══════════════════════════════════════════════════════
  if (screen === 'login') return (
    <Wrapper>
      <BackBtn />
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">🔑 Login / Parol</h2>
        <p className="text-sm text-gray-400 mt-1">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Login</label>
          <input type="text" value={loginVal} onChange={e => setLoginVal(e.target.value)}
            placeholder="loginni kiriting" autoFocus
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50/50 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/5 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parol</label>
          <input type="password" value={parolVal} onChange={e => setParolVal(e.target.value)}
            placeholder="parolni kiriting"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50/50 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/5 transition-all" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"><span>❌</span>{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-60 mt-2">
          {loading ? '⏳ Kirish...' : 'Kirish →'}
        </button>
      </form>
    </Wrapper>
  )

  // ═══════════════════════════════════════════════════════
  // GOOGLE SCREEN
  // ═══════════════════════════════════════════════════════
  if (screen === 'google') return (
    <Wrapper>
      <BackBtn />
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Google bilan kirish</h2>
        <p className="text-sm text-gray-400 mt-1">Akkauntingizni tanlang</p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Google orqali kirilmoqda...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {googleAccounts.map(acc => (
            <button key={acc.email} onClick={() => handleGoogle(acc)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all text-left group">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                {acc.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">{acc.ism}</div>
                <div className="text-gray-400 text-xs truncate">{acc.email}</div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                acc.rol === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                acc.rol === 'admin' ? 'bg-blue-100 text-blue-700' :
                acc.rol === 'usta' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {acc.rol === 'superadmin' ? '👑 Super' : acc.rol === 'admin' ? '🔑 Admin' : acc.rol === 'usta' ? '🔧 Usta' : '🛒 Sotuvchi'}
              </span>
            </button>
          ))}
        </div>
      )}

      {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}
    </Wrapper>
  )

  // ═══════════════════════════════════════════════════════
  // PHONE SCREEN
  // ═══════════════════════════════════════════════════════
  if (screen === 'phone') return (
    <Wrapper>
      <BackBtn />
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">📱 Telefon bilan ro'yxatdan o'tish</h2>
        <p className="text-sm text-gray-400 mt-1">SMS kod yuboriladi</p>
      </div>

      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Telefon raqam</label>
        <div className="flex gap-2">
          <div className="flex items-center px-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex-shrink-0">
            🇺🇿 +998
          </div>
          <input type="tel" value={phone.replace('+998', '')}
            onChange={e => setPhone('+998' + e.target.value.replace(/\D/g, '').slice(0, 9))}
            placeholder="90 123 45 67" autoFocus
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none bg-gray-50/50 focus:border-blue-500 focus:bg-white transition-all tracking-wider font-medium" />
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

      <button onClick={handleSendSms}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all">
        📨 SMS Kod Yuborish
      </button>
    </Wrapper>
  )

  // ═══════════════════════════════════════════════════════
  // SMS CODE SCREEN
  // ═══════════════════════════════════════════════════════
  return (
    <Wrapper>
      <BackBtn />
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">🔐 SMS Tasdiqlash</h2>
        <p className="text-sm text-gray-400 mt-1">{phone} raqamiga kod yuborildi</p>
      </div>

      {/* Demo SMS display */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 mb-6 border border-gray-700">
        <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">📱 SMS xabar (demo)</div>
        <div className="text-gray-300 text-sm mb-2">FastStore: Tasdiqlash kodingiz:</div>
        <div className="text-center text-blue-400 text-4xl font-black tracking-[12px] py-2" style={{ textShadow: '0 0 20px rgba(96,165,250,0.5)' }}>
          {fakeSms}
        </div>
      </div>

      {/* Code input */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">4 xonali kodni kiriting</label>
        <input type="text" value={smsCode} maxLength={4}
          onChange={e => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="• • • •" autoFocus
          onKeyDown={e => e.key === 'Enter' && handleVerifySms()}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-3xl font-black outline-none bg-gray-50/50 focus:border-blue-500 focus:bg-white transition-all tracking-[20px]" />
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}

      <button onClick={handleVerifySms} disabled={smsCode.length < 4 || loading}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
          smsCode.length === 4
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}>
        {loading ? '⏳ Tekshirilmoqda...' : '✅ Tasdiqlash'}
      </button>

      <div className="text-center mt-4">
        <button onClick={() => { setScreen('phone'); setSmsCode(''); setError('') }}
          className="text-blue-500 text-sm font-semibold hover:text-blue-700 transition-colors">
          🔄 Kodni qayta yuborish
        </button>
      </div>
    </Wrapper>
  )
}