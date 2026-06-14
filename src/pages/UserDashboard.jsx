import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { 
  LogOut, Settings, LayoutDashboard, Calendar, Activity, 
  BrainCircuit, Music, Play, ListTodo
} from 'lucide-react'
import FocusTimer from '../components/Productivity/FocusTimer'
import AdvancedTodoList from '../components/Productivity/AdvancedTodoList'
import MiniTodoList from '../components/Productivity/MiniTodoList'
import HabitTracker from '../components/Productivity/HabitTracker'
import FocusMusic from '../components/Productivity/FocusMusic'
import ActivityCalendar from '../components/Productivity/ActivityCalendar'
import ProductivityAnalytics from '../components/Productivity/ProductivityAnalytics'
import NotificationSystem from '../components/Productivity/NotificationSystem'
import AIAssistant from '../components/Productivity/AIAssistant'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, todo, calendar, analytics, ai
  const currentUser = useStore((state) => state.user)
  const logout = useStore((state) => state.logout)
  const addAILog = useStore(state => state.addAILog)
  const navigate = useNavigate()

  // Mood State Logic
  const [morningMood, setMorningMood] = useState(() => localStorage.getItem(`fokus-flow-${currentUser?.id || 'guest'}-morning-mood`))
  const [eveningMood, setEveningMood] = useState(() => localStorage.getItem(`fokus-flow-${currentUser?.id || 'guest'}-evening-mood`))
  const [currentHour, setCurrentHour] = useState(new Date().getHours())

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000)
    return () => clearInterval(interval)
  }, [])

  const handleMoodSelect = (mood, type) => {
    if (type === 'morning') {
      setMorningMood(mood)
      localStorage.setItem(`fokus-flow-${currentUser?.id || 'guest'}-morning-mood`, mood)
    } else {
      setEveningMood(mood)
      localStorage.setItem(`fokus-flow-${currentUser?.id || 'guest'}-evening-mood`, mood)
    }

    addAILog({ prompt: `Pengguna mencatat mood manual: ${mood}`, mood: mood, response: 'Dicatat oleh sistem.' })

    if (mood === 'Negative' || mood === 'Stressed') {
      if (window.confirm('Sepertinya Anda sedang merasa kurang baik. Apakah Anda ingin ngobrol dengan Fokus AI untuk menceritakan hal ini?')) {
        setActiveTab('ai')
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!currentUser || currentUser.status === 'pending') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-[#F8FAFD] text-[#0F172A] font-sans">
      <NotificationSystem />
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-[#E2E8F0] flex flex-col transition-all shrink-0">
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-center lg:justify-start">
          <div className="w-8 h-8 bg-[#2563EB] rounded-md flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-blue-500/20">
            FF
          </div>
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight">Fokus Flow</span>
        </div>
        
        <div className="p-4 border-b border-[#E2E8F0]">
          <button 
            onClick={() => navigate('/focus')}
            className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 lg:p-4 rounded-xl font-bold bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            <Play size={20} fill="currentColor" />
            <span className="hidden lg:block">Mulai Fokus</span>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 flex flex-col items-center lg:items-stretch overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
          >
            <LayoutDashboard size={20} />
            <span className="hidden lg:block">Beranda</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('todo')}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'todo' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
          >
            <ListTodo size={20} />
            <span className="hidden lg:block">To-Do List</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'calendar' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
          >
            <Calendar size={20} />
            <span className="hidden lg:block">Kalender</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg font-medium transition-colors ${activeTab === 'analytics' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
          >
            <Activity size={20} />
            <span className="hidden lg:block">Analitik</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg font-medium transition-colors mt-4 bg-gradient-to-r ${activeTab === 'ai' ? 'from-[#4F46E5] to-[#2563EB] text-white shadow-md' : 'from-[#EEF2FF] to-[#E0E7FF] text-[#4F46E5] hover:shadow-md border border-[#C7D2FE]'}`}
          >
            <BrainCircuit size={20} />
            <span className="hidden lg:block font-bold">Fokus AI</span>
          </button>
          
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin-dashboard')}
              className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg font-medium text-[#64748B] hover:bg-[#F1F5F9] transition-colors mt-auto"
            >
              <Settings size={20} />
              <span className="hidden lg:block">Admin Panel</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-[#E2E8F0] flex flex-col items-center lg:items-stretch">
          <div className="hidden lg:block mb-4 px-2">
            <p className="text-sm font-semibold truncate text-[#0F172A]">{currentUser.name}</p>
            <p className="text-xs text-[#64748B] truncate">{currentUser.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center lg:justify-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
            title="Keluar"
          >
            <LogOut size={18} /> 
            <span className="hidden lg:block">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4 lg:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            {activeTab === 'dashboard' ? `Halo, ${currentUser.name.split(' ')[0]} 👋` : 
             activeTab === 'todo' ? 'Master To-Do List' :
             activeTab === 'calendar' ? 'Jadwal Aktivitas' : 
             activeTab === 'ai' ? 'Asisten AI Fokus Flow' : 'Perkembanganmu'}
          </h1>
          <p className="text-[#64748B]">
            {activeTab === 'dashboard' ? 'Mari selesaikan tugas-tugas penting hari ini.' : 
             activeTab === 'todo' ? 'Kelola semua tugas, target, dan jadwal Anda.' :
             activeTab === 'calendar' ? 'Atur harimu dan jangan lewatkan sesi fokusmu.' : 
             activeTab === 'ai' ? 'Teman curhat & konsultan produktivitas pribadi Anda.' :
             'Pantau konsistensimu membangun kebiasaan baik.'}
          </p>
        </header>

        {activeTab === 'calendar' && <ActivityCalendar />}
        {activeTab === 'analytics' && <ProductivityAnalytics />}
        {activeTab === 'todo' && <AdvancedTodoList />}
        {activeTab === 'ai' && <AIAssistant />}
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Wider) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Top row in left col */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FocusTimer />
                <div className="flex flex-col gap-6">
                  <FocusMusic />
                  <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-[#64748B] mb-2 flex items-center gap-2">
                      <BrainCircuit size={16} className="text-[#2563EB]" /> AI Assistant
                    </h3>
                    <p className="text-sm text-[#334155] leading-relaxed">
                      Sesi kerjamu cukup intens hari ini. Jangan lupa ambil istirahat panjang setelah 1 pomodoro lagi untuk menjaga mood.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom row in left col */}
              <MiniTodoList onSeeAll={() => setActiveTab('todo')} />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              <HabitTracker />
              {/* Mood Tracker */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                 <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-[#2563EB]" /> Mood Hari Ini
                </h3>
                
                {currentHour < 12 ? (
                  <div className="mb-4">
                    <p className="text-xs text-[#64748B] mb-2 font-medium">Bagaimana perasaan Anda pagi ini?</p>
                    {morningMood ? (
                      <div className="flex justify-center bg-[#F8FAFD] p-4 rounded-xl border border-[#E2E8F0]">
                        <span className="text-4xl hover:scale-110 transition-transform cursor-default">
                          {morningMood === 'Negative' ? '😢' : morningMood === 'Stressed' ? '😐' : morningMood === 'Neutral' ? '😊' : '🤩'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-[#F8FAFD] p-3 rounded-xl border border-[#E2E8F0]">
                         <button onClick={() => handleMoodSelect('Negative', 'morning')} className="text-2xl hover:scale-125 transition-transform" title="Sedih">😢</button>
                         <button onClick={() => handleMoodSelect('Stressed', 'morning')} className="text-2xl hover:scale-125 transition-transform" title="Stres">😐</button>
                         <button onClick={() => handleMoodSelect('Neutral', 'morning')} className="text-2xl hover:scale-125 transition-transform" title="Biasa Saja">😊</button>
                         <button onClick={() => handleMoodSelect('Positive', 'morning')} className="text-2xl hover:scale-125 transition-transform" title="Senang">🤩</button>
                      </div>
                    )}
                  </div>
                ) : currentHour >= 18 ? (
                  <div>
                    <p className="text-xs text-[#64748B] mb-2 font-medium">Bagaimana perasaan Anda sore/malam ini?</p>
                    {eveningMood ? (
                      <div className="flex justify-center bg-[#F8FAFD] p-4 rounded-xl border border-[#E2E8F0]">
                        <span className="text-4xl hover:scale-110 transition-transform cursor-default">
                          {eveningMood === 'Negative' ? '😢' : eveningMood === 'Stressed' ? '😐' : eveningMood === 'Neutral' ? '😊' : '🤩'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-[#F8FAFD] p-3 rounded-xl border border-[#E2E8F0]">
                         <button onClick={() => handleMoodSelect('Negative', 'evening')} className="text-2xl hover:scale-125 transition-transform" title="Sedih">😢</button>
                         <button onClick={() => handleMoodSelect('Stressed', 'evening')} className="text-2xl hover:scale-125 transition-transform" title="Stres">😐</button>
                         <button onClick={() => handleMoodSelect('Neutral', 'evening')} className="text-2xl hover:scale-125 transition-transform" title="Biasa Saja">😊</button>
                         <button onClick={() => handleMoodSelect('Positive', 'evening')} className="text-2xl hover:scale-125 transition-transform" title="Senang">🤩</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-4 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0]">
                     <span className="text-3xl mb-2">☀️</span>
                     <p className="text-xs text-[#64748B] font-medium">Tetap semangat! Anda sudah mengisi mood pagi. Kembali lagi jam 6 sore.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
