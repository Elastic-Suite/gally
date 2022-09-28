#!/bin/sh

fixuid || :

yarn install
[ -d shared/dist ] || (yarn build:shared)

exec $@
