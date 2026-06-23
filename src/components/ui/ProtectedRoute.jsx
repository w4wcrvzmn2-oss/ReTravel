import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

// role: 'admin' | 'manager' | 'partner' | null (любой авторизованный)
// Правило: admin может заходить куда угодно
export default function ProtectedRoute({ children, role }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to={`/auth?from=${encodeURIComponent(location.pathname)}`} replace />
  }

  // admin имеет доступ ко всем панелям
  if (role && user.role !== role && user.role !== 'admin') {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="text-center card p-12 max-w-md mx-4">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Доступ запрещён</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            У вашей роли <span className="font-semibold">({user.role})</span> нет доступа к этой странице.
          </p>
          <a href="/" className="btn-primary inline-flex">На главную</a>
        </div>
      </div>
    )
  }

  return children
}
