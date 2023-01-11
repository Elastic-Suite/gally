#!/bin/sh

fixuid || :

yarn install --frozen-lockfile

if [ -d gally-admin ]
then
  cd gally-admin
  yarn install --frozen-lockfile;
  yarn build
  cd ../pwa/node_modules
  ln -Ts ../../gally-admin/packages/components gally-admin-components
  ln -Ts ../../gally-admin/packages/shared gally-admin-shared
  cd ../..
fi

exec $@
