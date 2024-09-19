#!/bin/sh

CERT_PATH="/etc/letsencrypt/${SERVER_NAME}/fullchain.pem"
KEY_PATH="/etc/letsencrypt/${SERVER_NAME}/privkey.pem"

if [[ ! -f "$CERT_PATH" ]]; then
	echo 'Generate self signed certificates'
	mkdir -p $(dirname $CERT_PATH)

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

	if [[ -z $SELF_SIGNED ]]
	then
		echo 'Ask letsencrypt certificates'
		[[ -z "${HAS_MULTIPLE_DOMAINS}" ]] \
			&& DOMAINS="${SERVER_NAME}" \
			|| DOMAINS="${SERVER_NAME},${API_SERVER_NAME}"

		certbot certonly --webroot --webroot-path=/var/www/certbot --non-interactive --agree-tos --register-unsafely-without-email --agree-tos --no-eff-email -d ${DOMAINS}
	fi
fi

if [[ -z $SELF_SIGNED ]]; then
	echo 'Wait 48h for certificates renew'
	trap exit TERM
	while :; do
		sleep 48h & wait;
		certbot renew;
	done
else
	sleep infinity
fi

