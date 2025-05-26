#!/bin/sh

set -eu

# Allows to set '443' as default value of $HTTPS_PORT, even if the value for $HTTPS_PORT is not set in compose.yml files.
HTTPS_PORT=${HTTPS_PORT:-443}
sed -i "s|{{HTTPS_PORT}}|$HTTPS_PORT|g" /etc/nginx/conf.d/default.conf
