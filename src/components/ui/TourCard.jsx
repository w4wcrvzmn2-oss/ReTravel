import { Link } from 'react-router-dom'
import { Star, Clock, ShoppingCart, Flame, Sparkles, Heart, Scale } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import useFavoritesStore from '../../store/useFavoritesStore'
import useCompareStore from '../../store/useCompareStore'
import useToastStore from '../../store/useToastStore'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function TourCard({ tour }) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const inCart = items.some((i) => i.tour.id === tour.id)

  const { toggle, isFav } = useFavoritesStore()
  const fav = isFav(tour.id)

  const { add: addCompare, remove: removeCompare, has: inCompare } = useCompareStore()
  const comparing = inCompare(tour.id)

  const toast = useToastStore((s) => s.show)

  const discount = tour.originalPrice
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : null

  const mealShort = {
    'All Inclusive': 'AI',
    'Полупансион': 'HB',
    'Завтрак': 'BB',
    'Полный пансион': 'FB',
  }

  const handleCart = () => {
    if (inCart) return
    addItem(tour)
    toast(`✈ «${tour.title}» добавлен в корзину`, 'success')
  }

  const handleFav = () => {
    const added = toggle(tour.id)
    toast(added ? `♥ Добавлено в избранное` : `Удалено из избранного`, added ? 'success' : 'info')
  }

  const handleCompare = () => {
    if (comparing) {
      removeCompare(tour.id)
      toast('Убрано из сравнения', 'info')
    } else {
      const ok = addCompare(tour)
      if (ok) {
        toast('Добавлено к сравнению', 'success')
      } else {
        toast('Можно сравнивать не более 3 туров', 'error')
      }
    }
  }

  return (
    <div className="card-hover group flex flex-col overflow-hidden">
      {/* картинка */}
      <div className="relative overflow-hidden h-[185px] shrink-0">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* бейджи сверху-слева */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {tour.isHot && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary-500 text-white text-[11px] font-bold rounded-full font-mono">
              <Flame className="w-3 h-3" /> Горящий
            </span>
          )}
          {tour.isNew && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-500 text-white text-[11px] font-bold rounded-full font-mono">
              <Sparkles className="w-3 h-3" /> Новый
            </span>
          )}
          {discount && (
            <span className="px-2.5 py-1 bg-ink text-white text-[11px] font-bold rounded-full font-mono">
              −{discount}%
            </span>
          )}
        </div>

        {/* иконки сверху-справа */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={handleFav}
            className={[
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
              fav ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-red-500',
            ].join(' ')}
            title={fav ? 'Убрать из избранного' : 'В избранное'}
          >
            <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={handleCompare}
            className={[
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
              comparing ? 'bg-primary-500 text-white' : 'bg-black/40 text-white hover:bg-primary-500',
            ].join(' ')}
            title={comparing ? 'Убрать из сравнения' : 'Сравнить'}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* питание снизу-слева */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold rounded-full font-mono">
            {mealShort[tour.mealType] || tour.mealType} · {tour.hotelStars}★
          </span>
        </div>
      </div>

      {/* контент */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/tour/${tour.id}`} className="hover:text-primary-500 transition-colors">
          <h3 className="font-display font-bold text-[17px] text-ink dark:text-sand-50 line-clamp-2 mb-1 leading-tight">
            {tour.title}
          </h3>
        </Link>

        <p className="text-sm text-sand-500 dark:text-sand-400 mb-3">
          {tour.city}, {tour.country}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tour.tags.map((tag) => (
            <span key={tag} className="badge-blue text-[11px]">{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-sand-500 dark:text-sand-400 mb-4">
          <span className="flex items-center gap-1 font-mono text-xs">
            <Clock className="w-3.5 h-3.5" />
            {tour.nights} ноч.
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-ink dark:text-sand-50">{tour.rating}</span>
            <span className="text-xs">({tour.reviewsCount})</span>
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            {tour.originalPrice && (
              <p className="font-mono text-xs text-sand-400 line-through">{formatPrice(tour.originalPrice)}</p>
            )}
            <p className="font-display font-black text-[22px] text-primary-500 leading-none">{formatPrice(tour.price)}</p>
            <p className="font-mono text-[11px] text-sand-400 mt-0.5">за человека</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCart}
              disabled={inCart}
              className={[
                'p-2 rounded-[12px] border-2 transition-all',
                inCart
                  ? 'border-green-500 text-green-500 cursor-default'
                  : 'border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
              ].join(' ')}
              title={inCart ? 'Уже в корзине' : 'В корзину'}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Link to={`/tour/${tour.id}`} className="btn-primary py-2 px-4 text-sm">
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
