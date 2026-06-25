import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MobileBottomNav from './components/layout/MobileBottomNav'
import Toast from './components/ui/Toast'
import ComparePanel from './components/ui/ComparePanel'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Home from './pages/Home'
import Search from './pages/Search'
import Destinations from './pages/Destinations'
import DestinationDetail from './pages/DestinationDetail'
import TourDetail from './pages/TourDetail'
import Auth from './pages/Auth'
import Cabinet from './pages/Cabinet'
import Cart from './pages/Cart'
import About from './pages/About'
import Flights from './pages/Flights'
import Hotels from './pages/Hotels'
import Compare from './pages/Compare'
import AdminPanel from './pages/admin/AdminPanel'
import CRMPanel from './pages/crm/CRMPanel'
import PartnerPanel from './pages/partner/PartnerPanel'
import useThemeStore from './store/useThemeStore'
import useAuthStore from './store/useAuthStore'

// панели используют свои sidebar'ы — скрываем глобальный header/footer
const PANEL_PREFIXES = ['/admin', '/crm', '/partner']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { isDark, hydrate } = useThemeStore()
  const { pathname } = useLocation()
  const initAuth = useAuthStore((s) => s.init)

  useEffect(() => {
    hydrate(isDark)
    initAuth()
  }, [])

  const isPanel = PANEL_PREFIXES.some((p) => pathname.startsWith(p))
  const isAuth = pathname === '/auth'

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isPanel && <Header />}

      <main className="flex-1 pb-[72px] md:pb-0">
        <Routes>
          {/* ─── публичные ─── */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/compare" element={<Compare />} />

          {/* ─── авторизованные ─── */}
          <Route path="/cabinet" element={
            <ProtectedRoute><Cabinet /></ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />

          {/* ─── панели (только sidebar, без глобального header/footer) ─── */}
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
          } />
          <Route path="/crm/*" element={
            <ProtectedRoute role="manager"><CRMPanel /></ProtectedRoute>
          } />
          <Route path="/partner/*" element={
            <ProtectedRoute role="partner"><PartnerPanel /></ProtectedRoute>
          } />

          <Route
            path="*"
            element={
              <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl font-black text-gray-100 dark:text-dark-800 mb-4">404</div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Страница не найдена</h1>
                  <a href="/" className="btn-primary inline-flex">На главную</a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {!isPanel && !isAuth && <Footer />}

      {/* Мобильная навигация (скрыта на десктопе и в панелях) */}
      {!isPanel && !isAuth && <MobileBottomNav />}

      {/* глобальные оверлеи */}
      <Toast />
      <ComparePanel />
    </div>
  )
}
