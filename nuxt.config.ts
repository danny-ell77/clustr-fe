import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true, // Enable server-side rendering
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/icon",
  ],

  core: {
    debug: process.env.NODE_ENV !== "production",
  },

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
      apiBase: process.env.API_BASE || "http://localhost:8000/api/v1/",
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
