#!/usr/bin/env bash
# Purpose of this script is to disable the Varnish integration of API-Platform. There is no Varnish service in the deployment configuration ATM.
sed -e 'H;x;/^\(  *\)\n\1/{s/\n.*//;x;d;}' -i 's/.*//;x;/http_cache/{s/^\( *\).*/ \1/;x;d;}' config/packages/api_platform.yaml
sed -e 'H;x;/^\(  *\)\n\1/{s/\n.*//;x;d;}' -i 's/.*//;x;/http_cache/{s/^\( *\).*/ \1/;x;d;}' vendor/gally/gally-standard/src/Configuration/Resources/config/api_platform.yaml
