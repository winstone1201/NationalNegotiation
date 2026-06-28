import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页', transition: 'page' }
  },
  {
    path: '/intro/:caseId',
    name: 'Intro',
    component: () => import('@/views/IntroView.vue'),
    meta: { title: '谈判背景', transition: 'page' }
  },
  {
    path: '/negotiate/:caseId',
    name: 'Negotiation',
    component: () => import('@/views/NegotiationView.vue'),
    meta: { title: '谈判中', transition: 'fade' }
  },
  {
    path: '/result/:caseId',
    name: 'Result',
    component: () => import('@/views/ResultView.vue'),
    meta: { title: '谈判复盘', transition: 'page' }
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('@/views/QuizView.vue'),
    meta: { title: '知识测验', transition: 'page' }
  },
  {
    // 404 重定向到首页
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 全局路由守卫：更新页面标题
router.beforeEach((to) => {
  const baseTitle = '我正在砍救命药'
  document.title = to.meta.title
    ? `${to.meta.title} - ${baseTitle}`
    : baseTitle
})

export default router
