import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { dbService } from '../services/db'
import { 
  Users, LayoutTemplate, LayoutDashboard, LogOut, CheckCircle, XCircle 
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users') // 'users', 'content', 'productivity'
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  const currentUser = useStore((state) => state.user)
  const logout = useStore((state) => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers()
    }
  }, [currentUser])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await dbService.getUsers()
    
    if (data) setUsers(data)
    setLoading(false)
  }

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await dbService.updateStatus(id, newStatus)
    
    if (!error) {
      fetchUsers() // refresh
    }
  }

  const handleDelete = async (id) => {
    const { error } = await dbService.deleteUser(id)
    
    if (!error) {
      fetchUsers()
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-[#F8FAFD] text-[#0F172A] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#2563EB] flex items-center gap-2">
            <LayoutDashboard size={24} />
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
          >
            <Users size={20} />
            Pendaftar (User)
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'content' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
          >
            <LayoutTemplate size={20} />
            Konten Landing Page
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            <LayoutDashboard size={20} />
            Buka Produktivitas
          </button>
        </nav>
        <div className="p-4 border-t border-[#E2E8F0]">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-[#64748B]">{currentUser.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {activeTab === 'users' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-1">Manajemen Pengguna</h1>
                <p className="text-[#64748B] text-sm">Terima atau tolak pendaftaran akses Fokus Flow.</p>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#2563EB]">
                Total User: {users.filter(u => u.role !== 'admin').length} / 20
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.08)] overflow-hidden border border-[#E2E8F0]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFD] border-b border-[#E2E8F0] text-sm text-[#64748B]">
                    <th className="py-4 px-6 font-semibold">Nama & Email</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Tanggal Daftar</th>
                    <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="py-8 text-center text-[#64748B]">Memuat data...</td></tr>
                  ) : users.filter(u => u.role !== 'admin').length === 0 ? (
                    <tr><td colSpan="4" className="py-8 text-center text-[#64748B]">Belum ada pengguna terdaftar.</td></tr>
                  ) : (
                    users.filter(u => u.role !== 'admin').map((user) => (
                      <tr key={user.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFD] transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-[#64748B]">{user.email}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.status === 'active' ? 'Disetujui' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-[#64748B]">
                          {new Date(user.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(user.id, 'active')}
                                className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                                title="Setujui (Acc)"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                if(confirm('Yakin ingin menghapus user ini?')) handleDelete(user.id)
                              }}
                              className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                              title="Hapus / Tolak"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Konten Landing Page</h1>
            <p className="text-[#64748B] text-sm mb-8">Ubah teks utama yang tampil di beranda aplikasi.</p>

            <div className="bg-white p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.08)] border border-[#E2E8F0]">
              <p className="text-[#64748B] text-sm mb-4">
                <em>*Fitur edit konten landing page akan tersedia setelah database konten dibuat di Supabase. Untuk saat ini hanya UI Demo.</em>
              </p>
              <div className="space-y-5 opacity-70 pointer-events-none">
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-2">Hero Title</label>
                  <input type="text" value="Fokus Sepenuhnya, Stres Berkurang" className="w-full px-4 py-3 rounded-md border border-[#E2E8F0]" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-2">Hero Subtitle</label>
                  <textarea rows="3" className="w-full px-4 py-3 rounded-md border border-[#E2E8F0]" readOnly value="Sistem manajemen produktivitas berbasis neurosains yang memadukan teknik Pomodoro, smart to-do list, dan soundscape lofi untuk peak performance Anda." />
                </div>
                <button className="bg-[#2563EB] text-white px-6 py-2 rounded-md font-semibold">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
