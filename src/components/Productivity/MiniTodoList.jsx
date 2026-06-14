import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { CheckCircle2, Circle, ArrowRight, ListTodo, Plus, Trash2, Edit3, Clock, Tag, Bell } from 'lucide-react'
import { isToday, parseISO, format } from 'date-fns'
import { id } from 'date-fns/locale'
import TaskFormModal from './TaskFormModal'

export default function MiniTodoList({ onSeeAll }) {
  const tasks = useStore(state => state.tasks)
  const setTasks = useStore(state => state.setTasks)
  const categories = useStore(state => state.categories)

  const [isAdding, setIsAdding] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Get tasks for today
  const todayTasks = tasks.filter(t => t.date && isToday(parseISO(t.date)))
  const uncompletedTasks = todayTasks.filter(t => !t.completed)
  const completedTasks = todayTasks.filter(t => t.completed)
  const completedCount = completedTasks.length

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t))
      setEditingTask(null)
      setIsAdding(false)
      return
    }

    const tasksToAdd = []
    const baseDate = parseISO(taskData.date)
    const isHabit = taskData.recurrence !== 'none'
    
    let daysCount = 1
    if (taskData.recurrence === 'daily_week') daysCount = 7
    else if (taskData.recurrence === 'daily_month') daysCount = 30
    else if (taskData.recurrence === 'daily_year') daysCount = 365

    for (let i = 0; i < daysCount; i++) {
      const taskDate = new Date(baseDate)
      taskDate.setDate(taskDate.getDate() + i)
      
      tasksToAdd.push({
        ...taskData,
        date: format(taskDate, "yyyy-MM-dd'T'HH:mm"),
        id: Date.now().toString() + i, // unique ID
        completed: false,
        isHabit
      })
    }

    setTasks([...tasks, ...tasksToAdd])
    setIsAdding(false)
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const getCategoryColor = (id) => categories.find(c => c.id === id)?.color || '#94A3B8'

  const renderTask = (task) => (
    <div key={task.id} className="flex items-start gap-3 group bg-white hover:bg-[#F8FAFD] p-3 rounded-xl transition-all border border-[#E2E8F0] hover:border-[#CBD5E1]">
      <button onClick={() => toggleTask(task.id)} className="shrink-0 mt-0.5 hover:scale-110 transition-transform">
        {task.completed ? <CheckCircle2 size={20} className="text-[#10B981]" /> : <Circle size={20} className="text-[#CBD5E1] hover:text-[#2563EB]" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <span className={`text-[15px] font-semibold block truncate ${task.completed ? 'text-[#94A3B8] line-through' : 'text-[#0F172A]'}`}>
          {task.title}
        </span>
        {task.description && (
          <p className={`text-xs mt-0.5 line-clamp-2 ${task.completed ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(task.categoryId) }}></span>
          <span className={`flex items-center gap-1 ${task.completed ? 'text-[#CBD5E1]' : 'text-[#64748B]'}`}>
            <Clock size={12} /> {format(parseISO(task.date), 'HH:mm')}
          </span>
          {task.notification?.enabled && (
             <Bell size={12} className={task.completed ? 'text-[#CBD5E1]' : 'text-[#2563EB]'} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => { setEditingTask(task); setIsAdding(true); }} className="text-[#94A3B8] hover:text-[#2563EB] p-1.5 transition-colors">
          <Edit3 size={16} />
        </button>
        <button onClick={() => deleteTask(task.id)} className="text-[#94A3B8] hover:text-red-500 p-1.5 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm flex flex-col h-[500px] overflow-hidden relative">
      <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFD] flex justify-between items-center shrink-0">
        <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
          <ListTodo className="text-[#2563EB]" /> Tugas Hari Ini
        </h2>
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold text-[#64748B] bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0]">{completedCount}/{todayTasks.length}</p>
          <button onClick={() => setIsAdding(true)} className="bg-[#2563EB] text-white p-1.5 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {todayTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
             <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                <ListTodo size={24} className="text-[#94A3B8]" />
             </div>
             <p className="text-[#64748B] text-sm font-medium">Belum ada tugas untuk hari ini.</p>
             <button onClick={() => setIsAdding(true)} className="mt-3 text-sm text-[#2563EB] font-bold hover:underline">Tambah Tugas Sekarang</button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Uncompleted Tasks */}
            {uncompletedTasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest px-1">Harus Diselesaikan</h3>
                {uncompletedTasks.map(renderTask)}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest px-1">Selesai</h3>
                {completedTasks.map(renderTask)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#E2E8F0] bg-white shrink-0">
        <button 
          onClick={onSeeAll}
          className="w-full py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#2563EB] font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Lihat Semua Filter <ArrowRight size={16} />
        </button>
      </div>

      {isAdding && (
        <TaskFormModal 
          isOpen={true} 
          onClose={() => { setIsAdding(false); setEditingTask(null); }} 
          onSave={handleSaveTask}
          initialTask={editingTask}
        />
      )}
    </div>
  )
}
