import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import DestinationCard from '../components/ui/DestinationCard'
import { destinations } from '../data/destinations'

export default function Destinations() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = 'Направления — ReTravel'
  }, [])

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase())
  )

  const popular = filtered.filter((d) => d.popular)
  const other = filtered.filter((d) => !d.popular)

  return (
    <div className="pt-24 min-h-screen">
      <div className="page-container py-10">
        {/* шапка */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">Направления</h1>
          <p className="section-sub mx-auto text-center">
            Откройте для себя мир — выберите направление и найдите лучший тур
          </p>
          {/* поиск */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400 dark:text-sand-500" />
            <input
              type="text"
              placeholder="Найти направление..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-12 py-4 text-base"
            />
          </div>
        </div>

        {/* популярные */}
        {popular.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Популярные
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popular.map((dest) => (
                <DestinationCard key={dest.id} dest={dest} />
              ))}
            </div>
          </section>
        )}

        {/* остальные */}
        {other.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Другие направления
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {other.map((dest) => (
                <DestinationCard key={dest.id} dest={dest} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌍</div>
            <p className="text-gray-500 dark:text-gray-400">
              По запросу «{query}» ничего не найдено
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
