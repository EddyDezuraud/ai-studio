// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [['@nuxtjs/google-fonts', {
    families: {
      Inter: [400, 500, 600, 700, 800, 900],
    }
   }],
  ],
  css: [
    '~/assets/css/reset.css',
    '~/assets/css/variables.css',
    '~/assets/css/app.css',
  ],
})
