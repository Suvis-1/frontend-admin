<template>
  <div>
    <table v-if="lessons.length">
      <thead>
        <tr>
          <th>Topic</th>
          <th>Location</th>
          <th>Spaces</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in lessons" :key="l._id">
          <td>{{ l.topic }}</td>
          <td>{{ l.location }}</td>
          <td>{{ l.space }}</td>
          <td>
            <button @click="selected = l" class="edit-btn">Edit</button>
            <button @click="remove(l._id)" class="delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No lessons available.</p>

    <LessonEditor
      v-if="selected"
      :lesson="selected"
      @saved="onSaved"
      @cancel="selected = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../store'
import { storeToRefs } from 'pinia'
import { toast } from "vue3-toastify";
import LessonEditor from './LessonEditor.vue'

const store = useAdminStore()
const { lessons } = storeToRefs(store)  
const selected = ref(null)

onMounted(() => store.fetchLessons())

// Expose refresh for parent
const refresh = () => store.fetchLessons()
defineExpose({ refresh })

async function onSaved(updatedLesson) {
  selected.value = null
  toast.success(`Lesson "${updatedLesson.topic}" updated successfully!`)
  await store.fetchLessons()
}

async function remove(id) {
  if (confirm('Are you sure you want to permanently delete this lesson?')) {
    try {
      await store.deleteLesson(id)
      toast.success('Lesson deleted!')
      await store.fetchLessons()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete lesson')
    }
  }
}
</script>

<style scoped>
table { width: 100%; border-collapse: collapse; margin: 2rem 0; }
th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
th { background-color: #f9f9f9; }
.edit-btn, .delete-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}
.edit-btn {
  background: #007bff;
  color: white;
}
.edit-btn:hover { background: #0056b3; }
.delete-btn {
  background: #dc3545;
  color: white;
}
.delete-btn:hover { background: #a71d2a; }
</style>
