# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=16
ARG public_url

# "common" stage
FROM node:${NODE_VERSION}-alpine AS api_platform_pwa_common

EXPOSE 3000
EXPOSE 3001

WORKDIR /usr/src/front

ENV NEXT_TELEMETRY_DISABLED 1

# prevent the reinstallation of node modules at every changes in the source code
RUN mkdir -p ./example-app/coverage ./pwa/coverage ./shared/coverage
COPY package.json yarn.lock ./
COPY example-app/package.json ./example-app
COPY pwa/package.json ./pwa
COPY shared/package.json ./shared

RUN set -xe; \
	yarn install --frozen-lockfile;

COPY . ./



FROM api_platform_pwa_common AS api_platform_shared_build

RUN set -eux; \
	yarn build:shared



FROM api_platform_pwa_common AS api_platform_pwa_ci

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

CMD ["yarn", "dev"]



FROM api_platform_pwa_common AS api_platform_example_ci

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

CMD ["yarn", "start:example"]



FROM api_platform_pwa_ci AS api_platform_pwa_dev

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

# env variable needed for chokidar-cli
ENV SHELL /bin/sh

COPY ./docker-entrypoint-pwa.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

RUN addgroup -g 1042 docker && \
	adduser -u 1042 -G docker -h /home/docker -s /bin/sh -D docker

RUN USER=docker && \
	GROUP=docker && \
	apk add --no-cache curl && \
	curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.5.1/fixuid-0.5.1-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
	chown root:root /usr/local/bin/fixuid && \
	chmod 4755 /usr/local/bin/fixuid && \
	mkdir -p /etc/fixuid && \
	printf "user: $USER\ngroup: $GROUP\npaths:\n  - /usr/src/front" > /etc/fixuid/config.yml

USER 1042
CMD ["yarn", "dev"]



FROM api_platform_example_ci AS api_platform_example_dev

ENV WDS_SOCKET_PORT 443

RUN apk add --no-cache curl
COPY ./docker-entrypoint-example.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["yarn", "start:example"]



# "build" stage
# depends on the "common" stage above
FROM api_platform_pwa_ci AS api_platform_pwa_int

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT
ARG public_url
ENV PUBLIC_URL $public_url

RUN set -eux; \
	yarn build; \
	yarn build-storybook; \
	mv pwa/storybook-static pwa/public/; \
	yarn build:example; \
	mv example-app/build pwa/public/example

CMD ["yarn", "start"]



# "build" stage
# depends on the "common" stage above
FROM api_platform_pwa_ci AS api_platform_pwa_prod

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT

RUN set -eux; \
	yarn build

CMD ["yarn", "start"]
