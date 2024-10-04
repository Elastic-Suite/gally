FROM certbot/certbot:latest

COPY ./generate-certs.sh /generate-certs.sh

HEALTHCHECK --interval=1m --timeout=10s --start-period=30s --retries=3 \
    CMD find  /etc/letsencrypt/live/ -name 'fullchain.pem' -exec test -f {} \; || exit 1

ENTRYPOINT ["/generate-certs.sh"]
