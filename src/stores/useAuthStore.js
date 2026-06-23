import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth as authApi } from '../lib/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      // вызывается при старте приложения
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
          set({ error: e.error || 'Ошибка регистрации', isLoading: false })
          return { ok: false, error: e.error }
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
          set({ error: e.error || 'Неверный email или пароль', isLoading: false })
          return { ok: false, error: e.error }
        }
      },

      logout: async () => {
        try { await authApi.logout() } catch {}
        set({ user: null, error: null })
      },

      updateProfile: async (data) => {
        set({ isLoading: true })
        try {
          const user = await authApi.updateProfile(data)
          set({ user, isLoading: false })
          return { ok: true }
        } catch (e) {
          set({ isLoading: false })
          return { ok: false, error: e.error }
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
