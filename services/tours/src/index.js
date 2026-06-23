require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = process.env.PORT || 3002
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

// ─── TOURS LIST ──────────────────────────────────────────────
app.get('/', async (req, res) => {
  try {
    const {
      destination, category, meal_type, stars, price_max,
      is_hot, sort = 'rating', page = 1, limit = 6, search,
    } = req.query

    const conditions = ['t.active = true']
    const params = []
    let i = 1

    if (destination)      { conditions.push(`t.destination_id = $${i++}`); params.push(destination) }
    if (category)         { conditions.push(`t.category = ANY($${i++}::text[])`); params.push(category.split(',')) }
    if (meal_type)        { conditions.push(`t.meal_type = ANY($${i++}::text[])`); params.push(meal_type.split(',')) }
    if (stars)            { conditions.push(`t.hotel_stars = ANY($${i++}::int[])`); params.push(stars.split(',').map(Number)) }
    if (price_max)        { conditions.push(`t.price <= $${i++}`); params.push(Number(price_max)) }
    if (is_hot === 'true'){ conditions.push(`t.is_hot = true`) }
    if (search)           { conditions.push(`t.title ILIKE $${i++}`); params.push(`%${search}%`) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const sortMap = {
      price_asc:  't.price ASC',
      price_desc: 't.price DESC',
      rating:     't.rating DESC',
      duration:   't.nights DESC',
    }
    const orderBy = sortMap[sort] || 't.rating DESC'

    const offset = (Number(page) - 1) * Number(limit)

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tours t ${where}`,
      params
    )
    const total = parseInt(countResult.rows[0].count, 10)

    params.push(Number(limit), offset)
    const { rows } = await pool.query(
      `SELECT t.*, d.name AS destination_name, d.flag AS destination_flag
       FROM tours t
       LEFT JOIN destinations d ON d.id = t.destination_id
       ${where}
       ORDER BY ${orderBy}
       LIMIT $${i++} OFFSET $${i++}`,
      params
    )

    res.json({ tours: rows, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// ─── TOUR BY ID ───────────────────────────────────────────────
app.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, d.name AS destination_name, d.flag AS destination_flag, d.country AS destination_country
       FROM tours t
       LEFT JOIN destinations d ON d.id = t.destination_id
       WHERE t.id = $1 AND t.active = true`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Тур не найден' })
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// ─── DESTINATIONS LIST ────────────────────────────────────────
app.get('/destinations', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT d.*,
             COUNT(t.id)::int AS tours_count,
             COALESCE(MIN(t.price), d.min_price) AS min_price
      FROM destinations d
      LEFT JOIN tours t ON t.destination_id = d.id AND t.active = true
      GROUP BY d.id
      ORDER BY d.popular DESC, d.name
    `)
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// tут /destinations/:id
app.get('/destinations/:id', async (req, res) => {
  try {
    const dest = await pool.query('SELECT * FROM destinations WHERE id = $1', [req.params.id])
    if (!dest.rows.length) return res.status(404).json({ error: 'Направление не найдено' })

    const tours = await pool.query(
      'SELECT * FROM tours WHERE destination_id = $1 AND active = true ORDER BY rating DESC',
      [req.params.id]
    )
    res.json({ ...dest.rows[0], tours: tours.rows })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

pool.connect()
  .then(() => {
    console.log('Tours service: DB connected')
    app.listen(PORT, () => console.log(`Tours service on :${PORT}`))
  })
  .catch((e) => { console.error('DB connection failed', e); process.exit(1) })
