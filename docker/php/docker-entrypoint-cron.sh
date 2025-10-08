#!/bin/sh
set -e

# Call PHP entrypoint
docker-entrypoint "$@"

# Export environment variables for cron
printenv | grep -v "no_proxy" > /etc/environment

if [ -z "$CRONTAB" ]; then
    echo "You must specify a crontab with the environment variable \$CRONTAB."
    exit 1
fi

echo "Configure crontab..."
echo "$CRONTAB" > /tmp/crontab
crontab /tmp/crontab
rm -f /tmp/crontab
crontab -l
echo "Crontab configured."

#Run cron in foreground so container keeps running
exec cron -f
