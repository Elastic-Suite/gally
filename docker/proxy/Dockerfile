FROM nginx:latest

COPY --link ./templates /etc/nginx/templates
COPY generate-certs.sh /docker-entrypoint.d/
