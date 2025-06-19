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
      description: "Financial management and accounting features",
      enabled: true,
      options: {},
    })

    // Register navigation items for this module
    registry.registerExtensionHandler("accounting:getNavigation", "accounting", ({ permissions }) => {
      const navItems = [
        {
          id: "accounts",
          label: "Accounts",
          icon: "credit-card",
          route: "/accounting",
          order: 1,
          visible: permissions.includes("accounting.view"),
        },
        {
          id: "payment",
          label: "Payment",
          icon: "banknote",
          route: "/accounting/payment",
          order: 2,
          visible: permissions.includes("accounting.payments.view"),
        },
        {
          id: "ewallet",
          label: "E-wallet",
          icon: "wallet",
          route: "/accounting/ewallet",
          order: 3,
          visible: permissions.includes("accounting.ewallet.view"),
        },
      ]

      return navItems.filter((item) => item.visible)
    })
  },
})
