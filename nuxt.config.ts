import { defineNuxtConfig } from 'nuxt/config';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineNuxtConfig({
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          '@juggle/resize-observer'
        ]
        : ['@juggle/resize-observer'],

  },
  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.e2e.*',
    '**/*.d.ts',
    'old/**/*',
    'koa/**/*',
    'routes/**/*',
  ],
  nitro: {
    devProxy: {
      '/backend/': {
        target: 'http://127.0.0.1:9090/',
        prependPath: true,
        changeOrigin: true,
      }
    },
    // 该配置用于服务端请求转发
    routeRules: {
      '/backend/**': {
        proxy: 'http://127.0.0.1:9090/**'
      }
    }
  },
  modules: [
    // Simple usage
    // [
    //   '@nuxtjs/eslint-module',
    //   {
    //     lintOnStart: false,
    //     emitWarning: false,
    //   }
    // ],
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
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/devtools',
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
    esbuild: {
      jsxInject: 'import React from \'react\'',
    },
    css: {
      // 预处理器配置项
      preprocessorOptions: {
        less: {
          math: 'always',
        },
      },
    },
  },
  devServer: {
    port: 2333,
  },
});
