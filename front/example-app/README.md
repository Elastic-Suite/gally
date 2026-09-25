# Gally example app

Demo storefront for `@elastic-suite/gally-sdk`: Next.js 16 (App Router) + React 19 + TypeScript.
Package name `gally-features-example`.

## Running it

It runs as the `example` service of the monorepo Docker stack, in the dev profile only, and is
served at **https://gally.localhost/example** (`basePath: '/example'`, port 3001 inside the
container). From the repo root:

```bash
make start            # build + up
make logs s=example   # follow this app's logs
```

**Do not run `npm run build` or `npm start` on the host.** Package resolution only works inside the
`example` container — the SDK is a yarn-workspace symlink to `front/gally-admin/packages/sdk`.
To type-check:

```bash
docker compose exec example sh -c "cd /usr/src/front/example-app && npx tsc --noEmit"
```

There are no tests in this workspace (`npm test` prints "no tests").

## Working on it

Read **[`AGENTS.md`](AGENTS.md)** first. It is the entry point and holds the routing table for
`docs/`, `specs/` and the directory-level rules.
