import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'
import { authService } from './services/authService'

// Setup axios default base URL
axios.defaults.baseURL = 'http://localhost:8080'

// Setup axios interceptor to add token to requests
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Setup axios interceptor for response errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout
      authService.logout()
    }
    return Promise.reject(error)
  },
)

const app = createApp(App)

// Global auth check - redirect to login if not authenticated
app.config.globalProperties.$authService = authService

app.use(router)
app.mount('#app')
