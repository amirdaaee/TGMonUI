import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    routeRules: {
      [process.env.NUXT_PUBLIC_BASE_API + "/**" || ""]: { proxy: { to: process.env.BASE_API_PROXY + "/**", fetchOptions: { cache: "force-cache" } } },
      [process.env.NUXT_PUBLIC_BASE_STREAM + "/**" || ""]: { proxy: process.env.BASE_STREAM_PROXY + "/**" },
      [process.env.NUXT_PUBLIC_BASE_THUMB + "/**" || ""]: { proxy: process.env.BASE_THUMB_PROXY + "/**" },
    }
  },
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
    // ...(process.env.NODE_ENV !== 'production' ? ['@nuxt-alt/proxy'] : []),
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
    public: {
      baseApi: '/api',
      baseStream: '/stream',
      baseThumb: '/tgmon-thumb',
    },
    baseAuth: ''
  },
  // ...
})