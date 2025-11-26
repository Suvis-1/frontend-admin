<template>
  <div class="editor">
    <h3>Edit Lesson</h3>
    <form @submit.prevent="save">
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
        <input type="number" v-model.number="form.price" required />
      </label>
      <label>
        Spaces:
        <input type="number" v-model.number="form.space" required />
      </label>

      <button type="submit">Save</button>
      <button type="button" @click="emit('cancel')">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useAdminStore } from '../store'
import { toast } from "vue3-toastify";

const props = defineProps({
  lesson: { type: Object, required: true }
})
const emit = defineEmits(['saved', 'cancel'])
const store = useAdminStore()

// local reactive copy of lesson
const form = reactive({ ...props.lesson })

// keep form in sync if prop changes
watch(
  () => props.lesson,
  (newLesson) => {
    Object.assign(form, newLesson)
  },
  { deep: true }
)

async function save() {
  try {
    await store.updateLesson(props.lesson._id, form)
    toast.success(`Lesson "${form.topic}" updated successfully!`)
    emit('saved', { ...form })
  } catch (err) {
    console.error(err)
    toast.error('Failed to update lesson')
  }
}
</script>

<style scoped>
.editor {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  margin-left: 0.5rem;
}
button {
  margin-right: 0.5rem;
}
</style>
