import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/styles.css'

// Import vue3-toastify
import Toast from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// Create Vue app
const app = createApp(App)

// Register plugins
app.use(router)
app.use(createPinia())
app.use(Toast, { autoClose: 3000 }) 

// Mount to #app in index.html
app.mount('#app')
