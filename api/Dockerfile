# the different stages of this Dockerfile are meant to be built into separate images
# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG PHP_VERSION=8.1
ARG CADDY_VERSION=2.6.4
ARG OPENSEARCH2_VERSION=2.11.0
ARG ELASTIC7_VERSION=7.16.3
ARG ELASTIC8_VERSION=8.10.4
# ARG XDEBUG_VERSION=3.1.2

# "php" stage
FROM php:${PHP_VERSION}-fpm-alpine AS gally_php

# persistent / runtime deps
RUN apk add --no-cache \
		acl \
		fcgi \
		file \
		gettext \
		git \
		gnu-libiconv \
    	patch \
	;

# install gnu-libiconv and set LD_PRELOAD env to make iconv work fully on Alpine image.
# see https://github.com/docker-library/php/issues/240#issuecomment-763112749
ENV LD_PRELOAD /usr/lib/preloadable_libiconv.so

ARG APCU_VERSION=5.1.21
RUN set -eux; \
	apk add --no-cache --virtual .build-deps \
		$PHPIZE_DEPS \
		icu-dev \
		libzip-dev \
		zlib-dev \
	; \
	\
	docker-php-ext-configure zip; \
	docker-php-ext-install -j$(nproc) \
		intl \
		zip \
	; \
	pecl install \
		apcu-${APCU_VERSION} \
	; \
	pecl clear-cache; \
	docker-php-ext-enable \
		apcu \
		opcache \
	; \
	\
	runDeps="$( \
		scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
			| tr ',' '\n' \
			| sort -u \
			| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-cache --virtual .api-phpexts-rundeps $runDeps; \
	\
	apk del .build-deps

# PHP Redis install
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
	&& pecl install redis \
    && docker-php-ext-enable redis.so

###> recipes ###
###> doctrine/doctrine-bundle ###
RUN apk add --no-cache --virtual .pgsql-deps postgresql-dev; \
	docker-php-ext-install -j$(nproc) pdo_pgsql; \
	apk add --no-cache --virtual .pgsql-rundeps so:libpq.so.5; \
	apk del .pgsql-deps
###< doctrine/doctrine-bundle ###
###< recipes ###

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN ln -s $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini
COPY docker/php/conf.d/api-platform.prod.ini $PHP_INI_DIR/conf.d/api-platform.ini

COPY docker/php/php-fpm.d/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

VOLUME /var/run/php

# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="${PATH}:/root/.composer/vendor/bin"

WORKDIR /srv/api

# build for production
ARG APP_ENV=prod

# copy potential patches to apply before running the composer install
COPY patches patches/

# prevent the reinstallation of vendors at every changes in the source code
COPY composer.json composer.lock symfony.lock ./

# copy dev packages directory if exist
# (for docker-compose version, we need a least on file to exist, so we add the composer.json to prevent failure if packages is missing)
COPY composer.json package* packages/

ARG COMPOSER_AUTH
ENV COMPOSER_AUTH=${COMPOSER_AUTH}

RUN set -eux; \
	composer install --prefer-dist --no-dev --no-scripts --no-progress; \
	composer clear-cache

# copy only specifically what we need
COPY .env ./
COPY bin bin/
COPY config config/
COPY migrations migrations/
COPY public public/
COPY src src/
COPY templates templates/

RUN set -eux; \
	mkdir -p var/cache var/log; \
	composer dump-autoload --classmap-authoritative --no-dev; \
	composer dump-env prod; \
	composer run-script --no-dev post-install-cmd; \
	chmod +x bin/console; sync
VOLUME /srv/api/var

COPY docker/php/docker-healthcheck.sh /usr/local/bin/docker-healthcheck
RUN chmod +x /usr/local/bin/docker-healthcheck

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["docker-healthcheck"]

COPY docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENV SYMFONY_PHPUNIT_VERSION=9

ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]

# "php+xdebug" stage
# ENV XDEBUG_VERSION=${XDEBUG_VERSION}
FROM gally_php as gally_php_dev

ARG XDEBUG_VERSION=3.1.2
RUN set -eux; \
	apk add --no-cache --virtual .build-deps $PHPIZE_DEPS; \
	pecl install xdebug-${XDEBUG_VERSION}; \
	docker-php-ext-enable xdebug; \
	apk del .build-deps

# "caddy" stage
# depends on the "php" stage above
FROM caddy:${CADDY_VERSION}-builder-alpine AS gally_caddy_builder

# install Mercure and Vulcain modules
RUN xcaddy build \
    --with github.com/dunglas/mercure@v0.14.6  \
    --with github.com/dunglas/mercure/caddy@v0.14.6  \
    --with github.com/dunglas/vulcain@v0.4.3 \
    --with github.com/dunglas/vulcain/caddy@v0.4.3

FROM caddy:${CADDY_VERSION} AS gally_caddy

WORKDIR /srv/api

COPY --from=gally_caddy_builder /usr/bin/caddy /usr/bin/caddy
COPY --from=gally_php /srv/api/public public/
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile

FROM opensearchproject/opensearch:${OPENSEARCH2_VERSION} AS gally_opensearch2

WORKDIR /usr/share/opensearch

RUN bin/opensearch-plugin install analysis-phonetic
RUN bin/opensearch-plugin install analysis-icu

FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC7_VERSION} AS gally_elasticsearch7

WORKDIR /usr/share/elasticsearch

RUN bin/elasticsearch-plugin install analysis-phonetic
RUN bin/elasticsearch-plugin install analysis-icu

FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC8_VERSION} AS gally_elasticsearch8

WORKDIR /usr/share/elasticsearch

RUN bin/elasticsearch-plugin install analysis-phonetic
RUN bin/elasticsearch-plugin install analysis-icu

FROM amazonlinux:2 AS gally_opensearch2_gpu_builder

