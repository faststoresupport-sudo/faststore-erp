'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type Screen = 'main' | 'login' | 'register' | 'phone'

export function LoginPage() {
  const [screen, setScreen] = useState<Screen>('main')
  if (screen === 'main') return <MainScreen onGo={setScreen} />
  if (screen === 'login') return <LoginScreen onBack={() => setScreen('main')} onRegister={() => setScreen('register')} />
  if (screen === 'register') return <RegisterScreen onBack={() => setScreen('main')} onLogin={() => setScreen('login')} />
  if (screen === 'phone') return <PhoneScreen onBack={() => setScreen('main')} />
  return null
}

// ─── UI HELPERS ──────────────────────────────────────────
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/[0.04]" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/[0.04]" />
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-[440px] overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
function Logo() {
  return (
    <div className="text-center mb-8">
      <div className="w-[72px] h-[72px] mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-blue-500/30">⚡</div>
      <h1 className="text-[28px] font-black text-gray-900">FastStore</h1>
      <p className="text-gray-400 text-sm mt-1">Do'kon Boshqaruv Tizimi</p>
    </div>
  )
}
function Err({ msg }: { msg: string }) {
  if (!msg) return null
  return <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-4">❌ {msg}</div>
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
function MainScreen({ onGo }: { onGo: (s: Screen) => void }) {
  const { loginWithGoogle } = useAuth()
  const [err, setErr] = useState('')

  return (
    <Wrap>
      <Logo />
      {/* Google */}
      <button onClick={async () => { try { await loginWithGoogle('') } catch (e: any) { setErr(e.message) } }}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 hover:shadow-md transition-all mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Google bilan kirish / ro'yxatdan o'tish
      </button>
      {/* Phone */}
      <button onClick={() => onGo('phone')}
        className="w-full flex items-center justify-center gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-all mb-4">
        📱 Telefon raqam bilan kirish / ro'yxatdan o'tish
      </button>
      <div className="flex items-center gap-4 my-5"><div className="flex-1 h-px bg-gray-200"/><span className="text-xs text-gray-400 uppercase">yoki</span><div className="flex-1 h-px bg-gray-200"/></div>
      <button onClick={() => onGo('login')} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all mb-3">
        🔑 Login / Parol bilan kirish
      </button>
      <button onClick={() => onGo('register')} className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:border-purple-300 hover:text-purple-600 transition-all">
        📝 Ro'yxatdan o'tish (yangi hisob)
      </button>
      <Err msg={err} />
    </Wrap>
  )
}

// ═══════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════
function LoginScreen({ onBack, onRegister }: { onBack: () => void; onRegister: () => void }) {
  const { login } = useAuth()
  const [l, setL] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try { await login({ login: l, parol: p }) } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <Wrap>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6">
        <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm">←</span>
        <span className="text-sm font-medium">Orqaga</span>
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-1">🔑 Kirish</h2>
      <p className="text-sm text-gray-400 mb-6">Login va parolingizni kiriting</p>
      <Err msg={err} />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Login</label>
          <input type="text" value={l} onChange={e => setL(e.target.value)} placeholder="superadmin" autoFocus autoComplete="username"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Parol</label>
          <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="admin123" autoComplete="current-password"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
        <button type="submit" disabled={busy} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 disabled:opacity-60">
          {busy ? '⏳ Kirish...' : 'Kirish →'}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-4">Hisobingiz yo'qmi? <button onClick={onRegister} className="text-blue-500 font-semibold">Ro'yxatdan o'ting</button></p>
    </Wrap>
  )
}

