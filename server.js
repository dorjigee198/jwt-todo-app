const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory user storage (in production, use a database)
const users = [
  {
    id: 1,
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: "password"
  }
];

// In-memory todo storage (in production, use a database)
const todos = [
  {
    id: 1,
    userId: 1,
    title: 'Welcome to your Todo List!',
    description: 'This is your first task. You can edit, complete, or delete it.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let nextTodoId = 2;

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

// Logout endpoint (client-side token removal)
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Register endpoint (for demo purposes)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// TODO API Endpoints

// Get all todos for authenticated user
app.get('/api/todos', authenticateToken, (req, res) => {
  try {
    const userTodos = todos.filter(todo => todo.userId === req.user.id);
    res.json(userTodos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single todo by ID
app.get('/api/todos/:id', authenticateToken, (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId && t.userId === req.user.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new todo
app.post('/api/todos', authenticateToken, (req, res) => {
  try {
    const { title, description, priority = 'medium', dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTodo = {
      id: nextTodoId++,
      userId: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update todo
app.put('/api/todos/:id', authenticateToken, (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === todoId && t.userId === req.user.id);
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const { title, description, completed, priority, dueDate } = req.body;
    const todo = todos[todoIndex];

    // Update fields if provided
    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = Boolean(completed);
    if (priority !== undefined && ['low', 'medium', 'high'].includes(priority)) {
      todo.priority = priority;
    }
    if (dueDate !== undefined) {
      todo.dueDate = dueDate ? new Date(dueDate) : null;
    }
    
    todo.updatedAt = new Date();
    todos[todoIndex] = todo;

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete todo
app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === todoId && t.userId === req.user.id);
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Toggle todo completion status
app.patch('/api/todos/:id/toggle', authenticateToken, (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === todoId && t.userId === req.user.id);
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    todos[todoIndex].updatedAt = new Date();

    res.json(todos[todoIndex]);
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get todos with filtering and search
app.get('/api/todos/search', authenticateToken, (req, res) => {
  try {
    const { q, status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    let userTodos = todos.filter(todo => todo.userId === req.user.id);

    // Search by title or description
    if (q) {
      const searchTerm = q.toLowerCase();
      userTodos = userTodos.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by completion status
    if (status === 'completed') {
      userTodos = userTodos.filter(todo => todo.completed);
    } else if (status === 'pending') {
      userTodos = userTodos.filter(todo => !todo.completed);
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      userTodos = userTodos.filter(todo => todo.priority === priority);
    }

    // Sort todos
    userTodos.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'dueDate') {
        aValue = aValue ? new Date(aValue) : new Date('9999-12-31');
        bValue = bValue ? new Date(bValue) : new Date('9999-12-31');
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    res.json(userTodos);
  } catch (error) {
    console.error('Search todos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
