<template>
  <transition name="fade">
    <div v-if="visible" class="toast-container" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  type: { type: String, default: 'success' }, // success | error | info
  duration: { type: Number, default: 3000 }
})

const visible = ref(true)

watch(() => props.message, () => {
  visible.value = true
  setTimeout(() => (visible.value = false), props.duration)
})
</script>

<style>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
}
.toast-container.success { background-color: #28a745; }
.toast-container.error { background-color: #dc3545; }
.toast-container.info { background-color: #17a2b8; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
