#!/bin/sh

CERT_PATH="/etc/letsencrypt/${SERVER_NAME}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/${SERVER_NAME}/privkey.pem"

if [[ ! -f "$CERT_PATH" ]]; then
    mkdir -p $(dirname $CERT_PATH)

    if [[ -n $SELF_SIGNED ]]
    then
        echo 'Generate self signed certificates'
        [[ -z "${HAS_MULTIPLE_DOMAINS}" ]] \
            && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                  -keyout $KEY_PATH \
                  -out $CERT_PATH \
                  -subj "/CN=${SERVER_NAME:-localhost}" \
            || openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                  -keyout $KEY_PATH \
                  -out $CERT_PATH \
                  -subj "/CN=${SERVER_NAME:-localhost}" \
                  -addext "subjectAltName=DNS:${SERVER_NAME},DNS:${API_SERVER_NAME}"
    fi
fi

if [[ -z $SELF_SIGNED ]]; then
    echo 'Wait 12h for certificates renew'
    trap exit TERM
    while :; do
        sleep 12h & wait;
        certbot renew;
    done
else
    sleep infinity
fi

