import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MyReactionView from '../views/MyReactionView.vue'
import PerformerTerminView from '../views/PerformerTerminView.vue'
import PromocodeView from '../views/PromocodeView.vue'
import MyActualComments from '../views/MyAllCommentsView.vue'
import StatisticView from '@/views/StatisticView.vue'
import BudgetView from '@/views/budget/BudgetView.vue'
import CategoryView from '@/views/budget/CategoryView.vue'
import GoalsView from '@/views/budget/GoalsView.vue'
import TransactionsView from '@/views/budget/TransactionsView.vue'
import BudgetSettingsView from '@/views/budget/BudgetSettingsView.vue'

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
      path: '/service/edit/:uuid',
      name: 'edit',
      component: () => import('../views/EditView.vue'),
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
    },
    {
      path: '/service/promocode',
      name: 'promocode',
      component: PromocodeView,
    },
    {
      path: '/comments',
      name: 'myallcomments',
      component: MyActualComments,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticView,
    },
    {
      path: '/budgets',
      name: 'budget',
      component: BudgetView,
    },
     {
      path: '/categories',
      name: 'category',
      component: CategoryView,
    },
    {
      path: '/goals',
      name: 'goal',
      component: GoalsView,
    },
        {
      path: '/transactions/:budgetId',
      name: 'transaction',
      component: TransactionsView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: BudgetSettingsView,
    },
    
  ],
})

export default router
