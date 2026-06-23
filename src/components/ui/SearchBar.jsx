import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Plane, Building } from 'lucide-react'
import { destinations } from '../../data/destinations'
import { fromCities, toCities } from '../../data/flights'

const TABS = [
  { id: 'tours', label: 'Туры', icon: MapPin },
  { id: 'flights', label: 'Авиабилеты', icon: Plane },
  { id: 'hotels', label: 'Отели', icon: Building },
]

export default function SearchBar({ compact = false, initialValues = {} }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('tours')

  const [tours, setTours] = useState({
    destination: initialValues.destination || '',
    dateFrom: initialValues.dateFrom || '',
    dateTo: initialValues.dateTo || '',
    travelers: initialValues.travelers || 2,
  })

  const [flights, setFlights] = useState({
    from: 'Москва',
    to: '',
    date: '',
    passengers: 2,
  })

  const [hotels, setHotels] = useState({
    destination: '',
    checkin: '',
    checkout: '',
    guests: 2,
  })

  const submitTours = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (tours.destination) p.set('destination', tours.destination)
    if (tours.dateFrom) p.set('dateFrom', tours.dateFrom)
    if (tours.dateTo) p.set('dateTo', tours.dateTo)
    p.set('travelers', tours.travelers)
    navigate(`/search?${p}`)
  }

  const submitFlights = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (flights.to) p.set('to', flights.to)
    if (flights.date) p.set('date', flights.date)
    p.set('passengers', flights.passengers)
    navigate(`/flights?${p}`)
  }

  const submitHotels = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (hotels.destination) p.set('destination', hotels.destination)
    if (hotels.checkin) p.set('checkin', hotels.checkin)
    if (hotels.checkout) p.set('checkout', hotels.checkout)
    p.set('guests', hotels.guests)
    navigate(`/hotels?${p}`)
  }

  if (compact) {
    return (
      <form onSubmit={submitTours} className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px] relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={tours.destination}
            onChange={(e) => setTours((f) => ({ ...f, destination: e.target.value }))}
            className="input-field pl-10 appearance-none"
          >
            <option value="">Все направления</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.flag} {d.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[160px] relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={tours.dateFrom}
            onChange={(e) => setTours((f) => ({ ...f, dateFrom: e.target.value }))}
            className="input-field pl-10"
          />
        </div>
        <div className="w-28 relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number" min={1} max={20}
            value={tours.travelers}
            onChange={(e) => setTours((f) => ({ ...f, travelers: +e.target.value }))}
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary">
          <Search className="w-4 h-4" /> Найти
        </button>
      </form>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden w-full">
      {/* вкладки */}
      <div className="flex border-b border-gray-100 dark:border-dark-700">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors',
                tab === t.id
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
              ].join(' ')}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="p-5 md:p-6">
        {/* ===== ТУРЫ ===== */}
        {tab === 'tours' && (
          <form onSubmit={submitTours}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Куда</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select value={tours.destination} onChange={(e) => setTours((f) => ({ ...f, destination: e.target.value }))} className="input-field pl-10 appearance-none cursor-pointer">
                    <option value="">Любое направление</option>
                    {destinations.map((d) => <option key={d.id} value={d.id}>{d.flag} {d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Дата выезда</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="date" value={tours.dateFrom} onChange={(e) => setTours((f) => ({ ...f, dateFrom: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Дата возврата</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="date" value={tours.dateTo} onChange={(e) => setTours((f) => ({ ...f, dateTo: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Туристы</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" min={1} max={20} value={tours.travelers} onChange={(e) => setTours((f) => ({ ...f, travelers: +e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button type="submit" className="btn-primary px-12 py-3.5 text-base">
                <Search className="w-5 h-5" /> Найти туры
              </button>
            </div>
          </form>
        )}

        {/* ===== АВИАБИЛЕТЫ ===== */}
        {tab === 'flights' && (
          <form onSubmit={submitFlights}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Откуда</label>
                <select value={flights.from} onChange={(e) => setFlights((f) => ({ ...f, from: e.target.value }))} className="input-field appearance-none">
                  {fromCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Куда</label>
                <select value={flights.to} onChange={(e) => setFlights((f) => ({ ...f, to: e.target.value }))} className="input-field appearance-none">
                  <option value="">Любое</option>
                  {toCities.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Дата вылета</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="date" value={flights.date} onChange={(e) => setFlights((f) => ({ ...f, date: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Пассажиры</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" min={1} max={9} value={flights.passengers} onChange={(e) => setFlights((f) => ({ ...f, passengers: +e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button type="submit" className="btn-primary px-12 py-3.5 text-base">
                <Search className="w-5 h-5" /> Найти билеты
              </button>
            </div>
          </form>
        )}

        {/* ===== ОТЕЛИ ===== */}
        {tab === 'hotels' && (
          <form onSubmit={submitHotels}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Направление</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select value={hotels.destination} onChange={(e) => setHotels((f) => ({ ...f, destination: e.target.value }))} className="input-field pl-10 appearance-none">
                    <option value="">Любое</option>
                    {destinations.map((d) => <option key={d.id} value={d.id}>{d.flag} {d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Заезд</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="date" value={hotels.checkin} onChange={(e) => setHotels((f) => ({ ...f, checkin: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Выезд</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="date" value={hotels.checkout} onChange={(e) => setHotels((f) => ({ ...f, checkout: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Гостей</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" min={1} max={10} value={hotels.guests} onChange={(e) => setHotels((f) => ({ ...f, guests: +e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button type="submit" className="btn-primary px-12 py-3.5 text-base">
                <Search className="w-5 h-5" /> Найти отели
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
