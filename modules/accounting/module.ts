import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"
import { defu } from "defu"

export interface ModuleOptions {
  features: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "accounting",
    configKey: "accounting",
    compatibility: {
      nuxt: "^3.0.0",
      modules: {
        core: ">=1.0.0",
      },
    },
  },
  defaults: {
    features: ["invoices", "payments", "reports"],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add accounting module plugin
    addPlugin(resolver.resolve("./runtime/plugins/accounting"))

    // Register routes for this module
    extendPages((pages) => {
      pages.push({
        name: "accounting-index",
        path: "/accounting",
        file: resolver.resolve("./pages/index.vue"),
        meta: {
          title: "Accounting",
          description: "Manage financial operations",
        },
      })

      pages.push({
        name: "accounting-invoices",
        path: "/accounting/invoices",
        file: resolver.resolve("./pages/invoices.vue"),
        meta: {
          title: "Invoices",
          description: "Manage invoices and billing",
        },
      })

      pages.push({
        name: "accounting-payments",
        path: "/accounting/payments",
        file: resolver.resolve("./pages/payments.vue"),
        meta: {
          title: "Payments",
          description: "Track incoming and outgoing payments",
        },
      })

      pages.push({
        name: "accounting-reports",
        path: "/accounting/reports",
        file: resolver.resolve("./pages/reports.vue"),
        meta: {
          title: "Reports",
          description: "Generate financial reports",
        },
      })
    })

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.accounting = defu(nuxt.options.runtimeConfig.public.accounting, {
      features: options.features,
    })
  },
})
