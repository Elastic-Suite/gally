#!/bin/sh

while [[ "$(curl --connect-timeout 2 -s -o /dev/null -w ''%{http_code}'' http://pwa:3000)" != "200" ]];
do echo '... wait for pwa to be up ...'; sleep 5;
done;
echo 'pwa is up'

exec $@
