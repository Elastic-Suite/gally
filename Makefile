# Include .env if exist
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Executables (local)
DOCKER_COMP_EXEC := docker compose
ASK_CONFIRMATION := "read -p '\e[31mThis Makefile is meant to be used in a development environment, are you sure you want to continue? (y/n)\e[0m ' REPLY; \
    [ "\$$REPLY" = "y" ] \
    || exit 0; $(DOCKER_COMP_EXEC)"
DOCKER_COMP := $(shell [ "${APP_ENV}" = "prod" ] && echo $(ASK_CONFIRMATION) || echo $(DOCKER_COMP_EXEC))

# Docker containers
PHP_CONT = $(DOCKER_COMP) exec php
PHP_DATABASE = $(DOCKER_COMP) exec database

# Executables
PHP          = $(PHP_CONT) php
COMPOSER     = $(PHP_CONT) composer
SYMFONY      = $(PHP_CONT) bin/console
PHP_UNIT     = $(PHP_CONT) bin/phpunit
PHP_CS_FIXER = $(PHP_CONT) vendor/bin/php-cs-fixer
PHP_STAN     = $(PHP_CONT) vendor/bin/phpstan

# Misc
.DEFAULT_GOAL = help
.PHONY        = help build up start down logs sh composer vendor sf cc

## —— 🎵 🐳 The Symfony-docker Makefile 🐳 🎵 ——————————————————————————————————
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
build: .env ## Builds the Docker images
	@$(DOCKER_COMP) build

build_no_cache: ## Builds the Docker images (without cache)
	@$(DOCKER_COMP) build --pull --no-cache

up: .env ## Start the docker hub in detached mode (no logs)
	@$(DOCKER_COMP) up --detach

start: build up ## Build and start the containers

down: .env ## Stop the docker hub
	@$(DOCKER_COMP) down --remove-orphans

logs: ## Show live logs, pass the parameter "s=" to get logs of a given service, example: make logs s=elasticsearch
	@$(eval s ?=)
	@$(DOCKER_COMP) logs --tail=0 --follow $(s)

sh: ## Connect to the PHP FPM container, pass the parameter "s=" to connect to another service, example: make sh s=database
	@$(eval s ?= php)
	@$(DOCKER_COMP) exec $(s) bash

## —— Composer 🧙 ——————————————————————————————————————————————————————————————
composer: ## Run composer, pass the parameter "c=" to run a given command, example: make composer c='req symfony/orm-pack'
	@$(eval c ?=)
	@$(COMPOSER) $(c)

vendor: ## Install vendors according to the current composer.lock file
vendor: c=install --prefer-dist --no-dev --no-progress --no-scripts --no-interaction
vendor: composer

## —— Services 🔧 ———————————————————————————————————————————————————————————————
exec: ## Execute a command on a given container
	@$(eval s ?=)
	@$(evel c ?=)
	@$(DOCKER_COMP) exec $(s) $(c)

db: ## Connect to the DB
	@$(PHP_DATABASE) sh -c 'psql $$POSTGRES_DB $$POSTGRES_USER'

init-dev-env: .env ## Initialize current environment with dev repositories
	git config core.hooksPath ./hooks
	$(DOCKER_COMP) run --rm --entrypoint="rm -rf nodes_modules/gally* pwa/node_modules/gally* example-app/node_modules/gally*" pwa
	[ -d api/packages/gally-standard ] || git clone git@github.com:Elastic-Suite/gally-standard.git api/packages/gally-standard
	[ -d api/packages/gally-premium ] || git clone git@github.com:Elastic-Suite/gally-premium.git api/packages/gally-premium
	[ -d api/packages/gally-sample-data ] || git clone git@github.com:Elastic-Suite/gally-sample-data.git api/packages/gally-sample-data
	[ -d front/gally-admin ] || git clone git@github.com:Elastic-Suite/gally-admin.git front/gally-admin
	$(MAKE) start
	$(MAKE) switch-dev-env

