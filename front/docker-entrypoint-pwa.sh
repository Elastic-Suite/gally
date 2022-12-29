#!/bin/sh

fixuid || :

yarn install --frozen-lockfile

exec $@
