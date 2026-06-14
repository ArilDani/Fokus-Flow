import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { dbService } from '../services/db'
import { useStore } from '../store/useStore'
import { ArrowRight, BrainCircuit, Activity, Clock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const setUser = useStore((state) => state.setUser)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { data: user, error: dbError } = await dbService.login(email, password)

    if (dbError || !user) {
      setError('Email atau password salah.')
      setLoading(false)
      return
    }

    if (user.status === 'pending') {
      setError('Akun Anda masih menunggu persetujuan Admin.')
      setLoading(false)
      return
    }

    setUser(user)
    
    if (user.role === 'admin') {
      navigate('/admin-dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFD] font-sans">
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#2563EB] text-white relative overflow-hidden flex-col justify-between p-12">
        {/* Background decorations */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#06B6D4] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 text-2xl font-bold text-white mb-16 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#2563EB]">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="14" width="5" height="11" rx="1.5" fill="currentColor" opacity=".45"/>
                <rect x="11.5" y="8" width="5" height="17" rx="1.5" fill="currentColor" opacity=".7"/>
                <rect x="20" y="3" width="5" height="22" rx="1.5" fill="currentColor"/>
              </svg>
            </div>
            Fokus Flow
          </Link>
          
          <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
            Kembalikan<br />Fokus Anda.
          </h1>
          <p className="text-xl text-blue-100 max-w-md font-light leading-relaxed">
            Akses dashboard produktivitas berbasis neurosains dan temukan flow kerja terbaik Anda hari ini.
          </p>
        </div>

        {/* Floating Cards Demo */}
        <div className="relative z-10 grid grid-cols-2 gap-4 max-w-lg mt-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl transform transition-transform hover:-translate-y-2 hover:bg-white/20">
             <Clock className="mb-3 text-blue-200" size={28} />
             <h3 className="font-semibold text-lg">Smart Timer</h3>
             <p className="text-sm text-blue-100 opacity-80 mt-1">Pomodoro adaptif</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl transform transition-transform hover:-translate-y-2 hover:bg-white/20 translate-y-6">
             <Activity className="mb-3 text-blue-200" size={28} />
             <h3 className="font-semibold text-lg">Habit Tracker</h3>
             <p className="text-sm text-blue-100 opacity-80 mt-1">Bangun konsistensi</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[28px] shadow-[0_12px_40px_rgba(37,99,235,0.08)] border border-[#E2E8F0] transform transition-all hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[#2563EB] justify-center w-full">
               <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="14" width="5" height="11" rx="1.5" fill="currentColor" opacity=".45"/>
                <rect x="11.5" y="8" width="5" height="17" rx="1.5" fill="currentColor" opacity=".7"/>
                <rect x="20" y="3" width="5" height="22" rx="1.5" fill="currentColor"/>
              </svg>
              Fokus Flow
            </Link>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2 tracking-tight">Selamat Datang 👋</h2>
            <p className="text-[#64748B]">Silakan masuk ke akun Anda.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all font-medium text-[#0F172A]"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all font-medium text-[#0F172A]"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-4 rounded-xl transition-all mt-4 flex items-center justify-center overflow-hidden"
            >
              <span className={`flex items-center justify-center gap-2 transition-transform duration-300 ${loading ? '-translate-y-12' : 'translate-y-0'}`}>
                Masuk Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${loading ? 'translate-y-0' : 'translate-y-12'}`}>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-[#64748B]">
              Belum punya akun?{' '}
              <Link to="/register" className="text-[#2563EB] font-bold hover:underline">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