switch-dev-env: ## Switch current environment with dev repositories on a composer version, pass the parameter "v=" to set the composer version, example: make switch-dev-env v=2.0.0
	@$(eval v ?= 2.1.0)
	$(DOCKER_COMP) up -d --wait php # Wait php container to be ready
	$(COMPOSER) config repositories.gally-standard '{ "type": "path", "url": "./packages/gally-standard", "options": { "versions": { "gally/gally-standard": "$(v)"}} }'
	$(COMPOSER) config repositories.gally-premium '{ "type": "path", "url": "./packages/gally-premium", "options": { "versions": { "gally/gally-premium": "$(v)"}} }'
	$(COMPOSER) config repositories.gally-sample-data '{ "type": "path", "url": "./packages/gally-sample-data", "options": { "versions": { "gally/gally-sample-data": "$(v)"}} }'
	$(COMPOSER) remove gally/gally-premium gally/gally-sample-data gally/gally-standard --no-scripts
	$(COMPOSER) require gally/gally-standard $(v) --no-scripts
	$(COMPOSER) require gally/gally-premium $(v) --no-scripts
	$(COMPOSER) require gally/gally-sample-data $(v)

phpcsfixer: ## Run php cs fixer, pass the parameter "o=" to pass options, make phpcsfixer o="--dry-run"
	@$(eval o ?=)
	@$(PHP_CS_FIXER) fix --path-mode=intersection src/ --diff $(o)
	@for package in $$(ls api/vendor/gally); do \
		$(PHP_CS_FIXER) fix --path-mode=intersection vendor/gally/$$package --diff $(o) ;\
	done

phpcsfixer_dryrun: ## Run php cs fixer with dry run option
phpcsfixer_dryrun: o="--dry-run"
phpcsfixer_dryrun: phpcsfixer

phpstan: ## Run phpstan , pass the parameter "o=" to ass options, make phpstan o="--level 3"
	@$(eval o ?=)
	@$(PHP_STAN) --memory-limit=-1 analyse $(o)

yarn: ## Install dependencies on pwa container through yarn
	@$(DOCKER_COMP) exec pwa yarn install

typescript: ## Run typescript
typescript: yarn
	@$(DOCKER_COMP) exec pwa yarn typescript

eslint: ## Run eslint in fix mode
eslint: yarn
	@$(DOCKER_COMP) exec pwa yarn eslint

prettier: ## Run prettier
prettier: yarn
	@$(DOCKER_COMP) exec pwa yarn prettier

qa_back: ## Run code quality tools for back
qa_back: phpcsfixer
qa_back: phpstan

qa_front: ## Run code quality tools for front
qa_front: typescript
qa_front: eslint
qa_front: prettier

qa: ## Run code quality tools
qa: qa_back
qa: qa_front

phpunit: ## Run php unit tests, pass the parameter "p=" to launch tests on a specific path
	@$(eval p ?=)
	@$(PHP_UNIT) $(p)

jest: ## Run jest unit tests
	@$(DOCKER_COMP) exec pwa yarn test

jest_update: ## Run jest unit tests
	@$(DOCKER_COMP) exec pwa yarn test:update

varnish_flush: ## Flush varnish cache
	@$(DOCKER_COMP) exec varnish varnishadm 'ban req.url ~ .'

.env:
	@echo "UUID=$(shell id -u)" >> .env
	@echo "GUID=$(shell id -g)" >> .env

## —— Symfony 🎵 ———————————————————————————————————————————————————————————————
sf: ## List all Symfony commands or pass the parameter "c=" to run a given command, example: make sf c=about
	@$(eval c ?=)
	@$(SYMFONY) $(c)

cc: c=c:c ## Clear the cache
cc: sf

migrate: ## Run symfony migration
migrate: c=doctrine:migrations:migrate -n --allow-no-migration
migrate: sf

generate_migration: ## Generate symfony migration
generate_migration: c=doctrine:migrations:diff --namespace 'DoctrineMigrations'
generate_migration: sf

fixtures_load: ## Load fixtures (Delete DB and Elasticsearch data)
	@$(SYMFONY) gally:index:clear
	@$(SYMFONY) list gally --raw | grep gally:vector-search:upload-model && $(SYMFONY) gally:vector-search:upload-model || true
	@$(SYMFONY) hautelook:fixtures:load
	@$(SYMFONY) doctrine:fixtures:load --append #Append argument used because the database is already reset by the previous command
	@$(MAKE) varnish_flush

fixtures_append: ## Append fixtures
	@$(SYMFONY) hautelook:fixtures:load --append
	@$(SYMFONY) doctrine:fixtures:load --append

index_clear: ## Delete all Elasticsearch indices
index_clear: c=gally:index:clear
index_clear: sf
