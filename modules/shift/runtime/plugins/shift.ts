import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "#imports"

export default defineNuxtPlugin({
  name: "shift-module",
  setup() {
    const registry = usePluginRegistry()

    // Register the module as a plugin
    registry.registerPlugin({
      id: "shift",
      name: "Shift Management",
      version: "1.0.0",
      description: "Staff shift and schedule management",
      enabled: true,
      options: {},
    })

    // Register navigation items for this module
    registry.registerExtensionHandler("shift:getNavigation", "shift", ({ permissions }) => {
      const navItems = [
        {
          id: "dashboard",
          label: "Shift Management",
          icon: "calendar",
          route: "/shift",
          order: 1,
          visible: permissions.includes("shift.view"),
        },
        {
          id: "shift-log",
          label: "Shift Log",
          icon: "clipboard-list",
          route: "/shift/log",
          order: 2,
          visible: permissions.includes("shift.logs.view"),
        },
        {
          id: "create-shift",
          label: "Create New Shift",
          icon: "plus-circle",
          route: "/shift/create",
          order: 3,
          visible: permissions.includes("shift.create"),
        },
        {
          id: "task-log",
          label: "Task Log",
          icon: "check-square",
          route: "/shift/tasks",
          order: 4,
          visible: permissions.includes("shift.tasks.view"),
        },
        {
          id: "maintenance-log",
          label: "Maintenance Log",
          icon: "wrench",
          route: "/shift/maintenance",
          order: 5,
          visible: permissions.includes("shift.maintenance.view"),
        },
      ]

      return navItems.filter((item) => item.visible)
    })
  },
})
