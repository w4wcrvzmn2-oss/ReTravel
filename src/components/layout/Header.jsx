import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Moon, Sun, ShoppingCart, User, Menu, X, Plane, Building, Info } from 'lucide-react'
import useThemeStore from '../../store/useThemeStore'
import useAuthStore from '../../store/useAuthStore'
import useCartStore from '../../store/useCartStore'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggle } = useThemeStore()
  const { user, logout } = useAuthStore()
  const cartCount = useCartStore((s) => s.getCount())
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const links = [
    { to: '/search', label: 'Туры' },
    { to: '/destinations', label: 'Направления' },
    { to: '/flights', label: 'Авиабилеты', icon: Plane },
    { to: '/hotels', label: 'Отели', icon: Building },
    { to: '/about', label: 'О нас', icon: Info },
  ]

  const headerClass = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    isHome && !scrolled ? 'bg-transparent' : 'glass shadow-sm',
  ].join(' ')

  return (
    <header className={headerClass}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* лого */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white">
              Re<span className="text-primary-500">Travel</span>
            </span>
          </Link>

          {/* десктопная навигация */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={[
                  'px-3 py-2 rounded-lg font-medium transition-colors text-sm',
                  location.pathname === l.to.split('?')[0]
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700',
                ].join(' ')}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* правый блок */}
          <div className="flex items-center gap-2">
            {/* тема */}
            <button onClick={toggle} className="btn-ghost p-2 rounded-xl" aria-label="Переключить тему">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* корзина */}
            <Link to="/cart" className="btn-ghost p-2 rounded-xl relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-accent-500 text-white text-[10px] font-bold rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* авторизация */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/cabinet" className="btn-ghost px-3 py-2 rounded-xl">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:flex btn-primary py-2 px-4 text-sm">Войти</Link>
            )}

            {/* бургер */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn-ghost p-2 rounded-xl"
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* мобильная панель */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-gray-200 dark:border-dark-700 px-4 py-4 flex flex-col gap-1 animate-slide-up">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-gray-200 dark:border-dark-700 mt-2 pt-2">
            {user ? (
              <>
                <Link to="/cabinet" className="px-4 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="px-4 py-3 text-red-500 w-full text-left"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-primary w-full justify-center mt-1">Войти</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
