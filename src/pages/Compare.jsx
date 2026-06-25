import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Star, Check, X as XIcon, ShoppingCart } from 'lucide-react'
import { tours } from '../data/tours'
import useCartStore from '../store/useCartStore'
import useToastStore from '../store/useToastStore'
import useCompareStore from '../store/useCompareStore'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

const ROWS = [
  { key: 'price', label: 'Цена', render: (t) => <span className="font-bold text-accent-500">{formatPrice(t.price)}</span> },
  { key: 'nights', label: 'Ночей', render: (t) => t.nights },
  { key: 'rating', label: 'Рейтинг', render: (t) => <span className="flex items-center justify-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{t.rating}</span> },
  { key: 'stars', label: 'Звёзды отеля', render: (t) => '★'.repeat(t.hotelStars) },
  { key: 'meal', label: 'Питание', render: (t) => t.mealType },
  { key: 'hotel', label: 'Отель', render: (t) => <span className="text-sm">{t.hotel}</span> },
  { key: 'destination', label: 'Страна', render: (t) => t.country },
  { key: 'hot', label: 'Горящий', render: (t) => t.isHot ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <XIcon className="w-4 h-4 text-sand-300 dark:text-sand-500 mx-auto" /> },
]

export default function Compare() {
  const [searchParams] = useSearchParams()
  const idsParam = searchParams.get('ids') || ''
  const ids = idsParam.split(',').map(Number).filter(Boolean)
  const selected = tours.filter((t) => ids.includes(t.id))

  const addItem = useCartStore((s) => s.addItem)
  const toast = useToastStore((s) => s.show)
  const { remove } = useCompareStore()

  useEffect(() => {
    document.title = 'Сравнение туров — ReTravel'
  }, [])

  if (selected.length < 2) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚖️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Добавьте хотя бы 2 тура для сравнения
          </h1>
          <Link to="/search" className="btn-primary">Найти туры</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-sand-50 dark:bg-dark-950">
      <div className="page-container py-8 pb-16">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-8">
          Сравнение туров
        </h1>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-700">
                <th className="text-left p-4 w-40 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Параметр
                </th>
                {selected.map((tour) => (
                  <th key={tour.id} className="p-4 text-center min-w-[200px]">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-28 object-cover rounded-xl"
                      />
                      <Link
                        to={`/tour/${tour.id}`}
                        className="font-bold text-gray-900 dark:text-white text-sm hover:text-primary-500 transition-colors leading-tight text-center"
                      >
                        {tour.title}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row, ri) => (
                <tr
                  key={row.key}
                  className={[
                    'border-b border-gray-50 dark:border-dark-700/50',
                    ri % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-dark-700/20',
                  ].join(' ')}
                >
                  <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {row.label}
                  </td>
                  {selected.map((tour) => (
                    <td key={tour.id} className="p-4 text-center text-sm text-gray-800 dark:text-gray-200">
                      {row.render(tour)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* кнопки действий */}
              <tr>
                <td className="p-4" />
                {selected.map((tour) => (
                  <td key={tour.id} className="p-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          addItem(tour)
                          toast(`✈ ${tour.title} добавлен в корзину`, 'success')
                        }}
                        className="btn-primary w-full justify-center py-2 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        В корзину
                      </button>
                      <Link
                        to={`/tour/${tour.id}`}
                        className="btn-outline w-full justify-center py-2 text-sm"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
