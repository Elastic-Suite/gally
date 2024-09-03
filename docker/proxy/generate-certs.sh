#!/bin/bash

CERT_PATH="/etc/nginx/certs/$PWA_SERVER_NAME/fullchain.pem"
KEY_PATH="/etc/nginx/certs/$PWA_SERVER_NAME/privkey.pem"

# Generate self sign certificates if they note exists
if [[ ! -f "$CERT_PATH" ]]; then
	mkdir -p $(dirname $CERT_PATH)
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	  -keyout $KEY_PATH \
	  -out $CERT_PATH \
	  -subj "/CN=${PWA_SERVER_NAME:-localhost}"
fi
