#!/bin/sh

set -eu

# Defaults, even if these variables are not set in compose.yml files.
API_ROUTE_PREFIX=${API_ROUTE_PREFIX:-api}
HTTPS_PORT=${HTTPS_PORT:-443}
# Set to false when TLS is terminated upstream (Traefik, ingress, load balancer...): the app is then served over plain HTTP on port 80.
HTTPS_ENABLED=${HTTPS_ENABLED:-true}
# Node upstreams for the front apps; when PWA_UPSTREAM is empty, the pre-rendered admin shipped in the image is served.
PWA_UPSTREAM=${PWA_UPSTREAM:-}
EXAMPLE_UPSTREAM=${EXAMPLE_UPSTREAM:-}

CONF_DIR=/etc/nginx/conf.d

if [ "$HTTPS_ENABLED" = "true" ]; then
    PORT_SUFFIX=$([ "$HTTPS_PORT" = "443" ] && echo "" || echo ":$HTTPS_PORT")
    printf 'location / {\n    return 301 https://$host%s$request_uri;\n}\n' "$PORT_SUFFIX" > "$CONF_DIR/snippets/http.conf"
    cp "$CONF_DIR/snippets/https-server.conf" "$CONF_DIR/https.conf"
else
    echo "include $CONF_DIR/snippets/app.conf;" > "$CONF_DIR/snippets/http.conf"
    rm -f "$CONF_DIR/https.conf"
fi

if [ -n "$PWA_UPSTREAM" ]; then
    printf 'location / {\n    proxy_pass http://%s;\n}\n' "$PWA_UPSTREAM" > "$CONF_DIR/snippets/front.conf"
elif [ -d /app/admin ]; then
    cp "$CONF_DIR/snippets/admin-static.conf" "$CONF_DIR/snippets/front.conf"
else
    echo "Neither PWA_UPSTREAM nor a pre-rendered admin (/app/admin) is available, build the gally_router_prod target or set PWA_UPSTREAM." >&2
    exit 1
fi

if [ -n "$EXAMPLE_UPSTREAM" ]; then
    printf 'location ~ ^/(example|ws) {\n    proxy_pass http://%s;\n}\n' "$EXAMPLE_UPSTREAM" >> "$CONF_DIR/snippets/front.conf"
fi

sed -i -e "s|{{API_ROUTE_PREFIX}}|$API_ROUTE_PREFIX|g" -e "s|{{HTTPS_PORT}}|$HTTPS_PORT|g" "$CONF_DIR"/*.conf "$CONF_DIR"/snippets/*.conf
