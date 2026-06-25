import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Plane } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'login')
  const [showPass, setShowPass] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const { user, login, register, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const redirectTo = searchParams.get('from') || '/cabinet'

  useEffect(() => {
    document.title = 'Вход — ReTravel'
  }, [])

  // если уже залогинен — сразу редирект
  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true })
  }, [user])

  const setField = (key, val) => {
    setLocalError('')
    clearError()
    setForm((f) => ({ ...f, [key]: val }))
  }

  const validate = () => {
    if (!form.email.includes('@')) return 'Введите корректный email'
    if (form.password.length < 6) return 'Пароль минимум 6 символов'
    if (tab === 'register' && form.name.trim().length < 2) return 'Введите имя (минимум 2 символа)'
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return setLocalError(err)

    setLocalLoading(true)
    setLocalError('')

    try {
      let result
      if (tab === 'login') {
        result = await login(form.email, form.password)
      } else {
        result = await register(form.name, form.email, form.password)
      }

      if (!result.ok) {
        setLocalError(result.error || 'Что-то пошло не так')
      }
      // при успехе — useEffect выше поймает user и сделает navigate
    } catch {
      setLocalError('Сервер недоступен, попробуйте позже')
    } finally {
      setLocalLoading(false)
    }
  }

  const loading = localLoading || isLoading
  const displayError = localError || error

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand-50 dark:bg-dark-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-1">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold text-primary-500">ReTravel</span>
          </Link>
          <h1 className="text-2xl font-black text-ink dark:text-sand-50 mt-3">
            {tab === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
          </h1>
          <p className="text-sand-500 dark:text-sand-400 mt-1 text-sm">
            {tab === 'login'
              ? 'Войдите, чтобы управлять бронированиями'
              : 'Регистрация бесплатна'}
          </p>
        </div>

        <div className="card p-8">
          <div className="flex bg-sand-100 dark:bg-dark-700 rounded-xl p-1 mb-6">
            {[
              { id: 'login', label: 'Войти' },
              { id: 'register', label: 'Регистрация' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setLocalError(''); clearError() }}
                className={[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                  tab === t.id
                    ? 'bg-white dark:bg-dark-800 text-ink dark:text-sand-50 shadow-sm'
                    : 'text-sand-500 dark:text-sand-400',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-ink dark:text-sand-200 mb-1.5">Имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    className="input-field pl-10"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className="input-field pl-10"
                  autoFocus={tab === 'login'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Минимум 6 символов"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600 dark:hover:text-sand-200"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {displayError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : tab === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          {tab === 'login' && (
            <p className="text-center text-sm text-sand-500 dark:text-sand-400 mt-4">
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

        <p className="text-center text-xs text-sand-400 dark:text-sand-500 mt-4">
          Нажимая «Войти», вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  )
}
