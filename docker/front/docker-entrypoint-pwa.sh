#!/bin/sh

fixuid || :

rm -rf node_modules pwa/node_modules example-app/node_modules

if [ -d gally-admin ]
then
  rm -rf gally-admin/node_modules gally-admin/packages/components/node_modules gally-admin/packages/shared/node_modules
fi

yarn install --frozen-lockfile --network-timeout 120000

if [ -d gally-admin ]
then
  cd gally-admin
  yarn build
  yarn cache clean
  cd ..
fi

exec $@
