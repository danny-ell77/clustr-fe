import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "#imports"

export default defineNuxtPlugin({
  name: "property-module",
  setup() {
    const registry = usePluginRegistry()

    // Register the module as a plugin
    registry.registerPlugin({
      id: "property",
      name: "Property Management",
      version: "1.0.0",
      description: "Property management features",
      enabled: true,
      options: {},
    })

    // Register navigation items for this module
    registry.registerExtensionHandler("property:getNavigation", "property", ({ permissions }) => {
      const navItems = [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: "layout-dashboard",
          route: "/property",
          order: 1,
          visible: permissions.includes("property.view"),
        },
        {
          id: "listings",
          label: "Property Listings",
          icon: "building",
          route: "/property/listings",
          order: 2,
          visible: permissions.includes("property.listings.view"),
        },
        {
          id: "maintenance",
          label: "Maintenance",
          icon: "wrench",
          route: "/property/maintenance",
          order: 3,
          visible: permissions.includes("property.maintenance.view"),
        },
        {
          id: "tenants",
          label: "Tenants",
          icon: "users",
          route: "/property/tenants",
          order: 4,
          visible: permissions.includes("property.tenants.view"),
        },
        {
          id: "reports",
          label: "Reports",
          icon: "file-text",
          route: "/property/reports",
          order: 5,
          visible: permissions.includes("property.reports.view"),
        },
      ]

      return navItems.filter((item) => item.visible)
    })
  },
})
