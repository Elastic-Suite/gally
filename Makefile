# Executables (local)
DOCKER_COMP = docker-compose

# Docker containers
PHP_CONT = $(DOCKER_COMP) exec php
PHP_DATABASE = $(DOCKER_COMP) exec database

# Executables
PHP       = $(PHP_CONT) php
COMPOSER  = $(PHP_CONT) composer
SYMFONY   = $(PHP_CONT) bin/console
PHP_UNIT  = $(PHP_CONT) bin/phpunit

# Misc
.DEFAULT_GOAL = help
.PHONY        = help build up start down logs sh composer vendor sf cc

## —— 🎵 🐳 The Symfony-docker Makefile 🐳 🎵 ——————————————————————————————————
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
build: ## Builds the Docker images
	@$(DOCKER_COMP) build --pull --no-cache

up: ## Start the docker hub in detached mode (no logs)
	@$(DOCKER_COMP) up --detach

start: build up ## Build and start the containers

down: ## Stop the docker hub
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

phpunit: ## Run php unit tests
	@$(PHP_UNIT)

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
