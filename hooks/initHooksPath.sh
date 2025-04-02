#!/bin/bash
# Init front hookPath
yarn --cwd ./front run husky:install

# Init global hookPath that manage front and back
git config core.hooksPath ./hooks
