import { defineNuxtConfig } from 'nuxt/config';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
  ignore: ['old/**/*'],
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          '@juggle/resize-observer'
        ]
        : ['@juggle/resize-observer']
  },
  modules: [
    // Simple usage
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // 自动引入 `defineStore()`
          'defineStore',
          // 自动引入 `defineStore()` 并重命名为 `definePiniaStore()`
          ['defineStore', 'definePiniaStore'],
        ],
      },
    ],
  ],
  components: [
    {
      // 果你想只根据组件的名称而不是路径自动导入组件，那么你需要使用配置对象的扩展形式将pathPrefix选项设置为false:
      path: '~/components/',
      pathPrefix: false,
    },
  ],
  vite: {
    plugins: [
      vueJsx()
    ],
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : []
    },
  }
});
