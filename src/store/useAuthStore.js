import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── встроенные демо-аккаунты ─────────────────────────────────
const DEMO_USERS = [
  { id: 1, name: 'Администратор', email: 'admin@retravel.ru',   password: 'admin123',   role: 'admin'   },
  { id: 2, name: 'Партнёр',       email: 'partner@retravel.ru', password: 'partner123', role: 'partner' },
  { id: 3, name: 'Менеджер',      email: 'manager@retravel.ru', password: 'manager123', role: 'manager' },
]

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem('rt_users') || '[]') } catch { return [] }
}
function saveLocalUsers(users) {
  localStorage.setItem('rt_users', JSON.stringify(users))
}
function allUsers() {
  return [...DEMO_USERS, ...getLocalUsers()]
}
function stripPassword({ password, ...u }) { return u }

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      // при старте ничего делать не нужно — user берётся из persist
      init: () => {},

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 400))

        const exists = allUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (exists) {
          const msg = 'Пользователь с таким email уже существует'
          set({ error: msg, isLoading: false })
          return { ok: false, error: msg }
        }

        const localUsers = getLocalUsers()
        const newUser = {
          id: Date.now(),
          name,
          email: email.toLowerCase(),
          password,
          role: 'user',
        }
        saveLocalUsers([...localUsers, newUser])

        const user = stripPassword(newUser)
        set({ user, isLoading: false })
        return { ok: true }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        await new Promise((r) => setTimeout(r, 400))

        const found = allUsers().find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )

        if (!found) {
          const msg = 'Неверный email или пароль'
          set({ error: msg, isLoading: false })
          return { ok: false, error: msg }
        }

        const user = stripPassword(found)
        set({ user, isLoading: false })
        return { ok: true }
      },

      logout: () => {
        set({ user: null, error: null })
      },

      updateProfile: async (updates) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 300))

        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
          isLoading: false,
        }))

        // обновляем в localStorage если это не демо-пользователь
        const localUsers = getLocalUsers()
        const idx = localUsers.findIndex((u) => u.id === updates.id)
        if (idx !== -1) {
          localUsers[idx] = { ...localUsers[idx], ...updates }
          saveLocalUsers(localUsers)
        }

        return { ok: true }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'retravel-auth',
      partialize: (s) => ({ user: s.user }),
    }
  )
)

export default useAuthStore
