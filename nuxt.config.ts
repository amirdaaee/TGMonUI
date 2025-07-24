import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  typescript: {
    typeCheck: false
  },

  //...
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@vueuse/nuxt',
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
    disableInternalRouting: true,
    disableServerSideAuth: false,
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "local",
      token: {
        maxAgeInSeconds: 365 * 24 * 60 * 60,
        signInResponseTokenPointer: "/Token"
      },
      endpoints: {
        signIn: { path: "/login/" },
        getSession: { path: "/session/" }
      },
    },
  },
  // ...
  runtimeConfig: {
    public: {
      baseApi: '/api',
      baseThumb: '/thumb',
      baseStream: '/stream',
    },
  },
  // ...
})