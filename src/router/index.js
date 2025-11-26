import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from "jwt-decode"

// Views
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Lessons from '../views/Lessons.vue'
// import Orders from '../views/Orders.vue'
import Orders from '../components/OrdersTable.vue'
// import Icons from '../views/Icons.vue'
// import CreateLesson from '../views/CreateLesson.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: 'lessons', component: Lessons },
      { path: 'orders', component: Orders },
      // { path: 'icons', component: Icons },
      // { path: 'create', component: CreateLesson }
    ]
  },
  // Redirect root to login by default
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Helper checks if token exists and is still valid
function isTokenValid() {
  const token = localStorage.getItem('adminToken')
  if (!token) return false
  try {
    const decoded = jwtDecode(token)
    const now = Date.now() / 1000 // seconds
    return decoded.exp && decoded.exp > now
  } catch {
    return false
  }
}

// Auth guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!isTokenValid()) {
      localStorage.removeItem('adminToken')
      alert('Session expired, please log in again')
      return next('/login')
    }
  }
  next()
})

export default router
