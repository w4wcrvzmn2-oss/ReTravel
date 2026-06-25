import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Moon, Sun, ShoppingCart, User, Menu, X, Plane, Building, Info,
  LayoutDashboard, Users, BarChart2, ChevronDown, Settings,
} from 'lucide-react'
import useThemeStore from '../../store/useThemeStore'
import useAuthStore from '../../store/useAuthStore'
import useCartStore from '../../store/useCartStore'

// панели доступные по роли
const PANELS = {
  admin:   [
    { to: '/admin',   label: 'Админ-панель',   icon: LayoutDashboard, color: 'text-red-500' },
    { to: '/crm',     label: 'CRM',             icon: BarChart2,       color: 'text-violet-500' },
    { to: '/partner', label: 'Партнёр',         icon: Settings,        color: 'text-accent-500' },
  ],
  manager: [
    { to: '/crm', label: 'CRM', icon: BarChart2, color: 'text-violet-500' },
  ],
  partner: [
    { to: '/partner', label: 'Мои туры', icon: Settings, color: 'text-accent-500' },
  ],
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggle } = useThemeStore()
  const { user, logout } = useAuthStore()
  const cartCount = useCartStore((s) => s.getCount())
  const location = useLocation()
  const navigate = useNavigate()
  const panelRef = useRef(null)

  const isHome = location.pathname === '/'
  const panels = user ? (PANELS[user.role] || []) : []

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setPanelOpen(false) }, [location.pathname])

  // закрываем дропдаун при клике снаружи
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const links = [
    { to: '/search', label: 'Туры' },
    { to: '/destinations', label: 'Направления' },
    { to: '/flights', label: 'Авиабилеты' },
    { to: '/hotels', label: 'Отели' },
    { to: '/about', label: 'О нас' },
  ]

  const headerClass = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    isHome && !scrolled
      ? 'bg-transparent'
      : 'glass shadow-[0_1px_0_rgba(60,40,20,.08)] dark:shadow-[0_1px_0_rgba(255,255,255,.06)]',
  ].join(' ')

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={headerClass}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* лого */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-[11px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_2px_8px_rgba(232,93,61,.35)]">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-xl text-ink dark:text-sand-50">
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
                  'relative px-3 py-2 font-semibold transition-colors text-sm font-sans',
                  location.pathname === l.to
                    ? 'text-primary-500'
                    : 'text-sand-600 dark:text-sand-400 hover:text-ink dark:hover:text-sand-50',
                ].join(' ')}
              >
                {l.label}
                {location.pathname === l.to && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* правый блок */}
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="btn-ghost p-2 rounded-xl" aria-label="Тема">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/cart" className="btn-ghost p-2 rounded-xl relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent-500 text-white text-[10px] font-bold rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-1">
                {/* дропдаун панелей — только если есть доступ хотя бы к одной */}
                {panels.length > 0 && (
                  <div ref={panelRef} className="relative">
                    <button
                      onClick={() => setPanelOpen(!panelOpen)}
                      className={[
                        'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        panelOpen
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700',
                      ].join(' ')}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Панели
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${panelOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {panelOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 rounded-2xl shadow-xl py-1.5 z-50">
                        {panels.map((p) => {
                          const Icon = p.icon
                          return (
                            <Link
                              key={p.to}
                              to={p.to}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${p.color}`} />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                <Link to="/cabinet" className="btn-ghost px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:flex btn-primary py-2 px-5 text-sm rounded-full">Войти</Link>
            )}

            {/* На мобиле навигация через BottomNav — бургер не нужен */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden btn-ghost p-2 rounded-xl"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* мобильная панель */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-gray-200 dark:border-dark-700 px-4 py-4 flex flex-col gap-1 animate-slide-up">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              {l.label}
            </Link>
          ))}

          {panels.length > 0 && (
            <>
              <div className="my-1 h-px bg-gray-200 dark:bg-dark-700" />
              <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Панели управления</p>
              {panels.map((p) => {
                const Icon = p.icon
                return (
                  <Link key={p.to} to={p.to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span className="font-medium">{p.label}</span>
                  </Link>
                )
              })}
            </>
          )}

          <div className="border-t border-gray-200 dark:border-dark-700 mt-2 pt-2">
            {user ? (
              <>
                <Link to="/cabinet" className="px-4 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="px-4 py-3 text-red-500 w-full text-left text-sm">Выйти</button>
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
