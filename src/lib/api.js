// тут живёт весь HTTP-слой — один файл, ни один компонент не знает про fetch напрямую

const BASE = import.meta.env.VITE_API_URL || '/api'

let accessToken = null

function setToken(token) {
  accessToken = token
}

function getToken() {
  return accessToken
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  // токен протух — пробуем обновить
  if (res.status === 401 && accessToken) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      headers.Authorization = `Bearer ${accessToken}`
      const retry = await fetch(`${BASE}${path}`, { ...options, headers })
      if (!retry.ok) throw await retry.json()
      return retry.json()
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Ошибка сервера' }))
    throw err
  }

  return res.json()
}

async function tryRefresh() {
  const refresh = localStorage.getItem('rt_refresh')
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) {
      localStorage.removeItem('rt_refresh')
      return false
    }
    const data = await res.json()
    accessToken = data.access
    localStorage.setItem('rt_refresh', data.refresh)
    return true
  } catch {
    return false
  }
}

// ─── AUTH ────────────────────────────────────────────────────
export const auth = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () => {
    const refresh = localStorage.getItem('rt_refresh')
    localStorage.removeItem('rt_refresh')
    accessToken = null
    return request('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh }) })
  },

  me: () => request('/auth/me'),

  updateProfile: (data) =>
    request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  refresh: tryRefresh,
  setToken,
  getToken,
}

// ─── TOURS ───────────────────────────────────────────────────
export const tours = {
  list: (params = {}) => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)))
    return request(`/tours/?${q}`)
  },
  get: (id) => request(`/tours/${id}`),
}

// ─── DESTINATIONS ─────────────────────────────────────────────
export const destinations = {
  list: () => request('/destinations/'),
  get: (id) => request(`/destinations/${id}`),
}

// ─── FLIGHTS ─────────────────────────────────────────────────
export const flights = {
  search: (params = {}) => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)))
    return request(`/flights/?${q}`)
  },
  meta: () => request('/flights/meta/cities'),
}

// ─── HOTELS ──────────────────────────────────────────────────
export const hotels = {
  list: (params = {}) => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)))
    return request(`/hotels/?${q}`)
  },
  get: (id) => request(`/hotels/${id}`),
}

// ─── ORDERS ──────────────────────────────────────────────────
export const orders = {
  list: () => request('/orders/'),
  create: (payload) => request('/orders/', { method: 'POST', body: JSON.stringify(payload) }),
  get: (id) => request(`/orders/${id}`),
}

// ─── FAVORITES ───────────────────────────────────────────────
export const favorites = {
  list: () => request('/favorites/'),
  toggle: (tourId) => request(`/favorites/${tourId}`, { method: 'POST' }),
}

// ─── REVIEWS ─────────────────────────────────────────────────
export const reviews = {
  list: (tourId) => request(`/reviews/tour/${tourId}`),
  add: (tourId, rating, text) =>
    request(`/reviews/tour/${tourId}`, { method: 'POST', body: JSON.stringify({ rating, text }) }),
  helpful: (reviewId) => request(`/reviews/${reviewId}/helpful`, { method: 'POST' }),
}

// ─── PRICE ALERTS ─────────────────────────────────────────────
export const alerts = {
  subscribe: (email, tour_id) =>
    request('/notifications/alerts', { method: 'POST', body: JSON.stringify({ email, tour_id }) }),
}

// ─── ADMIN ────────────────────────────────────────────────────
export const admin = {
  users: () => request('/auth/admin/users'),
  setRole: (userId, role) =>
    request(`/auth/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
}
