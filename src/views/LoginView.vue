<template>
  <div class="login-wrapper">
    <!-- Animated background blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <div class="login-card animate__animated animate__fadeInUp animate__faster">
      <!-- Logo + Title -->
      <div class="text-center mb-5">
        <div class="logo-shield mb-4">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <h2 class="fw-bold text-dark mb-2">Admin Portal</h2>
        <p class="text-muted opacity-80">Sign in to manage your dashboard</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login">
        <div class="form-group mb-4">
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder=" "
            required
            autocomplete="username"
          />
          <label>Username</label>
          <i class="bi bi-person input-icon"></i>
        </div>

        <div class="form-group mb-4">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            placeholder=" "
            required
            autocomplete="current-password"
          />
          <label>Password</label>
          <i class="bi bi-lock input-icon"></i>
          <button
            type="button"
            class="btn-eye"
            @click="togglePassword"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkmark"></span>
            Remember me
          </label>
          <a href="#" class="text-decoration-none small fw-medium text-primary">Forgot password?</a>
        </div>

        <button
          type="submit"
          class="btn-login w-100"
          :disabled="!username || !password || loading"
        >
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>

      <Toast v-if="toastMessage" :message="toastMessage" :type="toastType" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Toast from '../components/Toast.vue'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const router = useRouter()
const auth = useAuthStore()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const showToast = (msg, type = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => (toastMessage.value = ''), 4000)
}

const login = async () => {
  if (!username.value || !password.value || loading.value) return
  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()

    if (data.token) {
      auth.setToken(data.token)
      if (!rememberMe.value) {
        window.addEventListener('beforeunload', () => localStorage.removeItem('adminToken'))
      }
      showToast('Welcome back! Redirecting...', 'success')
      setTimeout(() => router.push('/orders'), 800)
    } else {
      showToast(data.message || 'Invalid credentials', 'error')
    }
  } catch (err) {
    showToast('Network error. Please try again.', 'error')
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
@import 'animate.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

/* Animated floating blobs */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
}
.blob-1 { width: 500px; height: 500px; background: #a78bfa; top: -10%; left: -10%; animation-delay: 0s; }
.blob-2 { width: 600px; height: 600px; background: #60a5fa; bottom: -15%; right: -10%; animation-delay: 7s; }
.blob-3 { width: 400px; height: 400px; background: #34d399; top: 20%; right: 10%; animation-delay: 14s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-60px) rotate(5deg); }
}

/* Card */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

/* Logo */
.logo-shield {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  color: white;
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4);
}

/* Custom floating label inputs */
.form-group {
  width: 100%;
  position: relative;
  margin-bottom: 1.5rem;
}
.form-control {
  width: 100%;
  padding: 1.1rem 1rem 0.4rem 2.8rem;
  font-size: 1rem;
  border: 1.5px solid transparent;
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.045);
  transition: all 0.3s ease;
}
.form-control:focus {
  outline: none;
  background: white;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
}
.form-group label {
  position: absolute;
  top: 1rem;
  left: 2.9rem;
  font-size: 1rem;
  color: #888;
  pointer-events: none;
  transition: all 0.25s ease;
  transform-origin: left;
}
.form-control:focus ~ label,
.form-control:not(:placeholder-shown) ~ label {
  top: 0.5rem;
  left: 2.9rem;
  font-size: 0.75rem;
  color: #8b5cf6;
  font-weight: 600;
}
.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.1rem;
  pointer-events: none;
}
.btn-eye {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  font-size: 1.1rem;
  cursor: pointer;
}

/* Custom checkbox */
.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #555;
  cursor: pointer;
}
.checkbox-container input {
  opacity: 0;
  width: 0;
  height: 0;
}
.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  margin-right: 10px;
  transition: all 0.2s;
  position: relative;
}
.checkbox-container input:checked ~ .checkmark {
  background: #8b5cf6;
  border-color: #8b5cf6;
}
.checkmark:after {
  content: "✓";
  position: absolute;
  color: white;
  font-weight: bold;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s;
}
.checkbox-container input:checked ~ .checkmark:after {
  transform: translate(-50%, -50%) scale(1);
}

/* Sign in button */
.btn-login {
  width: 100%;
  height: 56px;
  margin-top: 10px;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.btn-login:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
}
.btn-login:disabled {
  opacity: 0.7;
  transform: none;
  cursor: not-allowed;
}
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 10px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>