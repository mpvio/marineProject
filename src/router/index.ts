import { createRouter, createWebHistory } from 'vue-router'
import VueInformationView from '../views/VueInformationView.vue'
import GoogleMapsView from '../views/GoogleMapsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Map',
      component: GoogleMapsView,
    },
    {
      path: '/vueInfo',
      name: 'Vue',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: VueInformationView,
    },
  ],
})

export default router
