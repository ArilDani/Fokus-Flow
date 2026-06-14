import { useState } from 'react'
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  isSameMonth, isSameDay, addDays, parseISO 
} from 'date-fns'
import { id } from 'date-fns/locale' 
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, X, CheckCircle2, Circle } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function ActivityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null) // null means no modal is open
  
  const tasks = useStore(state => state.tasks)
  const setTasks = useStore(state => state.setTasks)
  const categories = useStore(state => state.categories)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  
  const onDateClick = (day) => setSelectedDate(day)
  const closeModal = () => setSelectedDate(null)

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
  }

  const getCategoryColor = (catId) => categories?.find(c => c.id === catId)?.color || '#94A3B8'
  const getCategoryName = (catId) => categories?.find(c => c.id === catId)?.name || 'Tanpa Kategori'

  // --- Render Header ---
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
          <CalIcon className="text-[#2563EB]" /> Kalender
        </h2>
      </div>
    )
  }

  // --- Render Days (Sun, Mon, Tue...) ---
  const renderDays = () => {
    const dateFormat = "EEEE"
    const days = []
    let startDate = startOfWeek(currentDate)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-semibold text-sm text-[#64748B] py-2" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: id }).substring(0, 3)}
        </div>
      )
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>
  }

  // --- Render Cells ---
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = "d"
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)
        const cloneDay = day
        
        // Tasks for this day
        const dayActivities = tasks.filter(act => act.date && isSameDay(parseISO(act.date), cloneDay))

        days.push(
          <div
            className={`min-h-[100px] p-2 border border-[#E2E8F0] -ml-[1px] -mt-[1px] cursor-pointer transition-all hover:shadow-inner ${
              !isSameMonth(day, monthStart)
                ? "bg-[#F8FAFD] text-[#CBD5E1]"
                : isSameDay(day, new Date())
                ? "bg-[#EFF6FF] border-[#BFDBFE]"
                : "bg-white hover:bg-[#F8FAFD]"
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <span className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'bg-[#2563EB] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md' : 'text-[#334155]'}`}>
                {formattedDate}
              </span>
            </div>
            
            <div className="mt-2">
              {dayActivities.length === 1 ? (
                <div className="text-[11px] bg-[#E0E7FF] text-[#3730A3] px-2 py-1 rounded truncate border border-[#C7D2FE] font-medium shadow-sm">
                  {dayActivities[0].title}
                </div>
              ) : dayActivities.length > 1 ? (
                <div className="text-[11px] bg-[#2563EB] text-white px-2 py-1 rounded border border-[#1D4ED8] font-bold shadow-sm inline-block">
                  {dayActivities.length} Tugas
                </div>
              ) : null}
            </div>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      )
      days = []
    }
    return <div className="border-t border-l border-[#E2E8F0]">{rows}</div>
  }

  // Activity List for selected day (Modal Content)
  const selectedDayActivities = selectedDate ? tasks.filter(act => act.date && isSameDay(parseISO(act.date), selectedDate)) : []

  return (
    <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm p-6 lg:p-8 flex flex-col h-full relative">
      {renderHeader()}

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-2xl text-[#0F172A] capitalize tracking-tight">
          {format(currentDate, 'MMMM yyyy', { locale: id })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2.5 border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFD] transition-colors"><ChevronLeft size={20} className="text-[#64748B]"/></button>
          <button onClick={nextMonth} className="p-2.5 border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFD] transition-colors"><ChevronRight size={20} className="text-[#64748B]"/></button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {renderDays()}
        {renderCells()}
      </div>

      {/* Task Details Modal */}
      {selectedDate && (
        <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-[28px]">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFD]">
              <h3 className="font-bold text-lg text-[#0F172A]">
                Tugas: {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
              </h3>
              <button onClick={closeModal} className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              {selectedDayActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalIcon size={24} className="text-[#94A3B8]" />
                  </div>
                  <p className="text-[#64748B] font-medium">Tidak ada tugas di hari ini.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayActivities.map(task => (
                    <div key={task.id} className={`p-4 rounded-xl border ${task.completed ? 'bg-[#F8FAFD] border-[#E2E8F0] opacity-70' : 'bg-white border-[#E2E8F0] shadow-sm'}`}>
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleTask(task.id)} className="shrink-0 mt-0.5 transition-transform hover:scale-110">
                          {task.completed ? <CheckCircle2 size={20} className="text-[#10B981]" /> : <Circle size={20} className="text-[#CBD5E1] hover:text-[#2563EB]" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm ${task.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-2 text-[10px]">
                            <span className="flex items-center gap-1 font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9]" style={{ color: getCategoryColor(task.categoryId) }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryColor(task.categoryId) }}></span>
                              {getCategoryName(task.categoryId)}
                            </span>
                            <span className="text-[#94A3B8] font-medium">
                              {format(parseISO(task.date), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[#E2E8F0] bg-white">
              <button 
                onClick={closeModal}
                className="w-full py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-sm rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
