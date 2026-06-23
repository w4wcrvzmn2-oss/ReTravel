import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      login: (userData) => set({ user: userData }),

      logout: () => set({ user: null }),

      register: (userData) =>
        set({
          user: {
            ...userData,
            id: Date.now(),
            memberSince: new Date().toISOString().split('T')[0],
          },
        }),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'retravel-auth' }
  )
)

export default useAuthStore
