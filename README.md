# JWT Authentication & Todo List App

A comprehensive authentication system using JSON Web Tokens (JWT) with a beautiful, modern UI and a full-featured todo list management system.

## Features

### Authentication
- 🔐 JWT-based authentication
- 📧 Email/password login and registration
- 🛡️ Protected routes with middleware
- 💾 Token persistence in localStorage
- 🎨 Modern, responsive UI
- 🔄 Automatic token validation

### Todo List Management
- ✅ Create, read, update, and delete tasks
- 🏷️ Priority levels (High, Medium, Low) with color coding
- 📅 Due date support with overdue warnings
- 🔍 Search and filter functionality
- 📊 Real-time statistics dashboard
- 📱 Fully responsive design
- 🎯 Task completion tracking
- 🔄 Real-time updates

## How JWT Works in This App

### 1. **Token Generation**
When a user logs in successfully, the server generates a JWT token containing:
- User ID
- Email
- Expiration time (1 hour)

### 2. **Token Storage**
The JWT token is stored in the browser's localStorage for persistence across sessions.

### 3. **Token Validation**
- Every request to protected routes includes the token in the Authorization header
- The server validates the token using the secret key
- If valid, the user can access protected content

### 4. **Token Expiration**
Tokens expire after 1 hour for security. Users need to re-login after expiration.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to `http://localhost:3000`

## Default Credentials

For testing, you can use:
- **Email:** `user@example.com`
- **Password:** `password`

Or register a new account using the registration form.

## API Endpoints

### Authentication
- `POST /api/login` - Login with email/password
- `POST /api/register` - Register new user
- `POST /api/logout` - Logout (client-side token removal)

### Protected Routes
- `GET /api/profile` - Get user profile (requires valid JWT token)

### Todo Management
- `GET /api/todos` - Get all todos for authenticated user
- `GET /api/todos/:id` - Get single todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update existing todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion status
- `GET /api/todos/search` - Search and filter todos with query parameters

## JWT Implementation Details

### Backend (server.js)
- Uses `jsonwebtoken` library for token generation and verification
- Implements `authenticateToken` middleware for protecting routes
- Passwords are hashed using `bcryptjs`
- CORS enabled for cross-origin requests

### Frontend (public/index.html)
- `AuthManager` class handles all authentication logic
- Automatic token validation on page load
- Token included in Authorization header for protected requests
- Graceful error handling for expired/invalid tokens

### Security Features
- Passwords are hashed with bcrypt
- JWT tokens expire after 1 hour
- CORS protection
- Input validation
- Error handling for invalid credentials

## File Structure

```
├── server.js          # Express server with JWT authentication
├── config.js          # Configuration settings
├── package.json       # Dependencies and scripts
├── public/
│   └── index.html     # Frontend authentication page
└── README.md          # This file
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Modern CSS with gradients and animations

## How to Test the Application

### Authentication Testing
1. **Login** with the default credentials (`user@example.com` / `password`)
2. **Check Browser DevTools** → Application → Local Storage to see the stored JWT token
3. **Test Protected Route** by accessing the todo list (automatically loads after login)
4. **Verify Token Expiration** by waiting 1 hour or manually expiring the token
5. **Test Logout** to see token removal from localStorage

### Todo List Testing
1. **Create Tasks** - Click "Add New Task" to create tasks with different priorities and due dates
2. **Edit Tasks** - Click the edit button on any task to modify it
3. **Complete Tasks** - Click the complete button to mark tasks as done
4. **Delete Tasks** - Click the delete button to remove tasks
5. **Search & Filter** - Use the search box and filter dropdowns to find specific tasks
6. **Sort Tasks** - Use the sort dropdown to organize tasks by different criteria
7. **View Statistics** - Check the dashboard stats for task completion overview

The JWT token contains encoded user information and can be decoded (but not modified) using online JWT decoders to see its contents.

## Todo List Features

### Task Management
- **Title & Description**: Add detailed task information
- **Priority Levels**: High (red), Medium (yellow), Low (blue) with visual indicators
- **Due Dates**: Set deadlines with overdue warnings
- **Completion Status**: Mark tasks as complete/incomplete
- **Real-time Updates**: Changes reflect immediately

### Search & Filtering
- **Text Search**: Search by title or description
- **Status Filter**: Show all, pending, or completed tasks
- **Priority Filter**: Filter by priority level
- **Sorting Options**: Sort by creation date, due date, or priority

### Statistics Dashboard
- **Total Tasks**: Count of all tasks
- **Completed**: Number of finished tasks
- **Pending**: Number of incomplete tasks
- **Overdue**: Tasks past their due date
