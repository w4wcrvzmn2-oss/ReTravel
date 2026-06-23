import { create } from 'zustand'

const useCompareStore = create((set, get) => ({
  tours: [],

  add: (tour) => {
    const tours = get().tours
    if (tours.length >= 3 || tours.some((t) => t.id === tour.id)) return false
    set({ tours: [...tours, tour] })
    return true
  },

  remove: (tourId) =>
    set((s) => ({ tours: s.tours.filter((t) => t.id !== tourId) })),

  has: (tourId) => get().tours.some((t) => t.id === tourId),

  clear: () => set({ tours: [] }),
}))

export default useCompareStore
