import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '../components/pages/IndexPage.vue'
import HelpPage from '../components/pages/HelpPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: IndexPage },
    { path: '/help', component: HelpPage },
  ],
})

export default router
