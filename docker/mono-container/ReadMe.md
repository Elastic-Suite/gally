# Gally in a single docker container

```shell
#From gally root directory
make .env
docker compose run --rm php composer install
docker compose run --rm pwa yarn install --frozen-lockfile --network-timeout 120000
docker compose run --rm pwa yarn build
SERVER_NAME=mono.localhost docker compose -f docker/mono-container/compose.yml build
SERVER_NAME=mono.localhost docker compose -f docker/mono-container/compose.yml up -d
SERVER_NAME=mono.localhost docker compose exec server bash
cd api
bin/console hautelook:fixtures:load
bin/console gally:user:create 
```
