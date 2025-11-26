<template>
  <div class="creator">
    <h3>Create New Lesson</h3>
    <form @submit.prevent="create">
      <label>
        Topic:
        <input v-model="form.topic" required />
      </label>
      <label>
        Location:
        <input v-model="form.location" required />
      </label>
      <label>
        Price:
        <input type="number" v-model.number="form.price" min="0" required />
      </label>
      <label>
        Spaces:
        <input type="number" v-model.number="form.space" min="0" required />
      </label>

      <!-- Icon selection -->
      <label>
        Choose Icon:
        <select v-model="form.icon">
          <option v-for="icon in icons" :key="icon" :value="icon">
            {{ icon }}
          </option>
          <option value="__upload">Upload new...</option>
        </select>
      </label>

      <!-- Preview -->
      <div v-if="form.icon && form.icon !== '__upload'">
        <img :src="`${API_BASE}/icons/${form.icon}`" 
             :alt="form.icon" width="64" height="64" />
      </div>

      <!-- Upload new icon -->
      <div v-if="form.icon === '__upload'">
        <input type="file" @change="onFileChange" ref="fileInput" />
      </div>

      <button type="submit">Add Lesson</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { API_BASE, createLesson, fetchIcons, uploadIcon } from '../api.js'
import { useAdminStore } from '../store'
import { toast } from "vue3-toastify";

const form = reactive({
  topic: '',
  location: '',
  price: 0,
  space: 0,
  icon: ''
})

const icons = ref([])
let uploadedFile = null
const fileInput = ref(null)
const store = useAdminStore()
const emit = defineEmits(['created'])

// Load icons on mount
onMounted(async () => {
  try {
    icons.value = await fetchIcons()
    if (icons.value.length) form.icon = icons.value[0]
  } catch (err) {
    console.error(err)
    toast.error('Failed to load icons')
  }
})

function onFileChange(e) {
  uploadedFile = e.target.files[0]
}

async function create() {
  let iconName = form.icon

  try {
    // If uploading new icon
    if (form.icon === '__upload' && uploadedFile) {
      const data = await uploadIcon(uploadedFile)
      iconName = data.filename
      uploadedFile = null
      fileInput.value.value = '' // reset input
      icons.value.push(iconName) // add new icon to list
    }

    // Basic validation
    if (!form.topic.trim() || !form.location.trim()) {
      return toast.error('Topic and location are required')
    }
    if (form.price < 0 || form.space < 0) {
      return toast.error('Price and spaces must be non‑negative')
    }

    const payload = {
      topic: form.topic,
      location: form.location,
      price: form.price,
      space: form.space,
      icon: iconName,
      totalSpace: form.space
    }

    await createLesson(payload)
    toast.success(`Lesson "${form.topic}" created!`)
    emit('created', payload)

    // Reset form
    Object.assign(form, { topic: '', location: '', price: 0, space: 0, icon: icons.value[0] || '' })

    // Refresh lessons in store
    await store.fetchLessons()
  } catch (err) {
    console.error(err)
    toast.error('Failed to create lesson')
  }
}
</script>

<style scoped>
.creator form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.creator label {
  display: flex;
  flex-direction: column;
}
.creator img {
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
