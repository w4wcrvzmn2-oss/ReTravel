import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package, BarChart2, Plus, Eye, Edit, Trash2,
  TrendingUp, Star, DollarSign, LogOut, Upload,
  CheckCircle, Clock, AlertCircle, ChevronRight,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import useCommissionStore from '../../store/useCommissionStore'

const DEMO_MY_TOURS = [
  { id: 1, title: 'Дубай: эксклюзивный тур', price: 95000, bookings: 12, revenue: 1140000, rating: 4.9, status: 'active', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=80' },
  { id: 2, title: 'Турция: частный пляж', price: 52000, bookings: 31, revenue: 1612000, rating: 4.7, status: 'active', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=200&q=80' },
  { id: 3, title: 'Греция: яхт-тур по островам', price: 148000, bookings: 5, revenue: 740000, rating: 4.8, status: 'pending', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=200&q=80' },
]

const TABS = [
  { id: 'dashboard', label: 'Обзор', icon: BarChart2 },
  { id: 'tours', label: 'Мои туры', icon: Package },
  { id: 'add', label: 'Добавить тур', icon: Plus },
]

export default function PartnerPanel() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')

  useEffect(() => { document.title = 'Партнёр — ReTravel' }, [])

  const handleLogout = async () => { await logout(); navigate('/') }

  const totalRevenue = DEMO_MY_TOURS.reduce((s, t) => s + t.revenue, 0)
  const totalBookings = DEMO_MY_TOURS.reduce((s, t) => s + t.bookings, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex">
      {/* sidebar */}
      <aside className="w-60 shrink-0 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 flex flex-col">
        <div className="p-5 border-b border-gray-100 dark:border-dark-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">RT</span>
            </div>
            <div>
              <div className="font-black text-gray-900 dark:text-white text-sm">ReTravel</div>
              <div className="text-[10px] text-accent-500 font-semibold uppercase">Партнёр</div>
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
                    ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400'
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
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400">Туроператор</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 min-w-0 overflow-auto p-8">
        {tab === 'dashboard' && <PartnerDashboard tours={DEMO_MY_TOURS} totalRevenue={totalRevenue} totalBookings={totalBookings} />}
        {tab === 'tours' && <MyTours tours={DEMO_MY_TOURS} />}
        {tab === 'add' && <AddTour onSuccess={() => setTab('tours')} />}
      </main>
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────
const TIER_COLORS = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   text: 'text-blue-600 dark:text-blue-400',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',   bar: 'bg-blue-500'   },
  green:  { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', bar: 'bg-green-500' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', bar: 'bg-violet-500' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',  bar: 'bg-amber-500'  },
}

function PartnerDashboard({ tours, totalRevenue, totalBookings }) {
  const { getEffective, getNextTier, promos } = useCommissionStore()
  const { rate, tier, activePromos } = getEffective(totalBookings)
  const nextTier = getNextTier(totalBookings)
  const tc = TIER_COLORS[tier.color] || TIER_COLORS.blue

  // Прогресс до следующего уровня
  const progress = nextTier
    ? Math.min(100, ((totalBookings - tier.bookingsMin) / (nextTier.bookingsMin - tier.bookingsMin)) * 100)
    : 100
  const toNext = nextTier ? nextTier.bookingsMin - totalBookings : 0

  const stats = [
    { label: 'Туров размещено',    value: tours.length,                                            icon: Package,   color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/20' },
    { label: 'Всего бронирований', value: totalBookings,                                           icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Общая выручка',      value: (totalRevenue / 1e6).toFixed(1) + ' млн ₽',             icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Средний рейтинг',    value: (tours.reduce((s, t) => s + t.rating, 0) / tours.length).toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Обзор</h1>
      </div>

      {/* ── Комиссионная карточка ── */}
      <div className={`card p-5 mb-6 border ${tc.bg} flex flex-col sm:flex-row sm:items-center gap-5`}
           style={{ borderColor: 'transparent' }}>
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-14 h-14 rounded-2xl ${tc.bg} border-2 flex items-center justify-center shrink-0`}
               style={{ borderColor: 'currentColor' }}>
            <span className={`text-2xl font-black ${tc.text}`}>{rate}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`badge text-xs font-semibold ${tc.badge}`}>{tier.label}</span>
              <span className="text-xs text-gray-400">текущая ставка комиссии</span>
            </div>
            {nextTier ? (
              <div className="mt-2 w-full max-w-xs">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{totalBookings} броней</span>
                  <span>{toNext} до уровня «{nextTier.label}» ({nextTier.rate}%)</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                  <div className={`h-full ${tc.bar} rounded-full transition-all`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Максимальный уровень — так держать!</p>
            )}
          </div>
        </div>

        {/* Активные акции */}
        {activePromos.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {activePromos.map((p) => (
              <span key={p.id} className="flex items-center gap-1 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2.5 py-1.5 rounded-xl font-medium">
                {p.badge} {p.label}
              </span>
            ))}
          </div>
        )}
      </div>

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
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Топ туры по выручке</h2>
          <div className="space-y-4">
            {[...tours].sort((a, b) => b.revenue - a.revenue).map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <img src={t.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.title}</p>
                  <p className="text-xs text-gray-400">{t.bookings} бронирований</p>
                </div>
                <p className="text-sm font-bold text-accent-500 shrink-0">{(t.revenue / 1e6).toFixed(1)} млн ₽</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Условия работы</h2>
          <div className="space-y-3 text-sm">
            {[
              { icon: CheckCircle, text: `Ваша комиссия: ${rate}% (уровень «${tier.label}»)`, color: 'text-green-500' },
              { icon: CheckCircle, text: 'Выплата выручки каждые 2 недели', color: 'text-green-500' },
              { icon: CheckCircle, text: 'Неограниченное число туров', color: 'text-green-500' },
              { icon: Clock,        text: 'Модерация нового тура: 1–2 рабочих дня', color: 'text-yellow-500' },
              { icon: AlertCircle,  text: 'Минимальный рейтинг для листинга: 4.0', color: 'text-red-500' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                  <span className="text-gray-600 dark:text-gray-300">{item.text}</span>
                </div>
              )
            })}
          </div>

          {/* Путь к следующему уровню */}
          {nextTier && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-700">
              <p className="text-xs text-gray-400 mb-2">Как снизить комиссию:</p>
              <div className="flex items-center gap-2 text-xs">
                <span className={`badge ${tc.badge}`}>{tier.label} {tier.rate}%</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className={`badge ${TIER_COLORS[nextTier.color]?.badge || ''}`}>
                  {nextTier.label} {nextTier.rate}%
                </span>
                <span className="text-gray-400">через {toNext} броней</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MY TOURS ─────────────────────────────────────────────────
function MyTours({ tours }) {
  const statusConfig = {
    active:  { label: 'Активен', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    pending: { label: 'На модерации', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    paused:  { label: 'Приостановлен', color: 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-gray-400' },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Мои туры</h1>
        <p className="text-sm text-gray-400">{tours.length} туров</p>
      </div>

      <div className="space-y-4">
        {tours.map((t) => {
          const s = statusConfig[t.status] || statusConfig.active
          return (
            <div key={t.id} className="card p-5 flex gap-5">
              <img src={t.image} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{t.title}</h3>
                  <span className={`badge text-xs shrink-0 ${s.color}`}>{s.label}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {t.price.toLocaleString('ru')} ₽</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> {t.bookings} бронирований</span>
                  <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3.5 h-3.5 fill-current" /> {t.rating}</span>
                  <span className="font-medium text-accent-500">{t.revenue.toLocaleString('ru')} ₽ выручки</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/tour/${t.id}`} className="p-2 text-gray-400 hover:text-primary-500 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <Eye className="w-4 h-4" />
                </Link>
                <button className="p-2 text-gray-400 hover:text-blue-500 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ADD TOUR ─────────────────────────────────────────────────
function AddTour({ onSuccess }) {
  const [form, setForm] = useState({
    title: '', city: '', country: '', destination: '',
    price: '', nights: '', hotel: '', hotel_stars: '4',
    meal_type: 'All Inclusive', category: 'beach', description: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="max-w-lg">
        <div className="card p-10 text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Тур отправлен на модерацию</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Мы проверим ваш тур в течение 1–2 рабочих дней. После одобрения он появится в каталоге.
          </p>
          <button onClick={onSuccess} className="btn-primary">Мои туры</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Добавить тур</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Название тура" required>
            <input className="input-field" placeholder="Название" value={form.title} onChange={(e) => set('title', e.target.value)} required />
          </FormField>
          <FormField label="Направление (slug)" required>
            <input className="input-field" placeholder="turkey / dubai / greece" value={form.destination} onChange={(e) => set('destination', e.target.value)} required />
          </FormField>
          <FormField label="Город">
            <input className="input-field" placeholder="Анталья" value={form.city} onChange={(e) => set('city', e.target.value)} />
          </FormField>
          <FormField label="Страна">
            <input className="input-field" placeholder="Турция" value={form.country} onChange={(e) => set('country', e.target.value)} />
          </FormField>
          <FormField label="Цена (₽)" required>
            <input type="number" className="input-field" placeholder="45000" value={form.price} onChange={(e) => set('price', e.target.value)} required min={1000} />
          </FormField>
          <FormField label="Ночей" required>
            <input type="number" className="input-field" placeholder="7" value={form.nights} onChange={(e) => set('nights', e.target.value)} required min={1} />
          </FormField>
          <FormField label="Отель">
            <input className="input-field" placeholder="Название отеля" value={form.hotel} onChange={(e) => set('hotel', e.target.value)} />
          </FormField>
          <FormField label="Звёзды">
            <select className="input-field" value={form.hotel_stars} onChange={(e) => set('hotel_stars', e.target.value)}>
              {[3,4,5].map((s) => <option key={s} value={s}>{s}★</option>)}
            </select>
          </FormField>
          <FormField label="Питание">
            <select className="input-field" value={form.meal_type} onChange={(e) => set('meal_type', e.target.value)}>
              {['All Inclusive','Полупансион','Завтрак','Без питания'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </FormField>
          <FormField label="Категория">
            <select className="input-field" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {[['beach','Пляж'],['excursion','Экскурсии'],['adventure','Приключения'],['romantic','Романтика'],['luxury','Люкс'],['city','Города']].map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Описание тура" required>
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder="Опишите тур подробно — что входит, что ждёт туристов..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            required
          />
        </FormField>

        <div className="border-2 border-dashed border-gray-200 dark:border-dark-600 rounded-2xl p-6 text-center">
          <Upload className="w-8 h-8 text-gray-300 dark:text-dark-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Перетащите фото сюда или</p>
          <button type="button" className="mt-2 text-sm text-primary-500 hover:underline font-medium">выберите файлы</button>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG до 10 МБ · рекомендуется 1200×800</p>
        </div>

        <CommissionNotice />

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Отправить на модерацию'}
        </button>
      </form>
    </div>
  )
}

function CommissionNotice() {
  const { getEffective } = useCommissionStore()
  const totalBookings = DEMO_MY_TOURS.reduce((s, t) => s + t.bookings, 0)
  const { rate, tier } = getEffective(totalBookings)
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm text-yellow-700 dark:text-yellow-400">
      После отправки тур пройдёт модерацию (1–2 дня). Ваша текущая комиссия — <strong>{rate}%</strong> (уровень «{tier.label}»).
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}
