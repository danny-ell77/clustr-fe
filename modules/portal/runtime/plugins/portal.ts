import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "#imports"

export default defineNuxtPlugin({
  name: "portal-module",
  setup() {
    const registry = usePluginRegistry()

    registry.registerPlugin({
      id: "portal",
      name: "Tenant Portal",
      version: "1.0.0",
      description: "Tenant communication and resources",
      enabled: true,
      options: {},
    })

    registry.registerExtensionHandler("portal:getNavigation", "portal", ({ permissions }) => {
      const navItems = [
        {
          id: "chat",
          label: "Chat",
          icon: "message-square",
          route: "/portal/chat",
          order: 1,
          visible: permissions.includes("portal.chat.view"),
        },
        {
          id: "meetings",
          label: "Meetings",
          icon: "calendar-check",
          route: "/portal/meetings",
          order: 2,
          visible: permissions.includes("portal.meetings.view"),
        },
      ]
      return navItems.filter((item) => item.visible)
    })
  },
})
