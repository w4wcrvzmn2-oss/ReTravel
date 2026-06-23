import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function DestinationCard({ dest }) {
  return (
    <Link
      to={`/search?destination=${dest.id}`}
      className="group relative overflow-hidden rounded-2xl block"
    >
      {/* фото */}
      <div className="h-56 overflow-hidden">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* градиентный оверлей */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* контент */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-bold text-lg leading-tight flex items-center gap-1.5">
              {dest.flag} {dest.name}
            </p>
            <p className="text-gray-300 text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {dest.country}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-xs">от</p>
            <p className="text-accent-400 font-bold text-base">
              {formatPrice(dest.minPrice)}
            </p>
          </div>
        </div>

        {/* теги */}
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {dest.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* количество туров */}
      <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
        {dest.toursCount} туров
      </div>
    </Link>
  )
}
