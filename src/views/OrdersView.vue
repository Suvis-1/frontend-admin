<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Orders ({{ filteredOrders.length }})</h2>
      <input
        v-model="searchQuery"
        class="form-control w-25"
        placeholder="Search by order #, name, phone, notes..."
      />
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="alert alert-info text-center">
      No orders found.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-primary">
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Lessons</th>
            <th class="text-end">Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order._id">
            <td class="fw-bold text-primary">{{ order.orderNumber || '—' }}</td>
            <td class="small text-muted">{{ formatDate(order.createdAt) }}</td>
            <td class="fw-bold">{{ order.name }}</td>
            <td>{{ order.phone }}</td>
            <td>
              <div v-for="item in order.lessons" :key="item.lessonId || item.id" class="small">
                {{ getLessonName(item.lessonId || item.id) }} × {{ item.qty }}
              </div>
            </td>
            <td class="text-end fw-bold text-success">
              £{{ calculateTotal(order).toFixed(2) }}
            </td>
            <td>
              <span class="badge" :class="order.status === 'done' ? 'bg-success' : 'bg-warning text-dark'">
                {{ (order.status || 'pending').toUpperCase() }}
              </span>
            </td>
            <td>
              <button
                v-if="order.status !== 'done'"
                @click="markAsDone(order._id)"
                class="btn btn-sm btn-success"
                :disabled="marking"
              >
                <span v-if="marking">...</span>
                <span v-else>Done</span>
              </button>
              <small v-else class="text-success fw-bold">Completed</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Toast v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import Toast from '../components/Toast.vue'

const orders = ref([])
const lessons = ref([])
const searchQuery = ref('')
const loading = ref(false)
const marking = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

const auth = useAuthStore()

// ONE AND ONLY filteredOrders — client-side search
const filteredOrders = computed(() => {
  if (!searchQuery.value.trim()) return orders.value
  const q = searchQuery.value.toLowerCase()
  return orders.value.filter(order =>
    (order.orderNumber || '').toLowerCase().includes(q) ||
    (order.name || '').toLowerCase().includes(q) ||
    (order.phone || '').includes(q) ||
    (order.notes || '').toLowerCase().includes(q) ||
    order._id.toString().includes(q)
  )
})

// MARK AS DONE
const markAsDone = async (id) => {
  marking.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders/${id}/done`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })

    if (!res.ok) throw new Error('Failed')

    const order = orders.value.find(o => o._id === id)
    if (order) order.status = 'done'

    showToast('Order marked as done!', 'success')
  } catch (err) {
    showToast('Failed to update order', 'error')
  } finally {
    marking.value = false
  }
}

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLessonName = (lessonId) => {
  const lesson = lessons.value.find(l => l._id === lessonId)
  return lesson ? lesson.topic : 'Deleted Lesson'
}

const calculateTotal = (order) => {
  return order.lessons.reduce((total, item) => {
    const lesson = lessons.value.find(l => l._id === (item.lessonId || item.id))
    const price = lesson?.price || 0
    return total + price * item.qty
  }, 0)
}

const showToast = (msg, type = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => (toastMessage.value = ''), 4000)
}

// Load data
const loadLessons = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/lessons`)
    if (res.ok) lessons.value = await res.json()
  } catch (err) {
    console.error('Failed to load lessons')
  }
}

const loadOrders = async () => {
  if (!auth.isAuthenticated) return

  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders`, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })

    if (!res.ok) {
      if (res.status === 401) auth.logout()
      throw new Error()
    }

    orders.value = await res.json()
    showToast(`Loaded ${orders.value.length} orders`, 'success')
  } catch {
    showToast('Failed to load orders', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadLessons()
  await loadOrders()
})
</script>

<style scoped>
.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
.badge {
  font-size: 0.8em;
}
</style>