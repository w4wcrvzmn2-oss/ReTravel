import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_TIERS = [
  { id: 'new',       label: 'Новый',       rate: 12, bookingsMin: 0,   bookingsMax: 4,    color: 'blue'   },
  { id: 'standard',  label: 'Стандарт',    rate: 10, bookingsMin: 5,   bookingsMax: 19,   color: 'green'  },
  { id: 'top',       label: 'Топ-партнёр', rate: 8,  bookingsMin: 20,  bookingsMax: 49,   color: 'violet' },
  { id: 'pro',       label: 'Про',         rate: 6,  bookingsMin: 50,  bookingsMax: 9999, color: 'amber'  },
  { id: 'exclusive', label: 'Эксклюзив',   rate: 4,  bookingsMin: null, bookingsMax: null, color: 'rose', manual: true },
]

const DEFAULT_PROMOS = [
  {
    id: 'chechen',
    badge: '🏔️',
    label: '0% для новых туров по Чечне',
    description: 'Первые 6 месяцев без комиссии для операторов с уникальным чеченским контентом',
    type: 'fixed',
    rate: 0,
    active: true,
  },
  {
    id: 'welcome',
    badge: '🎉',
    label: 'Добро пожаловать — 6% первые 3 мес',
    description: 'Все новые партнёры платят 6% первые 3 месяца вне зависимости от объёма',
    type: 'fixed',
    rate: 6,
    active: true,
  },
  {
    id: 'volume',
    badge: '📈',
    label: 'Бонус объёма −2%',
    description: 'При 30 и более бронях за месяц ставка снижается на 2% автоматически',
    type: 'discount',
    rate: 2,
    active: false,
  },
  {
    id: 'summer26',
    badge: '☀️',
    label: 'Летняя акция 2026 −1%',
    description: 'В июне–августе 2026 ставка для всех партнёров снижена на 1%',
    type: 'discount',
    rate: 1,
    active: false,
  },
]

const useCommissionStore = create(
  persist(
    (set, get) => ({
      tiers: DEFAULT_TIERS,
      promos: DEFAULT_PROMOS,

      setTierRate: (id, rate) =>
        set((s) => ({
          tiers: s.tiers.map((t) => (t.id === id ? { ...t, rate: Math.max(0, Math.min(50, Number(rate))) } : t)),
        })),

      togglePromo: (id) =>
        set((s) => ({
          promos: s.promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
        })),

      // Вычисляет эффективную ставку по количеству броней
      getEffective: (totalBookings) => {
        const { tiers, promos } = get()
        const tier =
          tiers.find((t) => !t.manual && totalBookings >= t.bookingsMin && totalBookings <= t.bookingsMax) ||
          tiers[0]

        let rate = tier.rate

        // discount-акции применяются ко всем партнёрам
        promos.forEach((p) => {
          if (!p.active || p.type !== 'discount') return
          rate = Math.max(0, rate - p.rate)
        })

        const activePromos = promos.filter((p) => p.active)
        return { rate, tier, activePromos }
      },

      // Следующий уровень для партнёра
      getNextTier: (totalBookings) => {
        const { tiers } = get()
        const sorted = tiers.filter((t) => !t.manual).sort((a, b) => a.bookingsMin - b.bookingsMin)
        const current = sorted.find((t) => totalBookings >= t.bookingsMin && totalBookings <= t.bookingsMax)
        if (!current) return null
        const idx = sorted.indexOf(current)
        return sorted[idx + 1] || null
      },

      resetToDefaults: () => set({ tiers: DEFAULT_TIERS, promos: DEFAULT_PROMOS }),
    }),
    { name: 'rt-commissions' }
  )
)

export default useCommissionStore
