FROM nginx:latest

COPY --link ./templates /etc/nginx/templates

COPY --link docker-entrypoint.d/25-replace-custom-var-env.sh /docker-entrypoint.d/25-replace-custom-var-env.sh
RUN chmod +x /docker-entrypoint.d/25-replace-custom-var-env.sh
