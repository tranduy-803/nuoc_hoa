import Product from '@/view/Product.vue'
import Brands from '@/view/Brands.vue'
import Login from '@/view/Login.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { authService } from '../services/authService'

const listHeader = [
  {
    path: '/',
    redirect: '/login', // Redirect to login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Product, // Placeholder
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
  },
  {
    path: '/san-pham',
    name: 'SanPham',
    component: Product,
  },
  {
    path: '/brands',
    name: 'Brands',
    component: Brands,
  },
  {
    path: '/thuong-hieu',
    name: 'ThuongHieu',
    component: Brands,
  },
  {
    path: '/bill',
    name: 'Bill',
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes: listHeader,
})

// Navigation guard for authentication - ALL routes except /login require authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  // Define public routes that don't require authentication
  const publicPaths = ['/login']

  const isPublicRoute = publicPaths.includes(to.path)

  // If trying to access public route (login) but already authenticated, redirect to products
  if (isPublicRoute && isAuthenticated) {
    next('/san-pham')
  }
  // If trying to access any non-public route without authentication, redirect to login
  else if (!isPublicRoute && !isAuthenticated) {
    next('/login')
  }
  // Otherwise, allow navigation
  else {
    next()
  }
})

export default router
