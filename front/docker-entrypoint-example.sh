#!/bin/sh

fixuid || :

while [[ "$(curl --connect-timeout 2 -s -o /dev/null -w ''%{http_code}'' http://pwa:3000)" != "200" ]];
do echo '... wait for pwa to be up ...'; sleep 5;
done;
echo 'pwa is up'

if [ -d gally-admin ]
then
  cd example-app/node_modules
  mkdir @elastic-suite
  ln -Ts ../../../gally-admin/packages/components @elastic-suite/gally-admin-components
  ln -Ts ../../../gally-admin/packages/shared @elastic-suite/gally-admin-shared
  cd ../..
fi

exec $@
