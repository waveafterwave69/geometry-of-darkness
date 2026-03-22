import './styles/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router/router'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App).use(MotionPlugin).use(pinia).use(router).mount('#app')
