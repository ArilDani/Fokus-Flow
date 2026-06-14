import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { CheckCircle2, Circle, GripVertical, Plus, Trash2 } from 'lucide-react'

// Dummy initial data
const initialTasks = [
  { id: '1', content: 'Selesaikan laporan triwulan', completed: false },
  { id: '2', content: 'Review desain UI baru', completed: false },
  { id: '3', content: 'Balas email client', completed: true },
]

export default function SmartTodoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('fokus-flow-tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    localStorage.setItem('fokus-flow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setTasks(items)
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    setTasks([{ id: Date.now().toString(), content: newTask, completed: false }, ...tasks])
    setNewTask('')
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col flex-1 h-[400px]">
      <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFD]">
        <div>
          <h2 className="font-bold text-[#0F172A] flex items-center gap-2">
            Smart To-Do
            <span className="bg-[#2563EB] text-white text-[10px] px-2 py-0.5 rounded-full">Gamified</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-1">{completedCount} dari {tasks.length} selesai. Dapatkan +10XP tiap task!</p>
        </div>
        <div className="text-[#2563EB] font-bold text-lg">{completedCount * 10} XP</div>
      </div>

      <div className="p-4 border-b border-[#E2E8F0]">
        <form onSubmit={addTask} className="relative">
          <input 
            type="text" 
            placeholder="Tambah tugas baru..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full bg-[#F1F5F9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] pr-12"
          />
          <button type="submit" className="absolute right-2 top-2 p-1.5 text-white bg-[#2563EB] rounded-md hover:bg-[#1D4ED8]">
            <Plus size={16} />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${snapshot.isDragging ? 'border-[#2563EB] shadow-md bg-white' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'} transition-colors group`}
                      >
                        <div {...provided.dragHandleProps} className="text-[#94A3B8] cursor-grab active:cursor-grabbing hover:text-[#334155]">
                          <GripVertical size={18} />
                        </div>
                        <button onClick={() => toggleTask(task.id)} className="shrink-0">
                          {task.completed ? (
                            <CheckCircle2 size={22} className="text-[#10B981]" />
                          ) : (
                            <Circle size={22} className="text-[#CBD5E1] hover:text-[#2563EB]" />
                          )}
                        </button>
                        <span className={`flex-1 text-sm ${task.completed ? 'text-[#94A3B8] line-through' : 'text-[#334155]'}`}>
                          {task.content}
                        </span>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="text-[#94A3B8] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
