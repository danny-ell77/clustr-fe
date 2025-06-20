import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"
import { defu } from "defu"

export interface ModuleOptions {
  features: string[]
}

export default defineNuxtModule<ModuleOptions>({
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
  defaults: {
    features: ["chat", "meetings", "announcements"],
  },
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
          title: "Tenant Portal",
          description: "Communication and resources for tenants",
        },
      })

      pages.push({
        name: "portal-chat",
        path: "/portal/chat",
        file: resolver.resolve("./pages/chat.vue"),
        meta: {
          title: "Tenant Chat",
          description: "Communicate directly with tenants",
        },
      })

      pages.push({
        name: "portal-meetings",
        path: "/portal/meetings",
        file: resolver.resolve("./pages/meetings.vue"),
        meta: {
          title: "Tenant Meetings",
          description: "Schedule and manage meetings with tenants",
        },
      })
      // Add more portal-related pages here if needed
    })

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.portal = defu(nuxt.options.runtimeConfig.public.portal, {
      features: options.features,
    })
  },
})
