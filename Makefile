# Executables (local)
DOCKER_COMP = docker-compose

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
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
build: ## Builds the Docker images
	@$(DOCKER_COMP) build --pull --no-cache

build_fast: ## Builds the Docker images (with cache)
	@$(DOCKER_COMP) build

up: ## Start the docker hub in detached mode (no logs)
	$(MAKE) .env
	@$(DOCKER_COMP) up --detach

start: build up ## Build and start the containers

down: ## Stop the docker hub
	$(MAKE) .env
	@$(DOCKER_COMP) down --remove-orphans

logs: ## Show live logs, pass the parameter "s=" to get logs of a given service, example: make logs s=elasticsearch
	@$(eval s ?=)
	@$(DOCKER_COMP) logs --tail=0 --follow $(s)

sh: ## Connect to the PHP FPM container, pass the parameter "s=" to connect to another service, example: make sh s=database
	@$(eval s ?= php)
	@$(DOCKER_COMP) exec $(s) sh

## —— Composer 🧙 ——————————————————————————————————————————————————————————————
composer: ## Run composer, pass the parameter "c=" to run a given command, example: make composer c='req symfony/orm-pack'
	@$(eval c ?=)
	@$(COMPOSER) $(c)

vendor: ## Install vendors according to the current composer.lock file
vendor: c=install --prefer-dist --no-dev --no-progress --no-scripts --no-interaction
vendor: composer

## —— Services 🔧 ———————————————————————————————————————————————————————————————
db: ## Connect to the DB
	@$(PHP_DATABASE) sh -c 'psql $$POSTGRES_DB $$POSTGRES_USER'

phpcsfixer: ## Run php cs fixer, pass the parameter "o=" to ass options, make phpcsfixer o="--dry-run"
	@$(eval o ?=)
	@$(PHP_CS_FIXER) fix --path-mode=intersection src/Elasticsuite --diff $(o)

phpcsfixer_dryrun: ## Run php cs fixer wuth dry run optoin
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

qa: ## Run code quality tools
qa: phpcsfixer
qa: phpstan
qa: typescript
qa: eslint
qa: prettier

phpunit: ## Run php unit tests, pass the parameter "p=" to launch tests on a specific path
	@$(eval p ?=)
	@$(PHP_UNIT) $(p)

jest: ## Run jest unit tests
	@$(DOCKER_COMP) exec pwa yarn test

jest_update: ## Run jest unit tests
	@$(DOCKER_COMP) exec pwa yarn test:update

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
generate_migration: c=doctrine:migrations:diff
generate_migration: sf

fixtures_load: ## Load fixtures (Delete DB and Elasticsearch data)
	@$(SYMFONY) elasticsuite:index:clear
	@$(SYMFONY) hautelook:fixtures:load
	@$(SYMFONY) doctrine:fixtures:load --append #Append argument used because the database is already reset by the previous command

fixtures_append: ## Append fixtures
	@$(SYMFONY) hautelook:fixtures:load --append
	@$(SYMFONY) doctrine:fixtures:load --append

index_clear: ## Delete all Elasticsearch indices
index_clear: c=elasticsuite:index:clear
index_clear: sf


.env:
ifeq (,$(wildcard ./env))
	touch .env
endif
	grep "UUID" .env || echo "UUID=$(shell id -u)" >> .env
	grep "GUID" .env || echo "GUID=$(shell id -g)" >> .env
