import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

import 'animate.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css' 

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)



app.mount('#app')