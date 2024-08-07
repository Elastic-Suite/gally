#!/bin/sh

if [ -f .env ]
then
  export $(cat .env | xargs)
fi

mkdir -p docker/certs
# todo upgrade docker run openssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/certs/server.key \
  -out docker/certs/server.crt \
  -subj "/CN=${PWA_SERVER_NAME-localhost}"
