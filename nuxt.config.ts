// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  css: [
    '~/assets/css/main.scss',
    '~/assets/css/variables-css.scss',
  ],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/content',
    '@pinia/nuxt'
  ],

  icon: {
    serverBundle: {
      collections: ['material-symbols']
    }
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
  },

  fonts: {
    families: [
      {
        name: 'DM Sans',
        provider: 'google',
        weights: ['400', '500', '700'],
        styles: ['normal', 'italic'],
        subsets: ['latin', 'latin-ext']
      },
      {
        name: 'Monoton',
        provider: 'google',
        weights: ['400'],
        styles: ['normal'],
        subsets: ['latin']
      },
    ]
  }
})