import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      orders: [],

      addItem: (tour, travelers = 1, date = '') => {
        const existing = get().items.find((i) => i.tour.id === tour.id)
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.tour.id === tour.id ? { ...i, travelers: i.travelers + travelers } : i
            ),
          }))
        } else {
          set((state) => ({
            items: [...state.items, { tour, travelers, date, addedAt: Date.now() }],
          }))
        }
      },

      removeItem: (tourId) =>
        set((state) => ({
          items: state.items.filter((i) => i.tour.id !== tourId),
        })),

      updateTravelers: (tourId, travelers) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.tour.id === tourId ? { ...i, travelers: Math.max(1, travelers) } : i
          ),
        })),

      getTotal: () => {
        const items = get().items
        return items.reduce((sum, i) => sum + i.tour.price * i.travelers, 0)
      },

      getCount: () => get().items.length,

      placeOrder: (contactInfo) => {
        const items = get().items
        const order = {
          id: `RT-${Date.now()}`,
          items: [...items],
          total: get().getTotal(),
          contact: contactInfo,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          orders: [...state.orders, order],
          items: [],
        }))
        return order
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'retravel-cart' }
  )
)

export default useCartStore
