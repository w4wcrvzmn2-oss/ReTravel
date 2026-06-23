# ReTravel — Агрегатор туров и авиабилетов

Полноценный travel-агрегатор с микросервисным бэкендом, SPA-фронтендом и готовностью к продакшену.

---

## Видео-обзор

Полный обзор проекта: [isk/export-1782228958812.mp4](isk/export-1782228958812.mp4)

---

## Стек

| Слой | Технологии |
|------|-----------|
| Фронтенд | React 18, Vite 5, Tailwind CSS 3, Zustand, React Router v6 |
| Бэкенд | Node.js 20, Express 4, PostgreSQL 16, Redis 7 |
| Инфраструктура | Docker, docker-compose, nginx (API gateway + SPA) |
| Безопасность | JWT (access 15m + refresh 30d), bcrypt, helmet, rate-limit |

---

## Архитектура

```
                    ┌─────────────────────┐
     Клиент ──────▶ │   nginx :80 / :443  │  (API gateway + Static SPA)
                    └──────────┬──────────┘
                               │ /api/*
       ┌───────────┬───────────┼──────────────┬────────────────┐
       ▼           ▼           ▼              ▼                ▼
  auth:3001   tours:3002  flights:3003   hotels:3004    orders:3005
                                         reviews:3006  notif:3007
       │           │
       └───────────┴──────────────────────────────────────────┐
                                                              ▼
                                                    PostgreSQL + Redis
```

---

## Функциональность

| Модуль | Возможности |
|--------|-------------|
| **Туры** | Поиск, фильтры (направление, категория, звёзды, питание, цена), сортировка, пагинация |
| **Авиабилеты** | Поиск рейсов, фильтр по направлению, сортировка по цене/пересадкам |
| **Отели** | Каталог с фильтром по звёздам и рейтингу |
| **Сравнение** | До 3 туров в панели сравнения |
| **Избранное** | Локальное + синхронизация с бэкендом при авторизации |
| **Корзина** | Промокоды (RETRAVEL5, WELCOME10, HOT20), оформление заказа |
| **Кабинет** | История заказов, избранное, профиль |
| **Отзывы** | Чтение и написание отзывов (требует авторизации) |
| **Алерты цены** | Подписка на снижение цены, email-уведомление (крон ночью) |
| **Тема** | Светлая / тёмная |

---

## Быстрый старт (локально)

```bash
# 1. Клонировать
git clone https://github.com/w4wcrvzmn2-oss/ReTravel.git
cd ReTravel

# 2. Создать .env из шаблона
cp .env.example .env
# Отредактировать .env — прописать пароли

# 3. Поднять бэкенд
docker compose up -d

# 4. Засеять базу данных
docker compose exec tours node src/seed.js

# 5. Запустить фронтенд
npm install
npm run dev
```

Фронтенд: http://localhost:5173  
API: http://localhost/api

---

## Деплой на VPS

### Требования к серверу
- Ubuntu 22.04+
- 2 vCPU, 2 GB RAM, 20 GB SSD
- Открытые порты: 22, 80, 443

### Автодеплой одной командой

```bash
# Залить скрипт на сервер и запустить
scp deploy.sh root@YOUR_SERVER_IP:/root/
ssh root@YOUR_SERVER_IP "bash /root/deploy.sh retravel.ru"
```

Скрипт сам установит Docker, склонирует репо, соберёт фронтенд, получит SSL и поднимет все контейнеры.

### Ручной деплой

```bash
git clone https://github.com/w4wcrvzmn2-oss/ReTravel.git /opt/retravel
cd /opt/retravel

cp .env.example .env
nano .env   # заполнить все переменные

# Сборка фронтенда
VITE_API_URL=https://retravel.ru/api npm run build
cp -r dist/* gateway/html/

# Запуск всех сервисов
docker compose up -d --build

# Заполнить базу данными
docker compose exec tours node src/seed.js

# SSL (после настройки DNS A-записи)
certbot --nginx -d retravel.ru -d www.retravel.ru
```

### Автопродление SSL

```bash
# Добавить в crontab -e
0 0 1 * * certbot renew --quiet && docker compose restart nginx
```

---

## API Reference

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/refresh` | Обновление токена |
| GET  | `/api/auth/me` | Профиль (🔒 auth) |
| PUT  | `/api/auth/me` | Обновить профиль (🔒 auth) |
| GET  | `/api/tours/` | Список туров + фильтры |
| GET  | `/api/tours/:id` | Детали тура |
| GET  | `/api/destinations/` | Список направлений |
| GET  | `/api/destinations/:id` | Направление + его туры |
| GET  | `/api/flights/` | Поиск рейсов |
| GET  | `/api/hotels/` | Список отелей |
| GET  | `/api/orders/` | Мои заказы (🔒 auth) |
| POST | `/api/orders/` | Создать заказ (🔒 auth) |
| GET  | `/api/favorites/` | Избранное (🔒 auth) |
| POST | `/api/favorites/:tourId` | Тоггл избранного (🔒 auth) |
| GET  | `/api/reviews/tour/:id` | Отзывы по туру |
| POST | `/api/reviews/tour/:id` | Оставить отзыв (🔒 auth) |
| POST | `/api/notifications/alerts` | Подписаться на снижение цены |

**Авторизация:** `Authorization: Bearer <access_token>`

---

## Переменные окружения

```env
POSTGRES_USER=retravel
POSTGRES_PASSWORD=...         # сгенерировать сложный пароль
POSTGRES_DB=retravel
REDIS_PASSWORD=...
JWT_SECRET=...                # openssl rand -hex 64
JWT_REFRESH_SECRET=...        # openssl rand -hex 64
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=...                 # Google App Password
FROM_EMAIL=noreply@retravel.ru
DOMAIN=retravel.ru
VITE_API_URL=https://retravel.ru/api
```

---

## Полезные команды

```bash
# Логи всех сервисов
docker compose logs -f

# Логи одного сервиса
docker compose logs -f tours

# Перезапустить сервис
docker compose restart auth

# Открыть psql
docker compose exec postgres psql -U retravel retravel

# Пересобрать после изменений в коде
docker compose up -d --build tours
```

---

## Сроки выхода в продакшн

| День | Задача |
|------|--------|
| **1** | Аренда VPS, настройка DNS, запуск `deploy.sh`, проверка SSL |
| **2** | Наполнение базы реальными данными через `seed.js` |
| **3** | Настройка SMTP, тест уведомлений о ценах, бэкап БД в cron |
| **4** | Финальное тестирование (регистрация → поиск → корзина → заказ) |
| **5** | Продакшн-релиз 🚀 |

**Итого: 5 рабочих дней до запуска.** Дольше всего займёт наполнение контентом — реальные туры, цены, фотографии.

---

## Команды разработки

```bash
npm run dev      # Vite dev-сервер с HMR
npm run build    # Production сборка
npm run preview  # Превью production-сборки
```

---

## Лицензия

MIT
