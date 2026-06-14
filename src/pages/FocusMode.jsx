import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Square, Volume2, VolumeX, Maximize, Minimize, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function FocusMode() {
  const navigate = useNavigate()
  const addSession = useStore(state => state.addSession)
  
  // Pre-session State
  const [hasStarted, setHasStarted] = useState(false)
  const [taskName, setTaskName] = useState('')

  // Timer State (Stopwatch: Count Up)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('work') // work, break
  
  // Tracking breakdown
  const [workTime, setWorkTime] = useState(0)
  const [breakTime, setBreakTime] = useState(0)

  // Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

  // Fullscreen & Summary
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  // Timer Logic
  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1)
        if (mode === 'work') setWorkTime(t => t + 1)
        else setBreakTime(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, mode])

  const toggleTimer = () => setIsActive(!isActive)

  const handleFinish = () => {
    setIsActive(false)
    if (document.fullscreenElement) document.exitFullscreen()
    setShowSummary(true)
    
    // Save to analytics (convert seconds to minutes, min 1 min)
    const durationMinutes = Math.max(1, Math.round(workTime / 60))
    addSession({ 
      taskName: taskName || 'Deep Work', 
      duration: durationMinutes, 
      breakDuration: Math.round(breakTime / 60),
      type: 'stopwatch' 
    })
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Music Logic
  const toggleMusic = () => {
    if (isPlayingMusic) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlayingMusic(!isPlayingMusic)
  }
  const toggleMute = () => {
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Fullscreen Logic
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // --- RENDERS ---

  if (showSummary) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[32px] p-10 max-w-lg w-full text-center relative overflow-hidden">
           <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
           
           <div className="w-20 h-20 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle2 size={40} />
           </div>
           
           <h2 className="text-3xl font-black text-[#0F172A] mb-2 tracking-tight">Sesi Selesai!</h2>
           <p className="text-[#64748B] mb-8 font-medium">Luar biasa! Inilah hasil fokusmu untuk "{taskName || 'Deep Work'}":</p>
           
           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#F8FAFD] p-6 rounded-2xl border border-[#E2E8F0]">
                <p className="text-sm text-[#64748B] font-semibold mb-1">Total Kerja</p>
                <p className="text-3xl font-bold text-[#2563EB]">{formatTime(workTime)}</p>
              </div>
              <div className="bg-[#ECFDF5] p-6 rounded-2xl border border-[#D1FAE5]">
                <p className="text-sm text-[#065F46] font-semibold mb-1">Total Istirahat</p>
                <p className="text-3xl font-bold text-[#10B981]">{formatTime(breakTime)}</p>
              </div>
           </div>

           <button 
             onClick={() => navigate('/dashboard')}
             className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-4 rounded-xl transition-all"
           >
             Kembali ke Dashboard
           </button>
        </div>
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-[32px] p-8 lg:p-12 max-w-md w-full shadow-2xl">
          <button onClick={() => navigate('/dashboard')} className="text-[#64748B] hover:text-[#0F172A] mb-8 flex items-center gap-2 font-medium transition-colors">
            <ArrowLeft size={18} /> Kembali
          </button>
          
          <h2 className="text-3xl font-bold text-[#0F172A] mb-2 tracking-tight">Mulai Sesi Fokus</h2>
          <p className="text-[#64748B] mb-8 leading-relaxed">Tuliskan satu hal penting yang akan Anda selesaikan di sesi ini.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); setHasStarted(true); setIsActive(true); }}>
            <input 
              type="text" 
              autoFocus
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Cth: Menyelesaikan Bab 1..."
              className="w-full text-lg font-semibold bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2563EB] rounded-xl px-5 py-4 outline-none mb-6 transition-colors"
            />
            <button 
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2"
            >
              Mulai Sekarang <Play size={18} fill="currentColor" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col relative overflow-hidden transition-colors duration-1000 font-sans">
      {/* Background Ambience */}
      <div className={`absolute inset-0 opacity-20 transition-all duration-1000 ${mode === 'work' ? 'bg-blue-600' : 'bg-green-500'}`}>
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-white blur-[120px] rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-white blur-[120px] rounded-full mix-blend-overlay"></div>
      </div>

      <audio 
        ref={audioRef} 
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" 
      />

      {/* Header Controls */}
      <div className="relative z-10 flex justify-between items-center p-6 lg:p-10">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 font-medium tracking-wide">
             Mengerjakan: <span className="font-bold text-white ml-1">{taskName}</span>
          </div>
        </div>
        <button 
          onClick={toggleFullscreen}
          className="p-3 bg-white/5 rounded-full hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          {isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Mode Selector */}
        <div className="flex bg-white/5 p-1.5 rounded-full backdrop-blur-md border border-white/10 mb-12 relative overflow-hidden">
          <div className={`absolute top-1.5 bottom-1.5 w-[50%] rounded-full transition-transform duration-500 ease-out ${mode === 'work' ? 'translate-x-0 bg-blue-500 shadow-lg shadow-blue-500/40' : 'translate-x-full bg-green-500 shadow-lg shadow-green-500/40'}`}></div>
          <button 
            onClick={() => setMode('work')}
            className={`w-32 py-2 rounded-full font-bold relative z-10 transition-colors duration-300 ${mode === 'work' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Fokus
          </button>
          <button 
            onClick={() => setMode('break')}
            className={`w-32 py-2 rounded-full font-bold relative z-10 transition-colors duration-300 ${mode === 'break' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Istirahat
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-16 group flex flex-col items-center">
          {/* Glowing ring */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] opacity-30 transition-opacity duration-1000 ${mode === 'work' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
          
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter tabular-nums drop-shadow-2xl relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            {formatTime(timeElapsed)}
          </h1>
          <p className="relative z-10 font-medium tracking-[0.2em] text-white/50 uppercase mt-4">
            {mode === 'work' ? 'Sedang Fokus' : 'Sedang Istirahat'}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-[#0F172A] transition-all shadow-2xl hover:scale-105 ${mode === 'work' ? 'bg-white hover:bg-blue-50' : 'bg-white hover:bg-green-50'}`}
          >
            {isActive ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor" className="ml-2"/>}
          </button>
          <button 
            onClick={handleFinish}
            className="w-16 h-16 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md flex items-center justify-center text-red-100 hover:text-white transition-all border border-red-500/30 hover:scale-105 group"
            title="Selesai"
          >
            <Square size={24} fill="currentColor" className="group-hover:scale-90 transition-transform"/>
          </button>
        </div>

      </div>

      {/* Footer Music Player */}
      <div className="relative z-10 p-6 lg:p-10 flex justify-center">
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full shadow-2xl">
           <button 
             onClick={toggleMusic}
             className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
           >
             {isPlayingMusic ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
           </button>
           <div className="px-4 border-l border-r border-white/10 flex items-center gap-4">
             <div>
               <p className="text-sm font-semibold tracking-wide">Deep Focus Lofi</p>
               <p className="text-[10px] text-white/50 uppercase tracking-wider">Menemani Sesi Anda</p>
             </div>
             <div className="flex items-end gap-1 h-4 opacity-70 w-8">
                {[1,2,3,4].map(i => (
                  <div 
                    key={i} 
                    className="w-1 bg-blue-300 rounded-full"
                    style={{
                      height: isPlayingMusic ? `${Math.random() * 100}%` : '20%',
                      animation: isPlayingMusic ? `bounce ${0.4 + Math.random()}s infinite alternate` : 'none'
                    }}
                  />
                ))}
             </div>
           </div>
           <button 
             onClick={toggleMute}
             className="p-2 text-slate-300 hover:text-white transition-colors"
           >
             {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
           </button>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  )
}
