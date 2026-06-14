// LocalStorage based Mock Database

const DB_KEY = 'fokus-flow-users'
const DELAY = 500

const delay = (ms) => new Promise(res => setTimeout(res, ms))

const getDb = () => {
  const data = localStorage.getItem(DB_KEY)
  if (data) return JSON.parse(data)
  
  // Seed admin
  const initialDb = [{
    id: 'admin-1',
    name: 'Arutia',
    email: 'arildani60@gmail.com',
    password: '#271106',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString()
  }]
  localStorage.setItem(DB_KEY, JSON.stringify(initialDb))
  return initialDb
}

const saveDb = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data))
}

export const dbService = {
  async login(email, password) {
    await delay(DELAY)
    const db = getDb()
    const user = db.find(u => u.email === email && u.password === password)
    if (!user) return { data: null, error: 'Email atau password salah.' }
    return { data: user, error: null }
  },

  async register(userData) {
    await delay(DELAY)
    const db = getDb()
    if (db.some(u => u.email === userData.email)) {
      return { error: 'Email sudah terdaftar.' }
    }
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    saveDb([...db, newUser])
    return { error: null }
  },

  async getUsers() {
    await delay(DELAY)
    const db = getDb()
    // Sort descending by created_at
    return { data: db.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), error: null }
  },

  async getUserCount() {
    await delay(DELAY)
    const db = getDb()
    return { count: db.length, error: null }
  },

  async updateStatus(id, newStatus) {
    await delay(DELAY)
    const db = getDb()
    const index = db.findIndex(u => u.id === id)
    if (index > -1) {
      db[index].status = newStatus
      saveDb(db)
    }
    return { error: null }
  },

  async deleteUser(id) {
    await delay(DELAY)
    let db = getDb()
    db = db.filter(u => u.id !== id)
    saveDb(db)
    return { error: null }
  }
}
