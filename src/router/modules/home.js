/* 首页路由配置 */
import Home from '@/views/dashboard/v-dashboard.vue'

export const homeRouter = [
  /* 首页 */
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    }
  }
]
export default homeRouter
