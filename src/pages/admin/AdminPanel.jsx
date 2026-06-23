import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, Star, Settings,
  TrendingUp, ShoppingCart, Bell, LogOut, ChevronRight,
  Plus, Search, Edit, Trash2, Eye, BarChart2, Percent,
  ToggleLeft, ToggleRight, RotateCcw,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import useCommissionStore from '../../store/useCommissionStore'
import { tours as toursApi, admin as adminApi } from '../../lib/api'
import { tours as staticTours } from '../../data/tours'

// демо-данные пока API недоступен
const DEMO_STATS = {
  users: 1247,
  tours: 83,
  orders_today: 14,
  revenue_month: 2480000,
}

const DEMO_USERS = [
  { id: 1, name: 'Алексей Петров', email: 'alexey@mail.ru', role: 'user', orders: 3, created_at: '2026-01-15' },
  { id: 2, name: 'Мария Иванова', email: 'maria@gmail.com', role: 'user', orders: 7, created_at: '2026-02-20' },
  { id: 3, name: 'Дмитрий Сидоров', email: 'dmitry@yandex.ru', role: 'partner', orders: 0, created_at: '2026-03-01' },
  { id: 4, name: 'Анна Козлова', email: 'anna@inbox.ru', role: 'manager', orders: 0, created_at: '2026-03-10' },
]

const DEMO_ORDERS = [
  { id: 'RT-001', user: 'Алексей Петров', tour: 'Дубай: город золота', total: 89500, status: 'confirmed', date: '2026-06-20' },
  { id: 'RT-002', user: 'Мария Иванова', tour: 'Греция: острова Эгейского моря', total: 192000, status: 'confirmed', date: '2026-06-21' },
  { id: 'RT-003', user: 'Анна Козлова', tour: 'Таиланд: Пхукет', total: 144000, status: 'pending', date: '2026-06-22' },
  { id: 'RT-004', user: 'Иван Новиков', tour: 'Мальдивы: бунгало над водой', total: 370000, status: 'confirmed', date: '2026-06-23' },
]

const TABS = [
  { id: 'dashboard',   label: 'Дашборд',       icon: LayoutDashboard },
  { id: 'tours',       label: 'Туры',           icon: Package },
  { id: 'users',       label: 'Пользователи',   icon: Users },
  { id: 'orders',      label: 'Заказы',         icon: ShoppingCart },
  { id: 'reviews',     label: 'Отзывы',         icon: Star },
  { id: 'commissions', label: 'Комиссии',       icon: Percent },
]

