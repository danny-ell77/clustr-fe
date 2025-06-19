import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"

export default defineNuxtModule({
  meta: {
    name: "security",
    configKey: "security",
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

    // Add security module plugin
    addPlugin(resolver.resolve("./runtime/plugins/security"))

    // Register routes for this module
    extendPages((pages) => {
      pages.push({
        name: "security-index",
        path: "/security",
        file: resolver.resolve("./pages/index.vue"),
        meta: {
          title: "Access Control",
          description: "Manage users, roles, and permissions",
        },
      })

      pages.push({
        name: "security-users",
        path: "/security/users",
        file: resolver.resolve("./pages/users.vue"),
        meta: {
          title: "Users",
          description: "Manage system users",
        },
      })

      pages.push({
        name: "security-roles",
        path: "/security/roles",
        file: resolver.resolve("./pages/roles.vue"),
        meta: {
          title: "Roles & Permissions",
          description: "Configure roles and permissions",
        },
      })
    })
  },
})
