#syntax=docker/dockerfile:1.4

# Adapted from https://github.com/dunglas/symfony-docker

# Versions
FROM php:8.3-fpm AS gally_php_upstream

# The different stages of this Dockerfile are meant to be built into separate images
# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# Base php image
FROM gally_php_upstream AS gally_php_base

WORKDIR /app

# persistent / runtime deps
# hadolint ignore=DL3008
RUN apt-get update && apt-get install --no-install-recommends -y \
	acl \
    libfcgi-bin \
	file \
	gettext \
	git \
	patch \
	rsync \
	&& rm -rf /var/lib/apt/lists/*

ARG COMPOSER_AUTH
ENV COMPOSER_AUTH=${COMPOSER_AUTH}
# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN set -eux; \
	install-php-extensions \
		@composer \
		apcu \
		intl \
		opcache \
    	redis \
		zip \
	;

###> recipes ###
###> doctrine/doctrine-bundle ###
RUN set -eux; \
	install-php-extensions pdo_pgsql
###< doctrine/doctrine-bundle ###
###< recipes ###

# copy dev packages directory if exist
# (for docker-compose version, we need a least on file to exist, so we add the composer.json to prevent failure if packages is missing)
COPY --from=api_src composer.json package* packages/

COPY --link conf.d/app.ini $PHP_INI_DIR/conf.d/
COPY --link --chmod=755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint
COPY --link php-fpm.d/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

ENTRYPOINT ["docker-entrypoint"]

HEALTHCHECK --start-period=90s --interval=20s --timeout=3s --retries=10 \
 	CMD env -i REQUEST_METHOD=GET SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping cgi-fcgi -bind -connect 127.0.0.1:9000 || exit 1
CMD ["php-fpm"]

# Dev php image
FROM gally_php_base AS gally_php_dev

ENV APP_ENV=dev XDEBUG_MODE=off
VOLUME /app/var/

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN set -eux; \
	install-php-extensions \
    xdebug \
	;

COPY --link conf.d/app.dev.ini $PHP_INI_DIR/conf.d/

CMD ["php-fpm"]

# Prod php image
FROM gally_php_base AS gally_php_prod

ENV APP_ENV=prod

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --link conf.d/app.prod.ini $PHP_INI_DIR/conf.d/


# prevent the reinstallation of vendors at every changes in the source code
COPY --from=api_src --link composer.* symfony.* patches ./
COPY --from=api_src --link patches ./patches

RUN set -eux; \
	composer install --no-cache --prefer-dist --no-dev --no-autoloader --no-scripts --no-progress

# copy sources
COPY --from=api_src --link . ./
RUN rm -Rf docker/php/

RUN set -eux; \
	mkdir -p var/cache var/log; \
	composer dump-autoload --classmap-authoritative --no-dev; \
	composer dump-env prod; \
	composer run-script --no-dev post-install-cmd; \
	chmod +x bin/console; \
	rm -rf var/cache/*; \
	sync;

# copy public files in php_static_files to save them, because they can be overwritten when a volume is mounted between php and router containers
RUN cp -r public php_static_files
