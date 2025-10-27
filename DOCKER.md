# Docker Setup for JWT Todo Application

This document describes the Docker Compose setup for the JWT authentication and todo list application.

## 🐳 **Docker Compose Files**

### **Development Environment**
- `docker-compose.yml` - Main development setup
- `docker-compose.test.yml` - Testing environment
- `docker-compose.prod.yml` - Production environment

## 🚀 **Quick Start**

### **1. Development Setup**
```bash
# Clone and setup
git clone <repository>
cd Mini_Project

# Copy environment file
cp env.example .env

# Start development environment
make start
```

### **2. Using Docker Compose Directly**
```bash
# Development
docker-compose up -d

# Testing
docker-compose -f docker-compose.test.yml up --build

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 **Available Services**

### **Development (docker-compose.yml)**
- **app**: Node.js application (port 3000)
- **redis**: Redis cache (port 6379)
- **postgres**: PostgreSQL database (port 5432)
- **nginx**: Reverse proxy (port 80)
- **prometheus**: Metrics collection (port 9090)
- **grafana**: Monitoring dashboard (port 3001)

### **Testing (docker-compose.test.yml)**
- **app-test**: Test application (port 3001)
- **postgres-test**: Test database
- **redis-test**: Test cache
- **test-runner**: Test execution
- **k6**: Performance testing
- **trivy**: Security scanning

### **Production (docker-compose.prod.yml)**
- **app**: Production application
- **postgres**: Production database
- **redis**: Production cache
- **nginx**: Production reverse proxy with SSL
- **fluentd**: Log aggregation
- **backup**: Automated backups

## 🛠️ **Makefile Commands**

### **Development**
```bash
make help          # Show all available commands
make build         # Build all images
make up            # Start development environment
make down          # Stop development environment
make logs          # Show logs from all services
make dev           # Start with hot reload
```

### **Testing**
```bash
make test              # Run all tests
make test-coverage     # Run tests with coverage
make test-performance  # Run performance tests
make test-security     # Run security tests
```

### **Production**
```bash
make prod         # Start production environment
make prod-down    # Stop production environment
make prod-logs    # Show production logs
```

### **Database**
```bash
make backup       # Backup database
make restore      # Restore database (FILE=backup.sql)
```

### **Monitoring**
```bash
make monitor      # Start monitoring stack
make health       # Check application health
make health-db    # Check database health
make health-redis # Check Redis health
```

### **Utilities**
```bash
make clean        # Clean up Docker resources
make clean-all    # Clean up all Docker resources
make shell        # Open shell in application container
make db-shell     # Open database shell
make redis-shell  # Open Redis shell
```

## 🔧 **Configuration**

### **Environment Variables**
Copy `env.example` to `.env` and configure:

```bash
# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here

# Database
DATABASE_URL=postgresql://todoapp:todoapp_password@postgres:5432/todoapp
POSTGRES_DB=todoapp
POSTGRES_USER=todoapp
POSTGRES_PASSWORD=todoapp_password

# Redis
REDIS_URL=redis://redis:6379
```

### **SSL Configuration (Production)**
Place SSL certificates in `nginx/ssl/`:
- `cert.pem` - SSL certificate
- `key.pem` - SSL private key

## 📊 **Monitoring & Observability**

### **Prometheus Metrics**
- Application metrics: `http://localhost:9090`
- Custom metrics endpoint: `/metrics`

### **Grafana Dashboard**
- URL: `http://localhost:3001`
- Default credentials: `admin/admin`

### **Health Checks**
- Application: `http://localhost:3000/health`
- Database: `make health-db`
- Redis: `make health-redis`

## 🔒 **Security Features**

### **Rate Limiting**
- API endpoints: 10 requests/second
- Login endpoint: 5 requests/minute
- Register endpoint: 2 requests/minute

### **Security Headers**
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (HTTPS)

### **SSL/TLS**
- TLS 1.2 and 1.3 support
- Modern cipher suites
- HSTS headers

## 🧪 **Testing**

### **Unit Tests**
```bash
make test
```

### **Integration Tests**
```bash
docker-compose -f docker-compose.test.yml up --build
```

### **Performance Tests**
```bash
make test-performance
```

### **Security Tests**
```bash
make test-security
```

## 📦 **CI/CD Integration**

### **GitHub Actions**
The repository includes GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs tests on every push/PR
- Builds Docker images
- Performs security scanning
- Deploys to production (on main branch)

### **Docker Registry**
Images are automatically built and pushed to GitHub Container Registry:
- Development: `ghcr.io/username/repo:develop`
- Production: `ghcr.io/username/repo:latest`

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Permission issues**: Check file permissions
3. **Database connection**: Verify DATABASE_URL
4. **SSL errors**: Check certificate paths

### **Debug Commands**
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f [service]

# Execute commands in container
docker-compose exec [service] [command]

# Restart specific service
docker-compose restart [service]
```

### **Cleanup**
```bash
# Remove all containers and volumes
make clean-all

# Remove only stopped containers
make clean
```

## 📈 **Performance Optimization**

### **Resource Limits**
Production containers have resource limits:
- App: 512MB RAM, 0.5 CPU
- Database: 1GB RAM, 1.0 CPU
- Redis: 256MB RAM, 0.25 CPU

### **Caching**
- Redis for session storage
- Nginx for static file caching
- Database connection pooling

### **Monitoring**
- Prometheus for metrics collection
- Grafana for visualization
- Health checks for reliability

## 🔄 **Backup & Recovery**

### **Automated Backups**
- Daily database backups
- 30-day retention policy
- Compressed backup files

### **Manual Backup**
```bash
make backup
```

### **Restore**
```bash
make restore FILE=backup_20231201_120000.sql
```

This Docker setup provides a complete, production-ready environment for the JWT authentication and todo list application with monitoring, security, and CI/CD capabilities.


