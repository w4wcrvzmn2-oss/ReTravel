import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ChevronLeft, Plane } from 'lucide-react'
import TourCard from '../components/ui/TourCard'
import RevealSection from '../components/ui/RevealSection'
import { destinations } from '../data/destinations'
import { tours } from '../data/tours'

export default function DestinationDetail() {
  const { id } = useParams()
  const dest = destinations.find((d) => d.id === id)
  const destTours = tours.filter((t) => t.destination === id)

  useEffect(() => {
    if (dest) document.title = `${dest.name} — ReTravel`
    window.scrollTo(0, 0)
  }, [dest])

  if (!dest) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Направление не найдено
          </h1>
          <Link to="/destinations" className="btn-primary">К направлениям</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <div className="relative h-[50vh] min-h-[380px]">
        <img
          src={dest.image}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* навигация */}
        <div className="absolute top-6 left-0 right-0 page-container">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
            Направления
          </Link>
        </div>

        {/* контент */}
        <div className="absolute bottom-0 left-0 right-0 page-container pb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-300 text-sm flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4" />
                {dest.country}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                {dest.flag} {dest.name}
              </h1>
              <p className="text-gray-200 mt-2 max-w-xl">{dest.description}</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-gray-300 text-sm">туров</p>
              <p className="text-3xl font-black text-white">{destTours.length}</p>
              <p className="text-gray-300 text-sm">от {dest.minPrice.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>

          {/* теги */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {dest.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-sm rounded-full border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ТУРЫ ===== */}
      <div className="page-container py-12">
        {destTours.length > 0 ? (
          <>
            <RevealSection>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Туры в {dest.name}
                <span className="ml-3 text-base font-normal text-gray-400">
                  ({destTours.length} тура)
                </span>
              </h2>
            </RevealSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destTours.map((tour, i) => (
                <RevealSection key={tour.id} delay={i * 80}>
                  <TourCard tour={tour} />
                </RevealSection>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Туры появятся скоро
            </h3>
            <p className="text-gray-400 mb-6">
              Мы работаем над добавлением туров в {dest.name}
            </p>
            <Link to="/search" className="btn-primary">
              Смотреть все туры
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
