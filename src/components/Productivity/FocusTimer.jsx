import { useNavigate } from 'react-router-dom'
import { Play, Flame, Target } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { parseISO, isToday } from 'date-fns'

export default function FocusTimer() {
  const navigate = useNavigate()
  const sessions = useStore(state => state.sessions)

  // Calculate today's focus time
  const todaySessions = sessions.filter(s => s.date && isToday(parseISO(s.date)))
  const todayMinutes = todaySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0)

  return (
    <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm p-6 lg:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
      
      <div className="mb-6 relative z-10">
        <h3 className="text-[#64748B] font-semibold mb-2">Fokus Hari Ini</h3>
        <div className="text-5xl font-black text-[#0F172A] tracking-tighter">
          {Math.floor(todayMinutes / 60)}<span className="text-2xl text-[#94A3B8] font-bold">j</span> {todayMinutes % 60}<span className="text-2xl text-[#94A3B8] font-bold">m</span>
        </div>
      </div>

      <div className="flex gap-4 mb-8 text-sm font-medium text-[#64748B] relative z-10">
        <div className="flex items-center gap-1.5 bg-[#F8FAFD] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
           <Target size={16} className="text-blue-500" /> {todaySessions.length} Sesi
        </div>
        <div className="flex items-center gap-1.5 bg-[#F8FAFD] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
           <Flame size={16} className="text-orange-500" /> Sedang on-fire
        </div>
      </div>

      <button 
        onClick={() => navigate('/focus')}
        className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg relative z-10"
      >
        <Play size={18} fill="currentColor" /> Masuk Focus Mode
      </button>
    </div>
  )
}
