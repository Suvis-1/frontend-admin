// src/stores/auth.js
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,        // ← Start as null (we load it in router)
    user: null
  }),

  getters: {
    isAuthenticated: (state) => {
      if (!state.token) return false
      try {
        const decoded = jwtDecode(state.token)
        return decoded.exp > Date.now() / 1000
      } catch {
        return false
      }
    },
    username: (state) => state.user || 'Admin'
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('adminToken', token)
      try {
        const decoded = jwtDecode(token)
        this.user = decoded.user
      } catch {
        this.logout()
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('adminToken')
    }
  }
})