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
          id: "access-control",
          label: "Access Control",
          icon: "shield-check",
          route: "/security",
          order: 1,
          visible: permissions.includes("security.view"),
        },
        {
          id: "visiting-log",
          label: "Visiting Log",
          icon: "clipboard-list",
          route: "/security/visiting-log",
          order: 2,
          visible: permissions.includes("security.logs.view"),
        },
        {
          id: "users",
          label: "Verify Guest Entry",
          icon: "user-check",
          route: "/security/guest-entry",
          order: 3,
          visible: permissions.includes("security.users.view"),
        },
        {
          id: "guest-exit",
          label: "Verify Guest Exit",
          icon: "user-x",
          route: "/security/guest-exit",
          order: 4,
          visible: permissions.includes("security.users.view"),
        },
        {
          id: "access-key",
          label: "One Access Key",
          icon: "key",
          route: "/security/access-key",
          order: 5,
          visible: permissions.includes("security.keys.view"),
        },
      ]

      return navItems.filter((item) => item.visible)
    })
  },
})
