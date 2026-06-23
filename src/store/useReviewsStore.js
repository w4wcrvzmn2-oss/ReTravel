import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useReviewsStore = create(
  persist(
    (set, get) => ({
      reviews: {},

      getReviews: (tourId) => get().reviews[String(tourId)] || [],

      addReview: (tourId, review) => {
        const key = String(tourId)
        const existing = get().reviews[key] || []
        set({
          reviews: {
            ...get().reviews,
            [key]: [{ ...review, id: Date.now() }, ...existing],
          },
        })
      },
    }),
    { name: 'retravel-reviews' }
  )
)

export default useReviewsStore
