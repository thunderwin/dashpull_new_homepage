// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/i18n'
  ],
  

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/docs': { redirect: '/docs/getting-started', prerender: false },
    '/zh/docs': { redirect: '/zh/docs/getting-started', prerender: false },
    '/zh-Hant/docs': { redirect: '/zh-Hant/docs/getting-started', prerender: false }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/',
        '/docs'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // 构建优化
  build: {
    transpile: ['@nuxt/ui-pro']
  },

  // Vite 配置
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router']
          }
        }
      }
    },
    optimizeDeps: {
      exclude: ['chrome-extension']
    }
  },

  // SSR 配置
  ssr: true,

  runtimeConfig: {
    // Public keys (exposed to client-side)
    public: {
      strapiApiUrl: process.env.NODE_ENV === 'development' 
        ? (process.env.STRAPI_API_URL || 'http://localhost:1337')
        : 'https://api.dashpull.com',
      strapiApiToken: process.env.NODE_ENV === 'development'
        ? (process.env.STRAPI_API_TOKEN || 'development-token')
        : 'd500bca2021bcb781b01959a2b5c7eca35104ead14e5a1c7a113e1b77030a9d798e3d0ea3be290c20050d000ac5d7c6cc021e57eda01e40b3c545e2d8da2b6c4b75ead96fa5e3ac2cae31ae76de74415371a7928094e271535d1ef786a1f2216e745df26d4aacf85021f5b86c9f2fe92644a9fa5a1f9d63699e43340409661ff'
    }
  },
  i18n: {
    baseUrl: process.env.APP_URL || "https://www.dashpull.com",
    locales: [
      {
        code: "en",
        iso: "en-US",
        language: "en-US",
        name: "English",
        file: "en.json",
      },
      {
        code: "zh",
        iso: "zh-CN",
        language: "zh-CN",
        name: "简体中文",
        file: "zh.json",
      },
      {
        code: "zh-Hant",
        iso: "zh-Hant",
        language: "zh-Hant",
        name: "繁体中文",
        file: "zh-HK.json",
      },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
    langDir: "locales/",
  },
})
