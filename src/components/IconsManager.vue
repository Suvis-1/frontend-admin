<template>
  <div class="icons-manager">
    <h3>Icons</h3>

    <!-- Icon List -->
    <ul>
      <li v-for="icon in icons" :key="icon">
        <img :src="`${API_BASE}/icons/${icon}`" :alt="icon" width="48" height="48" />
        <span>{{ icon }}</span>
      </li>
    </ul>

    <!-- Upload Section -->
    <h4>Upload New Icon</h4>
    <input type="file" @change="onFileChange" ref="fileInput" />
    <button @click="upload">Upload</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE, fetchIcons, uploadIcon } from '../api.js'
import { toast } from "vue3-toastify";

const icons = ref([])
let file = null
const fileInput = ref(null)
const emit = defineEmits(['uploaded'])

// Load icons on mount
onMounted(async () => {
  try {
    icons.value = await fetchIcons()
  } catch (err) {
    console.error(err)
    toast.error('Failed to load icons')
  }
})

// Handle file selection
function onFileChange(e) {
  file = e.target.files[0]
}

// Upload new icon
async function upload() {
  if (!file) return toast.error('Choose a file first')
  try {
    const data = await uploadIcon(file)
    toast.success('Icon uploaded!')
    emit('uploaded', data.filename)

    // Refresh list from backend to stay in sync
    icons.value = await fetchIcons()

    // Reset file input
    file = null
    fileInput.value.value = ''
  } catch (err) {
    console.error(err)
    toast.error('Upload failed')
  }
}
</script>

<style scoped>
.icons-manager ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
  list-style: none;
}
.icons-manager li {
  text-align: center;
}
.icons-manager img {
  display: block;
  margin: 0 auto 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
