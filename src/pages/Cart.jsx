import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, MapPin, Clock, Users, ShoppingCart, Check, Tag, X } from 'lucide-react'
import useCartStore from '../store/useCartStore'
import useAuthStore from '../store/useAuthStore'
import { orders as ordersApi } from '../lib/api'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

const PROMO_CODES = {
  RETRAVEL5: 0.05,
  WELCOME10: 0.10,
  HOT20: 0.20,
}

export default function Cart() {
  const { items, removeItem, updateTravelers, getTotal, placeOrder } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [step, setStep] = useState('cart')
  const [order, setOrder] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    comment: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // промокод
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(null) // { code, discount }
  const [promoError, setPromoError] = useState('')

  useEffect(() => {
    document.title = 'Корзина — ReTravel'
  }, [])

  const rawTotal = getTotal()
  const discount = promoApplied ? promoApplied.discount : 0
  const total = rawTotal * (1 - discount)

  const set = (key, val) => {
    setErrors((e) => ({ ...e, [key]: '' }))
    setForm((f) => ({ ...f, [key]: val }))
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setPromoApplied({ code, discount: PROMO_CODES[code] })
      setPromoError('')
    } else {
      setPromoError('Промокод не найден')
      setPromoApplied(null)
    }
  }

  const removePromo = () => {
    setPromoApplied(null)
    setPromoInput('')
    setPromoError('')
  }

  const validateCheckout = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Введите имя'
    if (!form.email.includes('@')) errs.email = 'Введите корректный email'
    if (form.phone.length < 10) errs.phone = 'Введите номер телефона'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    if (!validateCheckout()) return
    setLoading(true)
    try {
      const placed = await ordersApi.create({
        items,
        contact: form,
        total: Math.round(total),
        promo_code: promoApplied?.code || null,
        discount_percent: Math.round(discount * 100),
      })
      // локально тоже сохраняем на случай если нет авторизации
      placeOrder({ ...form, promoCode: promoApplied?.code, discountPercent: discount * 100, finalTotal: total })
      setOrder(placed)
      setStep('success')
    } catch {
      // fallback: сохраняем только локально
      const placed = placeOrder({ ...form, promoCode: promoApplied?.code, discountPercent: discount * 100, finalTotal: total })
      setOrder(placed)
      setStep('success')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success' && order) {
    return (
      <div className="pt-24 min-h-screen bg-sand-50 dark:bg-dark-950 flex items-center">
        <div className="page-container py-16">
          <div className="max-w-md mx-auto card p-10 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-black text-ink dark:text-sand-50 mb-2">Заказ оформлен!</h1>
            <p className="text-sand-500 dark:text-sand-400 mb-2">
              Номер заказа: <span className="font-bold text-primary-500">{order.id}</span>
            </p>
            <p className="text-sand-500 dark:text-sand-400 text-sm mb-6">
              Мы отправим подтверждение на{' '}
              <span className="font-medium">{order.contact.email}</span> и свяжемся с вами в течение 15 минут.
            </p>
            <div className="bg-sand-50 dark:bg-dark-800 rounded-xl p-4 mb-6 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-sand-500 dark:text-sand-400">Итого оплачено</span>
                <span className="font-bold text-accent-500">{formatPrice(total)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between mb-1">
                  <span className="text-sand-500 dark:text-sand-400">Промокод {promoApplied.code}</span>
                  <span className="text-green-600 font-medium">-{discount * 100}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sand-500 dark:text-sand-400">Туров</span>
                <span>{order.items.length}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/cabinet" className="btn-outline flex-1 justify-center">Мои заказы</Link>
              <Link to="/search" className="btn-primary flex-1 justify-center">Ещё туры</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-sand-50 dark:bg-dark-950 flex items-center">
        <div className="page-container py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-ink dark:text-sand-50 mb-3">Корзина пуста</h1>
          <p className="text-sand-500 dark:text-sand-400 mb-6">Добавьте туры из каталога, чтобы продолжить</p>
          <Link to="/search" className="btn-primary">
            <ShoppingCart className="w-5 h-5" /> Перейти к турам
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-sand-50 dark:bg-dark-950">
      <div className="page-container py-8 pb-16">
        {/* шаги */}
        <div className="flex items-center gap-3 mb-8">
          <StepBadge num={1} label="Корзина" active={step === 'cart'} done={step === 'checkout'} />
          <div className="flex-1 h-px bg-gray-200 dark:bg-dark-700" />
          <StepBadge num={2} label="Оформление" active={step === 'checkout'} done={false} />
          <div className="flex-1 h-px bg-gray-200 dark:bg-dark-700" />
          <StepBadge num={3} label="Готово" active={step === 'success'} done={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* список туров / форма */}
          <div className="lg:col-span-2 space-y-4">
            {step === 'cart' && (
              <>
                <h1 className="text-xl font-bold text-ink dark:text-sand-50 mb-2">Корзина ({items.length})</h1>
                {items.map((item) => (
                  <CartItem
                    key={item.tour.id}
                    item={item}
                    onRemove={() => removeItem(item.tour.id)}
                    onChangeTravelers={(n) => updateTravelers(item.tour.id, n)}
                  />
                ))}
              </>
            )}

            {step === 'checkout' && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-ink dark:text-sand-50 mb-5">Данные для бронирования</h2>
                <form onSubmit={handleOrder} className="space-y-4">
                  <Field label="Имя и фамилия" value={form.name} onChange={(v) => set('name', v)} placeholder="Иван Иванов" error={errors.name} />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="ivan@example.com" error={errors.email} />
                  <Field label="Телефон" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="+7 (999) 000-00-00" error={errors.phone} />
                  <div>
                    <label className="block text-sm font-medium text-sand-600 dark:text-sand-300 mb-1.5">Комментарий (необязательно)</label>
                    <textarea value={form.comment} onChange={(e) => set('comment', e.target.value)} placeholder="Особые пожелания..." rows={3} className="input-field resize-none" />
                  </div>
                  <p className="text-xs text-sand-400 dark:text-sand-500">Нажимая «Подтвердить», вы соглашаетесь с условиями бронирования.</p>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep('cart')} className="btn-outline">Назад</button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Подтвердить заказ'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* сводка */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-ink dark:text-sand-50 mb-4">Итого</h3>

              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.tour.id} className="flex justify-between text-sm">
                    <span className="text-sand-500 dark:text-sand-400 truncate flex-1 mr-2">
                      {item.tour.title} × {item.travelers}
                    </span>
                    <span className="font-medium text-ink dark:text-sand-50 shrink-0">
                      {formatPrice(item.tour.price * item.travelers)}
                    </span>
                  </div>
                ))}
              </div>

              {/* промокод */}
              {step === 'cart' && (
                <div className="mb-4">
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                        <Tag className="w-4 h-4" />
                        <span className="font-semibold">{promoApplied.code}</span>
                        <span>-{promoApplied.discount * 100}%</span>
                      </div>
                      <button onClick={removePromo} className="text-green-600 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 dark:text-sand-500" />
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                            placeholder="Промокод"
                            className="input-field pl-9 text-sm py-2"
                            onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                          />
                        </div>
                        <button onClick={applyPromo} className="btn-outline py-2 px-3 text-sm shrink-0">
                          Применить
                        </button>
                      </div>
                      {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-sand-100 dark:border-dark-700 pt-4 mb-5 space-y-2">
                {promoApplied && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-sand-400 dark:text-sand-500">Сумма</span>
                      <span className="text-sand-400 dark:text-sand-500 line-through">{formatPrice(rawTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Скидка {promoApplied.discount * 100}%</span>
                      <span className="text-green-600">-{formatPrice(rawTotal * promoApplied.discount)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Итого</span>
                  <span className="text-2xl font-black text-accent-500">{formatPrice(total)}</span>
                </div>
              </div>

              {step === 'cart' && (
                <button onClick={() => setStep('checkout')} className="btn-primary w-full justify-center">
                  Оформить заказ
                </button>
              )}

              <p className="text-xs text-sand-400 dark:text-sand-500 mt-3 text-center">🔒 Безопасная оплата · Без скрытых комиссий</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItem({ item, onRemove, onChangeTravelers }) {
  const { tour, travelers } = item
  return (
    <div className="card p-4 flex gap-4">
      <img src={tour.image} alt={tour.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/tour/${tour.id}`} className="font-semibold text-ink dark:text-sand-50 hover:text-primary-500 transition-colors text-sm leading-tight">
            {tour.title}
          </Link>
          <button onClick={onRemove} className="p-1.5 text-sand-400 dark:text-sand-500 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-3 mt-1 text-xs text-sand-500 dark:text-sand-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tour.city}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.nights} ночей</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button onClick={() => onChangeTravelers(travelers - 1)} className="w-7 h-7 rounded-lg border border-sand-200 dark:border-dark-600 flex items-center justify-center text-sand-600 dark:text-sand-300 hover:border-primary-400 transition-colors text-sm font-bold">−</button>
            <span className="text-sm font-medium flex items-center gap-1 text-sand-600 dark:text-sand-300">
              <Users className="w-3.5 h-3.5" /> {travelers}
            </span>
            <button onClick={() => onChangeTravelers(travelers + 1)} className="w-7 h-7 rounded-lg border border-sand-200 dark:border-dark-600 flex items-center justify-center text-sand-600 dark:text-sand-300 hover:border-primary-400 transition-colors text-sm font-bold">+</button>
          </div>
          <span className="font-bold text-accent-500">{(tour.price * travelers).toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-sand-600 dark:text-sand-300 mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={['input-field', error ? 'border-red-400 focus:ring-red-400' : ''].join(' ')}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function StepBadge({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={[
        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
        active ? 'bg-primary-500 text-white' : done ? 'bg-green-500 text-white' : 'bg-sand-200 dark:bg-dark-700 text-sand-400 dark:text-sand-500',
      ].join(' ')}>
        {done ? <Check className="w-3.5 h-3.5" /> : num}
      </div>
      <span className={['text-sm font-medium hidden sm:block', active ? 'text-ink dark:text-sand-50' : 'text-sand-400 dark:text-sand-500'].join(' ')}>
        {label}
      </span>
    </div>
  )
}
