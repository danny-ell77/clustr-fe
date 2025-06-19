import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"
import { defu } from "defu"

export interface ModuleOptions {
  features: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "shift",
    configKey: "shift",
    compatibility: {
      nuxt: "^3.0.0",
      modules: {
        core: ">=1.0.0",
      },
    },
  },
  defaults: {
    features: ["scheduling", "logging", "tasks"],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add shift module plugin
    addPlugin(resolver.resolve("./runtime/plugins/shift"))

    // Register routes for this module
    extendPages((pages) => {
      pages.push({
        name: "shift-index",
        path: "/shift",
        file: resolver.resolve("./pages/index.vue"),
        meta: {
          title: "Shift Management",
          description: "Manage shifts and schedules",
        },
      })
      // Add more shift-related pages here if needed
    })

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.shift = defu(nuxt.options.runtimeConfig.public.shift, {
      features: options.features,
    })
  },
})
