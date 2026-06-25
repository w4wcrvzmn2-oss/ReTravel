import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, HeadphonesIcon, ChevronRight, Star, ArrowRight, MapPin, Calendar, Users } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import TourCard from '../components/ui/TourCard'
import DestinationCard from '../components/ui/DestinationCard'
import { destinations as destinationsApi, tours as toursApi } from '../lib/api'
import { destinations as staticDestinations } from '../data/destinations'
import { tours as staticTours } from '../data/tours'

const stats = [
  { value: '50 000+', label: 'довольных клиентов' },
  { value: '120+',    label: 'стран мира' },
  { value: '3 000+', label: 'туров в каталоге' },
  { value: '4.9',    label: 'средний рейтинг' },
]

const howItWorks = [
  { step: '01', emoji: '🔍', title: 'Выберите направление',   desc: 'Вбейте куда хотите и когда — мы сравним сотни предложений от туроператоров.' },
  { step: '02', emoji: '💳', title: 'Бронируйте онлайн',      desc: 'Удобная оплата картой, никаких скрытых сборов. Подтверждение за 2 минуты.' },
  { step: '03', emoji: '✈️', title: 'Летите и наслаждайтесь', desc: 'Мы на связи 24/7 — от бронирования до возвращения домой.' },
]

const quickTags = [
  { label: '🇷🇺 Россия',   id: 'russia'   },
  { label: '⛰️ Кавказ',   id: 'caucasus' },
  { label: '🇹🇷 Турция',  id: 'turkey'   },
  { label: '🇪🇬 Египет',   id: 'egypt'    },
  { label: '🇦🇪 Дубай',    id: 'dubai'    },
  { label: '🇬🇪 Грузия',   id: 'georgia'  },
  { label: '🇹🇭 Таиланд',  id: 'thailand' },
  { label: '🇬🇷 Греция',   id: 'greece'   },
]

const mobileTags = [
  { code: 'РУ', label: 'Россия',   id: 'russia'   },
  { code: '⛰',  label: 'Кавказ',   id: 'caucasus' },
  { code: 'АЕ', label: 'Дубай',    id: 'dubai'    },
  { code: 'TR', label: 'Турция',   id: 'turkey'   },
  { code: 'EG', label: 'Египет',   id: 'egypt'    },
  { code: 'TH', label: 'Таиланд',  id: 'thailand' },
  { code: 'GR', label: 'Греция',   id: 'greece'   },
  { code: '🇬🇪', label: 'Грузия',   id: 'georgia'  },
]

