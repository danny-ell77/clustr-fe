import { defineNuxtModule, extendPages, createResolver, addPlugin } from "@nuxt/kit"

export default defineNuxtModule({
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
  defaults: {},
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
          description: "Manage staff shifts and schedules",
        },
      })

      pages.push({
        name: "shift-log",
        path: "/shift/log",
        file: resolver.resolve("./pages/log.vue"),
        meta: {
          title: "Shift Log",
          description: "View shift history and logs",
        },
      })

      pages.push({
        name: "shift-create",
        path: "/shift/create",
        file: resolver.resolve("./pages/create.vue"),
        meta: {
          title: "Create New Shift",
          description: "Create new shift schedules",
        },
      })

      pages.push({
        name: "shift-tasks",
        path: "/shift/tasks",
        file: resolver.resolve("./pages/tasks.vue"),
        meta: {
          title: "Task Management",
          description: "Manage shift tasks and assignments",
        },
      })
    })
  },
})
