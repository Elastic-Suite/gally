#!/bin/bash

## Add apt sources
curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-keyring
echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-2.x.list
apt-get update

# Databases
apt-get install -y openssl libssl3 opensearch=2.16.0
cp opensearch.yml /etc/opensearch/opensearch.yml
/usr/share/opensearch/bin/opensearch-plugin install analysis-icu
/usr/share/opensearch/bin/opensearch-plugin install analysis-phonetic


# Start services
systemctl enable opensearch
systemctl start opensearch
systemctl list-units --type service -q opensearch.service


