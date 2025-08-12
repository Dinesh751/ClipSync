// Mock API service for testing authentication
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123' // In real app, this would be hashed
  },
  {
    id: 2,
    name: 'Jane Smith', 
    email: 'jane@example.com',
    password: 'password123'
  }
];

// Mock authentication service
export const authAPI = {
  // Login user
  login: async (email, password) => {
    await delay(1000); // Simulate API call delay
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Generate mock JWT token
    const token = btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  },

  // Register new user
  signup: async (name, email, password) => {
    await delay(1500); // Simulate API call delay
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password
    };
    
    mockUsers.push(newUser);
    
    // Generate mock JWT token
    const token = btoa(JSON.stringify({ 
      userId: newUser.id, 
      email: newUser.email,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      token
    };
  },

  // Verify token
  verifyToken: async (token) => {
    await delay(500);
    
    try {
      const decoded = JSON.parse(atob(token));
      
      // Check if token is expired
      if (decoded.exp < Date.now()) {
        throw new Error('Token expired');
      }
      
      const user = mockUsers.find(u => u.id === decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Logout (client-side only for now)
  logout: async () => {
    await delay(300);
    return { success: true };
  }
};

export default authAPI;
