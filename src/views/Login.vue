<template>
  <section>
    <h2>Admin Login</h2>
    <LoginForm @login-success="handleLoginSuccess" />
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'

const router = useRouter()

function handleLoginSuccess(token) {
  // Save token in localStorage
  localStorage.setItem('adminToken', token)
  // Redirect to dashboard
  router.push('/dashboard')
}
</script>
