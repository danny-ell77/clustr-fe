import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"
import { defu } from "defu"

export interface ModuleOptions {
  features: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "property",
    configKey: "property",
    compatibility: {
      nuxt: "^3.0.0",
      modules: {
        core: ">=1.0.0",
      },
    },
  },
  defaults: {
    features: ["listings", "maintenance", "tenants"],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add property module plugin
    addPlugin(resolver.resolve("./runtime/plugins/property"))

    // Register routes for this module
    extendPages((pages) => {
      pages.push({
        name: "property-index",
        path: "/property",
        file: resolver.resolve("./pages/index.vue"),
        meta: {
          title: "Properties",
          description: "Manage your property portfolio",
        },
      })

      pages.push({
        name: "property-listings",
        path: "/property/listings",
        file: resolver.resolve("./pages/listings.vue"),
        meta: {
          title: "Property Listings",
          description: "View and manage property listings",
        },
      })

      pages.push({
        name: "property-maintenance",
        path: "/property/maintenance",
        file: resolver.resolve("./pages/maintenance.vue"),
        meta: {
          title: "Maintenance",
          description: "Track maintenance requests and schedules",
        },
      })

      pages.push({
        name: "property-tenants",
        path: "/property/tenants",
        file: resolver.resolve("./pages/tenants.vue"),
        meta: {
          title: "Tenants",
          description: "Manage tenant information and leases",
        },
      })
    })

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.property = defu(nuxt.options.runtimeConfig.public.property, {
      features: options.features,
    })
  },
})
