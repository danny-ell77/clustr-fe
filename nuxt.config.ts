import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: [
    // Core module must be loaded first
    "~/modules/core/module",

    // Tailwind CSS module
    "@nuxtjs/tailwindcss",
    // shadcn-vue module
    "shadcn-nuxt",

    // Feature modules
    "~/modules/property/module",
    "~/modules/security/module",
    "~/modules/shift/module",
    "~/modules/portal/module",
  ],

  // shadcn-vue configuration
  // shadcn: {
  //   prefix: "",
  //   componentDir: "./components/ui",
  // },

  // Module-specific configuration
  core: {
    debug: process.env.NODE_ENV !== "production",
  },

  // CSS framework
  css: ["~/assets/css/main.css"],

  // PostCSS configuration
  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (server only)
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    dbUrl: process.env.DATABASE_URL || "",

    // Public keys (available client-side)
    public: {
      apiBase: process.env.API_BASE || "http://localhost:3000/api",
      appName: "ClustR",
    },
  },

  // TypeScript configuration
  typescript: {
    strict: true,
  },

  // Auto-imports configuration
  imports: {
    dirs: ['composables/**', 'utils/**']
  },
});
