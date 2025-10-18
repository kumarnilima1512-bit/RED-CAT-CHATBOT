// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,

    notionApiKey: process.env.NOTION_API_KEY,

    notionFaqDatabaseId: process.env.NOTION_FAQ_DATABASE_ID,

    notionServicesDatabaseId: process.env.NOTION_SERVICES_DATABASE_ID,

    notionCompanyInfoDatabaseId: process.env.NOTION_COMPANY_INFO_DATABASE_ID,
    
     public: {
      // Public keys (client-side accessible)
      // Add any public config here
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
  compatibilityDate: '2025-07-15',

})
