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
