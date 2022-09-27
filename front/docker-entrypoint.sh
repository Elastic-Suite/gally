#!/bin/sh


fixuid || :

[ -d shared/dist ] || (yarn install && yarn build:shared)


exec $@
