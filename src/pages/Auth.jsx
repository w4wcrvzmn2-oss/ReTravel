import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Plane } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

export default function Auth() {
  const [tab, setTab] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { user, login, register } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Вход — ReTravel'
    if (user) navigate('/cabinet')
  }, [user])

  const set = (key, val) => {
    setError('')
    setForm((f) => ({ ...f, [key]: val }))
  }

  const validate = () => {
    if (!form.email.includes('@')) return 'Введите корректный email'
    if (form.password.length < 6) return 'Пароль должен быть не менее 6 символов'
    if (tab === 'register' && form.name.trim().length < 2) return 'Введите имя'
    return null
  }

  const submit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return setError(err)

    setLoading(true)
    // тут должен быть запрос к API, но пока эмулируем задержку
    setTimeout(() => {
      if (tab === 'login') {
        login({ name: form.email.split('@')[0], email: form.email })
      } else {
        register({ name: form.name, email: form.email })
      }
      setLoading(false)
      navigate('/cabinet')
    }, 800)
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4">
      <div className="w-full max-w-md">
        {/* лого */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Plane className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {tab === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {tab === 'login'
              ? 'Войдите чтобы управлять бронированиями'
              : 'Зарегистрируйтесь — это бесплатно'}
          </p>
        </div>

        <div className="card p-8">
          {/* табы */}
          <div className="flex bg-gray-100 dark:bg-dark-700 rounded-xl p-1 mb-6">
            {[
              { id: 'login', label: 'Войти' },
              { id: 'register', label: 'Регистрация' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError('') }}
                className={[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                  tab === t.id
                    ? 'bg-white dark:bg-dark-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* имя — только при регистрации */}
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="input-field pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="input-field pl-10"
                  required
                  autoFocus={tab === 'login'}
                />
              </div>
            </div>

            {/* пароль */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Минимум 6 символов"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ошибка */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* кнопка */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : tab === 'login' ? (
                'Войти'
              ) : (
                'Создать аккаунт'
              )}
            </button>
          </form>

          {/* разделитель */}
          {tab === 'login' && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Нет аккаунта?{' '}
              <button
                onClick={() => setTab('register')}
                className="text-primary-500 hover:underline font-medium"
              >
                Зарегистрируйтесь
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Нажимая «Войти», вы соглашаетесь с{' '}
          <Link to="/terms" className="text-primary-400 hover:underline">
            условиями использования
          </Link>
        </p>
      </div>
    </div>
  )
}
