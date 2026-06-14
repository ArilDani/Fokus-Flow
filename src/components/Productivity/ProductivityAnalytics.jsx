import { useState, useMemo, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, parseISO, startOfDay, endOfDay } from 'date-fns'
import { id } from 'date-fns/locale'
import { Activity, Clock, Zap, Target, FileText, Download, TrendingUp, Sparkles, BrainCircuit, HeartHandshake } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function ProductivityAnalytics() {
  const [timeRange, setTimeRange] = useState('week') // week, month, year
  const [isPrinting, setIsPrinting] = useState(false)
  const sessions = useStore(state => state.sessions)
  const aiLogs = useStore(state => state.aiLogs) || []
  const tasks = useStore(state => state.tasks) || []
  const user = useStore(state => state.user)

  const habitTaskIds = useMemo(() => {
    const titleCounts = {}
    tasks.forEach(t => {
      if (!t.title || typeof t.title !== 'string' || !t.title.trim()) return;
      const title = t.title.toLowerCase().trim()
      titleCounts[title] = (titleCounts[title] || 0) + 1
    })
    return new Set(tasks.filter(t => typeof t.title === 'string' && t.title.trim() && (t.isHabit || titleCounts[t.title.toLowerCase().trim()] > 1)).map(t => t.id))
  }, [tasks])

  // Process data for charts
  const chartData = useMemo(() => {
    const today = new Date()
    let startDate, endDate

    if (timeRange === 'week') {
      startDate = startOfWeek(today, { weekStartsOn: 1 })
      endDate = endOfWeek(today, { weekStartsOn: 1 })
    } else if (timeRange === 'month') {
      startDate = startOfMonth(today)
      endDate = endOfMonth(today)
    } else {
      startDate = startOfYear(today)
      endDate = endOfYear(today)
    }

    let safeEndDate = endDate > today ? today : endDate
    if (safeEndDate < startDate) safeEndDate = startDate // Safe fallback to prevent interval crash

    const days = eachDayOfInterval({ start: startDate, end: safeEndDate })
    
    return days.map(day => {
      const dayStart = startOfDay(day)
      const dayEnd = endOfDay(day)
      
      const daySessions = sessions.filter(session => {
        if(!session.date) return false
        try {
          const sDate = parseISO(session.date)
          return sDate >= dayStart && sDate <= dayEnd
        } catch { return false }
      })

      const totalMinutes = daySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0)

      return {
        name: format(day, timeRange === 'week' ? 'EEEE' : 'dd MMM', { locale: id }),
        minutes: totalMinutes,
        sessions: daySessions.length
      }
    })
  }, [sessions, timeRange])

  const totalFocusTime = chartData.reduce((acc, curr) => acc + curr.minutes, 0)
  const avgFocusTime = chartData.length ? Math.round(totalFocusTime / chartData.length) : 0

  // Smart Insights Generation
  const insights = useMemo(() => {
    if (chartData.length === 0 || totalFocusTime === 0) return "Belum ada data fokus yang cukup untuk dianalisis."
    
    const sortedDays = [...chartData].sort((a, b) => b.minutes - a.minutes)
    const bestDay = sortedDays[0]
    
    let text = `Hari paling produktif Anda adalah ${bestDay.name} dengan rekor fokus selama ${Math.floor(bestDay.minutes / 60)} jam ${bestDay.minutes % 60} menit. `
    
    if (avgFocusTime > 120) {
      text += "Konsistensi yang luar biasa! Anda berhasil mempertahankan rata-rata fokus tinggi di atas 2 jam/hari. Pastikan tetap menjaga waktu istirahat agar tidak burnout."
    } else if (avgFocusTime > 60) {
      text += "Cukup baik. Anda sudah mulai membangun momentum. Coba tambahkan 1 sesi Deep Work lagi esok hari."
    } else {
      text += "Pemanasan yang bagus. Mari bangun kebiasaan perlahan dengan memecah tugas menjadi sesi 25-menitan."
    }

    // Mood Correlation Insight
    const recentLogs = aiLogs.filter(log => {
      if (!log.date) return false;
      try {
        const d = new Date(log.date)
        return !isNaN(d) && d >= startDate && d <= endDate
      } catch { return false }
    })
    const stressedLogs = recentLogs.filter(l => l.mood === 'Stressed' || l.mood === 'Negative')
    
    if (stressedLogs.length > 0 && totalFocusTime > 60) {
      text += ` Hebatnya lagi, walaupun Anda sempat merasa ${stressedLogs[0].mood === 'Stressed' ? 'stres/lelah' : 'down'} berdasarkan curhatan Anda ke AI, Anda tetap berhasil mencatat waktu produktif. Mental Anda sangat tangguh!`
    } else if (stressedLogs.length > 0 && totalFocusTime < 60) {
      text += " Anda terlihat sedang mengalami masa sulit belakangan ini. Tidak apa-apa produktivitas menurun, utamakan kesehatan mental Anda dulu."
    }

    return text
  }, [chartData, totalFocusTime, avgFocusTime, aiLogs, timeRange])

  // Handle Print
  useEffect(() => {
    if (isPrinting) {
      const handleAfterPrint = () => setIsPrinting(false)
      window.addEventListener('afterprint', handleAfterPrint)
      window.print()
      return () => window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [isPrinting])

  if (isPrinting) {
    // --- PRINT VIEW (FORMAL REPORT) ---
    return (
      <div className="bg-white text-black p-10 min-h-screen font-serif absolute inset-0 z-[1000]">
        <div className="border-b-2 border-black pb-6 mb-8 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Laporan Produktivitas</h1>
          <p className="text-xl">Sistem Manajemen Fokus Flow</p>
          <p className="text-gray-600 mt-4">Tanggal Cetak: {format(new Date(), 'dd MMMM yyyy', { locale: id })}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">Informasi Pengguna</h2>
          <table className="w-full text-left">
            <tbody>
              <tr><th className="py-2 w-1/3">Nama Lengkap:</th><td>{user?.name || 'Pengguna'}</td></tr>
              <tr><th className="py-2">Email:</th><td>{user?.email || '-'}</td></tr>
              <tr><th className="py-2">Rentang Laporan:</th><td className="capitalize">{timeRange === 'week' ? 'Mingguan' : timeRange === 'month' ? 'Bulanan' : 'Tahunan'}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">Ringkasan Eksekutif</h2>
          <p className="leading-relaxed text-justify mb-4">{insights}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">Metrik Kinerja</h2>
          <table className="w-full text-left border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-3">Indikator</th>
                <th className="border border-black p-3">Nilai Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-3">Total Waktu Fokus</td>
                <td className="border border-black p-3">{Math.floor(totalFocusTime / 60)} Jam {totalFocusTime % 60} Menit</td>
              </tr>
              <tr>
                <td className="border border-black p-3">Rata-rata Fokus Harian</td>
                <td className="border border-black p-3">{Math.floor(avgFocusTime / 60)} Jam {avgFocusTime % 60} Menit</td>
              </tr>
              <tr>
                <td className="border border-black p-3">Total Sesi Kerja Selesai</td>
                <td className="border border-black p-3">{sessions.length} Sesi</td>
              </tr>
              <tr>
                <td className="border border-black p-3">Total Tugas Selesai</td>
                <td className="border border-black p-3">{tasks.filter(t => t.completed).length} Tugas</td>
              </tr>
              <tr>
                <td className="border border-black p-3">Tugas Habit Aktif</td>
                <td className="border border-black p-3">{tasks.filter(t => habitTaskIds.has(t.id) && t.completed).length} Selesai</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tugas dan Habit */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">Aktivitas Terkini</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Tugas Selesai (Terbaru)</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {tasks.filter(t => t.completed).slice(-5).map(t => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Riwayat Mood AI</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {aiLogs.slice(-5).map(l => (
                  <li key={l.id}>{new Date(l.date).toLocaleDateString('id-ID')} - <span className="font-semibold">{l.mood}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-24 text-gray-500 text-sm">
          <p>Dokumen ini di-generate secara otomatis oleh Fokus Flow System.</p>
        </div>
      </div>
    )
  }

  // --- NORMAL VIEW ---
  return (
    <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm p-6 lg:p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2 tracking-tight">
          <TrendingUp className="text-[#2563EB]" /> Analitik Produktivitas
        </h2>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="flex-1 lg:flex-none bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl px-4 py-2.5 outline-none font-medium text-[#334155]"
          >
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="year">Tahun Ini</option>
          </select>
          <button 
            onClick={() => setIsPrinting(true)}
            className="flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
          >
            <FileText size={18} /> <span className="hidden sm:inline">Buat Laporan</span>
          </button>
        </div>
      </div>

      {/* Smart Insights Box */}
      <div className="mb-8 bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] p-6 rounded-2xl border border-[#C7D2FE] flex items-start gap-4">
         <div className="bg-white p-3 rounded-full shadow-sm text-[#4F46E5] shrink-0">
           <BrainCircuit size={24} />
         </div>
         <div>
           <h3 className="text-[#3730A3] font-bold text-lg mb-1 flex items-center gap-1">
             <Sparkles size={16}/> Smart Insights
           </h3>
           <p className="text-[#4338CA] leading-relaxed text-sm md:text-base">
             {insights}
           </p>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#BFDBFE] transition-colors">
           <div className="flex items-center gap-2 text-[#64748B] mb-2 font-semibold text-sm">
              <Clock size={16} /> Total Waktu Fokus
           </div>
           <div className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter">
             {Math.floor(totalFocusTime / 60)}<span className="text-lg text-[#94A3B8]">j</span> {totalFocusTime % 60}<span className="text-lg text-[#94A3B8]">m</span>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#A7F3D0] transition-colors">
           <div className="flex items-center gap-2 text-[#64748B] mb-2 font-semibold text-sm">
              <Zap size={16} /> Rata-rata Harian
           </div>
           <div className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter">
             {Math.floor(avgFocusTime / 60)}<span className="text-lg text-[#94A3B8]">j</span> {avgFocusTime % 60}<span className="text-lg text-[#94A3B8]">m</span>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#FECACA] transition-colors">
           <div className="flex items-center gap-2 text-[#64748B] mb-2 font-semibold text-sm">
              <Target size={16} /> Sesi Selesai
           </div>
           <div className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter">
             {sessions.length} <span className="text-lg text-[#94A3B8] font-bold">Sesi</span>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-[#DDD6FE] transition-colors">
           <div className="flex items-center gap-2 text-[#64748B] mb-2 font-semibold text-sm">
              <Activity size={16} /> Total Habit Terpenuhi
           </div>
           <div className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter">
             {tasks.filter(h => habitTaskIds.has(h.id) && h.completed).length}<span className="text-lg text-[#94A3B8]">/{tasks.filter(h => habitTaskIds.has(h.id)).length}</span>
           </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[300px]">
        <h3 className="font-semibold text-[#0F172A] mb-6">Distribusi Durasi Fokus (Menit)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
            <RechartsTooltip 
              contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
              cursor={{ stroke: '#CBD5E1', strokeWidth: 2, strokeDasharray: '4 4' }}
            />
            <Area type="monotone" dataKey="minutes" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorMinutes)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB', stroke: '#EFF6FF', strokeWidth: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Mood Correlation Widget */}
      {aiLogs.length > 0 && (
        <div className="mt-8 bg-[#F8FAFD] p-6 rounded-2xl border border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
            <HeartHandshake size={18} className="text-[#F43F5E]" /> Analisis Mood & Performa (Dari AI)
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0]">
              <div className="text-xs font-semibold text-[#64748B] mb-1">Riwayat Suasana Hati</div>
              <div className="flex gap-2 flex-wrap">
                {aiLogs.slice(-5).map(log => (
                  <span key={log.id} className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                    log.mood === 'Stressed' ? 'bg-[#FEF2F2] text-[#EF4444]' :
                    log.mood === 'Negative' ? 'bg-[#F1F5F9] text-[#64748B]' :
                    log.mood === 'Positive' ? 'bg-[#ECFDF5] text-[#10B981]' :
                    'bg-[#EFF6FF] text-[#3B82F6]'
                  }`}>
                    {log.mood}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] text-sm text-[#334155] leading-relaxed italic border-l-4 border-l-[#F43F5E]">
              Sistem AI menganalisis percakapan Anda untuk memahami pola mood. Saat stres, pertimbangkan untuk menurunkan durasi target harian agar tidak burnout.
            </div>
          </div>
        </div>
      )}
      
      {/* Hide print view globally via CSS during print just in case */}
      <style>{`
        @media print {
          body > :not(#root) { display: none; }
        }
      `}</style>
    </div>
  )
}
