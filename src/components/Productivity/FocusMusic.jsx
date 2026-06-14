import { useState, useRef } from 'react'
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function FocusMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className="bg-[#1E293B] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB] rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
      
      {/* Hidden audio element (Using a free lofi stream or mock) */}
      <audio 
        ref={audioRef} 
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" 
      />

      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="font-bold flex items-center gap-2">
          <Music size={18} className="text-[#3B82F6]" /> Focus Music
        </h3>
        <span className="text-xs bg-[#334155] px-2 py-1 rounded-md text-[#CBD5E1]">Lofi Stream</span>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center hover:bg-[#2563EB] transition-colors shadow-lg shadow-blue-500/20"
        >
          {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium">Deep Focus Lofi</p>
          <p className="text-xs text-[#94A3B8]">Menemani sesi kerjamu</p>
        </div>
        <button 
          onClick={toggleMute}
          className="p-2 text-[#94A3B8] hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      
      {/* Equalizer animation when playing */}
      <div className="flex items-end gap-1 h-6 mt-4 opacity-50 relative z-10">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <div 
            key={i} 
            className="w-full bg-[#3B82F6] rounded-t-sm"
            style={{
              height: isPlaying ? `${Math.random() * 100}%` : '4px',
              transition: 'height 0.2s ease',
              animation: isPlaying ? `bounce ${0.5 + Math.random()}s infinite alternate` : 'none'
            }}
          />
        ))}
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
