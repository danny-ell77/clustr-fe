import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false, // Disable server-side rendering (SPA mode)
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/icon",
  ],

  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      "postcss-import": {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    dbUrl: process.env.DATABASE_URL || "",

    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.API_BASE || "http://localhost:8008/api/v1",
      appName: "ClustR",
    },
  },

  typescript: {
    strict: true,
  },

  imports: {
    dirs: ["composables/**", "utils/**"],
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components/ui",
      pathPrefix: false,
      global: true,
    },
  ],
});
