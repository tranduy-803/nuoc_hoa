import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

// Setup axios interceptor để thêm token vào mọi request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle response errors (401 = unauthorized)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const authService = {
  // Login
  async login(credentials) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials)
    return response.data
  },

  // Register
  async register(userData) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData)
    return response.data
  },

  // Get current user
  getCurrentUser() {
    const userJson = localStorage.getItem('user')
    return userJson ? JSON.parse(userJson) : null
  },

  // Get token
  getToken() {
    return localStorage.getItem('token')
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  // Check if user has role
  hasRole(role) {
    const user = this.getCurrentUser()
    return user?.role === role
  },

  // Check if user is admin
  isAdmin() {
    return this.hasRole('ADMIN')
  },

  // Check if user is staff
  isStaff() {
    return this.hasRole('STAFF')
  },

  // Logout
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    window.location.href = '/login'
  },

  // Set token after login
  setToken(token) {
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  // Set user after login
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  },
}
