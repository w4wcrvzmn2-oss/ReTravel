require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 3005
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

// ─── middleware: проверяем JWT ────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Требуется авторизация' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Недействительный токен' })
  }
}

// ─── ORDERS ──────────────────────────────────────────────────
app.get('/orders', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.sub]
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.post('/orders', auth, async (req, res) => {
  const { items, contact, total, promo_code, discount_percent } = req.body
  if (!items?.length || !contact || !total) {
    return res.status(400).json({ error: 'Неполные данные заказа' })
  }

  try {
    const id = `RT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const { rows } = await pool.query(
      `INSERT INTO orders (id, user_id, items, contact, total, promo_code, discount_percent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, req.user.sub, JSON.stringify(items), JSON.stringify(contact), total, promo_code || null, discount_percent || 0]
    )
    res.status(201).json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/orders/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.sub]
    )
    if (!rows.length) return res.status(404).json({ error: 'Заказ не найден' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// ─── FAVORITES ───────────────────────────────────────────────
app.get('/favorites', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.* FROM favorites f
       JOIN tours t ON t.id = f.tour_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.sub]
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// POST /favorites  →  тогглим
app.post('/favorites/:tourId', auth, async (req, res) => {
  const { tourId } = req.params
  try {
    const exists = await pool.query(
      'SELECT 1 FROM favorites WHERE user_id = $1 AND tour_id = $2',
      [req.user.sub, tourId]
    )
    if (exists.rows.length) {
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND tour_id = $2', [req.user.sub, tourId])
      return res.json({ added: false })
    }
    await pool.query('INSERT INTO favorites (user_id, tour_id) VALUES ($1, $2)', [req.user.sub, tourId])
    res.json({ added: true })
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

pool.connect()
  .then(() => app.listen(PORT, () => console.log(`Orders service on :${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1) })
