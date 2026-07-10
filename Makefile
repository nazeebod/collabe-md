.DEFAULT_GOAL := help

VERSION ?=
TAG_PREFIX := v
REGISTRY ?= ghcr.io
GITHUB_OWNER ?= $(shell git remote get-url origin 2>/dev/null | sed -n 's#.*github.com[:/]\([^/]*\).*#\1#p' | tr '[:upper:]' '[:lower:]')
GITHUB_REPO ?= $(shell git remote get-url origin 2>/dev/null | sed -n 's#.*github.com[:/][^/]*/\([^/.]*\).*#\1#p' | tr '[:upper:]' '[:lower:]')
SERVER_IMAGE ?= $(REGISTRY)/$(GITHUB_OWNER)/collabe-md-server
WEB_IMAGE ?= $(REGISTRY)/$(GITHUB_OWNER)/collabe-md-web

.PHONY: help install build test test-e2e db-push dev \
        docker-build docker-up docker-down docker-smoke \
        release-check release release-push release-local

help: ## Show available targets
	@grep -E '^[a-zA-Z0-9_.-]+:.*##' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

build: ## Build all workspace packages
	pnpm build

test: ## Run unit and integration tests
	pnpm test

test-e2e: ## Run Playwright collaboration E2E
	pnpm --filter @collabe-md/web test:e2e

db-push: ## Apply database schema
	pnpm db:push

dev: ## Start web and server in dev mode
	pnpm dev

docker-build: ## Build local Docker images
	docker compose build

docker-up: ## Start full stack with Docker Compose
	docker compose up -d

docker-down: ## Stop Docker Compose stack
	docker compose down

docker-smoke: docker-up ## Smoke test local Docker deployment
	@echo "Waiting for services..."
	@sleep 8
	curl -fsS http://localhost:3001/api/health
	curl -fsS http://localhost:5173 | grep -q "Collabe MD"
	@echo "Smoke test passed"

release-check: ## Validate VERSION and git state before release
	@test -n "$(VERSION)" || (echo "VERSION is required, e.g. make release VERSION=1.0.0" && exit 1)
	@echo "$(VERSION)" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$$' || (echo "VERSION must be semver: X.Y.Z or X.Y.Z-rc.1" && exit 1)
	@test -z "$(shell git status --porcelain)" || (echo "Working tree must be clean before release" && exit 1)
	@branch=$$(git rev-parse --abbrev-ref HEAD); \
	case "$$branch" in main|master) ;; *) echo "Release tags must be created from main/master"; exit 1;; esac
	git fetch --tags
	@test -z "$(shell git tag -l '$(TAG_PREFIX)$(VERSION)')" || (echo "Tag $(TAG_PREFIX)$(VERSION) already exists" && exit 1)

release: release-check ## Create annotated git tag locally (does not push)
	git tag -a "$(TAG_PREFIX)$(VERSION)" -m "Release $(TAG_PREFIX)$(VERSION)"
	@echo "Created tag $(TAG_PREFIX)$(VERSION)"
	@echo "Run 'make release-push VERSION=$(VERSION)' to publish"

release-push: release-check ## Push release tag to origin (triggers GitHub Release workflow)
	@test -n "$(shell git tag -l '$(TAG_PREFIX)$(VERSION)')" || git tag -a "$(TAG_PREFIX)$(VERSION)" -m "Release $(TAG_PREFIX)$(VERSION)"
	git push origin "$(TAG_PREFIX)$(VERSION)"
	@echo "Pushed $(TAG_PREFIX)$(VERSION). GitHub Actions will build images and create the release."

release-local: release-check docker-build ## Build and tag local release images without pushing
	docker build -t "$(SERVER_IMAGE):$(VERSION)" -f apps/server/Dockerfile .
	docker build -t "$(WEB_IMAGE):$(VERSION)" -f apps/web/Dockerfile .
	@echo "Built local images:"
	@echo "  $(SERVER_IMAGE):$(VERSION)"
	@echo "  $(WEB_IMAGE):$(VERSION)"
