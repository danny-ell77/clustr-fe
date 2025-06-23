import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from "@nuxt/kit"

export interface ModuleOptions {
  debug: boolean
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
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add core plugins
    addPlugin(resolver.resolve("./runtime/plugins/auth"))
    addPlugin(resolver.resolve("./runtime/plugins/permission-modal"))

    // Add composables
    addImports([
      {
        name: "useAuth",
        as: "useAuth",
        from: resolver.resolve("./runtime/composables/useAuth"),
      },
      {
        name: "usePageMeta",
        as: "usePageMeta",
        from: resolver.resolve("./runtime/composables/usePageMeta"),
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

    addComponent({
      name: "NoPermissionsModal",
      filePath: resolver.resolve("./components/NoPermissionsModal.vue"),
    })

    // Provide module options to runtime config
    nuxt.options.runtimeConfig.public.core = {
      debug: options.debug,
    }

    // Notify when module is ready
    nuxt.hook("ready", () => {
      if (options.debug) {
        console.log("Core module is ready")
      }
    })
  },
})

declare module "@nuxt/schema" {
  interface NuxtConfig {
    core?: ModuleOptions
  }
  interface NuxtOptions {
    core?: ModuleOptions
  }
}
