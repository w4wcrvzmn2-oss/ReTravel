require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const { Pool } = require('pg')

const app = express()
const PORT = process.env.PORT || 3006
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

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

// GET /tour/:tourId  — все отзывы по туру
app.get('/tour/:tourId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.author, r.initials, r.rating, r.text, r.helpful, r.created_at,
              u.name AS user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.tour_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.tourId]
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// POST /tour/:tourId  — оставить отзыв (нужна авторизация)
app.post(
  '/tour/:tourId',
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Рейтинг от 1 до 5'),
  body('text').trim().isLength({ min: 10, max: 2000 }).withMessage('Текст 10–2000 символов'),
  async (req, res) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) return res.status(422).json({ errors: errs.array() })

    const { rating, text } = req.body
    const tourId = req.params.tourId

    try {
      const user = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.sub])
      if (!user.rows.length) return res.status(404).json({ error: 'Пользователь не найден' })

      const name = user.rows[0].name
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

      const { rows } = await pool.query(
        `INSERT INTO reviews (tour_id, user_id, author, initials, rating, text)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (tour_id, user_id) DO UPDATE
           SET rating = EXCLUDED.rating, text = EXCLUDED.text
         RETURNING *`,
        [tourId, req.user.sub, name, initials, rating, text]
      )

      // пересчитываем средний рейтинг тура
      await pool.query(`
        UPDATE tours SET
          rating = (SELECT AVG(rating) FROM reviews WHERE tour_id = $1),
          reviews_count = (SELECT COUNT(*) FROM reviews WHERE tour_id = $1)
        WHERE id = $1
      `, [tourId])

      res.status(201).json(rows[0])
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Ошибка сервера' })
    }
  }
)

// POST /:reviewId/helpful  — +1 к "полезно"
app.post('/:reviewId/helpful', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE reviews SET helpful = helpful + 1 WHERE id = $1 RETURNING helpful',
      [req.params.reviewId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Отзыв не найден' })
    res.json({ helpful: rows[0].helpful })
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

pool.connect()
  .then(() => app.listen(PORT, () => console.log(`Reviews service on :${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1) })
