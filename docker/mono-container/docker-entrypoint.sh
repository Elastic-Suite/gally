#!/bin/bash

/usr/bin/supervisord -c /etc/supervisor/supervisord.conf &

sleep 10

# Todo move this in dockerfile in order to have everything ready in the built iamge
cd /var/gally/api
bin/console lexik:jwt:generate-keypair --skip-if-exists
bin/console doctrine:migrations:migrate --no-interaction --all-or-nothing
bin/console gally:vector-search:upload-model
bin/console hautelook:fixture:load

tail -f --retry --follow=name -n0 \
	/var/gally/api/var/log/dev.log
