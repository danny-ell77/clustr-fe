import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from "@nuxt/kit"
import { defu } from "defu"

export interface ModuleOptions {
  debug: boolean
  registry: {
    enabled: boolean
    autoDiscover: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "core",
    configKey: "core",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  defaults: {
    debug: false,
    registry: {
      enabled: true,
      autoDiscover: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add core plugins
    addPlugin(resolver.resolve("./runtime/plugins/plugin-registry"))
    addPlugin(resolver.resolve("./runtime/plugins/auth"))

    // Add composables
    addImports([
      {
        name: "usePluginRegistry",
        as: "usePluginRegistry",
        from: resolver.resolve("./runtime/composables/usePluginRegistry"),
      },
      {
        name: "useAuth",
        as: "useAuth",
        from: resolver.resolve("./runtime/composables/useAuth"),
      },
    ])

    // Add core components
    addComponent({
      name: "AppSidebar",
      filePath: resolver.resolve("./components/AppSidebar.vue"),
    })

    addComponent({
      name: "AppHeader",
      filePath: resolver.resolve("./components/AppHeader.vue"),
    })

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.core = defu(nuxt.options.runtimeConfig.public.core, {
      debug: options.debug,
      registry: options.registry,
    })

    // Add default layout
    nuxt.hook("app:resolve", (app) => {
      app.mainComponent = resolver.resolve("./layouts/default.vue")
    })

    // Notify when module is ready
    nuxt.hook("ready", () => {
      if (options.debug) {
        console.log("Core module is ready")
      }
    })
  },
})
