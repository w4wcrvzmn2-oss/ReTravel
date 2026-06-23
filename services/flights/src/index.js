require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = process.env.PORT || 3003
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

// GET /  — поиск рейсов
app.get('/', async (req, res) => {
  try {
    const { to, date, passengers = 1, flight_class = 'economy', sort = 'price' } = req.query

    const conditions = ['active = true']
    const params = []
    let i = 1

    if (to) { conditions.push(`to_destination = $${i++}`); params.push(to) }

    const where = `WHERE ${conditions.join(' AND ')}`

    const sortMap = {
      price:    `price ASC`,
      stops:    `stops ASC`,
      duration: `departure_time ASC`,
    }
    const orderBy = sortMap[sort] || 'price ASC'

    const { rows } = await pool.query(
      `SELECT f.*, d.name AS to_city_label, d.flag AS to_flag
       FROM flights f
       LEFT JOIN destinations d ON d.id = f.to_destination
       ${where}
       ORDER BY ${orderBy}`,
      params
    )

    // считаем итоговую цену по числу пассажиров и классу
    const result = rows.map(f => ({
      ...f,
      total_price: flight_class === 'business' && f.business_price
        ? f.business_price * Number(passengers)
        : f.price * Number(passengers),
    }))

    res.json(result)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// GET /:id
app.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM flights WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Рейс не найден' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Список городов вылета
app.get('/meta/cities', async (req, res) => {
  try {
    const from = await pool.query('SELECT DISTINCT from_city, from_code FROM flights ORDER BY from_city')
    const to = await pool.query(`
      SELECT DISTINCT f.to_destination AS value, d.name AS label
      FROM flights f LEFT JOIN destinations d ON d.id = f.to_destination
      ORDER BY label
    `)
    res.json({ fromCities: from.rows.map(r => r.from_city), toCities: to.rows })
  } catch (e) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

pool.connect()
  .then(() => app.listen(PORT, () => console.log(`Flights service on :${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1) })
