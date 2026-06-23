import { Link } from 'react-router-dom'
import { Plane, Mail, Phone, MapPin, Instagram, Youtube, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300 mt-24">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* бренд */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                Re<span className="text-primary-400">Travel</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Агрегатор туров и билетов. Сравниваем предложения от сотен туроператоров,
              чтобы вы нашли лучшую цену.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-primary-500 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-primary-500 flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-dark-700 hover:bg-primary-500 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* навигация */}
          <div>
            <h4 className="text-white font-semibold mb-4">Направления</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Турция', '/search?destination=turkey'],
                ['Египет', '/search?destination=egypt'],
                ['Таиланд', '/search?destination=thailand'],
                ['Дубай', '/search?destination=dubai'],
                ['Греция', '/search?destination=greece'],
                ['Все направления', '/destinations'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* компания */}
          <div>
            <h4 className="text-white font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['О нас', '/about'],
                ['Туры', '/search'],
                ['Личный кабинет', '/cabinet'],
                ['Корзина', '/cart'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* контакты */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 shrink-0 text-primary-400" />
                <span>+7 (800) 555-35-35</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 shrink-0 text-primary-400" />
                <span>hello@retravel.ru</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 shrink-0 text-primary-400 mt-0.5" />
                <span>Москва, ул. Тверская, 1</span>
              </li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              Работаем ежедневно 08:00 — 22:00
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 ReTravel. Все права защищены.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
