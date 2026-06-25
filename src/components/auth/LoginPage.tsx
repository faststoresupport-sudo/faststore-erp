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

// ─── WRAPPER ─────────────────────────────────────────────
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #0f172a 60%, #1e3a5f 100%)' }}>
      {/* Animated circles */}
      <div className="absolute top-[-15%] right-[-8%] w-[450px] h-[450px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      <div className="absolute top-[40%] left-[15%] w-[200px] h-[200px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-[28px] border border-white/10 shadow-2xl shadow-blue-900/20 overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <div className="text-center mb-8">
      <div className="w-[68px] h-[68px] mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-blue-500/40" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
        ⚡
      </div>
      <h1 className="text-[26px] font-black text-white tracking-tight">FastStore</h1>
      <p className="text-blue-300/70 text-sm mt-1 font-medium">Do'kon Boshqaruv Tizimi</p>
    </div>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-blue-300/70 hover:text-blue-200 transition-colors mb-6 group">
      <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm group-hover:bg-white/10 transition-colors">←</span>
      <span className="text-sm font-medium">Orqaga</span>
    </button>
  )
}

function Err({ msg }: { msg: string }) {
  if (!msg) return null
  return <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm font-medium mb-4 flex items-center gap-2"><span>❌</span>{msg}</div>
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
        className="w-full flex items-center justify-center gap-3 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-blue-100 hover:bg-white/10 hover:border-white/20 transition-all mb-3 group">
        <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Google bilan kirish / ro'yxatdan o'tish
      </button>

      {/* Phone */}
      <button onClick={() => onGo('phone')}
        className="w-full flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all mb-5 group">
        <span className="text-lg group-hover:scale-110 transition-transform">📱</span>
        Telefon raqam bilan kirish / ro'yxatdan o'tish
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <span className="text-[11px] font-semibold text-blue-400/60 uppercase tracking-widest">yoki</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>

      {/* Login */}
      <button onClick={() => onGo('login')}
        className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all mb-3" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
        🔑 Login / Parol bilan kirish
      </button>

      {/* Register */}
      <button onClick={() => onGo('register')}
        className="w-full py-3 rounded-xl font-semibold text-sm text-blue-300 border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all">
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
      <BackBtn onClick={onBack} />
      <h2 className="text-xl font-bold text-white mb-1">🔑 Tizimga kirish</h2>
      <p className="text-sm text-blue-300/60 mb-6">Login va parolingizni kiriting</p>
      <Err msg={err} />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Login</label>
          <input type="text" value={l} onChange={e => setL(e.target.value)} placeholder="superadmin" autoFocus autoComplete="username"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Parol</label>
          <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="••••••••" autoComplete="current-password"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all" />
        </div>
        <button type="submit" disabled={busy}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-60 mt-2" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
          {busy ? '⏳ Kirish...' : 'Kirish →'}
        </button>
      </form>
      <p className="text-center text-xs text-blue-300/50 mt-5">Hisobingiz yo'qmi? <button onClick={onRegister} className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">Ro'yxatdan o'ting</button></p>
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
      <BackBtn onClick={onBack} />
      <h2 className="text-xl font-bold text-white mb-1">📝 Ro'yxatdan o'tish</h2>
      <p className="text-sm text-blue-300/60 mb-4">Yangi hisob yarating</p>

      {/* Google & Phone */}
      <div className="flex gap-2 mb-4">
        <button onClick={async () => { try { await loginWithGoogle('') } catch (e: any) { setErr(e.message) } }}
          className="flex-1 flex items-center justify-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl py-2.5 text-xs font-semibold text-blue-200 hover:bg-white/10 hover:border-white/20 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>
        <button onClick={async () => { try { await sendSmsCode('') } catch (e: any) { setErr(e.message) } }}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all">
          📱 Telefon
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4"><div className="flex-1 h-px bg-blue-500/20"/><span className="text-[10px] text-blue-400/50 uppercase tracking-widest">yoki forma</span><div className="flex-1 h-px bg-blue-500/20"/></div>

      <Err msg={err} />
      <form onSubmit={submit} className="space-y-3">
        <input type="text" value={ism} onChange={e => setIsm(e.target.value)} placeholder="Ism Familiya"
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all" />
        <input type="text" value={lg} onChange={e => setLg(e.target.value)} placeholder="Login" autoComplete="username"
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all" />
        <div className="grid grid-cols-2 gap-2">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Parol" autoComplete="new-password"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all" />
          <input type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Qayta" autoComplete="new-password"
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all" />
        </div>
        <input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="+998 telefon raqam"
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all" />
        <select value={rol} onChange={e => setRol(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-blue-100 outline-none focus:border-blue-500/50 transition-all">
          <option value="sotuvchi" className="bg-gray-900">🛒 Sotuvchi</option>
          <option value="usta" className="bg-gray-900">🔧 Usta</option>
          <option value="admin" className="bg-gray-900">🔑 Admin</option>
        </select>
        <button type="submit" disabled={busy}
          className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-60 mt-1" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
          {busy ? '⏳...' : '📝 Ro\'yxatdan o\'tish'}
        </button>
      </form>
      <p className="text-center text-xs text-blue-300/50 mt-4">Hisobingiz bormi? <button onClick={onLogin} className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">Kirish</button></p>
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
      <BackBtn onClick={onBack} />
      <h2 className="text-xl font-bold text-white mb-1">📱 Telefon bilan kirish</h2>
      <p className="text-sm text-blue-300/60 mb-6">{sent ? 'SMS kod yuborildi' : 'Raqamingizga SMS kod yuboriladi'}</p>
      <Err msg={err} />
      {!sent ? (
        <>
          <div className="flex gap-2 mb-5">
            <div className="flex items-center px-4 bg-white/[0.05] border border-white/10 rounded-xl text-sm font-bold text-blue-200 flex-shrink-0">🇺🇿+998</div>
            <input type="tel" value={ph} onChange={e => setPh(e.target.value.replace(/\D/g, '').slice(0, 9))} placeholder="901234567" autoFocus
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-base text-blue-100 placeholder-blue-300/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] tracking-wider font-medium transition-all" />
          </div>
          <button onClick={send} disabled={busy}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            📨 SMS Kod Yuborish
          </button>
        </>
      ) : (
        <>
          <input type="text" value={code} maxLength={6} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="• • • • • •" autoFocus
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-4 text-center text-2xl font-black text-blue-100 placeholder-blue-300/20 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] tracking-[14px] mb-5 transition-all" />
          <button onClick={verify} disabled={code.length < 4 || busy}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-xl shadow-blue-500/25 transition-all disabled:opacity-40" style={{ background: code.length >= 4 ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : '#334155' }}>
            {busy ? '⏳...' : '✅ Tasdiqlash'}
          </button>
          <button onClick={() => { setSent(false); setCode('') }} className="w-full mt-3 text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors">🔄 Qayta yuborish</button>
        </>
      )}
    </Wrap>
  )
}