import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"

export default defineNuxtModule({
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
  defaults: {},
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
          title: "Accounts",
          description: "Financial management and accounting",
        },
      })

      pages.push({
        name: "accounting-payment",
        path: "/accounting/payment",
        file: resolver.resolve("./pages/payment.vue"),
        meta: {
          title: "Payment",
          description: "Manage payments and transactions",
        },
      })

      pages.push({
        name: "accounting-ewallet",
        path: "/accounting/ewallet",
        file: resolver.resolve("./pages/ewallet.vue"),
        meta: {
          title: "E-wallet",
          description: "Digital wallet management",
        },
      })
    })
  },
})
