import { createRouter, createWebHistory } from 'vue-router'
import LayoutMain from '../views/layouts/layout-main.vue'
import login from '../views/login/login.vue'

// 获取所有路由文件
const routerModules = import.meta.glob('@/router/modules/*.js', { eager: true })
// 子路由
const mainRouterChildren = []

Object.keys(routerModules).forEach((key) => {
  mainRouterChildren.push(...routerModules[key].default)
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LayoutMain',
      component: LayoutMain,
      children: mainRouterChildren
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/:pachMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
