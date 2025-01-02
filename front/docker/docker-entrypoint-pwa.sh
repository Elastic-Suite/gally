#!/bin/sh

fixuid || :

yarn install --frozen-lockfile --network-timeout 120000

if [ -d gally-admin ]
then
  cd gally-admin
  yarn install --frozen-lockfile --network-timeout 120000;
  yarn build
  yarn cache clean
  cd node_modules
  rm -rf react react-dom
  ln -Ts ../../node_modules/react react
  ln -Ts ../../node_modules/react-dom react-dom
  cd ../packages/shared/node_modules
  ln -Ts ../../../../node_modules/react react
  ln -Ts ../../../../node_modules/react-dom react-dom
  cd ../../components/node_modules
  ln -Ts ../../../../node_modules/react react
  ln -Ts ../../../../node_modules/react-dom react-dom
  cd ../../../../pwa/node_modules
  mkdir @elastic-suite
  ln -Ts ../../../gally-admin/packages/components @elastic-suite/gally-admin-components
  ln -Ts ../../../gally-admin/packages/shared @elastic-suite/gally-admin-shared
  cd ../..
fi

exec $@
