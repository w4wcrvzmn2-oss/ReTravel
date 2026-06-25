import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Plane, Heart, User } from 'lucide-react'
import useFavoritesStore from '../../store/useFavoritesStore'
import useCartStore from '../../store/useCartStore'
import useAuthStore from '../../store/useAuthStore'

const LEFT_TABS = [
  { to: '/',       icon: Home,   label: 'Главная' },
  { to: '/search', icon: Search, label: 'Туры'    },
]
const RIGHT_TABS = [
  { to: '/favorites', icon: Heart, label: 'Избранное' },
  { to: '/cabinet',   icon: User,  label: 'Профиль'   },
]

export default function MobileBottomNav() {
  const { pathname } = useLocation()
  const cartCount  = useCartStore((s) => s.getCount())
  const favCount   = useFavoritesStore((s) => s.ids.length)
  const { user }   = useAuthStore()

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  function TabItem({ to, icon: Icon, label }) {
    const active = isActive(to)
    const badge  = to === '/cart' ? cartCount : to === '/favorites' ? favCount : 0
    const dest   = to === '/cabinet' && !user ? '/auth' : to

    return (
      <Link
        to={dest}
        className="flex-1 flex flex-col items-center justify-center gap-[5px] py-2"
      >
        <div className="relative">
          <Icon
            className="w-[22px] h-[22px] transition-colors"
            style={{ color: active ? '#e85d3d' : '#c7bfb0' }}
            strokeWidth={active ? 2.2 : 1.6}
          />
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-[3px] bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono leading-none">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </div>
        <span
          className="text-[10px] font-semibold leading-none transition-colors font-sans"
          style={{ color: active ? '#e85d3d' : '#9a9183' }}
        >
          {label}
        </span>
      </Link>
    )
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{ background: '#191512', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end" style={{ height: 64 }}>
        {LEFT_TABS.map((tab) => <TabItem key={tab.to} {...tab} />)}

        {/* Center FAB */}
        <div className="flex-1 flex items-center justify-center" style={{ paddingBottom: 8 }}>
          <Link
            to="/search"
            className="flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              background: '#e85d3d',
              borderRadius: 14,
              marginTop: -22,
              boxShadow: '0 6px 20px rgba(232,93,61,.55)',
            }}
          >
            <Plane className="w-5 h-5 text-white" />
          </Link>
        </div>

        {RIGHT_TABS.map((tab) => <TabItem key={tab.to} {...tab} />)}
      </div>
    </nav>
  )
}
