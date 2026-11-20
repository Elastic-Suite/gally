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

up-cron: .env ## Start the docker hub in detached mode (no logs) with cron profile
	@CRON_UPSTREAM=cron $(DOCKER_COMP) --profile cron up --detach --force-recreate varnish cron

start: build up ## Build and start the containers

down: .env ## Stop the docker hub
	@$(DOCKER_COMP) down --remove-orphans

down-cron: .env ## Stop the docker hub with cron profile
	@$(DOCKER_COMP) --profile cron down --remove-orphans

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

init-dev-env: .env ## Initialize current environment with dev repositories and the AI skills, pass "without-ai-skills=1" or set WITHOUT_AI_SKILLS=1 in .env to skip the skills, example: make init-dev-env without-ai-skills=1
	$(DOCKER_COMP) run --rm --entrypoint="rm -rf nodes_modules/gally* pwa/node_modules/gally* example-app/node_modules/gally*" pwa
	[ -d api/packages/gally-standard ] || git clone git@github.com:Elastic-Suite/gally-standard.git api/packages/gally-standard
	[ -d api/packages/gally-premium ] || git clone git@github.com:Elastic-Suite/gally-premium.git api/packages/gally-premium
	[ -d api/packages/gally-sample-data ] || git clone git@github.com:Elastic-Suite/gally-sample-data.git api/packages/gally-sample-data
	[ -d front/gally-admin ] || git clone git@github.com:Elastic-Suite/gally-admin.git front/gally-admin
	$(MAKE) start
	$(MAKE) switch-dev-env
	cd front && yarn install --frozen-lockfile --network-timeout 120000 && cd -
	sh ./hooks/initHooksPath.sh
	$(MAKE) ai-skills

switch-dev-env: ## Switch current environment with dev repositories on a composer version, pass the parameter "v=" to set the composer version, example: make switch-dev-env v=2.3.0
	@$(eval v ?= dev-main)
	$(DOCKER_COMP) up -d --wait php # Wait php container to be ready
	$(COMPOSER) config repositories.gally-standard '{ "type": "path", "url": "./packages/gally-standard", "options": { "versions": { "gally/gally-standard": "$(v)"}} }'
	$(COMPOSER) config repositories.gally-premium '{ "type": "path", "url": "./packages/gally-premium", "options": { "versions": { "gally/gally-premium": "$(v)"}} }'
	$(COMPOSER) config repositories.gally-sample-data '{ "type": "path", "url": "./packages/gally-sample-data", "options": { "versions": { "gally/gally-sample-data": "$(v)"}} }'
	$(COMPOSER) remove gally/gally-premium gally/gally-sample-data gally/gally-standard --no-scripts
	$(COMPOSER) require gally/gally-standard $(v) --no-scripts
	$(COMPOSER) require gally/gally-premium $(v) --no-scripts
	$(COMPOSER) require gally/gally-sample-data $(v)
	$(DOCKER_COMP) restart pwa router # Remount the sample-data media, which only exists in vendor/ once switch-dev-env has run; router looks up pwa's IP again

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

node_modules_clear: ## Remove all node_modules folders in front workspaces (useful when switching branch leaves them inconsistent)
	@find front -name node_modules -type d -prune -print -exec rm -rf {} +

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

e2e: ## Run e2e tests or pass the parameter "f=" to filters tests and "t=" to run only certain tags, example: make e2e f=login t=standard
	@echo "\033[33m⚠️  E2E tests expect a clean application state. If you have modified your configuration and the tests fail, run 'make fixtures_load'\033[0m"
	@$(eval f ?=)
	@$(eval t ?=)
	@$(DOCKER_COMP) exec e2e yarn test $(f) $(if $(t),--grep $(t))

jest_update: ## Run jest unit tests
	@$(DOCKER_COMP) exec pwa yarn test:update

test_sdk: ## Run SDK integration and unit tests
	@$(DOCKER_COMP) exec pwa yarn test:sdk

varnish_flush: ## Flush varnish cache
	@$(DOCKER_COMP) exec varnish varnishadm 'ban req.url ~ .'

.env:
	@echo "UUID=$(shell id -u)" >> .env
	@echo "GUID=$(shell id -g)" >> .env

## —— Symfony 🎵 ———————————————————————————————————————————————————————————————
sf: ## List all Symfony commands or pass the parameter "c=" to run a given command, example: make sf c=about
	@$(eval c ?=)
	@$(SYMFONY) $(c)

cc: ## Clear the cache
	@$(SYMFONY) cache:clear

migrate: ## Run symfony migration
migrate: c=doctrine:migrations:migrate -n --allow-no-migration
migrate: sf

generate_migration: ## Generate symfony migration
generate_migration: c=doctrine:migrations:diff --namespace 'DoctrineMigrations'
generate_migration: sf

consume_messages: ## Consume messages from message provider, pass the parameter "r=" to consume a specific receiver, example: make consume_messages r=async
	@$(eval r ?=)
	@$(SYMFONY) messenger:consume $(if $(r),$(r),--all) -vv

