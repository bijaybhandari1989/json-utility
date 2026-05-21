// https://nuxt.com/docs/api/configuration/nuxt-config
import { JSON_LD, SITE } from './app/constants/site'

const ogImage = `${SITE.url}${SITE.ogImage}`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/color-mode', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: SITE.name,
      titleTemplate: '%s — Format JSON & JWT tools',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: SITE.description },
        { name: 'keywords', content: SITE.keywords },
        { name: 'author', content: SITE.author },
        { name: 'application-name', content: SITE.name },
        { name: 'theme-color', content: '#4f46e5' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'googlebot', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:title', content: `${SITE.name} — Format JSON & JWT online` },
        { property: 'og:description', content: SITE.description },
        { property: 'og:url', content: SITE.url },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:alt', content: `${SITE.name} app icon` },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: `${SITE.name} — Format JSON & JWT online` },
        { name: 'twitter:description', content: SITE.description },
        { name: 'twitter:image', content: ogImage },
        { name: 'twitter:image:alt', content: `${SITE.name} app icon` },
      ],
      link: [
        { rel: 'canonical', href: SITE.url },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'me', href: SITE.github },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(JSON_LD),
        },
      ],
    },
  },
})
