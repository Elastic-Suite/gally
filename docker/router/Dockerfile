ARG NODE_VERSION=20

# Admin build: the Next.js admin is fully pre-rendered at build time (no SSR, the whole app is client side),
# so its HTML and assets are served by nginx and no node runtime is needed in production.
FROM node:${NODE_VERSION}-alpine AS gally_admin_build

WORKDIR /usr/src/front

ARG NEXT_PUBLIC_ENTRYPOINT
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_ROUTE_PREFIX
ARG DEFAULT_LOCALE=en
ENV NEXT_PUBLIC_ENTRYPOINT=$NEXT_PUBLIC_ENTRYPOINT
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_ROUTE_PREFIX=$NEXT_PUBLIC_API_ROUTE_PREFIX
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=front_src . ./

RUN set -eux; \
	yarn install --frozen-lockfile --network-timeout 120000; \
	yarn cache clean

# `next export` refuses the i18n config, so the pre-rendered pages are taken from `next build` output:
# the default locale is served at the root, the other ones under their prefix (/fr/...).
RUN set -eux; \
	NODE_ENV=production yarn build; \
	pages=pwa/.next/server/pages; \
	mkdir -p /admin/_next; \
	cp -r pwa/.next/static /admin/_next/static; \
	cp -rL pwa/public/. /admin/; \
	for page in "$pages"/*.html; do \
		locale=$(basename "$page" .html); \
		target=/admin; \
		[ "$locale" = "$DEFAULT_LOCALE" ] || target="/admin/$locale"; \
		mkdir -p "$target"; \
		cp -r "$pages/$locale/." "$target/"; \
		cp "$page" "$target/index.html"; \
	done


# Router without the admin, which is then served by a node container (dev, CI, int)
FROM nginx:latest AS gally_router_base

COPY --link ./nginx.conf /etc/nginx/nginx.conf
COPY --link ./templates /etc/nginx/templates

COPY --link docker-entrypoint.d/25-replace-custom-var-env.sh /docker-entrypoint.d/25-replace-custom-var-env.sh
RUN chmod +x /docker-entrypoint.d/25-replace-custom-var-env.sh


# Production router, serving the pre-rendered admin itself
FROM gally_router_base AS gally_router_prod

COPY --link --from=gally_admin_build /admin /app/admin
