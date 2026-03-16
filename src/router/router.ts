import PromoPage from '@/pages/PromoPage.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [{ path: '/', component: PromoPage }]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
