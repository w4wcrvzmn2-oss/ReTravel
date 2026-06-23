import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, HeadphonesIcon, ChevronRight, Star } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import TourCard from '../components/ui/TourCard'
import DestinationCard from '../components/ui/DestinationCard'
import { destinations } from '../data/destinations'
import { tours } from '../data/tours'

const stats = [
  { value: '50 000+', label: 'довольных клиентов' },
  { value: '120+', label: 'стран мира' },
  { value: '3 000+', label: 'туров в каталоге' },
  { value: '4.9', label: 'средний рейтинг' },
]

const howItWorks = [
  {
    icon: '🔍',
    step: '01',
    title: 'Выберите направление',
    desc: 'Вбейте куда хотите и когда — мы сравним сотни предложений от туроператоров.',
  },
  {
    icon: '💳',
    step: '02',
    title: 'Бронируйте онлайн',
    desc: 'Удобная оплата картой, никаких скрытых сборов. Подтверждение приходит за 2 минуты.',
  },
  {
    icon: '✈️',
    step: '03',
    title: 'Летите и наслаждайтесь',
    desc: 'Мы на связи 24/7 — от бронирования до возвращения домой.',
  },
]

const popularDestinations = destinations.filter((d) => d.popular).slice(0, 8)
const featuredTours = tours.filter((t) => t.isHot || t.rating >= 4.7).slice(0, 6)

export default function Home() {
  useEffect(() => {
    document.title = 'ReTravel — найдите идеальное путешествие'
  }, [])

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* фоновое изображение */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80"
            alt="Путешествия"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/50 to-dark-900/80" />
        </div>

        <div className="relative page-container w-full py-32">
          {/* заголовок */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Более 50 000 довольных путешественников
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Найдите идеальное{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">
                путешествие
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Сравниваем туры и билеты от 200+ туроператоров, чтобы вы нашли лучшую цену
              без лишних усилий.
            </p>
          </div>

          {/* форма поиска */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>

          {/* популярные запросы */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['🇹🇷 Турция', '🇪🇬 Египет', '🇦🇪 Дубай', '🇹🇭 Таиланд', '🇬🇷 Греция'].map((tag) => {
              const id = tag.includes('Турция')
                ? 'turkey'
                : tag.includes('Египет')
                ? 'egypt'
                : tag.includes('Дубай')
                ? 'dubai'
                : tag.includes('Таиланд')
                ? 'thailand'
                : 'greece'
              return (
                <Link
                  key={tag}
                  to={`/search?destination=${id}`}
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm rounded-full border border-white/20 transition-colors"
                >
                  {tag}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===================== СТАТИСТИКА ===================== */}
      <section className="bg-primary-500 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-black mb-1">{s.value}</div>
                <div className="text-primary-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== КАК ЭТО РАБОТАЕТ ===================== */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="section-title">Как это работает</h2>
            <p className="section-sub mx-auto text-center">
              Забронировать тур с ReTravel — это просто
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="card p-8 text-center relative">
                <div className="absolute top-4 right-4 text-gray-100 dark:text-dark-700 text-5xl font-black">
                  {item.step}
                </div>
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ПОПУЛЯРНЫЕ НАПРАВЛЕНИЯ ===================== */}
      <section className="py-20">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Популярные направления</h2>
              <p className="section-sub">Куда чаще всего летят наши туристы</p>
            </div>
            <Link
              to="/destinations"
              className="hidden md:flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              Все направления <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularDestinations.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link to="/destinations" className="btn-outline">
              Все направления
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== ГОРЯЧИЕ ТУРЫ ===================== */}
      <section className="py-20 bg-gray-50 dark:bg-dark-900">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Горящие предложения</h2>
              <p className="section-sub">Лучшие туры по специальным ценам</p>
            </div>
            <Link
              to="/search?isHot=true"
              className="hidden md:flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              Все горящие <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ПРЕИМУЩЕСТВА ===================== */}
      <section className="py-20">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary-500" />,
                title: 'Безопасное бронирование',
                desc: 'Работаем только с проверенными туроператорами. Ваши данные защищены шифрованием.',
              },
              {
                icon: <Zap className="w-8 h-8 text-accent-500" />,
                title: 'Лучшие цены',
                desc: 'Сравниваем предложения 200+ туроператоров и показываем самую выгодную цену.',
              },
              {
                icon: <HeadphonesIcon className="w-8 h-8 text-violet-500" />,
                title: 'Поддержка 24/7',
                desc: 'Наша команда на связи круглосуточно — позвоните или напишите в любой момент.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-dark-800 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-violet-700">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5">
            Готовы к приключению?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Тысячи туров ждут вас. Начните поиск прямо сейчас и получите скидку 5% на
            первое бронирование.
          </p>
          <Link to="/search" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition-colors shadow-xl">
            Найти тур
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
