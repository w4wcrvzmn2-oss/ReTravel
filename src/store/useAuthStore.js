import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth as authApi } from '../lib/api'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      // вызывается один раз при старте — восстанавливаем сессию по refresh-токену
      init: async () => {
        const refresh = localStorage.getItem('rt_refresh')
        if (!refresh) return

        const ok = await authApi.refresh()
        if (!ok) return

        try {
          const user = await authApi.me()
          set({ user })
        } catch {
          set({ user: null })
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const data = await authApi.register(name, email, password)
          authApi.setToken(data.access)
          localStorage.setItem('rt_refresh', data.refresh)
          set({ user: data.user, isLoading: false })
          return { ok: true }
        } catch (e) {
          const msg = e?.error || 'Ошибка регистрации'
          set({ error: msg, isLoading: false })
          return { ok: false, error: msg }
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const data = await authApi.login(email, password)
          authApi.setToken(data.access)
          localStorage.setItem('rt_refresh', data.refresh)
          set({ user: data.user, isLoading: false })
          return { ok: true }
        } catch (e) {
          const msg = e?.error || 'Неверный email или пароль'
          set({ error: msg, isLoading: false })
          return { ok: false, error: msg }
        }
      },

      logout: async () => {
        try { await authApi.logout() } catch {}
        set({ user: null, error: null })
      },

      updateProfile: async (updates) => {
        set({ isLoading: true })
        try {
          const user = await authApi.updateProfile(updates)
          set({ user, isLoading: false })
          return { ok: true }
        } catch (e) {
          set({ isLoading: false })
          return { ok: false, error: e?.error }
        }
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
