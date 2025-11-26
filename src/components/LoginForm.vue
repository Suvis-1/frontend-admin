<template>
  <form @submit.prevent="login">
    <input v-model="user" placeholder="Username" />
    <input v-model="pass" type="password" placeholder="Password" />
    <button>Login</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login-success'])
const user = ref('')
const pass = ref('')
const error = ref('')

async function login() {
  error.value = ''
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.value, password: pass.value })
    })

    if (!res.ok) throw new Error('Invalid credentials')
    const data = await res.json()

    // Emit token back to Login.vue
    emit('login-success', data.token)
  } catch (err) {
    error.value = 'Login failed. Please check your credentials.'
  }
}
</script>