// ═══════════════════════════════════════════════════════════
// REGISTER
// ═══════════════════════════════════════════════════════════
function RegisterScreen({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const { register, loginWithGoogle, sendSmsCode } = useAuth()
  const [ism, setIsm] = useState('')
  const [lg, setLg] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [tel, setTel] = useState('')
  const [rol, setRol] = useState('sotuvchi')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    if (pw !== pw2) { setErr('Parollar mos kelmaydi!'); return }
    setBusy(true)
    try { await register({ ism, login: lg, parol: pw, rol: rol as any, telefon: tel }); onLogin() }
    catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <Wrap>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6">
        <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm">←</span>
        <span className="text-sm font-medium">Orqaga</span>
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-1">📝 Ro'yxatdan o'tish</h2>
      <p className="text-sm text-gray-400 mb-4">Yangi hisob yarating</p>

      {/* Google & Phone registratsiya */}
      <div className="flex gap-2 mb-4">
        <button onClick={async () => { try { await loginWithGoogle('') } catch (e: any) { setErr(e.message) } }}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-2.5 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>
        <button onClick={async () => { try { await sendSmsCode('') } catch (e: any) { setErr(e.message) } }}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl py-2.5 text-xs font-semibold text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
          📱 Telefon
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4"><div className="flex-1 h-px bg-gray-200"/><span className="text-[10px] text-gray-400 uppercase">yoki forma bilan</span><div className="flex-1 h-px bg-gray-200"/></div>

      <Err msg={err} />
      <form onSubmit={submit} className="space-y-3">
        <input type="text" value={ism} onChange={e => setIsm(e.target.value)} placeholder="Ism Familiya"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
        <input type="text" value={lg} onChange={e => setLg(e.target.value)} placeholder="Login" autoComplete="username"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
        <div className="grid grid-cols-2 gap-2">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Parol" autoComplete="new-password"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
          <input type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Qayta parol" autoComplete="new-password"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
        <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="+998 telefon raqam"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
        <select value={rol} onChange={e => setRol(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all">
          <option value="sotuvchi">🛒 Sotuvchi</option>
          <option value="usta">🔧 Usta</option>
          <option value="admin">🔑 Admin</option>
        </select>
        <button type="submit" disabled={busy} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/30 disabled:opacity-60 mt-1">
          {busy ? '⏳...' : '📝 Ro\'yxatdan o\'tish'}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-4">Hisobingiz bormi? <button onClick={onLogin} className="text-blue-500 font-semibold">Kirish</button></p>
    </Wrap>
  )
}

// ═══════════════════════════════════════════════════════════
// PHONE
// ═══════════════════════════════════════════════════════════
function PhoneScreen({ onBack }: { onBack: () => void }) {
  const { sendSmsCode, loginWithPhone } = useAuth()
  const [ph, setPh] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const send = async () => {
    setErr('')
    if (ph.length < 9) { setErr('Raqamni to\'liq kiriting!'); return }
    setBusy(true)
    try { await sendSmsCode('+998' + ph); setSent(true) } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }

  const verify = async () => {
    setErr(''); setBusy(true)
    try { await loginWithPhone('+998' + ph, code) } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <Wrap>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6">
        <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm">←</span>
        <span className="text-sm font-medium">Orqaga</span>
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-1">📱 Telefon bilan kirish</h2>
      <p className="text-sm text-gray-400 mb-6">{sent ? 'SMS kod yuborildi' : 'Raqamingizga SMS kod yuboriladi'}</p>
      <Err msg={err} />
      {!sent ? (
        <>
          <div className="flex gap-2 mb-5">
            <div className="flex items-center px-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-sm font-bold">🇺🇿+998</div>
            <input type="tel" value={ph} onChange={e => setPh(e.target.value.replace(/\D/g, '').slice(0, 9))} placeholder="901234567" autoFocus
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-blue-500 tracking-wider font-medium transition-all" />
          </div>
          <button onClick={send} disabled={busy} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 disabled:opacity-60">
            📨 SMS Kod Yuborish
          </button>
        </>
      ) : (
        <>
          <input type="text" value={code} maxLength={6} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="• • • • • •" autoFocus
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-black outline-none focus:border-blue-500 tracking-[14px] mb-5 transition-all" />
          <button onClick={verify} disabled={code.length < 4 || busy} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg disabled:opacity-60">
            {busy ? '⏳...' : '✅ Tasdiqlash'}
          </button>
          <button onClick={() => { setSent(false); setCode('') }} className="w-full mt-3 text-blue-500 text-sm font-semibold">🔄 Qayta yuborish</button>
        </>
      )}
    </Wrap>
  )
}