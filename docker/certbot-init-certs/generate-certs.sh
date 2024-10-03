#!/bin/sh

CERT_PATH="/etc/letsencrypt/${SERVER_NAME}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/${SERVER_NAME}/privkey.pem"

if [[ ! -f "$CERT_PATH" ]]; then
	mkdir -p $(dirname $CERT_PATH)

	if [[ -z $SELF_SIGNED ]]
	then
		echo 'Ask letsencrypt certificates'
		[[ -z "${HAS_MULTIPLE_DOMAINS}" ]] \
			&& DOMAINS="${SERVER_NAME}" \
			|| DOMAINS="${SERVER_NAME},${API_SERVER_NAME}"

		certbot certonly --webroot --webroot-path=/var/www/certbot --non-interactive --agree-tos --register-unsafely-without-email --agree-tos --no-eff-email -d ${DOMAINS}
	fi
fi

