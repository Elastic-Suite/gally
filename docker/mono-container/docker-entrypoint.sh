#!/bin/bash

/usr/bin/supervisord -c /etc/supervisor/supervisord.conf &

sleep 10

# Todo move this in dockerfile in order to have everything ready in the built image
cd /var/gally/api

echo "Entering Gally build configuration"

bin/console lexik:jwt:generate-keypair --skip-if-exists
bin/console doctrine:migrations:migrate --no-interaction --all-or-nothing

PACKAGE="gally/gally-premium"
if composer show "$PACKAGE" > /dev/null 2>&1; then
	echo "Gally Premium is installed, prepare Vector Search."
    bin/console gally:vector-search:upload-model
fi

bin/console hautelook:fixture:load

echo "Gally Application is ready..."

tail -f --retry --follow=name -n0 \
	/var/gally/api/var/log/dev.log
