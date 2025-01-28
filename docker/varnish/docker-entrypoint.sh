#!/bin/sh
set -e

envsubst < /etc/varnish/default.vcl > /tmp/default.vcl

cat /tmp/default.vcl > /etc/varnish/default.vcl

envsubst < /etc/varnish/default.vcl.template > /etc/varnish/default.vcl

VARNISH_PORTS=""
VARNISH_HTTP_PORT_LIST=${VARNISH_HTTP_PORTS:-80}
for PORT in $VARNISH_HTTP_PORT_LIST; do
    VARNISH_PORTS="$VARNISH_PORTS -a :$PORT"
done

# this will check if the first argument is a flag
# but only works if all arguments require a hyphenated flag
# -v; -SL; -f arg; etc will work, but not arg1 arg2
if [ "$#" -eq 0 ] || [ "${1#-}" != "$1" ]; then
    set -- varnishd \
	    -F \
	    -f /etc/varnish/default.vcl \
	    $VARNISH_PORTS \
	    -a proxy=:${VARNISH_PROXY_PORT:-8443},PROXY \
	    -p default_keep=${VARNISH_DEFAULT_KEEP:-300} \
	    -p http_resp_hdr_len=${VARNISH_HTTP_RESP_HRD_LEN:-64k} \
	    -p feature=+http2 \
	    -s malloc,$VARNISH_SIZE \
	    "$@"
fi

exec "$@"
