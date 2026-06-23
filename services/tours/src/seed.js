// node services/tours/src/seed.js
// Заполняем БД данными из статических JS-файлов фронтенда
require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const destinations = [
  { id: 'dubai', name: 'Дубай', country: 'ОАЭ', flag: '🇦🇪', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', min_price: 68000, tags: ['Пляж', 'Шоппинг', 'Роскошь'], description: 'Город будущего с небоскрёбами и золотыми пляжами', popular: true },
  { id: 'turkey', name: 'Турция', country: 'Турция', flag: '🇹🇷', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', min_price: 38000, tags: ['Пляж', 'История', 'Всё включено'], description: 'Популярнейшее направление с отличным соотношением цены и качества', popular: true },
  { id: 'egypt', name: 'Египет', country: 'Египет', flag: '🇪🇬', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80', min_price: 42000, tags: ['Пляж', 'Пирамиды', 'Дайвинг'], description: 'Древняя история и коралловые рифы Красного моря', popular: true },
  { id: 'thailand', name: 'Таиланд', country: 'Таиланд', flag: '🇹🇭', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80', min_price: 55000, tags: ['Пляж', 'Экзотика', 'Храмы'], description: 'Страна улыбок с белыми пляжами и вкуснейшей едой', popular: true },
  { id: 'greece', name: 'Греция', country: 'Греция', flag: '🇬🇷', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', min_price: 62000, tags: ['Острова', 'История', 'Пляж'], description: 'Белые домики Санторини и лазурные воды Эгейского моря', popular: true },
  { id: 'maldives', name: 'Мальдивы', country: 'Мальдивы', flag: '🇲🇻', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80', min_price: 145000, tags: ['Роскошь', 'Пляж', 'Медовый месяц'], description: 'Рай на земле — бирюзовые лагуны и бунгало над водой', popular: false },
  { id: 'bali', name: 'Бали', country: 'Индонезия', flag: '🇮🇩', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', min_price: 71000, tags: ['Экзотика', 'Серфинг', 'Духовность'], description: 'Остров богов с рисовыми террасами и живописными закатами', popular: true },
  { id: 'spain', name: 'Испания', country: 'Испания', flag: '🇪🇸', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', min_price: 74000, tags: ['Культура', 'Пляж', 'Архитектура'], description: 'Барселона, Мадрид, Ибица — Испания для любого вкуса', popular: true },
  { id: 'italy', name: 'Италия', country: 'Италия', flag: '🇮🇹', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', min_price: 85000, tags: ['Культура', 'Кухня', 'История'], description: 'Рим, Венеция, Флоренция — вечная красота Апеннин', popular: false },
  { id: 'france', name: 'Франция', country: 'Франция', flag: '🇫🇷', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80', min_price: 92000, tags: ['Культура', 'Романтика', 'Кухня'], description: 'Париж — город любви, моды и изысканной гастрономии', popular: false },
  { id: 'mexico', name: 'Мексика', country: 'Мексика', flag: '🇲🇽', image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80', min_price: 115000, tags: ['Пляж', 'Руины майя', 'Всё включено'], description: 'Канкун — белоснежные пляжи Карибского моря', popular: false },
  { id: 'malta', name: 'Мальта', country: 'Мальта', flag: '🇲🇹', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&q=80', min_price: 68000, tags: ['История', 'Острова', 'Дайвинг'], description: 'Средиземноморский остров с рыцарскими крепостями и хрустальным морем', popular: false },
]

const tours = [
  { title: 'Дубай: город золота', destination_id: 'dubai', country: 'ОАЭ', city: 'Дубай', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80','https://images.unsplash.com/photo-1582672752759-5d89f96cdb73?w=1200&q=80','https://images.unsplash.com/photo-1604941051939-9b86b04afc89?w=1200&q=80'], price: 89500, original_price: 112000, duration: '7 дней / 6 ночей', nights: 6, rating: 4.8, reviews_count: 234, category: 'beach', tags: ['Всё включено','5★','Пляж'], is_hot: true, is_new: false, hotel: 'Atlantis The Palm', hotel_stars: 5, meal_type: 'All Inclusive', departure_cities: ['Москва','Санкт-Петербург'], date_from: '2026-07-10', date_to: '2026-09-30', description: 'Погрузитесь в роскошь Дубая — города, где традиции встречаются с будущим. Шесть ночей в легендарном Atlantis The Palm с питанием всё включено, золотые пляжи Персидского залива и шоппинг в Dubai Mall.', includes: ['Авиаперелёт из Москвы/Санкт-Петербурга','Трансфер аэропорт — отель — аэропорт','Проживание в Atlantis The Palm 5★','Питание All Inclusive','Медицинская страховка'], excludes: ['Виза (оформляется онлайн, бесплатно для граждан РФ)','Экскурсии','Личные расходы'], highlights: ['Atlantis — отель-легенда на Palm Jumeirah','Аквапарк Aquaventure включён в стоимость','Пляж с белым песком длиной 1,4 км','Панорамный вид на Дубай с 63-го этажа'] },
  { title: 'Турция: Анталья всё включено', destination_id: 'turkey', country: 'Турция', city: 'Анталья', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80','https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1200&q=80'], price: 45200, original_price: 58000, duration: '10 дней / 9 ночей', nights: 9, rating: 4.9, reviews_count: 512, category: 'beach', tags: ['Всё включено','5★','Горящий'], is_hot: true, is_new: false, hotel: 'Rixos Premium Belek', hotel_stars: 5, meal_type: 'All Inclusive', departure_cities: ['Москва','Казань','Екатеринбург'], date_from: '2026-06-25', date_to: '2026-09-15', description: 'Отличный отдых в легендарном Rixos Premium Belek — одном из лучших отелей Турции. Беспрерывный сервис, собственный пляж, 8 ресторанов.', includes: ['Авиаперелёт','Трансфер','Проживание Rixos Premium Belek 5★','All Inclusive','Страховка'], excludes: ['Визовые сборы','Алкоголь премиум-класса'], highlights: ['Первая линия, собственный пляж','8 ресторанов и 12 баров','Аквапарк и спа-комплекс','Детский клуб'] },
  { title: 'Египет: Хургада — пляж и кораллы', destination_id: 'egypt', country: 'Египет', city: 'Хургада', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80'], price: 42800, original_price: null, duration: '8 дней / 7 ночей', nights: 7, rating: 4.6, reviews_count: 178, category: 'beach', tags: ['Пляж','Дайвинг','4★'], is_hot: false, is_new: false, hotel: 'Steigenberger Aqua Magic', hotel_stars: 4, meal_type: 'All Inclusive', departure_cities: ['Москва','Санкт-Петербург'], date_from: '2026-07-01', date_to: '2026-10-31', description: 'Хургада — жемчужина Красного моря. Лучшие кораллы, тёплое море +27°C круглый год, отличные отели по доступным ценам.', includes: ['Авиаперелёт чартером','Трансфер','Проживание 4★','All Inclusive','Страховка'], excludes: ['Экскурсии','Личные расходы'], highlights: ['Коралловые рифы у берега','Дайвинг-центр','Тёплое море круглый год'] },
  { title: 'Таиланд: Пхукет — остров мечты', destination_id: 'thailand', country: 'Таиланд', city: 'Пхукет', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80'], price: 72000, original_price: 89000, duration: '11 дней / 10 ночей', nights: 10, rating: 4.7, reviews_count: 301, category: 'beach', tags: ['Пляж','Экзотика','5★'], is_hot: false, is_new: true, hotel: 'Anantara Mai Khao Phuket Villas', hotel_stars: 5, meal_type: 'Завтрак', departure_cities: ['Москва'], date_from: '2026-07-15', date_to: '2026-10-15', description: 'Пхукет — самый известный остров Таиланда. Потрясающие закаты, экзотическая кухня и непрекращающиеся развлечения.', includes: ['Авиаперелёт','Трансфер','Проживание 5★','Завтраки','Страховка'], excludes: ['Виза','Ужины','Экскурсии'], highlights: ['Белые пляжи Патонг и Карон','Пхи-Пхи на яхте','Ночные рынки','Тайский массаж'] },
  { title: 'Греция: острова Эгейского моря', destination_id: 'greece', country: 'Греция', city: 'Санторини', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80'], price: 96000, original_price: 118000, duration: '9 дней / 8 ночей', nights: 8, rating: 4.9, reviews_count: 423, category: 'romantic', tags: ['Острова','Романтика','5★'], is_hot: false, is_new: false, hotel: 'Canaves Oia Epitome', hotel_stars: 5, meal_type: 'Завтрак', departure_cities: ['Москва','Санкт-Петербург'], date_from: '2026-06-20', date_to: '2026-09-20', description: 'Санторини — икона греческих островов. Белые домики, синие купола, бесконечные закаты над кальдерой.', includes: ['Авиаперелёт','Трансфер','Проживание 5★','Завтраки'], excludes: ['Виза Шенген','Ужины'], highlights: ['Деревня Ои — лучший закат в мире','Вулкан и горячие источники','Вина Санторини'] },
  { title: 'Мальдивы: бунгало над водой', destination_id: 'maldives', country: 'Мальдивы', city: 'Атолл Ари', image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80'], price: 185000, original_price: 220000, duration: '8 дней / 7 ночей', nights: 7, rating: 4.9, reviews_count: 89, category: 'luxury', tags: ['Роскошь','Пляж','Медовый месяц'], is_hot: false, is_new: false, hotel: 'Conrad Maldives Rangali Island', hotel_stars: 5, meal_type: 'Полупансион', departure_cities: ['Москва'], date_from: '2026-07-01', date_to: '2026-12-31', description: 'Абсолютный рай — ваше личное бунгало прямо над бирюзовым океаном.', includes: ['Авиаперелёт бизнес-класс','Трансфер гидропланом','Проживание бунгало над водой','Полупансион'], excludes: ['Дайвинг','Алкоголь'], highlights: ['Бунгало над водой со стеклянным полом','Подводный ресторан','Риф у берега'] },
  { title: 'Бали: остров богов', destination_id: 'bali', country: 'Индонезия', city: 'Убуд', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80'], price: 82000, original_price: null, duration: '11 дней / 10 ночей', nights: 10, rating: 4.8, reviews_count: 214, category: 'adventure', tags: ['Экзотика','Серфинг','Йога'], is_hot: false, is_new: true, hotel: 'Four Seasons Resort Bali at Ubud', hotel_stars: 5, meal_type: 'Завтрак', departure_cities: ['Москва'], date_from: '2026-06-01', date_to: '2026-11-30', description: 'Бали — магия природы, духовности и культуры. Рисовые террасы Убуда, серфинг на Куте, храмы.', includes: ['Авиаперелёт','Трансфер','Проживание виллы','Завтраки'], excludes: ['Виза','Ужины'], highlights: ['Рисовые террасы Тегаллаланг','Храм Танах-Лот','Серфинг на Куте'] },
  { title: 'Испания: Барселона и Коста-Брава', destination_id: 'spain', country: 'Испания', city: 'Барселона', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80'], price: 88000, original_price: 105000, duration: '9 дней / 8 ночей', nights: 8, rating: 4.7, reviews_count: 367, category: 'city', tags: ['Культура','Пляж','Архитектура'], is_hot: false, is_new: false, hotel: 'Hotel Arts Barcelona', hotel_stars: 5, meal_type: 'Завтрак', departure_cities: ['Москва','Санкт-Петербург'], date_from: '2026-06-15', date_to: '2026-09-30', description: 'Барселона — город Гауди, флоренции, тапас и фламенко. Плюс три дня на Costa Brava.', includes: ['Авиаперелёт','Трансфер','Проживание 5★','Завтраки'], excludes: ['Виза Шенген','Ужины','Экскурсии'], highlights: ['Саграда Фамилия','Лас-Рамблас','Пляжи Коста-Бравы'] },
]

async function seed() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // destinations
    for (const d of destinations) {
      await client.query(
        `INSERT INTO destinations (id, name, country, flag, image, min_price, tags, description, popular)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [d.id, d.name, d.country, d.flag, d.image, d.min_price, d.tags, d.description, d.popular]
      )
    }
    console.log(`✓ ${destinations.length} направлений`)

    // tours
    let inserted = 0
    for (const t of tours) {
      await client.query(
        `INSERT INTO tours (title, destination_id, country, city, image, gallery, price, original_price,
          duration, nights, rating, reviews_count, category, tags, is_hot, is_new, hotel, hotel_stars,
          meal_type, departure_cities, date_from, date_to, description, includes, excludes, highlights)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
         ON CONFLICT DO NOTHING`,
        [
          t.title, t.destination_id, t.country, t.city, t.image, t.gallery,
          t.price, t.original_price, t.duration, t.nights, t.rating, t.reviews_count,
          t.category, t.tags, t.is_hot, t.is_new, t.hotel, t.hotel_stars,
          t.meal_type, t.departure_cities, t.date_from, t.date_to,
          t.description, t.includes, t.excludes, t.highlights,
        ]
      )
      inserted++
    }
    console.log(`✓ ${inserted} туров`)

    await client.query('COMMIT')
    console.log('Seed completed!')
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('Seed error:', e)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