ARG OPENSEARCH2_VERSION
ARG UID=1000
ARG GID=1000
ARG TEMP_DIR=/tmp/opensearch
ARG OPENSEARCH_HOME=/usr/share/opensearch
ARG OPENSEARCH_PATH_CONF=$OPENSEARCH_HOME/config
ARG SECURITY_PLUGIN_DIR=$OPENSEARCH_HOME/plugins/opensearch-security
ARG PERFORMANCE_ANALYZER_PLUGIN_CONFIG_DIR=$OPENSEARCH_PATH_CONF/opensearch-performance-analyzer
ARG OS_VERSION=${OPENSEARCH2_VERSION}
# Update packages
# Install the tools we need: tar and gzip to unpack the OpenSearch tarball, and shadow-utils to give us `groupadd` and `useradd`.
# Install which to allow running of securityadmin.sh
RUN yum update -y && yum install -y tar gzip shadow-utils which && yum clean all

# Create an opensearch user, group, and directory
RUN groupadd -g $GID opensearch && \
    adduser -u $UID -g $GID -d $OPENSEARCH_HOME opensearch && \
    mkdir $TEMP_DIR

RUN mkdir /usr/share/elasticsearch
WORKDIR /usr/share/elasticsearch

RUN set -eux ; \
    cur_arch="" ; \
    case "$(arch)" in \
        aarch64) cur_arch='arm64' ;; \
        x86_64)  cur_arch='x64' ;; \
        *) echo >&2 ; echo >&2 "Unsupported architecture $(arch)" ; echo >&2 ; exit 1 ;; \
    esac ; \
    curl --retry 10 -S -L --output $TEMP_DIR/opensearch.tar.gz https://artifacts.opensearch.org/releases/bundle/opensearch/$OS_VERSION/opensearch-$OS_VERSION-linux-$cur_arch.tar.gz; \
    curl --output $TEMP_DIR/opensearch.pgp https://artifacts.opensearch.org/publickeys/opensearch.pgp; \
    gpg --import $TEMP_DIR/opensearch.pgp; \
    curl --output $TEMP_DIR/opensearch.tar.gz.sig https://artifacts.opensearch.org/releases/bundle/opensearch/$OS_VERSION/opensearch-$OS_VERSION-linux-$cur_arch.tar.gz.sig; \
    gpg --verify $TEMP_DIR/opensearch.tar.gz.sig $TEMP_DIR/opensearch.tar.gz;

RUN tar --warning=no-timestamp -zxf $TEMP_DIR/opensearch.tar.gz -C $OPENSEARCH_HOME --strip-components=1 && \
    mkdir -p $OPENSEARCH_HOME/data && chown -Rv $UID:$GID $OPENSEARCH_HOME/data && \
    if [[ -d $SECURITY_PLUGIN_DIR ]] ; then chmod -v 750 $SECURITY_PLUGIN_DIR/tools/* ; fi && \
    rm -rf $TEMP_DIR

COPY docker/opensearch/config/* $OPENSEARCH_PATH_CONF/
COPY docker/opensearch/bin/* $OPENSEARCH_HOME/
RUN if [[ -d $PERFORMANCE_ANALYZER_PLUGIN_CONFIG_DIR ]] ; then mv $OPENSEARCH_PATH_CONF/performance-analyzer.properties $PERFORMANCE_ANALYZER_PLUGIN_CONFIG_DIR/ ; fi

FROM nvidia/cuda:12.0.0-base-centos7 AS gally_opensearch2_gpu

ARG UID=1000
ARG GID=1000
ARG OPENSEARCH_HOME=/usr/share/opensearch
ARG OS_VERSION=2.5.0

RUN yum update -y && yum install -y tar gzip shadow-utils which && yum clean all

# Create an opensearch user, group
RUN groupadd -g $GID opensearch && \
    adduser -u $UID -g $GID -d $OPENSEARCH_HOME opensearch

# Copy from Stage0
COPY --from=gally_opensearch2_gpu_builder --chown=$UID:$GID $OPENSEARCH_HOME $OPENSEARCH_HOME
WORKDIR $OPENSEARCH_HOME

# Set $JAVA_HOME
RUN echo "export JAVA_HOME=$OPENSEARCH_HOME/jdk" >> /etc/profile.d/java_home.sh && \
    echo "export PATH=\$PATH:\$JAVA_HOME/bin" >> /etc/profile.d/java_home.sh
ENV JAVA_HOME=$OPENSEARCH_HOME/jdk
ENV PATH=$PATH:$JAVA_HOME/bin:$OPENSEARCH_HOME/bin

# Add k-NN lib directory to library loading path variable
ENV LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$OPENSEARCH_HOME/plugins/opensearch-knn/lib"

# Change user
USER $UID

# Setup OpenSearch
# Disable security demo installation during image build, and allow user to disable during startup of the container
# Enable security plugin during image build, and allow user to disable during startup of the container
ARG DISABLE_INSTALL_DEMO_CONFIG=true
ARG DISABLE_SECURITY_PLUGIN=false
RUN ./opensearch-onetime-setup.sh

RUN bin/opensearch-plugin install analysis-phonetic
RUN bin/opensearch-plugin install analysis-icu

EXPOSE 9200 9300 9600 9650

# Label
LABEL org.label-schema.schema-version="1.0" \
  org.label-schema.name="opensearch" \
  org.label-schema.version="$OS_VERSION" \
  org.label-schema.url="https://opensearch.org" \
  org.label-schema.vcs-url="https://github.com/OpenSearch" \
  org.label-schema.license="Apache-2.0" \
  org.label-schema.vendor="OpenSearch"

# CMD to run
ENTRYPOINT ["./opensearch-docker-entrypoint.sh"]
CMD ["opensearch"]
