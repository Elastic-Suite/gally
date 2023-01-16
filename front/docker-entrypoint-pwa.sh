#!/bin/sh

fixuid || :

yarn install --frozen-lockfile

if [ -d gally-admin ]
then
  cd gally-admin
  yarn install --frozen-lockfile;
  yarn build
  cd packages/shared/node_modules
  ln -Ts ../../../../node_modules/react react
  ln -Ts ../../../../node_modules/react-dom react-dom
  cd ../../components/node_modules
  ln -Ts ../../../../node_modules/react react
  ln -Ts ../../../../node_modules/react-dom react-dom
  cd ../../../../pwa/node_modules
  ln -Ts ../../gally-admin/packages/components gally-admin-components
  ln -Ts ../../gally-admin/packages/shared gally-admin-shared
  cd ../..
fi

exec $@
