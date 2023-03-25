import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import { AuthType } from '@/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
      props: { authType: AuthType.login }
    },
    {
      path: '/register',
      name: 'register',
      component: AuthView,
      props: { authType: AuthType.register }
    },
  ]
})

export default router
