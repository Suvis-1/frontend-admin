<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Lessons ({{ lessons.length }})</h2>
      <button @click="openCreateModal" class="btn btn-primary">
        Add New Lesson
      </button>
    </div>

    <!-- CREATE / EDIT MODAL -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingLesson ? 'Edit' : 'Create' }} Lesson</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Topic</label>
                  <input v-model="form.topic" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Location</label>
                  <input v-model="form.location" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Price (£)</label>
                  <input v-model.number="form.price" type="number" min="0" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Available Spaces</label>
                  <input v-model.number="form.space" type="number" min="0" class="form-control" required />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Icon</label>
                
                <!-- Upload New Icon -->
                <div class="border rounded p-3 mb-3 bg-light">
                  <h6>Upload New Icon (.png only)</h6>
                  <input type="file" accept=".png" @change="handleFileUpload" class="form-control form-control-sm" />
                  <div v-if="uploadedFileName" class="mt-2 text-success small">
                    Uploaded: {{ uploadedFileName }}
                  </div>
                </div>

                <!-- Icon Selector -->
                <select v-model="form.icon" class="form-select mb-3">
                  <option v-for="icon in icons" :key="icon" :value="icon">
                    {{ icon }}
                  </option>
                </select>

                <!-- Live Preview -->
                <div v-if="form.icon" class="text-center">
                  <p class="mb-2 fw-bold">Preview:</p>
                  <img 
                    :src="getImageUrl(form.icon)"
                    alt="Icon preview"
                    class="img-thumbnail"
                    style="height: 100px; object-fit: contain;"
                    @error="form.icon = ''"
                  />
                  <p class="small mt-2 text-muted">{{ form.icon }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button @click="saveLesson" class="btn btn-success">
              {{ editingLesson ? 'Update' : 'Create' }} Lesson
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- LESSONS TABLE -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
    </div>

    <table v-else-if="lessons.length" class="table table-striped table-hover">
      <thead class="table-primary">
        <tr>
          <th>Icon</th>
          <th>Topic</th>
          <th>Location</th>
          <th>Price</th>
          <th>Spaces</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lesson in lessons" :key="lesson._id">
          <td>
            <img 
              :src="getImageUrl(lesson.icon)"
              style="height: 50px; object-fit: contain;"
              class="rounded"
              alt="lesson icon"
            />
          </td>
          <td class="fw-bold">{{ lesson.topic }}</td>
          <td>{{ lesson.location }}</td>
          <td>£{{ lesson.price }}</td>
          <td>{{ lesson.space }} / {{ lesson.totalSpace }}</td>
          <td>
            <button @click="editLesson(lesson)" class="btn btn-sm btn-warning me-2">Edit</button>
            <button @click="deleteLesson(lesson._id)" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="alert alert-info text-center">No lessons found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const API_BASE = import.meta.env.VITE_API_BASE

const lessons = ref([])
const icons = ref([])
const loading = ref(false)
const showModal = ref(false)
const editingLesson = ref(null)
const uploadedFileName = ref('')

const form = ref({
  topic: '',
  location: '',
  price: 0,
  space: 0,
  icon: ''
})

const auth = useAuthStore()


const getImageUrl = (filename) => {
  if (!filename) return '/placeholder.png'
  return `${API_BASE}/images/${filename}`
}

// Upload PNG icon
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (!file.name.toLowerCase().endsWith('.png')) {
    alert('Only .png files allowed!')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch(`${API_BASE}/icons`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${auth.token}` },
      body: formData
    })

    if (res.ok) {
      const data = await res.json()
      uploadedFileName.value = data.filename
      form.value.icon = data.filename
      await loadIcons()
      alert('Icon uploaded successfully!')
    }
  } catch (err) {
    alert('Upload failed')
  }
}

// Load data
const loadLessons = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/lessons`, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    if (res.ok) lessons.value = await res.json()
  } catch (err) { console.error(err) }
  finally { loading.value = false }
}

const loadIcons = async () => {
  try {
    const res = await fetch(`${API_BASE}/icons`)
    if (res.ok) icons.value = await res.json()
    if (icons.value.length > 0 && !form.value.icon) {
      form.value.icon = icons.value[0]
    }
  } catch (err) { console.error(err) }
}

// CRUD
const openCreateModal = () => {
  editingLesson.value = null
  form.value = { topic: '', location: '', price: 0, space: 0, icon: icons.value[0] || '' }
  uploadedFileName.value = ''
  showModal.value = true
}

const editLesson = (lesson) => {
  editingLesson.value = lesson
  form.value = { ...lesson }
  uploadedFileName.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveLesson = async () => {
  if (!form.value.topic || !form.value.location || !form.value.icon) {
    alert('Please fill all fields')
    return
  }

  const url = editingLesson.value
    ? `${API_BASE}/lessons/${editingLesson.value._id}`
    : `${API_BASE}/lessons`

  const method = editingLesson.value ? 'PUT' : 'POST'

  await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form.value)
  })

  closeModal()
  loadLessons()
}

const deleteLesson = async (id) => {
  if (!confirm('Delete this lesson permanently?')) return
  await fetch(`${API_BASE}/lessons/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${auth.token}` }
  })
  loadLessons()
}

onMounted(() => {
  loadLessons()
  loadIcons()
})
</script>

<style scoped>
.modal { 
  position: fixed; 
  top: 0; left: 0; 
  width: 100%; height: 100%; 
  z-index: 1050; 
}
.img-thumbnail { background: #f8f9fa; }
</style>