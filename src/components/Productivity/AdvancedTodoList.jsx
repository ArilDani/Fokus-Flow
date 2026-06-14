import { useState, useMemo } from 'react'
import { format, isToday, parseISO, isPast, isWithinInterval, addDays, startOfDay } from 'date-fns'
import { id } from 'date-fns/locale'
import { Plus, Bell, Tag, Clock, CheckCircle2, Circle, Trash2, Edit3, Settings } from 'lucide-react'
import { useStore } from '../../store/useStore'
import TaskFormModal from './TaskFormModal'

export default function AdvancedTodoList() {
  const tasks = useStore(state => state.tasks)
  const setTasks = useStore(state => state.setTasks)
  const categories = useStore(state => state.categories)
  const setCategories = useStore(state => state.setCategories)
  const habits = useStore(state => state.habits)
  const setHabits = useStore(state => state.setHabits)

  const [filterTime, setFilterTime] = useState('today') // today, week, month, year, all
  const [filterCategory, setFilterCategory] = useState('all')

  const [isAdding, setIsAdding] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Category Management State
  const [isManagingCategories, setIsManagingCategories] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState('#2563EB')

  const filteredTasks = useMemo(() => {
    // Apply category and time filters first
    const timeAndCategoryFiltered = tasks.filter(task => {
      // Category Filter
      if (filterCategory !== 'all' && task.categoryId !== filterCategory) return false;

      // Time Filter
      if (!task.date) return filterTime === 'all';
      const taskDate = parseISO(task.date);
      const start = startOfDay(new Date());
      switch (filterTime) {
        case 'today': return isToday(taskDate);
        case 'week': return isWithinInterval(taskDate, { start, end: addDays(start, 7) });
        case 'month': return isWithinInterval(taskDate, { start, end: addDays(start, 30) });
        case 'year': return isWithinInterval(taskDate, { start, end: addDays(start, 365) });
        default: return true;
      }
    });

    // Sort chronologically (earliest first)
    timeAndCategoryFiltered.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Deduplicate recurring (habit) tasks: keep only the first UNCOMPLETED instance per title+category
    const seenHabits = new Set();
    const result = [];
    for (const task of timeAndCategoryFiltered) {
      if ((task.isHabit || (task.recurrence && task.recurrence !== 'none')) && typeof task.title === 'string') {
        const habitKey = task.title.toLowerCase().trim();
        if (seenHabits.has(habitKey)) continue; // already displayed
        if (task.completed) continue; // skip completed instances, await next uncompleted
        seenHabits.add(habitKey);
        result.push(task);
      } else {
        result.push(task);
      }
    }
    return result;
  }, [tasks, filterTime, filterCategory]);

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task (including possible recurrence change or title change)
      const oldTitle = editingTask.title;
      const newTitle = taskData.title;
      // Remove all previous instances of this habit/recurring task for both old and new titles
      const filtered = tasks.filter(t => !(
        (t.title === oldTitle || t.title === newTitle) &&
        (t.isHabit || (t.recurrence && t.recurrence !== 'none'))
      ));
      // Regenerate tasks according to the (potentially) new recurrence
      const tasksToAdd = [];
      const baseDate = parseISO(taskData.date);
      const isHabit = taskData.recurrence !== 'none';
      if (taskData.recurrence === 'weekly') {
        for (let i = 0; i < 52; i++) {
          const taskDate = new Date(baseDate);
          taskDate.setDate(taskDate.getDate() + i * 7);
          tasksToAdd.push({
            ...taskData,
            date: format(taskDate, "yyyy-MM-dd'T'HH:mm"),
            id: Date.now().toString() + i,
            completed: false,
            isHabit: true,
          });
        }
      } else {
        let daysCount = 1;
        if (taskData.recurrence === 'daily_week') daysCount = 7;
        else if (taskData.recurrence === 'daily_month') daysCount = 30;
        else if (taskData.recurrence === 'daily_year') daysCount = 365;
        for (let i = 0; i < daysCount; i++) {
          const taskDate = new Date(baseDate);
          taskDate.setDate(taskDate.getDate() + i);
          tasksToAdd.push({
            ...taskData,
            date: format(taskDate, "yyyy-MM-dd'T'HH:mm"),
            id: Date.now().toString() + i,
            completed: false,
            isHabit,
          });
        }
      }
      setTasks([...filtered, ...tasksToAdd]);
      setEditingTask(null);
      setIsAdding(false);
      return;
    }

    // Adding new task
    const tasksToAdd = []
    const baseDate = parseISO(taskData.date)
    const isHabit = taskData.recurrence !== 'none'
    
    if (taskData.recurrence === 'weekly') {
      // 52 weeks (1 year)
      for (let i = 0; i < 52; i++) {
        const taskDate = new Date(baseDate)
        taskDate.setDate(taskDate.getDate() + (i * 7))
        tasksToAdd.push({
          ...taskData,
          date: format(taskDate, "yyyy-MM-dd'T'HH:mm"),
          id: Date.now().toString() + i, // unique ID
          completed: false,
          isHabit: true
        })
      }
    } else {
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
    }

    setTasks([...tasks, ...tasksToAdd])
    setIsAdding(false)
  }

  const handleEditClick = (task) => {
    setEditingTask(task)
    setIsAdding(true)
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if(!newCatName.trim()) return
    setCategories([...categories, { id: Date.now().toString(), name: newCatName, color: newCatColor }])
    setNewCatName('')
  }

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id))
    // Move tasks to another category or empty
    setTasks(tasks.map(t => t.categoryId === id ? { ...t, categoryId: categories[0]?.id || '' } : t))
  }

  const getCategoryColor = (id) => categories.find(c => c.id === id)?.color || '#94A3B8'
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Tanpa Kategori'

  return (
    <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm p-6 lg:p-8 flex flex-col h-full overflow-hidden">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          Master To-Do List
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Time Filter */}
          <div className="bg-[#F1F5F9] rounded-lg p-1 flex text-sm">
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: 'week', label: 'Minggu' },
              { id: 'month', label: 'Bulan' },
              { id: 'year', label: 'Tahun' },
              { id: 'all', label: 'Semua' }
            ].map(mode => (
              <button 
                key={mode.id}
                onClick={() => setFilterTime(mode.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${filterTime === mode.id ? 'bg-white shadow text-[#2563EB]' : 'text-[#64748B]'}`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button onClick={() => setIsManagingCategories(!isManagingCategories)} className="p-2 text-[#64748B] hover:text-[#2563EB] bg-[#F1F5F9] rounded-lg">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Category Manager */}
      {isManagingCategories && (
        <div className="mb-6 p-4 bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl">
          <h3 className="font-semibold text-sm mb-3 text-[#0F172A]">Kelola Kategori</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(c => (
              <div key={c.id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#E2E8F0] text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                {c.name}
                <button onClick={() => deleteCategory(c.id)} className="text-red-400 hover:text-red-600 ml-1"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddCategory} className="flex items-center gap-2">
            <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nama Kategori Baru" className="px-3 py-1.5 text-sm border rounded-lg outline-none flex-1" />
            <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
            <button type="submit" className="bg-[#2563EB] text-white px-3 py-1.5 rounded-lg text-sm font-medium">Tambah</button>
          </form>
        </div>
      )}

      {isAdding && (
        <TaskFormModal 
          isOpen={true}
          onClose={() => { setIsAdding(false); setEditingTask(null); }} 
          onSave={handleSaveTask}
          initialTask={editingTask}
        />
      )}

      <button 
        onClick={() => setIsAdding(true)}
        className="mb-6 w-full py-4 border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-xl text-[#64748B] hover:text-[#2563EB] font-medium flex items-center justify-center gap-2 transition-colors bg-[#F8FAFD] hover:bg-[#EFF6FF]"
      >
        <Plus size={20} /> Tambah Kegiatan Baru
      </button>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] text-center">
            <CheckCircle2 size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Tidak ada tugas ditemukan.</p>
            <p className="text-sm">Silakan tambah tugas baru atau ubah filter Anda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => {
              const isOverdue = task.date && !task.completed && isPast(parseISO(task.date)) && !isToday(parseISO(task.date));
              return (
                <div key={task.id} className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${task.completed ? 'bg-[#F8FAFD] border-[#E2E8F0] opacity-60' : isOverdue ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm'}`}>
                  
                  <button onClick={() => toggleTask(task.id)} className="shrink-0 transition-transform hover:scale-110">
                    {task.completed ? <CheckCircle2 size={24} className="text-[#10B981]" /> : <Circle size={24} className="text-[#CBD5E1] hover:text-[#2563EB]" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-[15px] truncate ${task.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className={`text-sm mt-0.5 line-clamp-2 ${task.completed ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="flex items-center gap-1 font-medium" style={{ color: getCategoryColor(task.categoryId) }}>
                         <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryColor(task.categoryId) }}></span>
                         {getCategoryName(task.categoryId)}
                      </span>
                      {task.date && (
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-[#64748B]'}`}>
                          <Clock size={12} /> 
                          {format(parseISO(task.date), 'dd MMM yyyy, HH:mm', { locale: id })}
                        </span>
                      )}
                      {task.notification?.enabled && (
                        <span className="flex items-center gap-1 text-[#2563EB] bg-blue-50 px-1.5 rounded">
                          <Bell size={12} /> {task.notification.leadTime}m
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(task)} className="text-[#94A3B8] hover:text-[#2563EB] p-2 transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-[#94A3B8] hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
