-- ============================================================
-- ReTravel — master schema
-- Запускается автоматически при первом старте PostgreSQL
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  DEFAULT 'user',
  member_since  TIMESTAMPTZ  DEFAULT NOW(),
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── DESTINATIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS destinations (
  id          VARCHAR(50)  PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  country     VARCHAR(255) NOT NULL,
  flag        VARCHAR(10),
  image       TEXT,
  min_price   INT          DEFAULT 0,
  tags        TEXT[]       DEFAULT '{}',
  description TEXT,
  popular     BOOLEAN      DEFAULT false
);

-- ─── TOURS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tours (
  id               SERIAL       PRIMARY KEY,
  title            VARCHAR(500) NOT NULL,
  destination_id   VARCHAR(50)  REFERENCES destinations(id),
  country          VARCHAR(255),
  city             VARCHAR(255),
  image            TEXT,
  gallery          TEXT[]       DEFAULT '{}',
  price            INT          NOT NULL,
  original_price   INT,
  duration         VARCHAR(100),
  nights           INT,
  rating           NUMERIC(3,1) DEFAULT 0,
  reviews_count    INT          DEFAULT 0,
  category         VARCHAR(50),
  tags             TEXT[]       DEFAULT '{}',
  is_hot           BOOLEAN      DEFAULT false,
  is_new           BOOLEAN      DEFAULT false,
  hotel            VARCHAR(255),
  hotel_stars      INT,
  meal_type        VARCHAR(100),
  departure_cities TEXT[]       DEFAULT '{}',
  date_from        DATE,
  date_to          DATE,
  description      TEXT,
  includes         TEXT[]       DEFAULT '{}',
  excludes         TEXT[]       DEFAULT '{}',
  highlights       TEXT[]       DEFAULT '{}',
  active           BOOLEAN      DEFAULT true,
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── FLIGHTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS flights (
  id               SERIAL       PRIMARY KEY,
  from_city        VARCHAR(255),
  from_code        VARCHAR(10),
  to_city          VARCHAR(255),
  to_code          VARCHAR(10),
  to_destination   VARCHAR(50)  REFERENCES destinations(id),
  airline          VARCHAR(255),
  flight_number    VARCHAR(20),
  departure_time   TIME,
  arrival_time     TIME,
  duration_label   VARCHAR(50),
  stops            INT          DEFAULT 0,
  stop_city        VARCHAR(255),
  price            INT          NOT NULL,
  business_price   INT,
  seats_left       INT          DEFAULT 0,
  baggage          VARCHAR(100),
  active           BOOLEAN      DEFAULT true
);

-- ─── HOTELS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hotels (
  id             SERIAL       PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  destination_id VARCHAR(50)  REFERENCES destinations(id),
  city           VARCHAR(255),
  country        VARCHAR(255),
  image          TEXT,
  stars          INT,
  rating         NUMERIC(3,1),
  reviews_count  INT          DEFAULT 0,
  price_per_night INT         NOT NULL,
  amenities      TEXT[]       DEFAULT '{}',
  description    TEXT,
  popular        BOOLEAN      DEFAULT false
);

-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               VARCHAR(50)  PRIMARY KEY,
  user_id          UUID         NOT NULL REFERENCES users(id),
  items            JSONB        NOT NULL,
  contact          JSONB        NOT NULL,
  total            INT          NOT NULL,
  promo_code       VARCHAR(50),
  discount_percent INT          DEFAULT 0,
  status           VARCHAR(50)  DEFAULT 'confirmed',
  created_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── FAVORITES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  user_id    UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tour_id    INT   NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, tour_id)
);

-- ─── REVIEWS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL       PRIMARY KEY,
  tour_id    INT          NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author     VARCHAR(255),
  initials   VARCHAR(10),
  rating     INT          NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text       TEXT         NOT NULL,
  helpful    INT          DEFAULT 0,
  created_at TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE (tour_id, user_id)
);

-- ─── PRICE ALERTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS price_alerts (
  id                  SERIAL       PRIMARY KEY,
  email               VARCHAR(255) NOT NULL,
  tour_id             INT          NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  price_at_subscribe  INT          NOT NULL,
  notified            BOOLEAN      DEFAULT false,
  created_at          TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE (email, tour_id)
);

-- ─── REFRESH TOKENS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT        NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDICES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tours_destination  ON tours(destination_id);
CREATE INDEX IF NOT EXISTS idx_tours_category     ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_price        ON tours(price);
CREATE INDEX IF NOT EXISTS idx_tours_is_hot       ON tours(is_hot);
CREATE INDEX IF NOT EXISTS idx_flights_dest       ON flights(to_destination);
CREATE INDEX IF NOT EXISTS idx_orders_user        ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tour       ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_tour  ON price_alerts(tour_id);
