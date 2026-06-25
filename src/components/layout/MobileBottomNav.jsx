import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react'
import useFavoritesStore from '../../store/useFavoritesStore'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'

const TABS = [
  { to: '/',          label: 'Главная',   icon: Home       },
  { to: '/search',    label: 'Туры',      icon: Search     },
  { to: '/favorites', label: 'Избранное', icon: Heart      },
  { to: '/cart',      label: 'Брони',     icon: ShoppingBag},
  { to: '/cabinet',   label: 'Профиль',   icon: User       },
]

export default function MobileBottomNav() {
  const { pathname } = useLocation()
  const cartCount  = useCartStore((s) => s.getCount())
  const favCount   = useFavoritesStore((s) => s.ids.length)
  const { user }   = useAuthStore()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-dark-800 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ to, label, icon: Icon }) => {
        const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
        const badge = to === '/cart' ? cartCount : to === '/favorites' ? favCount : 0
        const dest  = to === '/cabinet' && !user ? '/auth' : to

        return (
          <Link
            key={to}
            to={dest}
            className={[
              'relative flex-1 flex flex-col items-center justify-center py-2.5 gap-[3px] transition-colors',
              isActive ? 'text-primary-500' : 'text-sand-500 hover:text-sand-300',
            ].join(' ')}
          >
            {/* top indicator line */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full" />
            )}

            <div className="relative">
              <Icon
                className="w-[22px] h-[22px]"
                strokeWidth={isActive ? 2.2 : 1.7}
              />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-[3px] bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono leading-none">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>

            <span className="font-mono text-[9px] font-bold tracking-[.08em] leading-none uppercase">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
