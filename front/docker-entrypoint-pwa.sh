#!/bin/sh

fixuid || :

yarn install --frozen-lockfile

if [ -d gally-admin ]
then
  cd gally-admin
  yarn install --frozen-lockfile;
  yarn build
  cd ../pwa/node_modules
  ln -s ../../gally-admin/packages/components gally-admin-components
  ln -s ../../gally-admin/packages/shared gally-admin-shared
  cd ../..
fi

exec $@
