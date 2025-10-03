#!/bin/sh

fixuid || :

# Skip node_modules deletion and yarn install if SKIP_INSTALL is set to true
# This is disabled by default as clean install are often necessary
# Change this in env file at your own risk with the benefit of speeding up container startup
if [ "$SKIP_YARN_INSTALL" != "true" ]; then
    echo "=== STARTING NODE_MODULES DELETION AND YARN INSTALL ==="
    echo "SKIP_YARN_INSTALL is not set to true"

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
else
  echo "=== SKIPPING NODE_MODULES DELETION AND YARN INSTALL ==="
  echo "SKIP_INSTALL is set to true"
fi

exec $@
