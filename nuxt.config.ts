import { defineNuxtConfig } from "nuxt"

export default defineNuxtConfig({
  modules: [
    // Core module must be loaded first
    "~/modules/core/module",

    // Feature modules - these will be conditionally loaded based on permissions
    "~/modules/property/module",
    "~/modules/accounting/module",
    "~/modules/security/module",
  ],

  // Module-specific configuration
  core: {
    debug: process.env.NODE_ENV !== "production",
    registry: {
      enabled: true,
      autoDiscover: true,
    },
  },

  property: {
    features: ["listings", "maintenance", "tenants"],
  },

  accounting: {
    features: ["invoices", "payments", "reports"],
  },

  security: {
    features: ["users", "roles", "logs"],
  },

  // CSS framework
  css: ["~/assets/css/main.css"],

  // Runtime configuration
  runtimeConfig: {
    // Private keys (server only)
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    dbUrl: process.env.DATABASE_URL || "",

    // Public keys (available client-side)
    public: {
      apiBase: process.env.API_BASE || "/api",
      appName: "Property Management System",
    },
  },

  // TypeScript configuration
  typescript: {
    strict: true,
  },
})
