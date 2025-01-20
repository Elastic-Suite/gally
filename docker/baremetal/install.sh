#!/bin/bash

## Add apt sources
curl -sSLo /usr/share/keyrings/deb.sury.org-php.gpg https://packages.sury.org/php/apt.gpg
sh -c 'echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list'
install -d /usr/share/postgresql-common/pgdg
curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
apt-get update

## Webserver
apt-get install -y openssl nginx varnish
mkdir -p /etc/nginx/template/ /etc/varnish/template/
cp nginx-site.conf /etc/nginx/template/default.template
cp default.vcl /etc/varnish/template/default.vcl.template
mkdir -p /etc/nginx/certs/live/${SERVER_NAME}
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/nginx/certs/live/${SERVER_NAME}/privkey.pem \
	-out /etc/nginx/certs/live/${SERVER_NAME}/fullchain.pem \
	-subj "/CN=${SERVER_NAME:-localhost}"
envsubst < /etc/nginx/template/default.template '\$SERVER_NAME \$API_ROUTE_PREFIX \$PWA_UPSTREAM' > /etc/nginx/sites-enabled/default
envsubst < /etc/varnish/template/default.vcl.template '\$SERVER_NAME \$API_ROUTE_PREFIX \$PWA_UPSTREAM' > /etc/varnish/default.vcl

## Php
apt-get install -y php8.3 \
  php8.3-apcu php8.3-dom php8.3-curl php8.3-intl php8.3-mbstring php8.3-opcache php8.3-pgsql php8.3-redis php8.3-zip \
  php8.3-fpm \
  composer
mkdir /run/php
chown www-data:www-data /run/php
cp app.ini /etc/php/8.3/mods-available/
ln -s /etc/php/8.3/mods-available/app.ini /etc/php/8.3/fpm/conf.d/app.ini
ln -s /etc/php/8.3/mods-available/app.ini /etc/php/8.3/cli/conf.d/app.ini

## Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 16
npm install -g yarn
cd /var/gally/front
yarn install --frozen-lockfile --network-timeout 120000
yarn cache clean
yarn build
cd /var/install
cp gally-next.service /etc/systemd/system/gally-next.service
useradd node

# Databases
apt-get install -y redis postgresql-16 postgresql-client

# Start services
systemctl enable postgresql redis-server gally-next php8.3-fpm varnish nginx
systemctl start postgresql redis-server gally-next php8.3-fpm varnish nginx
systemctl list-units --type service -q postgresql.service redis-server.service gally-next.service php8.3-fpm.service varnish.service nginx.service

set +H
sudo -upostgres psql -c 'CREATE ROLE "api-platform" WITH SUPERUSER LOGIN;'
sudo -upostgres psql -c "ALTER USER \"api-platform\" WITH password '!ChangeMe!';"
sudo -upostgres psql -c 'CREATE DATABASE api;'

# Install Gally
cp .env /var/gally/api/.env
cd /var/gally/api
composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress
composer dump-autoload --classmap-authoritative --no-dev
composer dump-env prod
composer run-script --no-dev post-install-cmd
chown www-data:www-data -R var public
sudo -uwww-data bin/console lexik:jwt:generate-keypair --skip-if-exists
sudo -uwww-data bin/console doctrine:migrations:migrate --no-interaction --all-or-nothing
sudo -uwww-data bin/console gally:vector-search:upload-model
sudo -uwww-data bin/console hautelook:fixture:load
sudo -uwww-data bin/console doctrine:fixture:load --append
