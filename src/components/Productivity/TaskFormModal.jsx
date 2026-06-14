import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Clock, Tag, Bell, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function TaskFormModal({ isOpen, onClose, onSave, initialTask }) {
  const categories = useStore(state => state.categories)
  
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    categoryId: categories[0]?.id || '',
    recurrence: 'none',
    notification: { enabled: false, leadTime: '60', sound: 'bell', duration: 5 }
  })

  // Reset form when modal opens or initialTask changes
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTaskData({
          ...initialTask,
          recurrence: initialTask.recurrence || 'none'
        })
      } else {
        setTaskData({
          title: '',
          description: '',
          date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          categoryId: categories[0]?.id || '',
          recurrence: 'none',
          notification: { enabled: false, leadTime: '60', sound: 'bell', duration: 5 }
        })
      }
    }
  }, [isOpen, initialTask, categories])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskData.title.trim()) return
    onSave(taskData)
    onClose()
  }

  const isEditing = !!initialTask

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[28px] border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFD] flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-[#0F172A]">
            {isEditing ? 'Ubah Tugas' : 'Tugas Baru'}
          </h2>
          <button onClick={onClose} className="text-[#64748B] hover:bg-[#E2E8F0] p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div>
            <input 
              type="text" required autoFocus
              value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})}
              placeholder="Apa yang ingin Anda selesaikan?" 
              className="w-full text-xl font-semibold bg-transparent border-b-2 border-[#CBD5E1] focus:border-[#2563EB] outline-none pb-3 transition-colors"
            />
          </div>
          
          <div>
            <textarea
              value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})}
              placeholder="Tambahkan deskripsi detail (opsional)..."
              className="w-full text-[15px] bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl p-4 focus:border-[#2563EB] outline-none resize-none h-24 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-[#64748B] mb-2 font-semibold text-sm">
                  <Clock size={16} className="text-[#2563EB]"/> Tanggal & Waktu
                </label>
                <input 
                  type="datetime-local" 
                  value={taskData.date} 
                  onChange={e => setTaskData({...taskData, date: e.target.value})} 
                  className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2563EB] p-3 rounded-xl outline-none font-medium text-[#334155] transition-colors" 
                  required 
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[#64748B] mb-2 font-semibold text-sm">
                  <Tag size={16} className="text-[#2563EB]"/> Kategori
                </label>
                <select 
                  value={taskData.categoryId} 
                  onChange={e => setTaskData({...taskData, categoryId: e.target.value})} 
                  className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2563EB] p-3 rounded-xl outline-none font-medium text-[#334155] transition-colors" 
                  required
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#64748B] mb-2 font-semibold text-sm">Pengulangan (Habit)</label>
                <select 
                  value={taskData.recurrence} 
                  onChange={e => setTaskData({...taskData, recurrence: e.target.value})} 
                  className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2563EB] p-3 rounded-xl outline-none font-medium text-[#334155] transition-colors"
                >
                  <option value="none">Hanya Sekali (Tidak Diulang)</option>
                  <option value="daily_week">Harian (1 Minggu Ke Depan)</option>
                  <option value="daily_month">Harian (1 Bulan Ke Depan)</option>
                  <option value="daily_year">Harian (1 Tahun Ke Depan)</option>
                  <option value="weekly">Mingguan (Pada Hari Yang Sama)</option>
                </select>
                {taskData.recurrence !== 'none' && (
                  <p className="text-xs text-[#2563EB] mt-2 font-medium bg-blue-50 p-2 rounded-lg border border-blue-100">
                    ✨ Tugas ini akan otomatis dicatat ke dalam Habit Tracker Anda!
                  </p>
                )}
              </div>

              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-4 rounded-xl transition-colors hover:border-[#CBD5E1]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={taskData.notification.enabled} 
                    onChange={e => setTaskData({...taskData, notification: {...taskData.notification, enabled: e.target.checked}})} 
                    className="w-5 h-5 accent-[#2563EB] rounded" 
                  />
                  <div className="flex items-center gap-2">
                    <Bell size={18} className={taskData.notification.enabled ? "text-[#2563EB]" : "text-[#94A3B8]"} />
                    <span className={`font-semibold ${taskData.notification.enabled ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>Ingatkan Saya</span>
                  </div>
                </label>
                
                {taskData.notification.enabled && (
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                    <select 
                      value={taskData.notification.leadTime} 
                      onChange={e => setTaskData({...taskData, notification: {...taskData.notification, leadTime: e.target.value}})}
                      className="w-full bg-white border border-[#CBD5E1] focus:border-[#2563EB] p-2 rounded-lg outline-none text-sm font-medium"
                    >
                      <option value="60">1 Jam sebelum</option>
                      <option value="180">3 Jam sebelum</option>
                      <option value="720">12 Jam sebelum</option>
                      <option value="1440">1 Hari sebelum</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
        
        <div className="p-6 border-t border-[#E2E8F0] bg-white flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 text-[#64748B] hover:bg-[#F1F5F9] rounded-xl text-[15px] font-semibold transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-[15px] font-bold shadow-lg shadow-blue-500/30 transition-colors"
          >
            {isEditing ? 'Simpan Perubahan' : 'Buat Tugas'}
          </button>
        </div>
      </div>
    </div>
  )
}
