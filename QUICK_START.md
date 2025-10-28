# 🚀 Quick Start Guide

## **Method 1: Run Locally (Fastest)**

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Start the Server**
```bash
npm start
```

### **Step 3: Access the Application**
- **URL**: http://localhost:3000
- **Default Login**: 
  - Email: `user@example.com`
  - Password: `password`

---

## **Method 2: Run with Docker (Recommended)**

### **Quick Start with Makefile**
```bash
# Setup and start
make start

# Or step by step:
make build
make up
```

### **Or Use Docker Compose Directly**
```bash
# Development environment
docker-compose up -d

# Production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

---

## **Method 3: Run with npm dev (Auto-restart)**
```bash
npm run dev
```

---

## 📋 **All Available Commands**

### **Local Development**
```bash
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with auto-restart
```

### **Docker Commands (using Makefile)**
```bash
make help           # Show all commands
make build          # Build images
make up             # Start containers
make down           # Stop containers
make logs           # View logs
make dev            # Development mode
make clean          # Clean up
```

### **Docker Commands (directly)**
```bash
docker-compose up -d                 # Start development
docker-compose down                  # Stop development
docker-compose logs -f app          # View app logs
docker-compose restart app          # Restart app
docker-compose ps                   # Check status
```

---

## 🌐 **Access Points**

Once running, you can access:

- **Application**: http://localhost:3000
- **Grafana Dashboard**: http://localhost:3001 (if monitoring is enabled)
- **Prometheus Metrics**: http://localhost:9090 (if monitoring is enabled)

---

## 🔑 **Login Credentials**

### **Default User**
- **Email**: user@example.com
- **Password**: password

### **Register New User**
1. Click "Don't have an account? Register"
2. Enter email and password
3. Click "Register"
4. Login with your new credentials

---

## 📝 **Features Available**

### **Authentication**
- ✅ Login with email/password
- ✅ Register new users
- ✅ JWT token-based authentication
- ✅ Secure password hashing

### **Todo List**
- ✅ Add tasks with title, description, priority, due date
- ✅ Edit, delete, and mark tasks as complete
- ✅ Search and filter tasks
- ✅ View statistics dashboard
- ✅ Sort by various criteria

---

## 🐛 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill the process using port 3000
# Windows PowerShell:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
npm start
```

### **Docker Issues**
```bash
# Check if containers are running
docker-compose ps

# View container logs
docker-compose logs -f

# Rebuild containers
docker-compose down
docker-compose up --build -d
```

### **Database Connection Issues**
```bash
# Check if database is running (Docker)
docker-compose ps postgres

# Restart database
docker-compose restart postgres
```

---

## 📚 **Next Steps**

1. **Login** to the application
2. **Create your first todo** by clicking "Add New Task"
3. **Explore features** like filtering, sorting, and statistics
4. **Test JWT** by checking browser DevTools → Application → Local Storage

---

## 🔧 **Development Tips**

### **Check Server Status**
```bash
# Local
curl http://localhost:3000/health

# Docker
docker-compose exec app curl http://localhost:3000/health
```

### **View Logs**
```bash
# Local
# Logs appear in terminal

# Docker
docker-compose logs -f app
```

### **Reset Everything**
```bash
# Local
# Stop server (Ctrl+C) and delete node_modules if needed

# Docker
docker-compose down -v
docker-compose up --build
```

---

## ✨ **That's It!**

Your JWT Authentication & Todo List application is now running! 🎉

**Repository**: https://github.com/dorjigee198/jwt-todo-app

Enjoy building and managing your todos!

