require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

const app = express()
const PORT = process.env.PORT || 3001

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*', credentials: true }))
app.use(express.json())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Слишком много попыток, попробуйте через 15 минут' },
})

// ─── helpers ────────────────────────────────────────────────
function signTokens(user) {
  const payload = { sub: user.id, email: user.email, role: user.role }
  const access = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
  return { access, refresh }
}

function validate(req, res) {
  const errs = validationResult(req)
  if (!errs.isEmpty()) {
    res.status(422).json({ errors: errs.array() })
    return false
  }
  return true
}

// ─── REGISTER ───────────────────────────────────────────────
app.post(
  '/register',
  authLimiter,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Имя 2–100 символов'),
  body('email').isEmail().normalizeEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 8 }).withMessage('Пароль минимум 8 символов'),
  async (req, res) => {
    if (!validate(req, res)) return

    const { name, email, password } = req.body
    try {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
      if (exists.rows.length) return res.status(409).json({ error: 'Email уже зарегистрирован' })

      const hash = await bcrypt.hash(password, 12)
      const { rows } = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role, member_since',
        [name, email, hash]
      )
      const user = rows[0]
      const { access, refresh } = signTokens(user)

      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
        [user.id, refresh]
      )

      res.status(201).json({ user, access, refresh })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Ошибка сервера' })
    }
  }
)

// ─── LOGIN ───────────────────────────────────────────────────
app.post(
  '/login',
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    if (!validate(req, res)) return

    const { email, password } = req.body
    try {
      const { rows } = await pool.query(
        'SELECT id, name, email, password_hash, role, member_since FROM users WHERE email = $1',
        [email]
      )
      const user = rows[0]
      if (!user) return res.status(401).json({ error: 'Неверный email или пароль' })

      const ok = await bcrypt.compare(password, user.password_hash)
      if (!ok) return res.status(401).json({ error: 'Неверный email или пароль' })

      const { access, refresh } = signTokens(user)
      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
        [user.id, refresh]
      )

      const { password_hash, ...safe } = user
      res.json({ user: safe, access, refresh })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Ошибка сервера' })
    }
  }
)

// ─── REFRESH ─────────────────────────────────────────────────
app.post('/refresh', async (req, res) => {
  const { refresh } = req.body
  if (!refresh) return res.status(400).json({ error: 'Нет токена' })

  try {
    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET)
    const { rows } = await pool.query(
      'SELECT id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refresh]
    )
    if (!rows.length) return res.status(401).json({ error: 'Токен истёк' })

    const user = await pool.query(
      'SELECT id, name, email, role, member_since FROM users WHERE id = $1',
      [payload.sub]
    )
    if (!user.rows.length) return res.status(401).json({ error: 'Пользователь не найден' })

    const tokens = signTokens(user.rows[0])
    await pool.query('UPDATE refresh_tokens SET token = $1, expires_at = NOW() + INTERVAL \'30 days\' WHERE token = $2', [tokens.refresh, refresh])

    res.json(tokens)
  } catch {
    res.status(401).json({ error: 'Недействительный токен' })
  }
})

// ─── LOGOUT ──────────────────────────────────────────────────
app.post('/logout', async (req, res) => {
  const { refresh } = req.body
  if (refresh) await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refresh])
  res.json({ ok: true })
})

// ─── GET ME ───────────────────────────────────────────────────
app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Нет токена' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await pool.query(
      'SELECT id, name, email, role, member_since FROM users WHERE id = $1',
      [payload.sub]
    )
    if (!rows.length) return res.status(404).json({ error: 'Пользователь не найден' })
    res.json(rows[0])
  } catch {
    res.status(401).json({ error: 'Недействительный токен' })
  }
})

// ─── UPDATE PROFILE ───────────────────────────────────────────
app.put(
  '/me',
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Нет токена' })

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      const { name, email } = req.body

      const { rows } = await pool.query(
        'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), updated_at = NOW() WHERE id = $3 RETURNING id, name, email, role, member_since',
        [name, email, payload.sub]
      )
      res.json(rows[0])
    } catch {
      res.status(401).json({ error: 'Недействительный токен' })
    }
  }
)

// ─── HEALTH ──────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ ok: true }))

pool.connect()
  .then(() => {
    console.log('Auth service: DB connected')
    app.listen(PORT, () => console.log(`Auth service on :${PORT}`))
  })
  .catch((e) => { console.error('DB connection failed', e); process.exit(1) })
