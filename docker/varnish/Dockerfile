# Varnish image
FROM varnish:7.5.0-alpine

USER root

RUN apk update && apk --no-cache add gettext

COPY --chown=varnish ./default.vcl.template /etc/varnish/default.vcl.template
COPY --chown=varnish ./default.vcl.template /etc/varnish/default.vcl

USER varnish

COPY --link --chmod=755 ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
