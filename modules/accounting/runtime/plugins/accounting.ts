import { defineNuxtPlugin } from "#app"
import { usePluginRegistry } from "#imports"

export default defineNuxtPlugin({
  name: "accounting-module",
  setup() {
    const registry = usePluginRegistry()

    // Register the module as a plugin
    registry.registerPlugin({
      id: "accounting",
      name: "Accounting",
      version: "1.0.0",
      description: "Financial management features",
      enabled: true,
      options: {},
    })

    // Register navigation items for this module
    registry.registerExtensionHandler("accounting:getNavigation", "accounting", ({ permissions }) => {
      const navItems = [
        {
          id: "invoices",
          label: "Invoices",
          icon: "receipt",
          route: "/accounting/invoices",
          order: 1,
          visible: permissions.includes("accounting.invoices.view"),
        },
        {
          id: "payments",
          label: "Payments",
          icon: "credit-card",
          route: "/accounting/payments",
          order: 2,
          visible: permissions.includes("accounting.payments.view"),
        },
        {
          id: "reports",
          label: "Reports",
          icon: "bar-chart-2",
          route: "/accounting/reports",
          order: 3,
          visible: permissions.includes("accounting.reports.view"),
        },
      ]

      return navItems.filter((item) => item.visible)
    })
  },
})
