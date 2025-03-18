#!/bin/sh

set -eu

# Allows to set 'api' as default value of $API_ROUTE_PREFIX, even if the value for $API_ROUTE_PREFIX is not set in compose.yml files.
API_ROUTE_PREFIX=${API_ROUTE_PREFIX:-api}
sed -i "s|{{API_ROUTE_PREFIX}}|$API_ROUTE_PREFIX|g" /etc/nginx/conf.d/default.conf
