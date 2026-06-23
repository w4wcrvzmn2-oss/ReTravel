require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = process.env.PORT || 3004
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const { destination, stars, sort = 'rating' } = req.query

    const conditions = []
    const params = []
    let i = 1

    if (destination) { conditions.push(`h.destination_id = $${i++}`); params.push(destination) }
    if (stars)       { conditions.push(`h.stars = ANY($${i++}::int[])`); params.push(stars.split(',').map(Number)) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const sortMap = {
      rating:     'h.rating DESC',
      price_asc:  'h.price_per_night ASC',
      price_desc: 'h.price_per_night DESC',
    }
    const orderBy = sortMap[sort] || 'h.rating DESC'

    const { rows } = await pool.query(
      `SELECT h.*, d.flag AS destination_flag
       FROM hotels h
       LEFT JOIN destinations d ON d.id = h.destination_id
       ${where}
       ORDER BY ${orderBy}`,
      params
    )
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT h.*, d.name AS destination_name FROM hotels h LEFT JOIN destinations d ON d.id = h.destination_id WHERE h.id = $1',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Отель не найден' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

pool.connect()
  .then(() => app.listen(PORT, () => console.log(`Hotels service on :${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1) })
