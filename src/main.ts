import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router/router'
import { MotionPlugin } from '@vueuse/motion'

createApp(App).use(MotionPlugin).use(router).mount('#app')