export default function Home() {
  const [popularDestinations, setPopularDestinations] = useState(
    staticDestinations.filter((d) => d.popular).slice(0, 8)
  )
  const [featuredTours, setFeaturedTours] = useState(
    staticTours.filter((t) => t.isHot || t.rating >= 4.7).slice(0, 6)
  )

  useEffect(() => {
    document.title = 'ReTravel — найдите идеальное путешествие'
    destinationsApi.list().then((data) => {
      const popular = data.filter((d) => d.popular).slice(0, 8)
      if (popular.length) setPopularDestinations(popular)
    }).catch(() => {})
    toursApi.list({ is_hot: 'true', sort: 'rating', limit: 6 }).then((data) => {
      if (data.tours?.length) setFeaturedTours(data.tours)
    }).catch(() => {})
  }, [])

  return (
    <div>
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative overflow-hidden bg-sand-50 dark:bg-dark-950 pt-16 md:pt-20">

        {/* ── MOBILE HERO ── */}
        <div className="md:hidden px-4 pt-3 pb-8">

          {/* Kicker */}
          <span className="kicker block mb-4">200+ ТУРОПЕРАТОРОВ</span>

          {/* Heading */}
          <h1 className="font-display font-black text-[44px] leading-[0.90] tracking-[-0.03em] text-ink dark:text-sand-50 mb-6">
            Найдите<br />
            идеальное<br />
            <span className="text-primary-500">путешест<br />вие</span>
          </h1>

          {/* Search card */}
          <div className="bg-white dark:bg-dark-800 rounded-[20px] p-3.5 mb-4 border border-sand-100 dark:border-dark-700"
               style={{ boxShadow: '0 8px 28px rgba(60,40,20,.10)' }}>
            {/* Destination */}
            <div className="flex items-center gap-2.5 px-3 py-3 rounded-[12px] mb-2 bg-sand-100 dark:bg-dark-900">
              <MapPin className="w-4 h-4 flex-shrink-0 text-sand-400 dark:text-sand-500" />
              <input
                type="text"
                placeholder="Любое направление"
                className="flex-1 text-[14px] bg-transparent outline-none font-sans text-sand-400 placeholder-sand-400 dark:placeholder-sand-500 dark:text-sand-400 focus:text-ink dark:focus:text-sand-50"
              />
            </div>
            {/* Date + Tourists */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2 px-3 py-3 rounded-[12px] bg-sand-100 dark:bg-dark-900">
                <Calendar className="w-4 h-4 flex-shrink-0 text-sand-400 dark:text-sand-500" />
                <input
                  type="text"
                  placeholder="12 июля"
                  className="min-w-0 flex-1 text-[13px] bg-transparent outline-none font-sans text-sand-500 placeholder-sand-400 dark:placeholder-sand-500 dark:text-sand-400 focus:text-ink dark:focus:text-sand-50"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-3 rounded-[12px] bg-sand-100 dark:bg-dark-900">
                <Users className="w-4 h-4 flex-shrink-0 text-sand-400 dark:text-sand-500" />
                <input
                  type="text"
                  placeholder="2 туриста"
                  className="min-w-0 flex-1 text-[13px] bg-transparent outline-none font-sans text-sand-500 placeholder-sand-400 dark:placeholder-sand-500 dark:text-sand-400 focus:text-ink dark:focus:text-sand-50"
                />
              </div>
            </div>
            <Link to="/search" className="btn-primary w-full py-3.5 text-[15px] font-bold">
              Найти туры
            </Link>
          </div>

          {/* Country tags */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {mobileTags.map((t) => (
              <Link
                key={t.id}
                to={`/search?destination=${t.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-full text-[13px] font-semibold transition-opacity hover:opacity-80"
                style={{ background: '#191512', color: '#ece6d8' }}
              >
                <span
                  className="text-[10px] font-mono font-bold w-7 text-center py-0.5 rounded-[5px]"
                  style={{ background: '#2a2318', color: '#9a9183' }}
                >
                  {t.code}
                </span>
                {t.label}
              </Link>
            ))}
          </div>

          {/* Горящие — horizontal scroll */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-[22px] text-ink dark:text-sand-50">Горящие</h2>
              <Link
                to="/search?is_hot=true"
                className="text-[13px] font-semibold flex items-center gap-0.5"
                style={{ color: '#9a9183' }}
              >
                Все <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
              {featuredTours.slice(0, 5).map((tour) => (
                <div key={tour.id} className="flex-shrink-0 w-[73vw] max-w-[288px]">
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP HERO ── */}
        <div className="hidden md:block page-container">
          <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[88vh] py-16">

            {/* Left: content */}
            <div className="flex-1 max-w-[560px] relative z-10">
              <span className="kicker mb-5 block">RETRAVEL · ПОИСК ТУРОВ · 2026</span>
              <h1 className="font-display font-black text-[52px] md:text-[68px] leading-[0.95] tracking-[-0.025em] text-ink dark:text-sand-50 mb-6">
                Путешествие<br />
                начинается с{' '}
                <span className="text-primary-500">горизонта</span>
              </h1>
              <p className="font-sans text-[17px] leading-[1.6] text-sand-700 dark:text-sand-400 mb-8 max-w-md">
                Сравниваем туры и билеты от 200+ туроператоров, чтобы вы нашли лучшую цену без лишних усилий.
              </p>
              <div className="bg-white dark:bg-dark-800 rounded-[22px] shadow-warm-lg p-2 mb-5 border border-sand-200 dark:border-dark-700">
                <SearchBar />
              </div>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((t) => (
                  <Link
                    key={t.id}
                    to={`/search?destination=${t.id}`}
                    className="px-4 py-2 bg-sand-100 dark:bg-dark-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sand-700 dark:text-sand-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm rounded-full border border-sand-200 dark:border-dark-700 transition-colors font-medium"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: image + floating badges */}
            <div className="flex-1 relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-[520px]">
                <div className="rounded-[28px] overflow-hidden aspect-[4/4.2] shadow-warm-xl">
                  <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80"
                    alt="Путешествие"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[28px]" />
                </div>
                <div className="absolute -bottom-6 -left-10 bg-white dark:bg-dark-800 rounded-2xl px-4 py-3 shadow-float animate-float border border-sand-100 dark:border-dark-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-lg">⭐</div>
                    <div>
                      <p className="font-mono text-[10px] font-bold text-sand-500 tracking-widest">РЕЙТИНГ</p>
                      <p className="font-display font-black text-xl text-ink dark:text-sand-50">4.9 / 5</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-5 -right-6 bg-primary-500 text-white rounded-2xl px-4 py-3 shadow-[0_8px_22px_rgba(232,93,61,.4)] animate-float-slow">
                  <p className="font-mono text-[10px] font-bold tracking-widest opacity-80">ПУТЕШЕСТВЕННИКОВ</p>
                  <p className="font-display font-black text-2xl">50 000+</p>
                </div>
                <div
                  className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white dark:bg-dark-800 rounded-2xl px-3 py-2.5 shadow-float animate-float border border-sand-100 dark:border-dark-700"
                  style={{ animationDelay: '2.5s' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">🔥</div>
                    <div>
                      <p className="font-mono text-[10px] font-bold text-sand-500 tracking-wide">ГОРЯЩИХ ТУРОВ</p>
                      <p className="font-display font-black text-lg text-ink dark:text-sand-50">24</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Декоративный кружок (desktop only) */}
        <div className="hidden md:block absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-500/5 dark:bg-primary-500/10 pointer-events-none" />
        <div className="hidden md:block absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-sand-200/60 dark:bg-dark-800/60 pointer-events-none" />
      </section>

      {/* ══════════════════════ СТАТИСТИКА ══════════════════════ */}
      <section className="bg-ink dark:bg-dark-900 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-black text-3xl md:text-4xl text-sand-50 mb-1">{s.value}</div>
                <div className="font-mono text-[11px] font-bold tracking-widest text-sand-500 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ КАК ЭТО РАБОТАЕТ ══════════════════════ */}
      <section className="py-20 bg-sand-100 dark:bg-dark-950">
        <div className="page-container">
          <div className="mb-14">
            <span className="kicker block mb-3">КАК ЭТО РАБОТАЕТ</span>
            <h2 className="section-title">Забронировать тур — это просто</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="card p-8 relative overflow-hidden">
                <div className="absolute top-4 right-5 font-display font-black text-6xl text-sand-200 dark:text-dark-700 select-none leading-none">
                  {item.step}
                </div>
                <div className="text-4xl mb-5">{item.emoji}</div>
                <h3 className="font-display font-bold text-xl text-ink dark:text-sand-50 mb-3">{item.title}</h3>
                <p className="text-sand-600 dark:text-sand-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ ПОПУЛЯРНЫЕ НАПРАВЛЕНИЯ ══════════════════════ */}
      <section className="py-20 bg-sand-50 dark:bg-dark-950">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="kicker block mb-3">НАПРАВЛЕНИЯ</span>
              <h2 className="section-title">Популярные места</h2>
              <p className="section-sub">Куда чаще всего летят наши туристы</p>
            </div>
            <Link
              to="/destinations"
              className="hidden md:flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-bold text-sm transition-colors"
            >
              Все направления <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularDestinations.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link to="/destinations" className="btn-outline">Все направления</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ ГОРЯЩИЕ ТУРЫ ══════════════════════ */}
      <section className="py-20 bg-sand-100 dark:bg-dark-900">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="kicker block mb-3">ГОРЯЩИЕ ПРЕДЛОЖЕНИЯ</span>
              <h2 className="section-title">Лучшие туры сейчас</h2>
              <p className="section-sub">Специальные цены — только для быстрых</p>
            </div>
            <Link
              to="/search?is_hot=true"
              className="hidden md:flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-bold text-sm transition-colors"
            >
              Все горящие <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: горизонтальный скролл (hidden — shown in mobile hero above) */}
          <div className="hidden gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
            {featuredTours.map((tour) => (
              <div key={tour.id} className="flex-shrink-0 w-[75vw] max-w-[300px]">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
          {/* Desktop: сетка */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ ПРЕИМУЩЕСТВА ══════════════════════ */}
      <section className="py-20 bg-sand-50 dark:bg-dark-950">
        <div className="page-container">
          <div className="mb-14">
            <span className="kicker block mb-3">ПОЧЕМУ МЫ</span>
            <h2 className="section-title">Надёжно, быстро, выгодно</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-7 h-7 text-primary-500" />, title: 'Безопасное бронирование', desc: 'Работаем только с проверенными туроператорами. Ваши данные защищены шифрованием.' },
              { icon: <Zap     className="w-7 h-7 text-primary-500" />, title: 'Лучшие цены',             desc: 'Сравниваем предложения 200+ туроператоров и показываем самую выгодную цену.' },
              { icon: <HeadphonesIcon className="w-7 h-7 text-primary-500" />, title: 'Поддержка 24/7', desc: 'Наша команда на связи круглосуточно — позвоните или напишите в любой момент.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-5">
                <div className="w-14 h-14 rounded-[18px] bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-ink dark:text-sand-50 mb-1.5">{item.title}</h3>
                  <p className="text-sand-600 dark:text-sand-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-20 bg-primary-500 relative overflow-hidden">
        <div className="page-container text-center relative z-10">
          <span className="font-mono text-[11px] font-bold tracking-widest text-primary-100/70 uppercase block mb-4">НАЧНИТЕ СЕЙЧАС</span>
          <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-5 leading-tight tracking-tight">
            Готовы к приключению?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto font-sans">
            Тысячи туров ждут вас. Начните поиск прямо сейчас и получите скидку 5% на первое бронирование.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-600 font-bold text-base rounded-[14px] hover:bg-sand-50 transition-colors shadow-xl"
          >
            Найти тур <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        {/* декор */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-black/10 pointer-events-none" />
      </section>
    </div>
  )
}
