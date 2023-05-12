import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(mode, 'mode')
  return {
    envPrefix: 'VUE_',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/variables.scss' as *; @use '@/styles/mixin.scss' as *;`
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      // 自动按需导入ElementPlus组件
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.mjs', '.js', '.jsx', '.json', '.vue']
    }
  }
})
