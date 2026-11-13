# Gally API - the Symfony application shell

This folder belongs to the monorepo (`Elastic-Suite/gally`). It is deliberately thin: it boots
and configures, it does not implement features. The features live in the packages under
`packages/`, each its own git repo with its own `AGENTS.md`:

| Package | What it holds |
|---|---|
| `packages/gally-standard/` | the open-source engine, all core features |
| `packages/gally-premium/` | the 8 paid modules |
| `packages/gally-sample-data/` | the demo dataset |

`vendor/gally/*` are symlinks to `packages/*`: the same files. Always open and edit them through
`packages/`, or you may commit to a repo you did not mean to.

## What is here

- `src/Kernel.php` - the only real class. `src/Entity`, `src/Controller`, `src/Repository` are
  empty placeholders.
- `src/Acme/ExampleBundle/` - **reference implementation**: a fully worked example bundle showing
  how to add your own indexed entity (Command, DataFixtures, GraphQl types and filters, Model,
  Repository, Resolver, Serializer, Tests). Read this first when asked to extend the data model.
- `config/bundles.php` - the definitive list of what is enabled. The committed file registers only
  `Gally\GallyBundle` (standard). Where premium and sample data are installed, the 8 premium
  bundles and then `GallySampleDataBundle` are registered after it.
- `config/packages/` - Symfony and third-party config (api_platform, doctrine, messenger, security,
  lexik_jwt, vich_uploader, hautelook_alice...).
- `migrations/` - app-level Doctrine migrations. Standard and premium ship their own, see their
  `AGENTS.md`.
- `fixtures/`, `tests/`, `patches/` (composer-patches), `templates/` (Twig emails),
  `translations/`.

Everything runs inside the `php` container; do not run composer or php on the host.
