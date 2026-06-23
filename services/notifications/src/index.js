require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const { Pool } = require('pg')
const nodemailer = require('nodemailer')
const cron = require('node-cron')

const app = express()
const PORT = process.env.PORT || 3007
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

async function sendPriceAlert(to, tourTitle, oldPrice, newPrice, tourId) {
  await mailer.sendMail({
    from: `"ReTravel" <${process.env.FROM_EMAIL}>`,
    to,
    subject: `Снижение цены на тур «${tourTitle}»`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Цена снизилась! 🎉</h2>
        <p>Тур <strong>${tourTitle}</strong> подешевел:</p>
        <p style="font-size: 1.2em;">
          <s style="color: #999;">${oldPrice.toLocaleString('ru')} ₽</s>
          →
          <strong style="color: #22c55e;">${newPrice.toLocaleString('ru')} ₽</strong>
        </p>
        <a href="https://${process.env.DOMAIN}/tour/${tourId}"
           style="display:inline-block;background:#f97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">
          Посмотреть тур
        </a>
        <p style="color: #666; font-size: 0.85em; margin-top: 24px;">
          Вы получили это письмо, потому что подписались на снижение цены на ReTravel.
        </p>
      </div>
    `,
  })
}

// POST /alerts  — подписаться на снижение цены
app.post('/alerts', async (req, res) => {
  const { email, tour_id } = req.body
  if (!email || !tour_id) return res.status(400).json({ error: 'email и tour_id обязательны' })

  try {
    const tour = await pool.query('SELECT price FROM tours WHERE id = $1', [tour_id])
    if (!tour.rows.length) return res.status(404).json({ error: 'Тур не найден' })

    await pool.query(
      `INSERT INTO price_alerts (email, tour_id, price_at_subscribe)
       VALUES ($1, $2, $3)
       ON CONFLICT (email, tour_id) DO NOTHING`,
      [email, tour_id, tour.rows[0].price]
    )
    res.json({ ok: true, message: 'Подписка оформлена' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Cron: каждую ночь в 3:00 проверяем снижение цен
cron.schedule('0 3 * * *', async () => {
  console.log('Price alert cron started')
  try {
    const { rows: alerts } = await pool.query(`
      SELECT pa.id, pa.email, pa.tour_id, pa.price_at_subscribe,
             t.price AS current_price, t.title
      FROM price_alerts pa
      JOIN tours t ON t.id = pa.tour_id
      WHERE pa.notified = false
        AND t.price < pa.price_at_subscribe
    `)

    for (const alert of alerts) {
      try {
        await sendPriceAlert(alert.email, alert.title, alert.price_at_subscribe, alert.current_price, alert.tour_id)
        await pool.query('UPDATE price_alerts SET notified = true WHERE id = $1', [alert.id])
        console.log(`Alert sent to ${alert.email} for tour ${alert.tour_id}`)
      } catch (mailErr) {
        console.error(`Failed to send to ${alert.email}:`, mailErr.message)
      }
    }
  } catch (e) {
    console.error('Price alert cron error:', e)
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

pool.connect()
  .then(() => app.listen(PORT, () => console.log(`Notifications service on :${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1) })
