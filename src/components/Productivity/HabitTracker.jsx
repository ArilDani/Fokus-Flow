import { useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { isSameDay, parseISO, startOfWeek, addDays } from 'date-fns'
import { CheckCircle2, Circle } from 'lucide-react'

export default function HabitTracker() {
  const tasks = useStore(state => state.tasks)
  const setTasks = useStore(state => state.setTasks)

  const habits = useMemo(() => {
    // 1. Find habit names by detecting task titles that appear more than once (or are explicitly marked isHabit)
    const titleCounts = {}
    tasks.forEach(t => {
      if (!t.title || typeof t.title !== 'string' || !t.title.trim()) return;
      const title = t.title.toLowerCase().trim()
      titleCounts[title] = (titleCounts[title] || 0) + 1
    })
    
    const habitNames = [...new Set(
      tasks.filter(t => typeof t.title === 'string' && t.title.trim() && (t.isHabit || titleCounts[t.title.toLowerCase().trim()] > 1))
           .map(t => t.title.toLowerCase().trim())
    )]
    
    // 2. Build habit object with 7 days progress
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday

    return habitNames.map(name => {
      // Find tasks matching this name
      const matchingTasks = tasks.filter(t => typeof t.title === 'string' && t.title.toLowerCase().trim() === name)
      const originalTitle = matchingTasks[0]?.title || name

      // Build progress array for Monday (0) to Sunday (6)
      const progress = Array(7).fill(false)
      const taskIdsPerDay = Array(7).fill(null) // Keep track of the task ID to toggle it

      for (let i = 0; i < 7; i++) {
        const currentDay = addDays(weekStart, i)
        // Find if there's a task for this day
        const taskForDay = matchingTasks.find(t => isSameDay(parseISO(t.date), currentDay))
        if (taskForDay) {
          progress[i] = taskForDay.completed
          taskIdsPerDay[i] = taskForDay.id
        }
      }

      return {
        id: name,
        name: originalTitle,
        progress,
        taskIdsPerDay
      }
    })
  }, [tasks])

  const toggleHabit = (taskId) => {
    if (!taskId) return
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
  }

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

  return (
    <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm flex flex-col h-[500px] overflow-hidden relative">
      <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFD] shrink-0">
        <h2 className="font-bold text-[#0F172A]">Habit Tracker</h2>
        <p className="text-xs text-[#64748B] mt-1">Lacak kebiasaan baik Anda setiap hari</p>
      </div>

      <div className="flex justify-between px-5 pt-4 pb-2 shrink-0">
        {days.map((d, i) => (
           <div key={i} className="flex-1 flex justify-center">
             <span className="text-[10px] font-bold text-[#94A3B8] uppercase">{d}</span>
           </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-0">
        {habits.length === 0 ? (
          <p className="text-[#94A3B8] text-sm py-4 text-center mt-4">Belum ada kebiasaan.<br/>Buat tugas "Berulang" di To-Do List untuk memulainya.</p>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="flex flex-col mb-3 last:mb-0 bg-[#F8FAFD] p-3 rounded-xl border border-[#E2E8F0]">
              <span className="text-[#334155] font-bold text-sm mb-3 pl-1" title={habit.name}>{habit.name}</span>
              <div className="flex justify-between">
                {habit.progress.map((isDone, idx) => {
                  const taskId = habit.taskIdsPerDay[idx]
                  return (
                    <div key={idx} className="flex-1 flex justify-center">
                      <button 
                        onClick={() => toggleHabit(taskId)}
                        disabled={!taskId}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                        !taskId ? 'bg-transparent border border-dashed border-[#CBD5E1] cursor-not-allowed opacity-30' :
                        isDone 
                          ? 'bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-sm shadow-emerald-500/20' 
                          : 'bg-white border border-[#CBD5E1] text-transparent hover:border-[#2563EB] hover:text-[#2563EB] shadow-sm'
                      }`}
                      title={!taskId ? 'Tidak dijadwalkan' : isDone ? 'Selesai' : 'Belum selesai'}
                      >
                        {isDone && <CheckCircle2 size={18} />}
                        {!isDone && taskId && <Circle size={18} />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
