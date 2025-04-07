FROM debian:12

ARG SERVER_NAME
ENV SERVER_NAME $SERVER_NAME
ARG OPENSEARCH_INITIAL_ADMIN_PASSWORD
ENV OPENSEARCH_INITIAL_ADMIN_PASSWORD $OPENSEARCH_INITIAL_ADMIN_PASSWORD

# Prerequisites
RUN apt-get update ; \
    apt-get install -y curl gettext gnupg lsb-release openssl sudo supervisor
RUN curl -sSLo /usr/share/keyrings/deb.sury.org-php.gpg https://packages.sury.org/php/apt.gpg; \
    echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ bookworm main" > /etc/apt/sources.list.d/php.list
RUN install -d /usr/share/postgresql-common/pgdg; \
    curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc; \
    echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-keyring; \
    echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" | tee /etc/apt/sources.list.d/opensearch-2.x.list
RUN apt-get update

# Databases
RUN apt-get install -y redis postgresql-16 libssl3 opensearch=2.16.0 postgresql-client
RUN /usr/share/opensearch/bin/opensearch-plugin install -b analysis-icu analysis-phonetic ingest-attachment
COPY redis.conf /etc/redis/redis.conf
USER postgres
RUN PGDATA="/var/lib/postgresql/data/"; \
	echo "Init PostgreSQL..."; \
	/usr/lib/postgresql/16/bin/initdb -D "$PGDATA"; \
	/usr/lib/postgresql/16/bin/pg_ctl -D "$PGDATA" -o "-c listen_addresses=''" -w start; \
	psql --username=postgres -c "CREATE ROLE \"api-platform\" WITH SUPERUSER LOGIN;"; \
	psql --username=postgres -c "ALTER USER \"api-platform\" WITH password '!ChangeMe!';"; \
	psql --username=postgres -c "CREATE DATABASE api;"; \
	/usr/lib/postgresql/16/bin/pg_ctl -D "$PGDATA" -m fast -w stop; \
    touch /var/log/postgresql/postgresql.log
COPY --chown=postgres:postgres postgresql.conf /var/lib/postgresql/data/postgresql.conf
USER opensearch
COPY opensearch.yml /etc/opensearch/opensearch.yml
USER root
RUN set -xe; \
	bash /usr/share/opensearch/plugins/opensearch-security/tools/install_demo_configuration.sh -y -i -s

# Webserver
RUN apt-get install -y nginx varnish
RUN mkdir -p /etc/nginx/template/ /etc/varnish/template/ /etc/nginx/certs/live/${SERVER_NAME} /var/log/php-fpm/
COPY nginx.conf /etc/nginx/template/default.template
COPY varnish.vcl /etc/varnish/template/default.vcl.template
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/nginx/certs/live/${SERVER_NAME}/privkey.pem \
	-out /etc/nginx/certs/live/${SERVER_NAME}/fullchain.pem \
	-subj "/CN=${SERVER_NAME:-localhost}"
RUN envsubst < /etc/nginx/template/default.template '\$SERVER_NAME' > /etc/nginx/sites-enabled/default
RUN envsubst < /etc/varnish/template/default.vcl.template '\$SERVER_NAME' > /etc/varnish/default.vcl

# Api
RUN apt-get install -y php8.3 \
  php8.3-apcu php8.3-dom php8.3-curl php8.3-intl php8.3-mbstring php8.3-opcache php8.3-pgsql php8.3-redis php8.3-zip \
  php8.3-fpm
COPY php.ini /etc/php/8.3/fpm/conf.d/app.ini
COPY php.ini /etc/php/8.3/cli/conf.d/app.ini
RUN sed -i 's/^;clear_env = no/clear_env = no/' /etc/php/8.3/fpm/pool.d/www.conf
RUN sed -i 's/^user = www-data/user = root/' /etc/php/8.3/fpm/pool.d/www.conf
RUN sed -i 's/^group = www-data/group = root/' /etc/php/8.3/fpm/pool.d/www.conf
RUN mkdir -p /run/php

# Pwa
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash; \
    export NVM_DIR="$HOME/.nvm"; \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; \
    nvm install 16; \
    npm install -g yarn; \
    ln -s "$(which node)" /usr/bin/node; \
    ln -s "$(which npm)" /usr/bin/npm; \
    ln -s "$(which yarn)" /usr/bin/yarn; \
    mkdir -p /var/log/yarn

COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR /var/gally
CMD ["/docker-entrypoint.sh"]
