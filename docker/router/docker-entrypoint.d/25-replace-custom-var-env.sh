#!/bin/sh

set -eu

# Defaults, even if these variables are not set in compose.yml files.
API_ROUTE_PREFIX=${API_ROUTE_PREFIX:-api}
HTTPS_PORT=${HTTPS_PORT:-443}
# Set to false when TLS is terminated upstream (Traefik, ingress, load balancer...): the app is then served over plain HTTP on port 80.
HTTPS_ENABLED=${HTTPS_ENABLED:-true}

CONF_DIR=/etc/nginx/conf.d

if [ "$HTTPS_ENABLED" = "true" ]; then
    PORT_SUFFIX=$([ "$HTTPS_PORT" = "443" ] && echo "" || echo ":$HTTPS_PORT")
    printf 'location / {\n    return 301 https://$host%s$request_uri;\n}\n' "$PORT_SUFFIX" > "$CONF_DIR/snippets/http.conf"
    cp "$CONF_DIR/snippets/https-server.conf" "$CONF_DIR/https.conf"
else
    echo "include $CONF_DIR/snippets/app.conf;" > "$CONF_DIR/snippets/http.conf"
    rm -f "$CONF_DIR/https.conf"
fi

sed -i -e "s|{{API_ROUTE_PREFIX}}|$API_ROUTE_PREFIX|g" -e "s|{{HTTPS_PORT}}|$HTTPS_PORT|g" "$CONF_DIR"/*.conf "$CONF_DIR"/snippets/*.conf
