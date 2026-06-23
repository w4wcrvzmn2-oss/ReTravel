import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,

      toggle: () =>
        set((state) => {
          const next = !state.isDark
          if (next) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDark: next }
        }),

      // вызывается при инициализации приложения чтобы подтянуть тему из localStorage
      hydrate: (isDark) => {
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    }),
    { name: 'retravel-theme' }
  )
)

export default useThemeStore
