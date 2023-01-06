#!/bin/sh

fixuid || :

yarn install --frozen-lockfile

if [ -d gally-admin ]
then
  cd gally-admin
  yarn install --frozen-lockfile;
  yarn build
  cd ../pwa/node_modules
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
