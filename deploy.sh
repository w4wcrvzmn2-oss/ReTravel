#!/bin/bash
# Скрипт деплоя ReTravel на VPS
# Использование: bash deploy.sh your-domain.ru

set -e

DOMAIN=${1:-retravel.ru}
REPO=https://github.com/w4wcrvzmn2-oss/ReTravel.git
APP_DIR=/opt/retravel

echo "=== ReTravel deploy to $DOMAIN ==="

# 1. Зависимости
apt-get update -q
apt-get install -y -q docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git curl

# 2. Клонируем / обновляем
if [ -d "$APP_DIR" ]; then
  cd $APP_DIR && git pull
else
  git clone $REPO $APP_DIR
  cd $APP_DIR
fi

# 3. .env — если ещё нет, спрашиваем пользователя
if [ ! -f .env ]; then
  echo "ВАЖНО: создайте .env из .env.example и запустите деплой снова"
  cp .env.example .env
  echo "Отредактируйте $APP_DIR/.env и запустите скрипт ещё раз"
  exit 1
fi

# 4. Подставляем домен в .env
sed -i "s/^DOMAIN=.*/DOMAIN=$DOMAIN/" .env

# 5. Собираем фронтенд
echo "=== Building frontend ==="
cd $APP_DIR
source .env
VITE_API_URL="https://$DOMAIN/api" npm ci
VITE_API_URL="https://$DOMAIN/api" npm run build

# 6. Копируем dist в образ nginx
cp -r dist/* gateway/html/ 2>/dev/null || mkdir -p gateway/html && cp -r dist/* gateway/html/

# 7. Обновляем nginx конфиг с реальным доменом
sed "s/\${DOMAIN}/$DOMAIN/g" gateway/nginx.prod.conf > gateway/nginx.conf.tmp

# 8. Запускаем без nginx для получения сертификата
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d postgres redis auth tours flights hotels orders reviews notifications

# 9. Waiting for DB
echo "Waiting for database..."
sleep 10

# 10. Сидируем БД (только первый запуск)
docker compose exec tours node src/seed.js 2>/dev/null || echo "Seed skipped (already seeded)"

# 11. Получаем SSL сертификат
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN \
  --non-interactive --agree-tos --email admin@$DOMAIN \
  --pre-hook "docker compose stop nginx 2>/dev/null || true" \
  --post-hook "docker compose start nginx 2>/dev/null || true"

# 12. Запускаем с nginx + SSL
cp gateway/nginx.conf.tmp gateway/nginx.conf
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nginx

echo ""
echo "=== Deploy complete! ==="
echo "Site: https://$DOMAIN"
echo ""
echo "Полезные команды:"
echo "  docker compose logs -f          # логи всех сервисов"
echo "  docker compose logs -f tours    # логи одного сервиса"
echo "  docker compose restart tours    # перезапуск сервиса"
echo "  docker compose exec postgres psql -U retravel retravel  # psql консоль"
