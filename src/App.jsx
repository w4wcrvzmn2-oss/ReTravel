import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Toast from './components/ui/Toast'
import ComparePanel from './components/ui/ComparePanel'
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
import useThemeStore from './store/useThemeStore'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const NO_FOOTER = ['/auth']
const NO_HEADER = []

export default function App() {
  const { isDark, hydrate } = useThemeStore()
  const { pathname } = useLocation()

  useEffect(() => {
    hydrate(isDark)
  }, [])

  const showFooter = !NO_FOOTER.includes(pathname)
  const showHeader = !NO_HEADER.includes(pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {showHeader && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/compare" element={<Compare />} />

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

      {showFooter && <Footer />}

      {/* глобальные оверлеи */}
      <Toast />
      <ComparePanel />
    </div>
  )
}
