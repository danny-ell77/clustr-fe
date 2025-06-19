import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"

export default defineNuxtModule({
  meta: {
    name: "portal",
    configKey: "portal",
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

    // Add portal module plugin
    addPlugin(resolver.resolve("./runtime/plugins/portal"))

    // Register routes for this module
    extendPages((pages) => {
      pages.push({
        name: "portal-index",
        path: "/portal",
        file: resolver.resolve("./pages/index.vue"),
        meta: {
          title: "Self Portal",
          description: "Resident self-service portal",
        },
      })

      pages.push({
        name: "portal-chat",
        path: "/portal/chat",
        file: resolver.resolve("./pages/chat.vue"),
        meta: {
          title: "Chat",
          description: "Community chat and messaging",
        },
      })

      pages.push({
        name: "portal-meetings",
        path: "/portal/meetings",
        file: resolver.resolve("./pages/meetings.vue"),
        meta: {
          title: "Virtual Meeting",
          description: "Schedule and join virtual meetings",
        },
      })
    })
  },
})
