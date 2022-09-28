#!/bin/sh

fixuid || :

yarn install --frozen-lockfile
[ -d shared/dist ] || (yarn build:shared)

exec $@
