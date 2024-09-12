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
    disableServerSideAuth: false,
    provider: {
      type: "local",
      token: {
        maxAgeInSeconds: 365 * 24 * 60 * 60
      }
    },
  },
  // ...
  runtimeConfig: {
    baseAuth: '',
    public: {
      baseApi: '',
      baseStream: '',
      baseThumb: '',
    }
  }
  // ...

})