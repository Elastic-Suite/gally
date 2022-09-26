# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=16

# "common" stage
FROM node:${NODE_VERSION}-alpine AS api_platform_pwa_common

EXPOSE 3000
EXPOSE 3001

WORKDIR /usr/src/front

ENV NEXT_TELEMETRY_DISABLED 1

# prevent the reinstallation of node modules at every changes in the source code
RUN mkdir ./example-app ./pwa ./shared
COPY package.json yarn.lock ./
COPY example-app/package.json ./example-app
COPY pwa/package.json ./pwa
COPY shared/package.json ./shared

RUN yarn install

COPY . ./

VOLUME /usr/src/front/node_modules
VOLUME /usr/src/front/shared/node_modules
VOLUME /usr/src/front/pwa/node_modules
VOLUME /usr/src/front/example-app/node_modules



FROM api_platform_pwa_common AS api_platform_shared_build

RUN set -eux; \
	yarn build:shared;



FROM api_platform_pwa_common AS api_platform_pwa_dev

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

CMD ["yarn", "dev"]



FROM api_platform_pwa_common AS api_platform_example_dev

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

CMD ["yarn", "start:example"]



# "build" stage
# depends on the "common" stage above
FROM api_platform_pwa_common AS api_platform_pwa_int

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT

RUN set -eux; \
	yarn build; \
	yarn build-storybook; \
	mv pwa/storybook-static pwa/public/; \
	yarn build:example; \
	mv example-app/build pwa/public/example

CMD ["yarn", "start"]



# "build" stage
# depends on the "common" stage above
FROM api_platform_pwa_common AS api_platform_pwa_prod

COPY --from=api_platform_shared_build /usr/src/front/shared/dist /usr/src/front/shared/dist

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT

RUN set -eux; \
	yarn build

CMD ["yarn", "start"]
