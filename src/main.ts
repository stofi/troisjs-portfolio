import './assets/tailwind.css'

import { createApp } from 'vue'

import App from './App.vue'
import configureRouter from './router'

const app = createApp(App)
const router = configureRouter()

app.use(router)

app.mount('#app')
