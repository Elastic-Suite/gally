# Install

## Prerequisites

> This documentation explain how to deploy Gally on a linux server without docker. The following commands assume a debian like distribution but you can adapt them for any Linux distribution.

Gally architecture is compose of 7 services :
- 3 databases:
  - PostgreSQL
  - Opensearch
  - Redis
- 2 webservice
  - Php-fpm
  - NodeJs
- 1 Full page cache
    - Varnish
- 1 Router
  - Nginx

It is up to you to deploy these services on a single server or on multiple one according to your management process.

## Databases

### PostgreSSQL & Redis

Install redis and postgresql (v16) packages and enable the services:
```shell
apt-get install -y redis postgresql-16
systemctl enable postgresql redis-server
systemctl start postgresql redis-server
```

Then you should create the default user and database in postgres : 
```shell
sudo -upostgres psql
```
```sql
CREATE ROLE "api-platform" WITH SUPERUSER LOGIN;
ALTER USER "api-platform" WITH password '!ChangeMe!';
CREATE DATABASE api;
```

### Opensearch

In oder to be able to search vector search request, you will need at least two nodes in your opensearch cluster.
- one node `data` node
- one node `ml` node

Install opensearch 16 and the plugins `analysis-icu` and `analysis-phonetic`:
```shell
apt-get install -y openssl libssl3 opensearch=2.16.0
/usr/share/opensearch/bin/opensearch-plugin install analysis-icu
/usr/share/opensearch/bin/opensearch-plugin install analysis-phonetic
```

Then enable the service:
```shell
systemctl enable opensearch
systemctl start opensearch
```
