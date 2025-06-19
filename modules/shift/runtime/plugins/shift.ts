import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "#imports"

export default defineNuxtPlugin({
  name: "shift-module",
  setup() {
    const registry = usePluginRegistry()

    registry.registerPlugin({
      id: "shift",
      name: "Shift Management",
      version: "1.0.0",
      description: "Shift management features",
      enabled: true,
      options: {},
    })

    registry.registerExtensionHandler("shift:getNavigation", "shift", ({ permissions }) => {
      const navItems = [
        {
          id: "scheduling",
          label: "Scheduling",
          icon: "calendar",
          route: "/shift/scheduling",
          order: 1,
          visible: permissions.includes("shift.scheduling.view"),
        },
        {
          id: "logging",
          label: "Time Logging",
          icon: "clock",
          route: "/shift/logging",
          order: 2,
          visible: permissions.includes("shift.logging.view"),
        },
      ]
      return navItems.filter((item) => item.visible)
    })
  },
})
