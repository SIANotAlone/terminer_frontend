import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MyReactionView from '../views/MyReactionView.vue'
import PerformerTerminView from '../views/PerformerTerminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/Sign-inView.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/Sign-upView.vue'),
    },
    {
      path: '/service/available',
      name: 'available',
      component: () => import('../views/AvailableView.vue'),
    },
    {
      path: '/service/create',
      name: 'create',
      component: () => import('../views/CreateView.vue'),
    },
    {
      path: '/service/performerservices',
      name: 'performer',
      component: PerformerTerminView,
    },
    {
      path: '/service/myreactions',
      name: 'my',
      component: MyReactionView,
    }
  ],
})

export default router
