<template>
  <div class="orders">
    <h1>Orders</h1>
    <OrdersTable />
  </div>
</template>

<script setup>
import OrdersTable from '../components/OrdersTable.vue'
</script>

<style scoped>
.orders {
  padding: 1rem;
}
</style>
