import { Link } from 'react-router-dom'
import { X, Scale } from 'lucide-react'
import useCompareStore from '../../store/useCompareStore'

export default function ComparePanel() {
  const { tours, remove, clear } = useCompareStore()

  if (tours.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 shadow-2xl">
      <div className="page-container py-3">
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          {/* заголовок */}
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white shrink-0">
            <Scale className="w-4 h-4 text-primary-500" />
            Сравнение ({tours.length}/3)
          </div>

          {/* туры */}
          <div className="flex flex-1 gap-2 overflow-x-auto py-1">
            {tours.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 bg-gray-50 dark:bg-dark-700 px-3 py-1.5 rounded-lg shrink-0 border border-gray-100 dark:border-dark-600"
              >
                <img src={t.image} alt="" className="w-8 h-8 rounded-md object-cover" />
                <span className="text-xs font-medium max-w-[120px] truncate">{t.title}</span>
                <button
                  onClick={() => remove(t.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {tours.length < 3 && (
              <div className="w-28 h-10 border-2 border-dashed border-gray-200 dark:border-dark-600 rounded-lg flex items-center justify-center text-xs text-gray-400 shrink-0">
                + тур
              </div>
            )}
          </div>

          {/* кнопки */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={clear}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Очистить
            </button>
            {tours.length >= 2 && (
              <Link
                to={`/compare?ids=${tours.map((t) => t.id).join(',')}`}
                className="btn-primary py-2 px-4 text-sm"
              >
                Сравнить →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
