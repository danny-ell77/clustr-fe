import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "#imports"

export default defineNuxtPlugin({
  name: "portal-module",
  setup() {
    const registry = usePluginRegistry()

    // Register the module as a plugin
    registry.registerPlugin({
      id: "portal",
      name: "Self Portal",
      version: "1.0.0",
      description: "Resident self-service portal and community features",
      enabled: true,
      options: {},
    })

    // Register navigation items for this module
    registry.registerExtensionHandler("portal:getNavigation", "portal", ({ permissions }) => {
      const navItems = [
        {
          id: "self-portal",
          label: "Self Portal",
          icon: "home",
          route: "/portal",
          order: 1,
          visible: permissions.includes("portal.view"),
        },
        {
          id: "chat",
          label: "Chat",
          icon: "message-circle",
          route: "/portal/chat",
          order: 2,
          visible: permissions.includes("portal.chat.view"),
        },
        {
          id: "virtual-meeting",
          label: "Virtual Meeting",
          icon: "video",
          route: "/portal/meetings",
          order: 3,
          visible: permissions.includes("portal.meetings.view"),
        },
        {
          id: "announcement",
          label: "Announcement",
          icon: "megaphone",
          route: "/portal/announcements",
          order: 4,
          visible: permissions.includes("portal.announcements.view"),
        },
        {
          id: "polls",
          label: "Polls",
          icon: "bar-chart",
          route: "/portal/polls",
          order: 5,
          visible: permissions.includes("portal.polls.view"),
        },
        {
          id: "reports",
          label: "Reports",
          icon: "file-text",
          route: "/portal/reports",
          order: 6,
          visible: permissions.includes("portal.reports.view"),
        },
      ]

      return navItems.filter((item) => item.visible)
    })
  },
})
