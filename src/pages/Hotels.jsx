import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Building, Star, Search, ChevronDown, Wifi, Waves, Dumbbell } from 'lucide-react'
import { hotels } from '../data/hotels'
import { destinations } from '../data/destinations'
import RevealSection from '../components/ui/RevealSection'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function Hotels() {
  const [form, setForm] = useState({ destination: '', checkin: '', checkout: '', guests: 2 })
  const [sort, setSort] = useState('rating')
  const [stars, setStars] = useState([])
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    document.title = 'Отели — ReTravel'
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleStar = (s) =>
    setStars((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const results = useMemo(() => {
    let res = [...hotels]
    if (form.destination) res = res.filter((h) => h.destination === form.destination)
    if (stars.length) res = res.filter((h) => stars.includes(h.stars))
    if (sort === 'price_asc') res.sort((a, b) => a.pricePerNight - b.pricePerNight)
    else if (sort === 'price_desc') res.sort((a, b) => b.pricePerNight - a.pricePerNight)
    else if (sort === 'rating') res.sort((a, b) => b.rating - a.rating)
    return res
  }, [form.destination, stars, sort])

  const displayList = searched ? results : hotels.slice(0, 6)

  return (
    <div className="pt-20 min-h-screen">
      {/* шапка поиска */}
      <div className="bg-dark-900 py-10">
        <div className="page-container">
          <h1 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Building className="w-6 h-6 text-primary-400" />
            Отели
          </h1>
          <form
            onSubmit={(e) => { e.preventDefault(); setSearched(true) }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Направление</label>
                <select
                  value={form.destination}
                  onChange={(e) => set('destination', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Все направления</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.flag} {d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Заезд</label>
                <input
                  type="date"
                  value={form.checkin}
                  onChange={(e) => set('checkin', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Выезд</label>
                <input
                  type="date"
                  value={form.checkout}
                  onChange={(e) => set('checkout', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">Гостей</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.guests}
                  onChange={(e) => set('guests', +e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button type="submit" className="btn-primary px-10">
                <Search className="w-4 h-4" />
                Найти отели
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex gap-8">
          {/* фильтры */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-sand-600 dark:text-sand-200 mb-3 uppercase tracking-wide">
                  Звёзды
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleStar(s)}
                      className={[
                        'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors',
                        stars.includes(s)
                          ? 'border-primary-500 bg-blue-50 dark:bg-primary-900/20 text-primary-600'
                          : 'border-sand-200 dark:border-dark-600 text-sand-600 dark:text-sand-300',
                      ].join(' ')}
                    >
                      {'★'.repeat(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* список */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searched
                  ? <><span className="font-bold text-gray-900 dark:text-white">{results.length}</span> отелей</>
                  : 'Популярные отели'}
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer"
                >
                  <option value="rating">По рейтингу</option>
                  <option value="price_asc">Сначала дешевле</option>
                  <option value="price_desc">Сначала дороже</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 dark:text-sand-500 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayList.map((hotel, i) => (
                <RevealSection key={hotel.id} delay={i * 60}>
                  <HotelCard hotel={hotel} nights={2} />
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HotelCard({ hotel, nights = 2 }) {
  return (
    <div className="card-hover flex flex-col overflow-hidden group">
      {/* фото */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
            {'★'.repeat(hotel.stars)}
          </span>
        </div>
        {hotel.popular && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-accent-500 text-white text-xs font-bold rounded-lg">
              Популярный
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 dark:text-white mb-0.5">{hotel.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {hotel.city}, {hotel.country}
        </p>

        {/* рейтинг */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{hotel.rating}</span>
          <span className="text-xs text-sand-400 dark:text-sand-500">({hotel.reviewsCount} отзывов)</span>
        </div>

        {/* удобства */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.slice(0, 4).map((a) => (
            <span key={a} className="badge-blue text-[10px]">{a}</span>
          ))}
        </div>

        {/* цена */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xl font-black text-accent-500">
              {formatPrice(hotel.pricePerNight)}
            </p>
            <p className="text-xs text-sand-400 dark:text-sand-500">за ночь</p>
          </div>
          <Link
            to={`/search?destination=${hotel.destination}`}
            className="btn-primary py-2 px-4 text-sm"
          >
            Туры →
          </Link>
        </div>
      </div>
    </div>
  )
}
