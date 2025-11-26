<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Admin</h2>
      <ul>
        <li><router-link to="/dashboard/lessons">Lessons</router-link></li>
        <li><router-link to="/dashboard/create">Create Lesson</router-link></li>
        <li><router-link to="/dashboard/orders">Orders</router-link></li>
        <li><router-link to="/dashboard/icons">Icons</router-link></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <header class="header">
        <h1>Admin Dashboard</h1>
        <button @click="logout">Logout</button>
      </header>
      <section class="view">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  // Clear token
  localStorage.removeItem('adminToken')
  // Redirect to login route
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

/* Sidebar styling */
.sidebar {
  width: 200px;
  background: #2c3e50;
  color: #fff;
  padding: 1rem;
}
.sidebar h2 {
  margin-bottom: 1rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 0.5rem;
}
.sidebar a {
  color: #fff;
  text-decoration: none;
  display: block;
}
.sidebar a.router-link-active {
  background: #34495e;
  font-weight: bold;
}

/* Main content styling */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f4f6f8;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}
.view {
  flex: 1;
  padding: 2rem;
}
</style>
