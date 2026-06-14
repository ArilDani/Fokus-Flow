import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { dbService } from '../services/db'
import { ArrowRight, Target, Zap, ShieldCheck } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Check total users (limit to 21)
    const { count, error: countError } = await dbService.getUserCount()

    if (countError) {
      setError('Gagal menghubungi database.')
      setLoading(false)
      return
    }

    if (count >= 21) {
      setError('Pendaftaran ditutup. Batas maksimal 20 User telah tercapai untuk tahap uji coba ini.')
      setLoading(false)
      return
    }

    // Insert new user
    const { error: insertError } = await dbService.register({
      name, 
      email, 
      password,
      role: 'user', 
      status: 'pending'
    })

    if (insertError) {
      setError(insertError) // e.g. "Email sudah terdaftar."
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFD] p-6 font-sans">
        <div className="bg-white rounded-[28px] shadow-[0_20px_50px_rgba(37,99,235,0.1)] p-10 max-w-lg w-full border border-[#E2E8F0] text-center transform transition-all">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-[#64748B] mb-8 leading-relaxed text-lg">
            Terima kasih telah bergabung di Fokus Flow. Akun Anda saat ini berstatus <strong className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">Pending</strong>. Admin akan segera meninjau pendaftaran Anda.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFD] font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
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
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2 tracking-tight">Buat Akun 🚀</h2>
            <p className="text-[#64748B]">Mulai tingkatkan produktivitas Anda hari ini.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all font-medium text-[#0F172A]"
                placeholder="Nama Anda"
              />
            </div>
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
              className="group relative w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-4 rounded-xl transition-all mt-4 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20"
            >
              <span className={`flex items-center justify-center gap-2 transition-transform duration-300 ${loading ? '-translate-y-12' : 'translate-y-0'}`}>
                Daftar Sekarang
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
              Sudah punya akun?{' '}
              <Link to="/login" className="text-[#2563EB] font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] text-white relative overflow-hidden flex-col justify-between p-12 order-1 lg:order-2">
        {/* Background decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2563EB] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#10B981] opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-end">
          <Link to="/" className="inline-flex items-center gap-3 text-2xl font-bold text-white hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/20">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="14" width="5" height="11" rx="1.5" fill="currentColor" opacity=".45"/>
                <rect x="11.5" y="8" width="5" height="17" rx="1.5" fill="currentColor" opacity=".7"/>
                <rect x="20" y="3" width="5" height="22" rx="1.5" fill="currentColor"/>
              </svg>
            </div>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
            Gabung dengan<br />Para Achievers.
          </h1>
          <p className="text-xl text-slate-300 max-w-md font-light leading-relaxed">
            Hanya tersedia untuk 20 orang pertama di tahap uji coba. Amankan posisi Anda sekarang.
          </p>
        </div>

        {/* Floating Cards Demo */}
        <div className="relative z-10 grid grid-cols-2 gap-4 max-w-lg mt-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl transform transition-transform hover:-translate-y-2 hover:bg-white/10">
             <Target className="mb-3 text-[#3B82F6]" size={28} />
             <h3 className="font-semibold text-lg">Goal Oriented</h3>
             <p className="text-sm text-slate-400 mt-1">Selesaikan apa yang dimulai</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl transform transition-transform hover:-translate-y-2 hover:bg-white/10 translate-y-6">
             <Zap className="mb-3 text-[#10B981]" size={28} />
             <h3 className="font-semibold text-lg">Deep Work</h3>
             <p className="text-sm text-slate-400 mt-1">Tanpa distraksi</p>
          </div>
        </div>
      </div>

    </div>
  )
}
