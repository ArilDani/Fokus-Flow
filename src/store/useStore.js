import { create } from 'zustand'

const getDefaultCategories = () => [
  { id: 'cat-1', name: 'Pribadi', color: '#3B82F6' },
  { id: 'cat-2', name: 'Pekerjaan', color: '#10B981' },
  { id: 'cat-3', name: 'Belajar', color: '#8B5CF6' }
];

// Helper to safely get data and optionally migrate old global data
const loadUserData = (userId, key, defaultData) => {
  const userKey = `fokus-flow-${userId}-${key}`;
  const globalKey = `fokus-flow-${key}`;
  
  // Try to get user specific data
  const userData = localStorage.getItem(userKey);
  if (userData) return JSON.parse(userData);

  // If no user data, try to migrate from global data (only once)
  const globalData = localStorage.getItem(globalKey);
  if (globalData) {
    const parsed = JSON.parse(globalData);
    localStorage.setItem(userKey, globalData); // Save to user specific key
    localStorage.removeItem(globalKey); // Delete global data so other new users don't get it
    return parsed;
  }

  return defaultData;
}

export const useStore = create((set, get) => ({
  user: null, // { id, name, email, role, status }
  
  // Dashboard mock state
  landingContent: {
    heroTitle: "Fokus Sepenuhnya, Stres Berkurang",
    heroSubtitle: "Sistem manajemen produktivitas berbasis neurosains yang memadukan teknik Pomodoro, smart to-do list, dan soundscape lofi untuk peak performance Anda."
  },
  setLandingContent: (content) => set({ landingContent: content }),

  // User-specific data
  categories: [],
  tasks: [],
  aiLogs: [],
  sessions: [],

  setUser: (user) => {
    if (user) {
      // Load user-specific data from localStorage
      set({
        user,
        categories: loadUserData(user.id, 'categories', getDefaultCategories()),
        tasks: loadUserData(user.id, 'tasks', []),
        aiLogs: loadUserData(user.id, 'ailogs', []),
        sessions: loadUserData(user.id, 'sessions', [])
      });
    } else {
      set({ user: null, categories: [], tasks: [], aiLogs: [], sessions: [] });
    }
  },

  logout: () => set({ user: null, categories: [], tasks: [], aiLogs: [], sessions: [] }),
  
  setCategories: (categories) => {
    const { user } = get();
    if (user) localStorage.setItem(`fokus-flow-${user.id}-categories`, JSON.stringify(categories));
    set({ categories });
  },

  setTasks: (tasks) => {
    const { user } = get();
    if (user) localStorage.setItem(`fokus-flow-${user.id}-tasks`, JSON.stringify(tasks));
    set({ tasks });
  },

  addAILog: (log) => set((state) => {
    if (!state.user) return state;
    const newLogs = [...state.aiLogs, { ...log, id: Date.now().toString(), date: new Date().toISOString() }];
    localStorage.setItem(`fokus-flow-${state.user.id}-ailogs`, JSON.stringify(newLogs));
    return { aiLogs: newLogs };
  }),
  
  addSession: (session) => set((state) => {
    if (!state.user) return state;
    const newSessions = [...state.sessions, { ...session, id: Date.now().toString(), date: new Date().toISOString() }];
    localStorage.setItem(`fokus-flow-${state.user.id}-sessions`, JSON.stringify(newSessions));
    return { sessions: newSessions };
  }),
}))
