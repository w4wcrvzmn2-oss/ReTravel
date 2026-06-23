import { useState, useEffect, useMemo } from 'react'
import { Plane, Clock, Briefcase, ChevronDown, ArrowRight, AlertCircle } from 'lucide-react'
import { flights, fromCities, toCities } from '../data/flights'
import { destinations } from '../data/destinations'
import useCartStore from '../store/useCartStore'
import useToastStore from '../store/useToastStore'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

const CLASSES = [
  { id: 'economy', label: 'Эконом' },
  { id: 'business', label: 'Бизнес' },
]

const SORT_OPTS = [
  { id: 'price', label: 'По цене' },
  { id: 'duration', label: 'По времени' },
  { id: 'stops', label: 'По пересадкам' },
]

export default function Flights() {
  const toast = useToastStore((s) => s.show)

  const [form, setForm] = useState({
    from: 'Москва',
    to: '',
    date: '',
    passengers: 1,
    flightClass: 'economy',
  })
  const [sort, setSort] = useState('price')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    document.title = 'Авиабилеты — ReTravel'
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const results = useMemo(() => {
    if (!searched) return []
    let res = [...flights]
    if (form.to) res = res.filter((f) => f.toDestination === form.to)
    if (sort === 'price') res.sort((a, b) => a.price - b.price)
    if (sort === 'stops') res.sort((a, b) => a.stops - b.stops)
    return res
  }, [searched, form.to, sort])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearched(true)
  }

  const handleBook = (flight) => {
    toast(`✈ Рейс ${flight.flightNumber} добавлен в корзину`, 'success')
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* шапка поиска */}
      <div className="bg-dark-900 py-10">
        <div className="page-container">
          <h1 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Plane className="w-6 h-6 text-primary-400" />
            Авиабилеты
          </h1>
          <form
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* откуда */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Откуда</label>
                <select
                  value={form.from}
                  onChange={(e) => set('from', e.target.value)}
                  className="input-field text-sm"
                >
                  {fromCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* куда */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Куда</label>
                <select
                  value={form.to}
                  onChange={(e) => set('to', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Любое направление</option>
                  {toCities.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* дата */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Дата вылета</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* пассажиры */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Пассажиры</label>
                <input
                  type="number"
                  min={1}
                  max={9}
                  value={form.passengers}
                  onChange={(e) => set('passengers', +e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* класс */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Класс</label>
                <select
                  value={form.flightClass}
                  onChange={(e) => set('flightClass', e.target.value)}
                  className="input-field text-sm"
                >
                  {CLASSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button type="submit" className="btn-primary px-10">
                <Plane className="w-4 h-4" />
                Найти билеты
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* результаты */}
      <div className="page-container py-8">
        {!searched ? (
          <div className="text-center py-20">
            <Plane className="w-16 h-16 text-gray-200 dark:text-dark-700 mx-auto mb-4" />
            <p className="text-gray-400">Введите параметры поиска и нажмите «Найти билеты»</p>
          </div>
        ) : results.length === 0 ? (
          <div className="card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Рейсов не найдено</h3>
            <p className="text-gray-400">Попробуйте изменить дату или направление</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Найдено <span className="font-bold text-gray-900 dark:text-white">{results.length}</span> рейсов
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer"
                >
                  {SORT_OPTS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              {results.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  passengers={form.passengers}
                  flightClass={form.flightClass}
                  onBook={() => handleBook(flight)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function FlightCard({ flight, passengers, flightClass, onBook }) {
  const price = flightClass === 'business' && flight.businessPrice
    ? flight.businessPrice
    : flight.price
  const total = price * passengers

  const destInfo = destinations.find((d) => d.id === flight.toDestination)

  return (
    <div className="card p-5 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* авиакомпания */}
        <div className="shrink-0 w-32">
          <p className="font-bold text-gray-900 dark:text-white text-sm">{flight.airline}</p>
          <p className="text-xs text-gray-400">{flight.flightNumber}</p>
        </div>

        {/* маршрут */}
        <div className="flex-1 flex items-center gap-3">
          <div className="text-center">
            <p className="text-xl font-black text-gray-900 dark:text-white">{flight.departureTime}</p>
            <p className="text-xs text-gray-400">{flight.from} ({flight.fromCode})</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {flight.durationLabel}
            </p>
            <div className="relative w-full">
              <div className="h-px bg-gray-200 dark:bg-dark-600 w-full" />
              <Plane className="absolute left-1/2 -translate-x-1/2 -top-2.5 w-4 h-4 text-primary-500" />
            </div>
            <p className="text-xs text-gray-400">
              {flight.stops === 0 ? 'Прямой' : `${flight.stops} пересадка: ${flight.stopCity}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl font-black text-gray-900 dark:text-white">{flight.arrivalTime}</p>
            <p className="text-xs text-gray-400">{flight.to} ({flight.toCode})</p>
          </div>
        </div>

        {/* багаж + мест */}
        <div className="hidden md:flex flex-col items-center gap-1 text-xs text-gray-400 shrink-0">
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            {flight.baggage}
          </span>
          <span>{flight.seatsLeft} мест</span>
        </div>

        {/* цена + кнопка */}
        <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-1 shrink-0">
          <div className="md:text-right">
            <p className="text-xl font-black text-accent-500">{formatPrice(total)}</p>
            <p className="text-xs text-gray-400">
              {passengers > 1 ? `за ${passengers} пасс.` : 'за пассажира'}
            </p>
          </div>
          <button onClick={onBook} className="btn-primary py-2 px-4 text-sm shrink-0">
            Выбрать <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
