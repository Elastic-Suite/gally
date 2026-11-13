# Gally - Docker runtime topology

This folder belongs to the monorepo (`Elastic-Suite/gally`) and holds the images. Read this when
you need to know which service serves a path, which compose file wins, or what a container reads
from the environment. The monorepo map is `../AGENTS.md`.

## Compose files

| File | Role |
|---|---|
| `compose.yml` (root) | Base stack, **prod targets** by default |
| `compose.override.yml` (root) | Dev overrides: bind mounts, xdebug, `example`/`mailer`/`blackfire`/`e2e` services |
| `compose.ci.yml`, `compose.int.yml`, `compose.e2e.yml` (root) | CI / integration / Playwright variants |
| `compose.init_certs.yml` (root) | One-shot self-signed cert generation |
| `compose/compose.elasticsearch{7,8}.yml` | Swap OpenSearch for Elasticsearch |
| `compose/compose.{with_gpu,dedicated_ml_node}.yml` | Vector-search / ML topologies |
| `mono-container/` | Standalone all-in-one image (own compose and supervisord), a separate concern |

## Services and where their images are built from

```
browser
  -> proxy      proxy/     nginx TLS terminator, :80/:443 (dev: HTTP_PORT/HTTPS_PORT)
    -> varnish  varnish/   full-page cache (default.vcl.template)
      -> router router/    THE URL DISPATCHER, read templates/default.conf.template
           /            -> pwa:3000       back office (Next.js)
           /example,/ws -> example:3001   demo storefront (dev only)
           /api/*       -> php:9000       Symfony/API Platform (fastcgi)
```

Backing services: `database` (PostgreSQL 16), `search` (OpenSearch 2, `search/`), `redis`, `cron`
(messenger consumers, `cron` profile), `mailer` (Mailpit, dev), `certbot`, `blackfire` (profile),
`e2e` (Playwright).

## Things that surprise

- **The API route prefix** is `API_ROUTE_PREFIX` (default `api`) and is stripped by the router
  before reaching Symfony: inside PHP, routes have no `/api` prefix. It is also injected as
  Symfony's `%route_prefix%` in `api/config/routes/gally.yaml`.
- **Static PHP files** (`api/public`) are shared to `router` through the `php_static_files` volume
  in prod, and bind-mounted in dev.
- **Env defaults** live in `compose.yml`'s `x-base-php-env` anchor and `api/.env`. Local overrides
  go in the root `.env`, which holds `UUID`/`GUID` for file-permission mapping: required for
  `pwa` and `example`.
- **Default host** is `https://gally.localhost` (`SERVER_NAME`), with the mail UI at
  `mail.gally.localhost`.
