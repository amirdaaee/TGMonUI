import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    typeCheck: false
  },
  //...
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    "@sidebase/nuxt-auth",
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        if (config.plugins) {
          config.plugins.push(vuetify({ autoImport: true }))
        }
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  // ...
  runtimeConfig: {
    public: {
      apiBase: '/api',
      streamBase: '/stream',
    }
  },
  // ...
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    baseURL: process.env.NUXT_AUTH_BASE ? process.env.NUXT_AUTH_BASE : "/auth",
    provider: {
      type: "local"
    }
  }
})