import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true, // Enable server-side rendering
  modules: [// Core module must be loaded first
    "~/modules/core/module", // Tailwind CSS module
    "@nuxtjs/tailwindcss", // shadcn-vue module
    "shadcn-nuxt", // Icon module
    "@nuxt/icon", // Feature modules
    "~/modules/property/module",
    "~/modules/security/module",
    "~/modules/shift/module",
    "~/modules/portal/module",
    "~/modules/accounting/module"
  ],

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
    dirs: ["composables/**", "utils/**"],
  },

  // Auto-import components configuration
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components/ui",
      pathPrefix: false,
      global: true,
      extensions: ['.vue'],
    },
    // Individual UI component folders
    {
      path: "~/components/ui/avatar",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/badge",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/button",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/card",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/dropdown-menu",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/input",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/label",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/select",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/separator",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/table",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/ui/tabs",
      pathPrefix: false,
      global: true,
    },
  ],
});
