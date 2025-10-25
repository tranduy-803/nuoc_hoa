import Product from '@/view/Product.vue'
import Brands from '@/view/Brands.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const listHeader = [
  {
    path: '/',
    redirect: '/product', // Tự động chuyển hướng khi vào root
  },
  {
    path: '/home',
    name: 'Home',
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
  },
  {
    path: '/brands',
    name: 'Brands',
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

export default router
