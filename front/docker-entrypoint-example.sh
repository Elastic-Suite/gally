#!/bin/sh

fixuid || :

while [[ "$(curl --connect-timeout 2 -s -o /dev/null -w ''%{http_code}'' http://pwa:3000)" != "200" ]];
do echo '... wait for pwa to be up ...'; sleep 5;
done;
echo 'pwa is up'

if [ -d gally-admin ]
then
  cd example-app/node_modules
  if [ ! -f gally-admin-components ]
  then
  	ln -s ../../gally-admin/packages/components gally-admin-components
  fi
  if [ ! -f gally-admin-shared ]
  then
  	ln -s ../../gally-admin/packages/shared gally-admin-shared
  fi
  cd ../..
fi

exec $@
