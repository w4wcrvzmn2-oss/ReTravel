import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Star,
  Clock,
  Users,
  MapPin,
  Check,
  X,
  ShoppingCart,
  ChevronLeft,
  Calendar,
  Utensils,
  Building,
  Bell,
  Heart,
  Scale,
  ThumbsUp,
  Send,
} from 'lucide-react'
import { tours } from '../data/tours'
import mockReviews from '../data/reviews'
import useCartStore from '../store/useCartStore'
import useFavoritesStore from '../store/useFavoritesStore'
import useCompareStore from '../store/useCompareStore'
import useReviewsStore from '../store/useReviewsStore'
import useToastStore from '../store/useToastStore'
import useAuthStore from '../store/useAuthStore'
import Lightbox from '../components/ui/Lightbox'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const tour = tours.find((t) => t.id === Number(id))

  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [travelers, setTravelers] = useState(2)
  const [date, setDate] = useState('')
  const [added, setAdded] = useState(false)
  const [alertEmail, setAlertEmail] = useState('')

  // отзыв
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const inCart = items.some((i) => i.tour.id === tour?.id)

  const { toggle, isFav } = useFavoritesStore()
  const fav = isFav(tour?.id)

  const { add: addCompare, remove: removeCompare, has: inCompare } = useCompareStore()
  const comparing = inCompare(tour?.id)

  const toast = useToastStore((s) => s.show)
  const { user } = useAuthStore()

  const { getReviews, addReview } = useReviewsStore()
  const userReviews = getReviews(tour?.id)
  const allReviews = [...(mockReviews[tour?.id] || []), ...userReviews]

  useEffect(() => {
    if (tour) document.title = `${tour.title} — ReTravel`
    window.scrollTo(0, 0)
  }, [tour])

  if (!tour) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-ink dark:text-sand-50 mb-3">Тур не найден</h1>
          <Link to="/search" className="btn-primary">Вернуться к поиску</Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(tour, travelers, date)
    setAdded(true)
    toast(`✈ «${tour.title}» добавлен в корзину`, 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  const handleFav = () => {
    const wasAdded = toggle(tour.id)
    toast(wasAdded ? '♥ Добавлено в избранное' : 'Убрано из избранного', wasAdded ? 'success' : 'info')
  }

  const handleCompare = () => {
    if (comparing) {
      removeCompare(tour.id)
      toast('Убрано из сравнения', 'info')
    } else {
      const ok = addCompare(tour)
      if (ok) toast('Добавлено к сравнению', 'success')
      else toast('Можно сравнивать не более 3 туров', 'error')
    }
  }

  const handleAlertSubmit = (e) => {
    e.preventDefault()
    if (!alertEmail.includes('@')) return
    toast(`Уведомление о снижении цены подключено для ${alertEmail}`, 'success')
    setAlertEmail('')
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewText.trim()) return
    if (!user) {
      toast('Войдите, чтобы оставить отзыв', 'error')
      return
    }
    addReview(tour.id, {
      author: user.name,
      initials: user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2),
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
      helpful: 0,
    })
    toast('Отзыв добавлен!', 'success')
    setReviewText('')
    setReviewRating(5)
  }

  const total = tour.price * travelers
  const discount = tour.originalPrice
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : null

  const avgRating = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : tour.rating

  return (
    <div className="pt-20 min-h-screen">
      {/* lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={tour.gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* навигация */}
      <div className="page-container py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sand-500 dark:text-sand-400 hover:text-sand-600 dark:hover:text-sand-300 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </button>
      </div>

      <div className="page-container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== ЛЕВАЯ ЧАСТЬ ===== */}
          <div className="lg:col-span-2 space-y-6">
            {/* галерея с лайтбоксом */}
            <div className="rounded-2xl overflow-hidden">
              <button
                onClick={() => setLightboxIndex(activeImage)}
                className="w-full block cursor-zoom-in"
              >
                <img
                  src={tour.gallery[activeImage]}
                  alt={tour.title}
                  className="w-full h-80 md:h-[480px] object-cover hover:brightness-95 transition-all"
                />
              </button>
              {tour.gallery.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {tour.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={[
                        'flex-1 h-20 rounded-xl overflow-hidden border-2 transition-all',
                        activeImage === i
                          ? 'border-primary-500'
                          : 'border-transparent opacity-70 hover:opacity-100',
                      ].join(' ')}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* заголовок */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {tour.isHot && (
                  <span className="badge bg-red-100 text-red-600">🔥 Горящий</span>
                )}
                {tour.isNew && (
                  <span className="badge bg-violet-100 text-violet-600">✨ Новый</span>
                )}
                {tour.tags.map((tag) => (
                  <span key={tag} className="badge-blue">{tag}</span>
                ))}
              </div>

              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">{tour.title}</h1>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleFav}
                    className={[
                      'p-2.5 rounded-xl border-2 transition-all',
                      fav
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-200 dark:border-dark-600 text-sand-400 dark:text-sand-500 hover:border-red-400',
                    ].join(' ')}
                    title={fav ? 'Убрать из избранного' : 'В избранное'}
                  >
                    <Heart className={`w-5 h-5 ${fav ? 'fill-red-500' : ''}`} />
                  </button>
                  <button
                    onClick={handleCompare}
                    className={[
                      'p-2.5 rounded-xl border-2 transition-all',
                      comparing
                        ? 'border-primary-500 bg-primary-50 text-primary-500'
                        : 'border-gray-200 dark:border-dark-600 text-sand-400 dark:text-sand-500 hover:border-primary-400',
                    ].join(' ')}
                    title={comparing ? 'Убрать из сравнения' : 'Сравнить'}
                  >
                    <Scale className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {tour.city}, {tour.country}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {avgRating} ({allReviews.length} отзывов)
                </span>
              </div>
            </div>

            {/* краткие данные */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Clock className="w-5 h-5 text-primary-500" />, label: 'Длительность', value: `${tour.nights} ночей` },
                { icon: <Building className="w-5 h-5 text-primary-500" />, label: 'Отель', value: `${tour.hotelStars}★` },
                { icon: <Utensils className="w-5 h-5 text-primary-500" />, label: 'Питание', value: tour.mealType },
                { icon: <Calendar className="w-5 h-5 text-primary-500" />, label: 'Даты', value: `${new Date(tour.dateFrom).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })} — ${new Date(tour.dateTo).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}` },
              ].map((item) => (
                <div key={item.label} className="card p-4">
                  <div className="mb-1">{item.icon}</div>
                  <p className="text-xs text-sand-400 dark:text-sand-500 mb-0.5">{item.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            {/* описание */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">О туре</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tour.description}</p>
            </div>

            {/* что включено */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Что входит в стоимость</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.includes.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              {tour.excludes && tour.excludes.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-5 mb-3 uppercase tracking-wide">Не включено</h3>
                  <div className="space-y-2">
                    {tour.excludes.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-red-500" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* хайлайты */}
            {tour.highlights && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Изюминки тура</h2>
                <ul className="space-y-3">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-primary-500 font-bold mt-0.5">→</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* уведомление о снижении цены */}
            <div className="card p-6 border border-primary-200 dark:border-primary-900/50">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Уведомление о снижении цены
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Сообщим вам, когда цена на этот тур снизится.
              </p>
              <form onSubmit={handleAlertSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="Ваш email"
                  className="input-field flex-1 text-sm"
                  required
                />
                <button type="submit" className="btn-outline py-2 px-4 text-sm shrink-0">
                  <Bell className="w-4 h-4" /> Подписаться
                </button>
              </form>
            </div>

            {/* ===== ОТЗЫВЫ ===== */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Отзывы
                  {allReviews.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-sand-400 dark:text-sand-500">({allReviews.length})</span>
                  )}
                </h2>
                {allReviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-black text-gray-900 dark:text-white">{avgRating}</span>
                  </div>
                )}
              </div>

              {allReviews.length === 0 ? (
                <p className="text-sand-400 dark:text-sand-500 text-sm py-4 text-center">
                  Отзывов пока нет. Будьте первым!
                </p>
              ) : (
                <div className="space-y-5 mb-6">
                  {allReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-dark-700 pb-5 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {review.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">{review.author}</span>
                            <span className="text-xs text-sand-400 dark:text-sand-500">{review.date}</span>
                          </div>
                          <div className="flex mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-sand-200 dark:text-dark-600'}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.text}</p>
                          {review.helpful > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-sand-400 dark:text-sand-500">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              Полезно: {review.helpful}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* форма отзыва */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="border-t border-gray-100 dark:border-dark-700 pt-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Оставить отзыв</h3>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${s <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-sand-300 dark:text-sand-500 hover:text-yellow-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Расскажите о вашем опыте..."
                    rows={3}
                    className="input-field resize-none text-sm mb-3"
                  />
                  <button type="submit" className="btn-primary py-2 px-5 text-sm">
                    <Send className="w-4 h-4" /> Отправить
                  </button>
                </form>
              ) : (
                <div className="border-t border-gray-100 dark:border-dark-700 pt-5 text-center">
                  <p className="text-sm text-sand-400 dark:text-sand-500 mb-3">Чтобы оставить отзыв, нужно войти</p>
                  <Link to="/auth" className="btn-outline text-sm py-2 px-5">Войти</Link>
                </div>
              )}
            </div>
          </div>

          {/* ===== ВИДЖЕТ БРОНИРОВАНИЯ ===== */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* цена */}
              <div className="mb-6">
                {tour.originalPrice && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sand-400 dark:text-sand-500 line-through text-sm">{formatPrice(tour.originalPrice)}</span>
                    <span className="badge-red text-xs">-{discount}%</span>
                  </div>
                )}
                <div className="text-3xl font-black text-accent-500">{formatPrice(tour.price)}</div>
                <p className="text-sand-400 dark:text-sand-500 text-sm">за одного человека</p>
              </div>

              {/* отель */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-xl p-3 mb-5 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Отель</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {tour.hotel} {'★'.repeat(tour.hotelStars)}
                </p>
              </div>

              {/* туристы */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Туристы</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-9 h-9 rounded-lg border-2 border-gray-200 dark:border-dark-600 flex items-center justify-center text-sand-600 dark:text-sand-300 hover:border-primary-500 transition-colors text-lg font-bold">−</button>
                  <span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white min-w-[40px] justify-center">
                    <Users className="w-4 h-4 text-sand-400 dark:text-sand-500" />{travelers}
                  </span>
                  <button onClick={() => setTravelers(Math.min(20, travelers + 1))} className="w-9 h-9 rounded-lg border-2 border-gray-200 dark:border-dark-600 flex items-center justify-center text-sand-600 dark:text-sand-300 hover:border-primary-500 transition-colors text-lg font-bold">+</button>
                </div>
              </div>

              {/* дата */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Желаемая дата выезда</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 dark:text-sand-500 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={tour.dateFrom}
                    max={tour.dateTo}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>

              {/* итого */}
              <div className="border-t border-gray-100 dark:border-dark-700 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{formatPrice(tour.price)} × {travelers} чел.</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white">{formatPrice(total)}</span>
                </div>
              </div>

              {/* кнопки */}
              {inCart ? (
                <Link to="/cart" className="btn-accent w-full justify-center">
                  <ShoppingCart className="w-5 h-5" />
                  Перейти в корзину
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className={['w-full justify-center transition-all', added ? 'btn-accent' : 'btn-primary'].join(' ')}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {added ? '✓ Добавлено!' : 'В корзину'}
                </button>
              )}

              <div className="mt-4 text-xs text-sand-400 dark:text-sand-500 text-center">
                Вылет из: {tour.departureCities.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
