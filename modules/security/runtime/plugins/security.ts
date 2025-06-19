import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "#imports"

export default defineNuxtPlugin({
  name: "security-module",
  setup() {
    const registry = usePluginRegistry()

    // Register the module as a plugin
    registry.registerPlugin({
      id: "security",
      name: "Access Control",
      version: "1.0.0",
      description: "Security and access control features",
      enabled: true,
      options: {},
    })

    // Register navigation items for this module
    registry.registerExtensionHandler("security:getNavigation", "security", ({ permissions }) => {
      const navItems = [
        {
          id: "users",
          label: "Users",
          icon: "users",
          route: "/security/users",
          order: 1,
          visible: permissions.includes("security.users.view"),
        },
        {
          id: "roles",
          label: "Roles & Permissions",
          icon: "key",
          route: "/security/roles",
          order: 2,
          visible: permissions.includes("security.roles.view"),
        },
      ]

      return navItems.filter((item) => item.visible)
    })
  },
})
