import '@/styles/normalize.css' // 统一浏览器的默认样式
import '@/styles/element-index.scss' // 重置element-ui变量
import '@/styles/element-reset.scss' // 重置element-ui css样式
import '@/styles/common.scss' // 全局公用样式

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
