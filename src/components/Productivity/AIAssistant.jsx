import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Sparkles, BrainCircuit, HeartHandshake, Zap } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const RESPONSES = [
  {
    keywords: ['sedih', 'kecewa', 'gagal', 'menangis', 'buruk', 'down'],
    mood: 'Negative',
    reply: 'Saya mengerti ini pasti terasa berat. Tidak apa-apa untuk merasa sedih. Ambil napas dalam-dalam, dan ingat bahwa satu hari yang buruk bukan berarti kehidupan yang buruk. Apakah Anda ingin istirahat sejenak atau butuh saran ringan?'
  },
  {
    keywords: ['stres', 'capek', 'lelah', 'pusing', 'burnout', 'banyak'],
    mood: 'Stressed',
    reply: 'Sepertinya Anda sedang mengalami kelelahan mental. Sangat penting untuk menjeda aktivitas Anda. Cobalah teknik Pomodoro (25 menit kerja, 5 menit rehat) atau tinggalkan meja Anda sebentar untuk minum air putih. Kesehatan Anda nomor satu.'
  },
  {
    keywords: ['bingung', 'buntu', 'stuck', 'ide', 'susah'],
    mood: 'Confused',
    reply: 'Saat jalan buntu, otak biasanya butuh distraksi positif. Cobalah teknik SCAMPER yang kita bahas sebelumnya, atau berjalan-jalan kecil selama 10 menit. Kadang ide terbaik muncul saat kita tidak sedang memaksa otak bekerja.'
  },
  {
    keywords: ['semangat', 'senang', 'berhasil', 'sukses', 'bisa', 'fokus'],
    mood: 'Positive',
    reply: 'Luar biasa! Saya bisa merasakan energi positif Anda. Manfaatkan momentum ini untuk menyelesaikan tugas terpenting (Eat the Frog) atau melakukan "Deep Work". Pertahankan kerja bagus ini!'
  },
  {
    keywords: ['produktivitas', 'tips', 'saran', 'cara', 'waktu'],
    mood: 'Neutral',
    reply: 'Untuk meningkatkan produktivitas, cobalah mulai hari dengan merencanakan 3 tugas utama saja. Gunakan Master To-Do List kita untuk mengaturnya, dan nyalakan Focus Mode saat mengerjakannya. Hindari multitasking!'
  }
]

const DEFAULT_REPLY = "Saya mendengarkan. Silakan ceritakan lebih lanjut apa yang sedang Anda rasakan atau kerjakan. Saya siap membantu Anda tetap produktif namun juga sehat secara mental."

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'Halo! Saya AI Assistant dari Fokus Flow. Anda bisa berkonsultasi soal produktivitas, curhat masalah kesehatan mental, atau meminta tips manajemen waktu. Apa yang bisa saya bantu hari ini?', time: new Date() }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  
  const addAILog = useStore(state => state.addAILog)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userText = input.trim()
    const newMsg = { id: Date.now().toString(), sender: 'user', text: userText, time: new Date() }
    setMessages(prev => [...prev, newMsg])
    setInput('')

    // Simulate AI thinking
    setTimeout(() => {
      let matchedMood = 'Neutral'
      let replyText = DEFAULT_REPLY

      // Simple Pattern Matching
      const lowerInput = userText.toLowerCase()
      for (const pattern of RESPONSES) {
        if (pattern.keywords.some(kw => lowerInput.includes(kw))) {
          matchedMood = pattern.mood
          replyText = pattern.reply
          break
        }
      }

      // Log Mood to Analytics
      addAILog({
        prompt: userText,
        mood: matchedMood,
        response: replyText
      })

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date()
      }])
    }, 1000)
  }

  return (
    <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFD] flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#2563EB] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-[#0F172A] text-lg">Fokus AI Companion</h2>
            <p className="text-xs font-medium text-[#2563EB] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> Online
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex gap-3 text-xs font-medium text-[#64748B]">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
            <HeartHandshake size={14} className="text-[#F43F5E]"/> Kesehatan Mental
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
            <Zap size={14} className="text-[#EAB308]"/> Produktivitas
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#F8FAFD]/50 space-y-6">
        <div className="text-center mb-8">
          <span className="text-xs font-medium text-[#94A3B8] bg-[#F1F5F9] px-3 py-1 rounded-full">
            Percakapan ini dianalisis untuk Laporan Produktivitas Anda
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#2563EB] rounded-xl flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                <BrainCircuit size={16} />
              </div>
            )}
            
            <div className={`max-w-[75%] lg:max-w-[60%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#0F172A] text-white rounded-tr-sm' 
                    : 'bg-white text-[#334155] border border-[#E2E8F0] rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] font-medium text-[#94A3B8] mt-1.5 px-1">
                {format(msg.time, 'HH:mm')}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 bg-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] shrink-0 mt-1 shadow-inner">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#E2E8F0]">
        <form onSubmit={handleSend} className="flex gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ceritakan keluh kesah atau minta tips produktivitas..." 
              className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2563EB] outline-none rounded-xl py-3.5 pl-4 pr-12 text-[15px] text-[#0F172A] transition-colors shadow-inner"
            />
            <Sparkles size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
          </div>
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#94A3B8] text-white px-5 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center"
          >
            <Send size={20} className={input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  )
}
