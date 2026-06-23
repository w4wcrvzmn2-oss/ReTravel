import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Award, Users, Globe, ChevronRight } from 'lucide-react'
import RevealSection from '../components/ui/RevealSection'

const values = [
  { icon: <Shield className="w-7 h-7 text-primary-500" />, title: 'Честность', desc: 'Никаких скрытых комиссий и мелкого шрифта. Цена на экране — это цена при оплате.' },
  { icon: <Award className="w-7 h-7 text-accent-500" />, title: 'Качество', desc: 'Работаем только с проверенными туроператорами с лицензией Ростуризма.' },
  { icon: <Users className="w-7 h-7 text-violet-500" />, title: 'Клиент прежде всего', desc: 'Поддержка 24/7 — до отъезда, во время тура и после возвращения.' },
  { icon: <Globe className="w-7 h-7 text-emerald-500" />, title: 'Широкий выбор', desc: 'Сотни туров в десятки направлений от проверенных туроператоров в одном месте.' },
]

export default function About() {
  useEffect(() => {
    document.title = 'О компании — ReTravel'
  }, [])

  return (
    <div className="pt-20 min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative py-24 bg-gradient-to-br from-dark-900 via-primary-900/30 to-dark-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative page-container text-center">
          <RevealSection>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Мы делаем путешествия{' '}
              <span className="text-gradient">доступными</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              ReTravel — агрегатор туров и авиабилетов, который сравнивает предложения
              от туроператоров, чтобы вы нашли лучшую цену и отправились в путешествие
              мечты без лишних усилий.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ===== ЦЕННОСТИ ===== */}
      <section className="py-20">
        <div className="page-container">
          <RevealSection>
            <h2 className="section-title text-center mb-12">Наши ценности</h2>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <RevealSection key={v.title} delay={i * 100}>
                <div className="card p-7 flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{v.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-violet-700">
        <div className="page-container text-center">
          <RevealSection>
            <h2 className="text-3xl font-black text-white mb-4">
              Готовы отправиться в путешествие?
            </h2>
            <p className="text-primary-100 mb-8">
              Туры ждут вас прямо сейчас
            </p>
            <Link to="/search" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-xl">
              Найти тур <ChevronRight className="w-5 h-5" />
            </Link>
          </RevealSection>
        </div>
      </section>
    </div>
  )
}