export default function AdminPanel() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [tours, setTours] = useState(staticTours)
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.title = 'Админ-панель — ReTravel'
    toursApi.list({ limit: 50 }).then((d) => { if (d.tours?.length) setTours(d.tours) }).catch(() => {})
  }, [])

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex">
      {/* ─── sidebar ─────────────────────────────────────── */}
      <aside className="w-60 shrink-0 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 flex flex-col">
        <div className="p-5 border-b border-gray-100 dark:border-dark-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">RT</span>
            </div>
            <div>
              <div className="font-black text-gray-900 dark:text-white text-sm">ReTravel</div>
              <div className="text-[10px] text-primary-500 font-semibold uppercase">Admin</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                  tab === t.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800',
                ].join(' ')}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t.label}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-dark-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400">Администратор</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* ─── main ────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8">
          {tab === 'dashboard'   && <Dashboard />}
          {tab === 'tours'       && <ToursTab tours={tours} search={search} setSearch={setSearch} />}
          {tab === 'users'       && <UsersTab />}
          {tab === 'orders'      && <OrdersTab />}
          {tab === 'reviews'     && <ReviewsTab />}
          {tab === 'commissions' && <CommissionsTab />}
        </div>
      </main>
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────
function Dashboard() {
  const stats = [
    { label: 'Пользователей', value: DEMO_STATS.users.toLocaleString('ru'), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Туров в каталоге', value: DEMO_STATS.tours, icon: Package, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Заказов сегодня', value: DEMO_STATS.orders_today, icon: ShoppingCart, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Выручка за месяц', value: (DEMO_STATS.revenue_month / 1e6).toFixed(1) + ' млн ₽', icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Дашборд</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Последние заказы</h2>
          <div className="space-y-3">
            {DEMO_ORDERS.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{o.user}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[200px]">{o.tour}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent-500">{o.total.toLocaleString('ru')} ₽</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '➕', label: 'Добавить тур', href: '/admin?tab=tours' },
              { icon: '👥', label: 'Пользователи', href: '/admin?tab=users' },
              { icon: '📋', label: 'Все заказы', href: '/admin?tab=orders' },
              { icon: '⭐', label: 'Модерация', href: '/admin?tab=reviews' },
            ].map((a) => (
              <button
                key={a.label}
                className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 text-center transition-colors"
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{a.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── TOURS TAB ────────────────────────────────────────────────
function ToursTab({ tours, search, setSearch }) {
  const filtered = tours.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    (t.city || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Туры</h1>
        <button className="btn-primary py-2 px-4 text-sm">
          <Plus className="w-4 h-4" /> Добавить тур
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-dark-700">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск туров..."
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                {['Тур', 'Направление', 'Цена', 'Рейтинг', 'Статус', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {filtered.slice(0, 20).map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">{t.title}</p>
                        <p className="text-xs text-gray-400">{t.nights} ноч. · {t.meal_type || t.mealType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.city}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{(t.price || 0).toLocaleString('ru')} ₽</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-yellow-500">
                      ★ {t.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${t.is_hot || t.isHot ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {t.is_hot || t.isHot ? '🔥 Горящий' : 'Активен'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/tour/${t.id}`} className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><Eye className="w-4 h-4" /></Link>
                      <button className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── USERS TAB ────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState(DEMO_USERS)
  const [saving, setSaving] = useState(null)
  const currentUser = useAuthStore((s) => s.user)

  useEffect(() => {
    adminApi.users().then(setUsers).catch(() => {})
  }, [])

  const changeRole = async (userId, role) => {
    setSaving(userId)
    try {
      const updated = await adminApi.setRole(userId, role)
      setUsers((prev) => prev.map((u) => u.id === updated.id ? { ...u, role: updated.role } : u))
    } catch {
      // API недоступен — обновляем только UI
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u))
    } finally {
      setSaving(null)
    }
  }

  const roleColor = {
    user:    'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-gray-300',
    partner: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    manager: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    admin:   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  }
  const ROLES = [
    { value: 'user', label: 'Клиент' },
    { value: 'manager', label: 'Менеджер' },
    { value: 'partner', label: 'Партнёр' },
    { value: 'admin', label: 'Админ' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Пользователи</h1>
        <span className="text-sm text-gray-400">{users.length} записей</span>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                {['Имя', 'Email', 'Роль', 'Регистрация', 'Изменить роль'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name?.[0] || '?'}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${roleColor[u.role] || roleColor.user}`}>
                      {ROLES.find((r) => r.value === u.role)?.label || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {u.created_at || u.member_since
                      ? new Date(u.created_at || u.member_since).toLocaleDateString('ru-RU')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {/* нельзя менять роль себе самому */}
                    {u.id !== currentUser?.id ? (
                      <div className="relative">
                        <select
                          value={u.role}
                          disabled={saving === u.id}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="input-field py-1.5 text-xs pr-7 appearance-none cursor-pointer disabled:opacity-50"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                        {saving === u.id && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">это вы</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── ORDERS TAB ───────────────────────────────────────────────
function OrdersTab() {
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Заказы</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                {['№ заказа', 'Клиент', 'Тур', 'Сумма', 'Дата', 'Статус'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {DEMO_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary-500">{o.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{o.user}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{o.tour}</td>
                  <td className="px-4 py-3 font-bold text-accent-500">{o.total.toLocaleString('ru')} ₽</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.date).toLocaleDateString('ru-RU')}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── REVIEWS TAB ──────────────────────────────────────────────
function ReviewsTab() {
  const reviews = [
    { id: 1, author: 'Мария И.', tour: 'Дубай: город золота', rating: 5, text: 'Потрясающий отдых! Всё организовано на высшем уровне.', date: '2026-06-18', approved: true },
    { id: 2, author: 'Кирилл Д.', tour: 'Турция: Анталья', rating: 3, text: 'В целом неплохо, но еда могла быть лучше.', date: '2026-06-20', approved: false },
    { id: 3, author: 'Ольга С.', tour: 'Мальдивы: бунгало над водой', rating: 5, text: 'Лучший отпуск в моей жизни! Рекомендую всем.', date: '2026-06-22', approved: false },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Модерация отзывов</h1>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className={`card p-5 border-l-4 ${r.approved ? 'border-green-400' : 'border-yellow-400'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{r.author}</span>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}</span>
                  <span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString('ru-RU')}</span>
                </div>
                <p className="text-xs text-primary-500 mb-2">{r.tour}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{r.text}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!r.approved && (
                  <button className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">Одобрить</button>
                )}
                <button className="px-3 py-1.5 text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors font-medium">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── COMMISSIONS TAB ──────────────────────────────────────────
function CommissionsTab() {
  const { tiers, promos, setTierRate, togglePromo, getEffective, resetToDefaults } = useCommissionStore()
  const [simBookings, setSimBookings] = useState(7)
  const [saved, setSaved] = useState(false)

  const sim = getEffective(simBookings)

  const tierColors = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   border: 'border-blue-200 dark:border-blue-800',   text: 'text-blue-600 dark:text-blue-400',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    green:  { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-600 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Комиссии партнёров</h1>
          <p className="text-sm text-gray-400 mt-0.5">Настройте ставки по уровням и управляйте акциями</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { resetToDefaults(); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Сбросить
          </button>
          <button
            onClick={handleSave}
            className={`btn-primary py-2 px-4 text-sm transition-all ${saved ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            {saved ? '✓ Сохранено' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* ── Уровни ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Уровни комиссии
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {tiers.map((tier) => {
            const c = tierColors[tier.color] || tierColors.blue
            return (
              <div key={tier.id} className={`card p-5 border ${c.border} ${c.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge text-xs font-semibold ${c.badge}`}>{tier.label}</span>
                  {tier.manual && (
                    <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-dark-700 px-1.5 py-0.5 rounded">ручной</span>
                  )}
                </div>
                {!tier.manual && (
                  <p className="text-xs text-gray-400 mb-3">
                    {tier.bookingsMin}–{tier.bookingsMax === 9999 ? '∞' : tier.bookingsMax} броней
                  </p>
                )}
                {tier.manual && (
                  <p className="text-xs text-gray-400 mb-3">назначается вручную</p>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={tier.rate}
                    onChange={(e) => setTierRate(tier.id, e.target.value)}
                    className={`w-16 text-center text-xl font-black bg-white dark:bg-dark-800 border ${c.border} rounded-xl py-1.5 ${c.text} focus:outline-none focus:ring-2 focus:ring-current/20`}
                  />
                  <span className={`text-lg font-bold ${c.text}`}>%</span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Уровни назначаются автоматически по суммарному числу броней партнёра. «Эксклюзив» — только вручную.
        </p>
      </section>

      {/* ── Акции ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Акции и спецусловия
        </h2>
        <div className="space-y-3">
          {promos.map((p) => (
            <div
              key={p.id}
              className={`card p-4 flex items-start gap-4 transition-opacity ${p.active ? '' : 'opacity-60'}`}
            >
              <span className="text-2xl shrink-0 mt-0.5">{p.badge}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{p.label}</span>
                  <span className={`badge text-[10px] ${p.type === 'fixed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {p.type === 'fixed' ? 'фиксированная' : `−${p.rate}%`}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{p.description}</p>
              </div>
              <button
                onClick={() => togglePromo(p.id)}
                className="shrink-0 mt-0.5"
                title={p.active ? 'Выключить акцию' : 'Включить акцию'}
              >
                {p.active
                  ? <ToggleRight className="w-8 h-8 text-primary-500" />
                  : <ToggleLeft  className="w-8 h-8 text-gray-300 dark:text-dark-600" />}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Симулятор ── */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Симулятор ставки
        </h2>
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Число броней у партнёра</label>
              <input
                type="number"
                min={0}
                max={200}
                value={simBookings}
                onChange={(e) => setSimBookings(Number(e.target.value))}
                className="input-field w-28 text-center font-bold"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mt-4">
                <div>
                  <p className="text-xs text-gray-400">Уровень</p>
                  <p className="font-bold text-gray-900 dark:text-white">{sim.tier.label}</p>
                </div>
                <span className="text-gray-300 dark:text-dark-600">→</span>
                <div>
                  <p className="text-xs text-gray-400">Базовая ставка</p>
                  <p className="font-bold text-gray-900 dark:text-white">{sim.tier.rate}%</p>
                </div>
                {sim.activePromos.filter((p) => p.type === 'discount').length > 0 && (
                  <>
                    <span className="text-gray-300 dark:text-dark-600">→</span>
                    <div>
                      <p className="text-xs text-gray-400">После скидок</p>
                      <p className="font-bold text-primary-500">{sim.rate}%</p>
                    </div>
                  </>
                )}
                <div className="ml-auto">
                  <p className="text-xs text-gray-400">Итоговая ставка</p>
                  <p className="text-2xl font-black text-green-500">{sim.rate}%</p>
                </div>
              </div>
            </div>
          </div>
          {sim.activePromos.length > 0 && (
            <div className="border-t border-gray-100 dark:border-dark-700 pt-3 mt-2">
              <p className="text-xs text-gray-400 mb-1.5">Активные акции:</p>
              <div className="flex flex-wrap gap-2">
                {sim.activePromos.map((p) => (
                  <span key={p.id} className="flex items-center gap-1 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg">
                    {p.badge} {p.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`badge text-xs ${status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
      {status === 'confirmed' ? '✓ Подтверждён' : '⏳ Ожидает'}
    </span>
  )
}
