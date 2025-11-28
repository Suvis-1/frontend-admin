// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import OrdersView from '../views/OrdersView.vue'
import LessonsView from '../views/LessonsView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/orders', component: OrdersView, meta: { requiresAuth: true } },
  { path: '/lessons', component: LessonsView, meta: { requiresAuth: true } },
  { path: '/', redirect: '/orders' },
  { path: '/:pathMatch(.*)*', redirect: '/orders' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// THIS IS THE ONE THAT NEVER FAILS
let isAuthChecked = false

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // First time only: force load token from localStorage
  if (!isAuthChecked) {
    const savedToken = localStorage.getItem('adminToken')
    if (savedToken) {
      try {
        const { jwtDecode } = await import('jwt-decode')
        const decoded = jwtDecode(savedToken)
        if (decoded.exp && decoded.exp > Date.now() / 1000) {
          auth.token = savedToken
          auth.user = decoded.user
        } else {
          localStorage.removeItem('adminToken')
        }
      } catch (err) {
        console.error('Invalid saved token:', err)
        localStorage.removeItem('adminToken')
      }
    }
    isAuthChecked = true
  }

  // Now do normal routing
  if (to.path === '/login' && auth.isAuthenticated) {
    next('/orders')
  } else if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router