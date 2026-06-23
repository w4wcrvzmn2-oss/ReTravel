import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (tourId) => {
        const ids = get().ids
        const wasFav = ids.includes(tourId)
        set({ ids: wasFav ? ids.filter((id) => id !== tourId) : [...ids, tourId] })
        return !wasFav
      },

      isFav: (tourId) => get().ids.includes(tourId),

      clear: () => set({ ids: [] }),
    }),
    { name: 'retravel-favorites' }
  )
)

export default useFavoritesStore
