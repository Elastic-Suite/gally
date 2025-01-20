#!/bin/bash

docker compose down -v
docker compose build
docker compose up -d
docker compose exec search bash install_search.sh
docker compose exec seearch-ml bash install_search_ml.sh
echo "Wating elastic to be ready"; sleep 20
docker compose exec server bash install.sh
docker compose exec -uwww-data server bash
