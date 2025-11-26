<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Lessons</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="o in orders" :key="o._id">
        <td>{{ o.name }}</td>
        <td>{{ o.phone }}</td>
        <td>{{ o.lessons.length }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const store = useAdminStore()
const { orders } = storeToRefs(store)

onMounted(() => {
  store.fetchOrders()
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
th {
  background: #f4f4f4;
}
</style>
