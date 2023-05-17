# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=16
ARG public_url

# "common" stage
FROM node:${NODE_VERSION}-alpine AS gally_pwa_common

EXPOSE 3000
EXPOSE 3001

WORKDIR /usr/src/front

ENV NEXT_TELEMETRY_DISABLED 1

COPY . ./

RUN set -xe; \
	yarn install --frozen-lockfile; \
    yarn cache clean;



FROM gally_pwa_common AS gally_pwa_ci

RUN mkdir -p ./example-app/coverage ./pwa/coverage
RUN set -xe; \
	apk add --no-cache curl; \
    rm -rf pwa/node_modules/@elastic-suite/gally-admin-* example-app/node_modules/@elastic-suite/gally-admin-*; \
    mkdir -p pwa/node_modules/@elastic-suite example-app/node_modules/@elastic-suite; \
    ln -Ts ../../../gally-admin/packages/components pwa/node_modules/@elastic-suite/gally-admin-components; \
    ln -Ts ../../../gally-admin/packages/shared pwa/node_modules/@elastic-suite/gally-admin-shared; \
    ln -Ts ../../../gally-admin/packages/components example-app/node_modules/@elastic-suite/gally-admin-components ; \
    ln -Ts ../../../gally-admin/packages/shared example-app/node_modules/@elastic-suite/gally-admin-shared; \
    yarn build:gally-admin;

CMD ["yarn", "dev"]



FROM gally_pwa_common AS gally_example_ci

CMD ["yarn", "start:example"]



FROM gally_pwa_ci AS gally_pwa_dev

# env variable needed for chokidar-cli
ENV SHELL /bin/sh

RUN USER=node && \
	GROUP=node && \
	curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.5.1/fixuid-0.5.1-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
	chown root:root /usr/local/bin/fixuid && \
	chmod 4755 /usr/local/bin/fixuid && \
	mkdir -p /etc/fixuid && \
	printf "user: $USER\ngroup: $GROUP\npaths:\n  - /usr/src/front\n  - /home/node" > /etc/fixuid/config.yml

RUN set -xe; \
  apk add --no-cache git;

COPY ./docker-entrypoint-pwa.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

USER node
ENV HOME=/home/node
CMD ["yarn", "dev"]



FROM gally_example_ci AS gally_example_dev

ENV WDS_SOCKET_PORT 443

RUN USER=node && \
	GROUP=node && \
	apk add --no-cache curl && \
	curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.5.1/fixuid-0.5.1-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
	chown root:root /usr/local/bin/fixuid && \
	chmod 4755 /usr/local/bin/fixuid && \
	mkdir -p /etc/fixuid && \
	printf "user: $USER\ngroup: $GROUP\npaths:\n  - /usr/src/front\n  - /home/node" > /etc/fixuid/config.yml

RUN set -xe; \
  apk add --no-cache curl

COPY ./docker-entrypoint-example.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

USER node
ENV HOME=/home/node
CMD ["yarn", "start:example"]



# "build" stage
# depends on the "common" stage above
FROM gally_pwa_ci AS gally_pwa_int

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT
ARG public_url
ENV PUBLIC_URL $public_url

RUN set -eux; \
	yarn build; \
	yarn build:example; \
	mv example-app/build pwa/public/example

CMD ["yarn", "start"]



# "build" stage
# depends on the "common" stage above
FROM gally_pwa_common AS gally_pwa_prod

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT

RUN set -eux; \
	yarn build

CMD ["yarn", "start"]
