<!-- src/App.vue -->
<template>
  <div class="app-wrapper">
    <!-- Loading state while checking auth -->
    <div v-if="!isReady" class="loading-screen">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Checking session...</p>
    </div>

    <!-- Auth checked — show correct layout -->
    <div v-else>
      <!-- LOGGED IN: Full dashboard with fixed sidebar -->
      <template v-if="isLoggedIn">
        <!-- Top Navbar -->
        <nav class="navbar navbar-dark bg-primary shadow-sm fixed-top">
          <div class="container-fluid">
            <span class="navbar-brand fw-bold mb-0">Admin Dashboard</span>
            <span class="text-light small">Welcome, {{ auth.username }}</span>
          </div>
        </nav>

        <!-- Sidebar + Main Content -->
        <div class="d-flex">
          <!-- Fixed Sidebar -->
          <div class="sidebar bg-dark text-white vh-100 position-fixed start-0 top-0 pt-5" style="width: 260px; margin-top: 56px; z-index: 1000;">
            <div class="p-4">
              <ul class="nav flex-column gap-2">
                <li class="nav-item">
                  <router-link to="/orders" class="nav-link text-white d-flex align-items-center gap-3 px-3 py-2 rounded">
                    <i class="bi bi-cart4 fs-5"></i> Orders
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/lessons" class="nav-link text-white d-flex align-items-center gap-3 px-3 py-2 rounded">
                    <i class="bi bi-book fs-5"></i> Lessons
                  </router-link>
                </li>
                <hr class="text-white-50 my-4">
                <li class="nav-item mt-auto">
                  <button @click="logout" class="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-box-arrow-right"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Main Content Area (with left margin so it doesn't hide under sidebar) -->
          <div class="main-content">
            <div class="content-area">
              <router-view />
            </div>
          </div>
        </div>
      </template>

      <!-- NOT LOGGED IN: Show login page (full screen) -->
      <router-view v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// Reactive flags
const isReady = ref(false)
const isLoggedIn = computed(() => auth.isAuthenticated)

// Wait for router guard to load token from localStorage
onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 150) // 150ms is enough for the router guard to run
})

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Loading screen */
.loading-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: white;
}

/* Main content — pushes everything right of sidebar */
.main-content {
  margin-left: 260px;
  margin-top: 56px; /* height of navbar */
  min-height: calc(100vh - 56px);
  transition: margin-left 0.3s ease;
}

.content-area {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100%;
}

/* Active & hover states for sidebar */
.sidebar .nav-link {
  transition: all 0.2s;
}
.sidebar .nav-link:hover,
.router-link-active {
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 8px;
}

/* Smooth scroll */
* {
  scroll-behavior: smooth;
}
</style>