import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import TourCard from '../components/ui/TourCard'
import SearchBar from '../components/ui/SearchBar'
import { tours as toursApi } from '../lib/api'
import { destinations } from '../data/destinations'

const CATEGORIES = [
  { id: 'beach', label: 'Пляж' },
  { id: 'excursion', label: 'Экскурсии' },
  { id: 'adventure', label: 'Приключения' },
  { id: 'romantic', label: 'Романтика' },
  { id: 'luxury', label: 'Люкс' },
  { id: 'city', label: 'Города' },
]

const MEALS = [
  { id: 'All Inclusive', label: 'Всё включено' },
  { id: 'Полупансион', label: 'Полупансион' },
  { id: 'Завтрак', label: 'Завтрак' },
]

const SORT_OPTIONS = [
  { id: 'price_asc', label: 'Сначала дешевле' },
  { id: 'price_desc', label: 'Сначала дороже' },
  { id: 'rating', label: 'По рейтингу' },
  { id: 'duration', label: 'По длительности' },
]

const PER_PAGE = 6

export default function Search() {
  const [searchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [tours, setTours] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    meals: [],
    stars: [],
    priceMax: 250000,
    sort: 'rating',
    isHot: searchParams.get('is_hot') === 'true',
  })

  useEffect(() => {
    document.title = 'Поиск туров — ReTravel'
  }, [])

  const fetchTours = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: PER_PAGE,
        sort: filters.sort,
        ...(filters.destination && { destination: filters.destination }),
        ...(filters.categories.length && { category: filters.categories.join(',') }),
        ...(filters.meals.length && { meal_type: filters.meals.join(',') }),
        ...(filters.stars.length && { stars: filters.stars.join(',') }),
        ...(filters.priceMax < 250000 && { price_max: filters.priceMax }),
        ...(filters.isHot && { is_hot: 'true' }),
      }

      const data = await toursApi.list(params)
      setTours(data.tours || [])
      setTotal(data.total || 0)
      setTotalPages(data.pages || 0)
    } catch {
      // API пока недоступен — ничего не ломаем
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  // при смене фильтров сбрасываем на первую страницу
  useEffect(() => { setPage(1) }, [filters])

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }))

  const toggleArr = (key, val) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val],
    }))

  const activeDestination = destinations.find((d) => d.id === filters.destination)

  const resetFilters = () => {
    setFilters({ destination: '', categories: [], meals: [], stars: [], priceMax: 250000, sort: 'rating', isHot: false })
    setPage(1)
  }

  const hasActiveFilters = filters.categories.length || filters.meals.length || filters.stars.length || filters.priceMax < 250000 || filters.isHot

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-dark-900 py-8">
        <div className="page-container">
          <h1 className="text-2xl font-bold text-white mb-5">
            {activeDestination ? `Туры в ${activeDestination.name}` : 'Все туры'}
          </h1>
          <SearchBar compact initialValues={{ destination: filters.destination }} />
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex gap-8">
          <aside className="shrink-0 w-64 hidden lg:block">
            <FilterPanel filters={filters} setFilter={setFilter} toggleArr={toggleArr} hasActive={hasActiveFilters} onReset={resetFilters} />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-sand-500 dark:text-sand-400 text-sm">
                Найдено <span className="font-semibold text-ink dark:text-sand-50">{total}</span> туров
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden btn-outline py-2 px-4 text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                  {hasActiveFilters && (
                    <span className="w-4 h-4 bg-accent-500 text-white text-[10px] rounded-full flex items-center justify-center">!</span>
                  )}
                </button>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilter('sort', e.target.value)}
                    className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 dark:text-sand-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: PER_PAGE }).map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-sand-100 dark:bg-dark-800" />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">😞</div>
                <h3 className="text-xl font-bold text-ink dark:text-sand-50 mb-2">Туры не найдены</h3>
                <p className="text-sand-500 dark:text-sand-400 mb-6">Попробуйте изменить фильтры</p>
                <button onClick={resetFilters} className="btn-outline">Сбросить фильтры</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-sand-200 dark:border-dark-600 disabled:opacity-40 hover:border-primary-400 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={[
                          'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                          n === page
                            ? 'bg-primary-500 text-white'
                            : 'border border-sand-200 dark:border-dark-600 text-sand-600 dark:text-sand-300 hover:border-primary-400',
                        ].join(' ')}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-sand-200 dark:border-dark-600 disabled:opacity-40 hover:border-primary-400 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-dark-800 overflow-y-auto p-6 dark:text-sand-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-ink dark:text-sand-50 text-lg">Фильтры</h3>
              <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterPanel filters={filters} setFilter={setFilter} toggleArr={toggleArr} hasActive={hasActiveFilters} onReset={resetFilters} />
          </div>
        </div>
      )}
    </div>
  )
}

function FilterPanel({ filters, setFilter, toggleArr, hasActive, onReset }) {
  return (
    <div className="space-y-6">
      {hasActive && (
        <button onClick={onReset} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium">
          <X className="w-4 h-4" /> Сбросить все
        </button>
      )}
      <FilterSection title="Тип предложения">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.isHot} onChange={(e) => setFilter('isHot', e.target.checked)} className="w-4 h-4 rounded text-primary-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">🔥 Только горящие</span>
        </label>
      </FilterSection>
      <FilterSection title="Вид отдыха">
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.categories.includes(c.id)} onChange={() => toggleArr('categories', c.id)} className="w-4 h-4 rounded text-primary-500" />
              <span className="text-sm text-sand-600 dark:text-sand-300">{c.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Питание">
        <div className="space-y-2">
          {MEALS.map((m) => (
            <label key={m.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.meals.includes(m.id)} onChange={() => toggleArr('meals', m.id)} className="w-4 h-4 rounded text-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{m.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Звёзды отеля">
        <div className="flex flex-wrap gap-2">
          {[3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => toggleArr('stars', s)}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors',
                filters.stars.includes(s)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'border-sand-200 dark:border-dark-600 text-sand-600 dark:text-sand-300 hover:border-sand-300',
              ].join(' ')}
            >
              {'★'.repeat(s)}
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title={`До ${filters.priceMax.toLocaleString('ru-RU')} ₽`}>
        <input
          type="range" min={30000} max={250000} step={5000}
          value={filters.priceMax}
          onChange={(e) => setFilter('priceMax', +e.target.value)}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-sand-400 dark:text-sand-500 mt-1">
          <span>30 000 ₽</span>
          <span>250 000 ₽</span>
        </div>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-sand-600 dark:text-sand-200 mb-3 uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  )
}
