import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/pages/PageHome.vue') },
  { path: '/about', name: 'about', component: () => import('@/pages/PageAbout.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/pages/PageContact.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
