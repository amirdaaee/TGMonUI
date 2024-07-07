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
  //... 
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    baseURL: process.env.NUXT_AUTH_BASE_URL ? process.env.NUXT_AUTH_BASE_URL : "/auth",
    session: {
      enableRefreshPeriodically: false,
      enableRefreshOnWindowFocus: false,
    },
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "login" },
        getSession: { path: "session" },
      },
      token: {
        maxAgeInSeconds: 60 * 24 * 365
      }
    },
  },
  // ...
  runtimeConfig: {
    public: {
      baseApi: '/api',
      baseStream: '/stream',
    }
  }
  // ...

})