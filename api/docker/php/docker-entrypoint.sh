#!/bin/sh
set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- php-fpm "$@"
fi

if [ "$1" = 'php-fpm' ] || [ "$1" = 'php' ] || [ "$1" = 'bin/console' ]; then
	if [ -d "php_static_files" ]; then
		echo "rsync php_static_files directory in public directory"
       	rsync -av php_static_files/ public/
	fi

	 if [ -n "$CONTAINER_APP_HOSTNAME" ]; then
		echo "Set SERVER_NAME in Azure context"
		SERVER_NAME=$CONTAINER_APP_HOSTNAME
	else
		echo "NOT set SERVER_NAME in Azure context '$CONTAINER_APP_HOSTNAME'"
    fi

	if [ -z "$(ls -A 'vendor/' 2>/dev/null)" ]; then
		composer install --prefer-dist --no-progress --no-interaction
	fi

	if [ "$APP_ENV" != 'prod' ]; then
		echo "Making sure public / private keys for JWT exist..."
		php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction
		setfacl -R -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
		setfacl -dR -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
	fi

	if grep -q ^DATABASE_URL= .env; then
		echo "Waiting for database to be ready..."
		ATTEMPTS_LEFT_TO_REACH_DATABASE=60
		until [ $ATTEMPTS_LEFT_TO_REACH_DATABASE -eq 0 ] || DATABASE_ERROR=$(php bin/console dbal:run-sql -q "SELECT 1" 2>&1); do
			if [ $? -eq 255 ]; then
				# If the Doctrine command exits with 255, an unrecoverable error occurred
				ATTEMPTS_LEFT_TO_REACH_DATABASE=0
				break
			fi
			sleep 1
			ATTEMPTS_LEFT_TO_REACH_DATABASE=$((ATTEMPTS_LEFT_TO_REACH_DATABASE - 1))
			echo "Still waiting for database to be ready... Or maybe the database is not reachable. $ATTEMPTS_LEFT_TO_REACH_DATABASE attempts left."
		done

		if [ $ATTEMPTS_LEFT_TO_REACH_DATABASE -eq 0 ]; then
			echo "The database is not up or not reachable:"
			echo "$DATABASE_ERROR"
			exit 1
		else
			echo "The database is now ready and reachable"
		fi

		if [ "$( find ./migrations -iname '*.php' -print -quit )" ]; then
			php bin/console doctrine:migrations:migrate --no-interaction --all-or-nothing
		fi
	fi

	if grep -q ELASTICSEARCH_URL= .env; then
		echo "Waiting for search engine to be ready..."
		ATTEMPTS_LEFT_TO_REACH_SEARCH=60
		until [ $ATTEMPTS_LEFT_TO_REACH_SEARCH -eq 0 ] || SEARCH_ERROR=$(curl -s ${ELASTICSEARCH_URL}); do
			sleep 1
			ATTEMPTS_LEFT_TO_REACH_SEARCH=$((ATTEMPTS_LEFT_TO_REACH_SEARCH - 1))
			echo "Still waiting for search engine to be ready... Or maybe the search engine is not reachable. $ATTEMPTS_LEFT_TO_REACH_SEARCH attempts left."
		done

		if [ $ATTEMPTS_LEFT_TO_REACH_SEARCH -eq 0 ]; then
			echo "The search engine is not up or not reachable:"
			echo "$SEARCH_ERROR"
			exit 1
		else
			echo "The search engine is now reachable"
		fi

		curl -s "${ELASTICSEARCH_URL}_cluster/health?wait_for_status=green&timeout=30s"
		echo "The search engine is now ready"

		if php bin/console list gally --raw | grep -q gally:vector-search:upload-model; then
			echo "Load ml model in opensearch"
			php bin/console gally:vector-search:upload-model
		fi
	fi

	setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX var
	setfacl -dR -m u:www-data:rwX -m u:"$(whoami)":rwX var
fi

exec docker-php-entrypoint "$@"
