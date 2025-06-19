import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "../composables/usePluginRegistry"

export default defineNuxtPlugin({
  name: "plugin-registry",
  enforce: "pre",
  setup() {
    const registry = usePluginRegistry()

    // Register the core plugin itself
    registry.registerPlugin({
      id: "core",
      name: "Core",
      version: "1.0.0",
      description: "Core functionality for the application",
      enabled: true,
      options: {},
    })

    // Define common extension points
    registry.registerExtensionPoint("app:mounted")
    registry.registerExtensionPoint("user:authenticated")
    registry.registerExtensionPoint("user:logout")
    registry.registerExtensionPoint("navigation:getItems")

    // Return the registry to make it available throughout the app
    return {
      provide: {
        pluginRegistry: registry,
      },
    }
  },
})