# Without catalogs=, the GALLY_SAMPLE_DATA_CATALOGS value of the running php container applies
fixtures_load: ## Load fixtures (Delete DB and Elasticsearch data). "catalogs=" loads only some sample data catalogs, comma separated, no spaces: make fixtures_load catalogs=default,01_fashion
	@$(eval catalogs ?=)
	@$(eval SYMFONY_FIXTURES := $(DOCKER_COMP) exec $(if $(catalogs),-e GALLY_SAMPLE_DATA_CATALOGS=$(catalogs),) php php -d memory_limit=384M bin/console)
	@CATALOGS="$(catalogs)"; \
	if [ -z "$$CATALOGS" ]; then CATALOGS=$$($(DOCKER_COMP_EXEC) exec -T php printenv GALLY_SAMPLE_DATA_CATALOGS 2>/dev/null || true); fi; \
	echo "📦 Following catalogs will be deployed: $${CATALOGS:-all}"
	@read -p "⚠️  This will ERASE your database. Are you sure? (y/N) " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		$(SYMFONY) doctrine:database:drop --force; \
		$(SYMFONY) gally:index:clear --with-data-streams --with-transforms --no-interaction; \
		$(SYMFONY) doctrine:database:create; \
		$(MAKE) migrate; \
		$(SYMFONY) list gally --raw | grep gally:vector-search:upload-model && $(SYMFONY) gally:vector-search:upload-model || true; \
		$(SYMFONY_FIXTURES) cache:clear; \
		$(SYMFONY_FIXTURES) hautelook:fixtures:load --no-interaction --append; \
		$(SYMFONY_FIXTURES) doctrine:fixtures:load --no-interaction --append; \
		$(MAKE) varnish_flush; \
	fi

index_clear: ## Delete all Elasticsearch indices and data streams
index_clear: c=gally:index:clear --with-data-streams --with-transforms
index_clear: sf

## —— AI tools 🤖 ——————————————————————————————————————————————————————————————
AI_SKILLS_REPO ?= git@github.com:Elastic-Suite/gally-ai-tools.git

# Folders that get one link per skill: .claude/skills for Claude Code, .agents/skills for Codex, Cursor, Gemini CLI,
# Copilot, OpenCode and others. Add an agent's own folder (two levels deep, like .windsurf/skills) on the command line or in .env.
AI_SKILLS_DIRS ?= .claude/skills .agents/skills

# Skip the AI skills: WITHOUT_AI_SKILLS=1 in .env or the shell, or without-ai-skills=1 on the command line. Use it when the
# skills are installed once for all checkouts from a separate clone (make install there). 0, false and no count as not set.
without-ai-skills ?= $(WITHOUT_AI_SKILLS)

# The repo is cloned into ai-tools/ (gitignored, like api/packages/*) and each skill is linked into every AI_SKILLS_DIRS folder.
# Edits in ai-tools/ apply directly. A branch switch, a pull or a rebase there relinks by itself: ai-tools uses the hooks
# in hooks/ai-tools/. Run it by hand after git clean -x here, or git reset --hard or git cherry-pick in ai-tools/, which
# fire none of them.
# Clones with the same SSH key as this checkout (core.sshCommand), unless GIT_SSH_COMMAND is already set.
ai-skills: ## Clone the Gally AI skills into ai-tools/ (private repo) and link them into .claude/skills and .agents/skills, branch switches, pulls and rebases in ai-tools/ relink by themselves, pass "without-ai-skills=1" or set WITHOUT_AI_SKILLS=1 in .env to skip
ifeq ($(filter-out 0 false no,$(without-ai-skills)),)
	@[ -d ai-tools ] || GIT_SSH_COMMAND="$${GIT_SSH_COMMAND:-$$(git config --get core.sshCommand || echo ssh)}" git clone $(AI_SKILLS_REPO) ai-tools
	@git -C ai-tools config core.hooksPath ../hooks/ai-tools
	@for dir in $(AI_SKILLS_DIRS); do \
		mkdir -p "$$dir"; \
		for link in "$$dir"/*; do \
			if [ -L "$$link" ] && [ ! -e "$$link" ] && readlink "$$link" | grep -q '^\.\./\.\./ai-tools/'; then \
				rm "$$link"; echo "Removed $$link (no longer in ai-tools)"; \
			fi; \
		done; \
		for skill in ai-tools/skills/*/; do \
			name=$$(basename "$$skill"); target=$$dir/$$name; \
			[ -f "$$skill/SKILL.md" ] || continue; \
			if grep -qE '^\s*internal: true' "$$skill/SKILL.md"; then [ -L "$$target" ] && rm "$$target"; continue; fi; \
			if [ -e "$$target" ] && [ ! -L "$$target" ]; then echo "Skipped $$target: a real folder is in the way"; continue; fi; \
			ln -sfn "../../ai-tools/skills/$$name" "$$target"; \
		done; \
	done
	@echo "AI skills linked from ai-tools ($$(git -C ai-tools rev-parse --abbrev-ref HEAD)) into $(AI_SKILLS_DIRS):" $$(ls $(firstword $(AI_SKILLS_DIRS)))
else
	@echo "Skipping the AI skills (without-ai-skills or WITHOUT_AI_SKILLS is set)"
endif
