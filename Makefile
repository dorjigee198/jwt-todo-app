# Docker Compose Management Makefile

.PHONY: help build up down logs clean test prod test-prod backup restore

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
build: ## Build all Docker images
	docker-compose build

up: ## Start development environment
	docker-compose up -d

down: ## Stop development environment
	docker-compose down

logs: ## Show logs from all services
	docker-compose logs -f

logs-app: ## Show logs from application only
	docker-compose logs -f app

# Testing commands
test: ## Run tests
	docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
	docker-compose -f docker-compose.test.yml down

test-coverage: ## Run tests with coverage
	docker-compose -f docker-compose.test.yml run --rm test-runner

test-performance: ## Run performance tests
	docker-compose -f docker-compose.test.yml run --rm k6

test-security: ## Run security tests
	docker-compose -f docker-compose.test.yml run --rm trivy

# Production commands
prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production environment
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## Show production logs
	docker-compose -f docker-compose.prod.yml logs -f

# Database commands
backup: ## Backup database
	docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U todoapp todoapp > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore: ## Restore database (usage: make restore FILE=backup.sql)
	docker-compose -f docker-compose.prod.yml exec -T postgres psql -U todoapp todoapp < $(FILE)

# Monitoring commands
monitor: ## Start monitoring stack
	docker-compose up -d prometheus grafana

monitor-logs: ## Show monitoring logs
	docker-compose logs -f prometheus grafana

# Utility commands
clean: ## Clean up Docker resources
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

clean-all: ## Clean up all Docker resources
	docker-compose down -v --rmi all
	docker system prune -af
	docker volume prune -f

# Health checks
health: ## Check application health
	curl -f http://localhost:3000/health || exit 1

health-db: ## Check database health
	docker-compose exec postgres pg_isready -U todoapp

health-redis: ## Check Redis health
	docker-compose exec redis redis-cli ping

# Development helpers
dev: ## Start development with hot reload
	docker-compose up --build

shell: ## Open shell in application container
	docker-compose exec app sh

db-shell: ## Open database shell
	docker-compose exec postgres psql -U todoapp todoapp

redis-shell: ## Open Redis shell
	docker-compose exec redis redis-cli

# Environment setup
setup: ## Initial setup
	cp env.example .env
	@echo "Please edit .env file with your configuration"
	@echo "Then run: make build && make up"

# Quick start
start: build up ## Quick start (build and up)
	@echo "Application is starting..."
	@echo "Access the application at: http://localhost:3000"
	@echo "Access Grafana at: http://localhost:3001"
	@echo "Access Prometheus at: http://localhost:9090"


