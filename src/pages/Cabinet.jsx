import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, Package, LogOut, ChevronRight, MapPin, Heart } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { orders as ordersApi, favorites as favoritesApi } from '../lib/api'
import TourCard from '../components/ui/TourCard'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

const TABS = [
  { id: 'orders', label: 'Бронирования', icon: Package },
  { id: 'favorites', label: 'Избранное', icon: Heart },
]

export default function Cabinet() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [favTours, setFavTours] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Личный кабинет — ReTravel'
    if (!user) { navigate('/auth'); return }
    loadOrders()
    loadFavorites()
  }, [user])

  async function loadOrders() {
    setLoading(true)
    try {
      const data = await ordersApi.list()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  async function loadFavorites() {
    try {
      const data = await favoritesApi.list()
      setFavTours(data)
    } catch {
      setFavTours([])
    }
  }

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="page-container py-8 pb-16">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Личный кабинет</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* профиль */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black mb-3">
                  {initials}
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Путешественник</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {(user.memberSince || user.member_since) && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
                    <span>
                      С нами с{' '}
                      {new Date(user.memberSince || user.member_since).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Package className="w-4 h-4 text-primary-500 shrink-0" />
                  <span>{orders.length} заказов</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Heart className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{favTours.length} в избранном</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-500 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Выйти
              </button>
            </div>

            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Быстрые ссылки
              </h3>
              <div className="space-y-1">
                {[
                  { to: '/search', icon: '🔍', label: 'Найти тур' },
                  { to: '/cart', icon: '🛒', label: 'Корзина' },
                  { to: '/destinations', icon: '🌍', label: 'Направления' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 text-sm transition-colors"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* правая часть */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-dark-800 p-1 rounded-xl">
              {TABS.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={[
                      'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors',
                      tab === t.id
                        ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                    ].join(' ')}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                    {t.id === 'favorites' && favTours.length > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {favTours.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {tab === 'orders' && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Мои бронирования</h2>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => <div key={i} className="h-24 rounded-xl bg-gray-100 dark:bg-dark-700 animate-pulse" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">✈️</div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Пока нет ни одного бронирования</p>
                    <Link to="/search" className="btn-primary">Найти тур</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...orders].reverse().map((order) => (
                      <div key={order.id} className="border border-gray-100 dark:border-dark-700 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">Заказ #{order.id}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.created_at || order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            ✓ Подтверждён
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img src={item.tour?.image} alt={item.tour?.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.tour?.title}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.tour?.city} · {item.travelers} чел.
                                </p>
                              </div>
                              <p className="text-sm font-bold text-accent-500 shrink-0">
                                {formatPrice((item.tour?.price || 0) * (item.travelers || 1))}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-dark-700">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.contact?.name} · {order.contact?.phone}
                          </div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            Итого: {formatPrice(order.total)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'favorites' && (
              <div>
                {favTours.length === 0 ? (
                  <div className="card p-12 text-center">
                    <Heart className="w-12 h-12 text-gray-200 dark:text-dark-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Избранное пусто</h3>
                    <p className="text-gray-400 mb-6">
                      Нажмите ♥ на карточке тура, чтобы добавить его сюда
                    </p>
                    <Link to="/search" className="btn-primary">Найти туры</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {favTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
