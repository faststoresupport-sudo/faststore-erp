'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type Screen = 'main' | 'login' | 'register' | 'google' | 'phone'

export function LoginPage() {
  const { login, loginWithGoogle, sendSmsCode, loginWithPhone, register, loading } = useAuth()
  const [screen, setScreen] = useState<Screen>('main')
  const [loginVal, setLoginVal] = useState('')
  const [parolVal, setParolVal] = useState('')
  const [error, setError] = useState('')

  // Register form
  const [regForm, setRegForm] = useState({ ism: '', login: '', parol: '', parol2: '', rol: 'sotuvchi' as const, telefon: '' })

  // Phone form
  const [phone, setPhone] = useState('+998')
  const [smsCode, setSmsCode] = useState('')
  const [smsSent, setSmsSent] = useState(false)

  // ─── LOGIN ─────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login({ login: loginVal, parol: parolVal })
    } catch (err: any) {
      setError(err.message)
    }
  }

  // ─── REGISTER ──────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (regForm.parol !== regForm.parol2) { setError('Parollar mos kelmaydi!'); return }
    try {
      await register({ ism: regForm.ism, login: regForm.login, parol: regForm.parol, rol: regForm.rol as any, telefon: regForm.telefon })
      setScreen('login')
      setLoginVal(regForm.login)
      setParolVal(regForm.parol)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // ─── GOOGLE ────────────────────────────────────────────
  const handleGoogle = async () => {
    setError('')
    try {
      // Real Google OAuth popup
      // TODO: Google Client ID kerak
      // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${window.location.origin}/api/auth/google/callback&response_type=code&scope=email profile`
      await loginWithGoogle('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  // ─── SMS ───────────────────────────────────────────────
  const handleSendSms = async () => {
    setError('')
    if (phone.length < 13) { setError('Telefon raqamni to\'liq kiriting!'); return }
    try {
      await sendSmsCode(phone)
      setSmsSent(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleVerifySms = async () => {
    setError('')
    try {
      await loginWithPhone(phone, smsCode)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // ─── WRAPPER ───────────────────────────────────────────
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.04]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/[0.04]" />
      </div>
      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-[440px] overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="p-8">{children}</div>
      </div>
    </div>
  )

  const Logo = () => (
    <div className="text-center mb-8">
      <div className="w-[72px] h-[72px] mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30">⚡</div>
      <h1 className="text-[28px] font-black text-gray-900 tracking-tight">FastStore</h1>
      <p className="text-gray-400 text-sm mt-1 font-medium">Do'kon Boshqaruv Tizimi</p>
    </div>
  )

  const BackBtn = () => (
    <button onClick={() => { setScreen('main'); setError(''); setSmsSent(false) }}
      className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6">
      <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm">←</span>
      <span className="text-sm font-medium">Orqaga</span>
    </button>
  )

  const ErrorMsg = () => error ? (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-4">
      <span>❌</span>{error}
    </div>
  ) : null

  // ═══ MAIN SCREEN ═══
  if (screen === 'main') return (
    <Wrapper>
      <Logo />
      {/* Google */}
      <button onClick={handleGoogle} disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-md transition-all mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google bilan kirish
      </button>
      {/* Phone */}
      <button onClick={() => setScreen('phone')} disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-all mb-4">
        <span className="text-lg">📱</span>
        Telefon raqam bilan kirish
      </button>
      {/* Divider */}
      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-medium text-gray-400 uppercase">yoki</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {/* Login */}
      <button onClick={() => setScreen('login')}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all mb-3">
        🔑 Login / Parol bilan kirish
      </button>
      {/* Register */}
      <button onClick={() => setScreen('register')}
        className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:border-purple-300 hover:text-purple-600 transition-all">
        📝 Ro'yxatdan o'tish
      </button>
      <ErrorMsg />
    </Wrapper>
  )

  // ═══ LOGIN SCREEN ═══
  if (screen === 'login') return (
    <Wrapper>
      <BackBtn />
      <h2 className="text-xl font-bold text-gray-900 mb-1">🔑 Kirish</h2>
      <p className="text-sm text-gray-400 mb-6">Login va parolingizni kiriting</p>
      <ErrorMsg />
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Login</label>
          <input type="text" value={loginVal} onChange={e => setLoginVal(e.target.value)} autoFocus placeholder="login"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parol</label>
          <input type="password" value={parolVal} onChange={e => setParolVal(e.target.value)} placeholder="parol"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all disabled:opacity-60">
          {loading ? '⏳ Kirish...' : 'Kirish →'}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-4">
        Hisobingiz yo'qmi? <button onClick={() => setScreen('register')} className="text-blue-500 font-semibold hover:underline">Ro'yxatdan o'ting</button>
      </p>
    </Wrapper>
  )

  // ═══ REGISTER SCREEN ═══
  if (screen === 'register') return (
    <Wrapper>
      <BackBtn />
      <h2 className="text-xl font-bold text-gray-900 mb-1">📝 Ro'yxatdan o'tish</h2>
      <p className="text-sm text-gray-400 mb-6">Yangi hisob yaratish</p>
      <ErrorMsg />
      <form onSubmit={handleRegister} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">To'liq ism</label>
          <input type="text" value={regForm.ism} onChange={e => setRegForm(f => ({ ...f, ism: e.target.value }))} placeholder="Ism Familiya"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Login</label>
          <input type="text" value={regForm.login} onChange={e => setRegForm(f => ({ ...f, login: e.target.value }))} placeholder="login"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Parol</label>
            <input type="password" value={regForm.parol} onChange={e => setRegForm(f => ({ ...f, parol: e.target.value }))} placeholder="••••••"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qayta</label>
            <input type="password" value={regForm.parol2} onChange={e => setRegForm(f => ({ ...f, parol2: e.target.value }))} placeholder="••••••"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Telefon</label>
          <input type="tel" value={regForm.telefon} onChange={e => setRegForm(f => ({ ...f, telefon: e.target.value }))} placeholder="+998901234567"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rol</label>
          <select value={regForm.rol} onChange={e => setRegForm(f => ({ ...f, rol: e.target.value as any }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-gray-50/50 transition-all">
            <option value="sotuvchi">🛒 Sotuvchi</option>
            <option value="usta">🔧 Usta</option>
            <option value="admin">🔑 Admin</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/30 transition-all disabled:opacity-60 mt-2">
          {loading ? '⏳...' : '📝 Ro\'yxatdan o\'tish'}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-4">
        Hisobingiz bormi? <button onClick={() => setScreen('login')} className="text-blue-500 font-semibold hover:underline">Kirish</button>
      </p>
    </Wrapper>
  )

  // ═══ PHONE SCREEN ═══
  if (screen === 'phone') return (
    <Wrapper>
      <BackBtn />
      <h2 className="text-xl font-bold text-gray-900 mb-1">📱 Telefon bilan kirish</h2>
      <p className="text-sm text-gray-400 mb-6">{smsSent ? `${phone} raqamiga kod yuborildi` : 'SMS kod yuboriladi'}</p>
      <ErrorMsg />
      {!smsSent ? (
        <>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Telefon raqam</label>
            <div className="flex gap-2">
              <div className="flex items-center px-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-sm font-bold flex-shrink-0">🇺🇿 +998</div>
              <input type="tel" value={phone.replace('+998', '')} onChange={e => setPhone('+998' + e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="90 123 45 67" autoFocus
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-blue-500 bg-gray-50/50 tracking-wider font-medium transition-all" />
            </div>
          </div>
          <button onClick={handleSendSms} disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-60">
            📨 SMS Kod Yuborish
          </button>
        </>
      ) : (
        <>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SMS kodni kiriting</label>
            <input type="text" value={smsCode} maxLength={6} onChange={e => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •" autoFocus
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-black outline-none focus:border-blue-500 bg-gray-50/50 tracking-[14px] transition-all" />
          </div>
          <button onClick={handleVerifySms} disabled={smsCode.length < 4 || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all disabled:opacity-60 disabled:shadow-none">
            {loading ? '⏳ Tekshirilmoqda...' : '✅ Tasdiqlash'}
          </button>
          <button onClick={() => { setSmsSent(false); setSmsCode(''); setError('') }}
            className="w-full mt-3 text-blue-500 text-sm font-semibold hover:underline">
            🔄 Qayta yuborish
          </button>
        </>
      )}
    </Wrapper>
  )

  // ═══ GOOGLE (redirect) ═══
  return (
    <Wrapper>
      <BackBtn />
      <div className="text-center py-10">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Google'ga yo'naltirilmoqda...</p>
      </div>
    </Wrapper>
  )
}